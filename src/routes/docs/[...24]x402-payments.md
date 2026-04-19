---
title: x402 Payments
description: Protect FastEndpoints routes with x402 payment requirements.
---

# {$frontmatter.title}

FastEndpoints supports protecting endpoints with the [x402 payment protocol](https://www.x402.org/). Once enabled, the middleware can advertise payment requirements for selected routes, verify incoming payment payloads, and settle successful requests without forcing payment logic into your endpoint handlers.

The current implementation is intentionally narrow in scope:

- Only the **exact** scheme is supported
- Only a single accepted payment option is advertised per endpoint
- Verification and settlement are facilitator-backed
- x402 v2 headers/payloads are used
- The default flow is **verify** -> **execute endpoint handler** -> **settle after success**

This keeps the integration simple while still covering the common case of charging for access to a route.

## Server-Side Setup

To enable x402 support, register the services and configure the middleware during startup:

```cs | title=Program.cs
var bld = WebApplication.CreateBuilder();
bld.Services
   .AddFastEndpoints()
   .AddX402();

var app = bld.Build();
app.UseX402(o =>
{
    o.FacilitatorUrl = "https://x402.org/facilitator";
    o.Defaults.Network = "eip155:84532";
    o.Defaults.PayTo = "0xYourAddress";
    o.Defaults.Asset = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
}).UseFastEndpoints() // must come after UseX402();
```

The middleware needs a facilitator URL and enough default payment metadata to describe what clients should pay for protected endpoints. In most cases, that means setting the default network, recipient address, and asset once at startup and then overriding only the endpoints that need different values.

If the facilitator client needs custom **HttpClient** behavior such as auth handlers, a custom primary handler, or retry policies, configure the typed client when calling **AddX402()**:

```cs | title=Program.cs
.AddX402(builder =>
{
   builder.AddHttpMessageHandler<MyFacilitatorAuthHandler>();
});
```

That customization applies to the underlying facilitator calls used for both verification and settlement.

## Global Options

The following options can be configured on **UseX402()**:

| Option                       | Required | Default      | Notes                                                        |
|------------------------------|----------|--------------|--------------------------------------------------------------|
| `FacilitatorUrl`             | yes      | none         | Base URL for facilitator **verify** and **settle** requests. |
| `Timeout`                    | no       | 30s          | **HttpClient** timeout for facilitator calls.                |
| `SettlementMode`             | no       | AfterSuccess | Global settlement timing. Endpoints can override it.         |
| `Defaults.Scheme`            | no       | exact        | Only **exact** is currently accepted.                        |
| `Defaults.Network`           | yes      | none         | Default CAIP-2 network id.                                   |
| `Defaults.PayTo`             | yes      | none         | Default recipient address.                                   |
| `Defaults.Asset`             | yes      | none         | Default asset/token identifier.                              |
| `Defaults.MaxTimeoutSeconds` | no       | 300          | Advertised in the payment requirements.                      |
| `Defaults.MimeType`          | no       | null         | Included in **resource.mimeType** of unpaid response.        |
| `Defaults.Extra`             | no       | null         | Extra metadata merged into **accepts[0].extra**.             |
| `Defaults.Extensions`        | no       | null         | Included in the unpaid response as **extensions**.           |

Think of these as the baseline values used whenever an endpoint calls **RequirePayment()** without supplying overrides.

## Protecting Endpoints

Protect an endpoint by calling **RequirePayment()** inside endpoint configuration:

```cs | title=Endpoint.cs
sealed class WeatherEndpoint : EndpointWithoutRequest
{
    public override void Configure()
    {
        Get("/weather");
        AllowAnonymous();
        RequirePayment(
            price: "1000",
            description: "Weather data");
    }

    public override Task HandleAsync(CancellationToken ct)
        => Send.OkAsync(new { report = "sunny" });
}
```

The **price** and **description** arguments are required. The **price** value is forwarded exactly as supplied. The library does not parse or normalize it, so pass the value in the format expected by your clients and facilitator.

If a client calls a protected endpoint without sending the `PAYMENT-SIGNATURE` request header, FastEndpoints responds with **402 Payment Required** and includes a `PAYMENT-REQUIRED` header containing the Base64-encoded x402 declaration. That declaration advertises the payment requirement for the route so the client can retry with a valid payment payload.

This means your handler code stays unchanged. The x402 middleware handles the unpaid flow before the endpoint executes.

## Endpoint Overrides

If an endpoint needs different payment details than the global defaults, supply overrides in the third argument of **RequirePayment()**:

```cs
RequirePayment(
    price: "2500",
    description: "Premium weather data",
    o =>
    {
        o.Network = "eip155:8453";
        o.PayTo = "0xSomeOtherAddress";
        o.Asset = "0xAssetOnThatNetwork";
        o.MimeType = "application/custom+json";
        o.MaxTimeoutSeconds = 120;
        o.SettlementMode = Settle.BeforeHandler;
        o.Extra = new JsonObject
        {
            ["plan"] = "premium"
        };
        o.Extensions = new JsonObject
        {
            ["bazaar"] = new JsonObject
            {
                ["discoverable"] = true
            }
        };
    });
```

Available endpoint options:

| Option              | Notes                                                                                         |
|---------------------|-----------------------------------------------------------------------------------------------|
| `Network`           | Overrides the global network.                                                                 |
| `PayTo`             | Overrides the global recipient address.                                                       |
| `Asset`             | Overrides the global asset/token id.                                                          |
| `MimeType`          | Overrides the resource mime type shown in unpaid responses.                                   |
| `MaxTimeoutSeconds` | Overrides the advertised timeout.                                                             |
| `SettlementMode`    | Overrides the runtime settlement behavior for this endpoint.                                  |
| `Extra`             | Merged into **accepts[0].extra**. Endpoint keys overwrite global keys.                        |
| `Extensions`        | Included in the unpaid response as **extensions**. Endpoint value overrides the global value. |

This is useful when most of the application charges in one asset or on one network, while a few premium or partner endpoints need different payment metadata.

## Settlement Timing

By default, the library buffers the outgoing response for payment-protected endpoints and settles only after the handler completes successfully.

The default flow looks like this:

1. Verify payment
2. Execute endpoint handler
3. Settle payment if the response status is below **400**
4. Add the `PAYMENT-RESPONSE` header and flush the response

This default exists to avoid charging clients for failed requests.

In the default **Settle.AfterSuccess** mode:

- If the handler returns a status code **>= 400**, the buffered response is passed through and settlement is skipped.
- If settlement fails after a successful handler run, the buffered response is discarded and the client receives **402 Payment Required** response instead.

If you want settlement to happen before the endpoint handler runs, change the mode like so:

```cs
//globally
app.UseX402(o => o.SettlementMode = Settle.BeforeHandler);

//endpoint level
RequirePayment(...,..., o => o.SettlementMode = Settle.BeforeHandler);
```

In **Settle.BeforeHandler** mode, the handler executes only after verification and settlement have both succeeded. This mode should be used for scenarios where the response cannot be buffered safely or usefully, such as streaming endpoints, SSE, or file downloads.

---

## Request And Response Flow

At a high level, the request flow is as follows:

1. The middleware checks whether the endpoint requires payment.
2. If payment is required, it looks for the `PAYMENT-SIGNATURE` header.
3. It validates the incoming x402 payload locally and with the facilitator.
4. It either rejects the request with payment instructions or allows execution to continue.
5. If execution succeeds, settlement occurs according to the selected **SettlementMode**.

For unpaid or invalid requests:

- Missing `PAYMENT-SIGNATURE` → **402** with `PAYMENT-REQUIRED`
- Invalid Base64/JSON in `PAYMENT-SIGNATURE` → **402** with `PAYMENT-REQUIRED`, error `Invalid payment payload`
- Failed local x402 validation or facilitator verification → **402** with `PAYMENT-REQUIRED`

For successful paid requests:

- Verification succeeds
- Settlement occurs based on the selected **SettlementMode**
- `PAYMENT-RESPONSE` is added to the successful response

## Headers

The x402 middleware uses the x402 v2 header names:

- Request header: `PAYMENT-SIGNATURE`
- Unpaid response header: `PAYMENT-REQUIRED`
- Settled response header: `PAYMENT-RESPONSE`

## Notes

- The middleware runs only for endpoints that call **RequirePayment()**.
- **RequirePayment()** cannot be combined with **ResponseCache()**.
- The current implementation assumes facilitator-backed verification and settlement via `POST: /verify` and `POST: /settle` endpoints.
- For auth or transport customization, use `AddX402(builder => ...)` to configure the facilitator **HttpClient**.
- If you need fully custom facilitator behavior, replace **IX402FacilitatorClient** in the DI container.
