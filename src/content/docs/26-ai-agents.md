---
title: AI Agents
description: Expose FastEndpoints as MCP tools and A2A skills for AI agents.
---

# {$frontmatter.title}

FastEndpoints can expose selected endpoints to agent runtimes using two small addon packages:

| Package               | Purpose                                                                                                 |
|-----------------------|---------------------------------------------------------------------------------------------------------|
| **FastEndpoints.Mcp** | Exposes opt-in endpoints as [Model Context Protocol](https://modelcontextprotocol.io/) tools over HTTP. |
| **FastEndpoints.A2A** | Exposes opt-in endpoints as A2A skills with an agent card and JSON-RPC dispatcher.                      |

Both are currently published as beta packages and versioned independently of the main FastEndpoints packages. Nothing is exposed by default. An endpoint only becomes visible to agents after you explicitly opt it in.

## Installation

Install the package you need, or both if the same API should be callable by MCP clients and A2A agents.

```cs |copy|title=terminal
dotnet add package FastEndpoints.Mcp --version 1.0.0-beta.3
dotnet add package FastEndpoints.A2A --version 1.0.0-beta.3
```

## Quick Start

The following example exposes one endpoint as both an MCP tool and an A2A skill.

```cs |copy|title=Program.cs
using FastEndpoints;
using FastEndpoints.A2A;
using FastEndpoints.Mcp;

var bld = WebApplication.CreateBuilder();

bld.Services
   .AddFastEndpoints()
   .AddMcp(o =>
   {
       // for local demos only. see the security section below for production setup.
       o.ToolVisibilityFilter = (_, _, _) => true;
   })
   .AddA2A(o =>
   {
       o.AgentName = "weather-agent";
       o.Description = "Weather information served by FastEndpoints.";
       o.Version = "1.0.0";
       o.SkillVisibilityFilter = (_, _, _) => true;
   });

var app = bld.Build();

app.UseFastEndpoints()
   .UseMcp()
   .UseA2A();

app.Run();
```

```cs |copy|title=WeatherEndpoint.cs
using FastEndpoints;
using FastEndpoints.A2A;
using FastEndpoints.Mcp;

sealed class WeatherEndpoint : Endpoint<WeatherRequest, WeatherResponse>
{
    public override void Configure()
    {
        Get("/weather/{city}");

        this.McpTool(
            name: "get_weather",
            description: "Returns the current weather for a city.",
            configure: tool =>
            {
                tool.Title = "Get Weather";
                tool.Hints.ReadOnly = true;
                tool.Hints.Idempotent = true;
                tool.Hints.OpenWorld = true;
            });

        this.A2ASkill(
            id: "get_weather",
            tags: ["weather", "read"],
            configure: skill =>
            {
                skill.Name = "Get Weather";
                skill.Description = "Returns the current weather for a city.";
                skill.Examples = ["What's the weather in London?"];
            });
    }

    public override Task HandleAsync(WeatherRequest req, CancellationToken ct)
    {
        return Send.OkAsync(new WeatherResponse
        {
            City = req.City,
            Units = req.Units,
            Summary = "sunny",
            Temperature = 29
        }, ct);
    }
}

sealed class WeatherRequest
{
    [RouteParam]
    public string City { get; set; } = "";

    [QueryParam]
    public string Units { get; set; } = "metric";
}

sealed class WeatherResponse
{
    public string City { get; set; } = "";
    public string Units { get; set; } = "";
    public string Summary { get; set; } = "";
    public int Temperature { get; set; }
}
```

The **this.** prefix on **.McpTool()** and **.A2ASkill()** is required by C# when calling these extension methods from inside **Configure()**.

After startup:

| URL                            | What It Does                                        |
|--------------------------------|-----------------------------------------------------|
| `/mcp`                         | MCP HTTP endpoint. Point an MCP client at this URL. |
| `/.well-known/agent-card.json` | A2A agent card used for discovery.                  |
| `/a2a`                         | A2A JSON-RPC endpoint.                              |

:::admonition type=warning
The visibility filters in the quick start allow anonymous agent access. That's fine for a local smoke test, but don't use that setting for destructive or private operations in production.
:::

---

## MCP Tools

The **FastEndpoints.Mcp** package wires FastEndpoints into the official MCP ASP.NET Core HTTP transport. Opt-in endpoints appear as MCP tools and are executed in-process when a client calls a tool.

### Setup

The minimum MCP wiring is just:

```cs
bld.Services
   .AddFastEndpoints()
   .AddMcp();

app.UseFastEndpoints()
   .UseMcp();
```

This maps the MCP endpoint at **/mcp** and serves requests. However, the default **ToolVisibilityFilter** only allows authenticated callers to see and invoke tools. Anonymous callers can still reach the transport endpoint, but they'll see no tools and won't be able to call any.

The following example shows the production-style extras: a custom per-caller visibility filter and ASP.NET authorization on the MCP route itself.

```cs |copy|title=Program.cs
using FastEndpoints;
using FastEndpoints.Mcp;

var bld = WebApplication.CreateBuilder();

bld.Services
   .AddFastEndpoints()
   .AddMcp(o =>
   {
       // optional. the default is authenticated callers only.
       o.ToolVisibilityFilter = (_, user, _) =>
           user.Identity?.IsAuthenticated == true &&
           user.HasClaim("scope", "agents");
   });

var app = bld.Build();

app.UseAuthentication()
   .UseAuthorization()
   .UseFastEndpoints()
   .UseMcp(
       pattern: "/mcp",
       // optional. recommended for production.
       configureRoute: route => route.RequireAuthorization());

app.Run();
```

Call **UseMcp()** after **UseFastEndpoints()** so the FastEndpoints endpoint registry is ready. **RequireAuthorization()** is not required for MCP to function. It protects the transport route. **ToolVisibilityFilter** controls which opted-in endpoints are listed and invokable for the current caller.

### Opt In With Fluent Configuration

```cs
public override void Configure()
{
    Post("/orders/{orderId}/status");

    this.McpTool(
        name: "get_order_status",
        description: "Returns the latest status for an order.",
        configure: tool =>
        {
            tool.Title = "Get Order Status";
            tool.Hints.ReadOnly = true;
            tool.Hints.Idempotent = true;
            tool.Hints.OpenWorld = false;
        });
}
```

You can also call **Definition.McpTool(...)** from helper methods that receive an **EndpointDefinition** instead of an endpoint instance.

### Opt In With An Attribute

Attribute configuration is useful for attribute-configured endpoints.

```cs
[McpTool(
    "get_order_status",
    Description = "Returns the latest status for an order.",
    Title = "Get Order Status",
    ReadOnly = true,
    Idempotent = true,
    OpenWorld = false)]
[HttpGet("/orders/{orderId}/status")]
sealed class GetOrderStatusEndpoint : Endpoint<OrderStatusRequest, OrderStatusResponse>
{
    public override Task HandleAsync(OrderStatusRequest req, CancellationToken ct)
        => Send.OkAsync(new OrderStatusResponse(), ct);
}
```

Only hints explicitly set on the attribute are sent to MCP clients. Omitted hints stay absent.

### Tool Names And Descriptions

The tool name is the stable identifier MCP clients use when calling the endpoint.

| Source                  | Behavior                                                                                |
|-------------------------|-----------------------------------------------------------------------------------------|
| Explicit `name`         | Must match `^[A-Za-z0-9_-]{1,64}$`.                                                     |
| No explicit `name`      | Uses endpoint `Summary` text if set, otherwise the endpoint type name.                  |
| Generated name          | Converted to `snake_case`, sanitized to MCP-safe characters, and truncated to 64 chars. |
| Duplicate visible names | Rejected with a clear startup/call-time exception.                                      |

The description comes from the **McpTool()** argument first, then the endpoint summary description. Set descriptions deliberately. LLMs rely on them to decide when and how to use a tool.

### Tool Hints

MCP hints are advisory metadata. FastEndpoints forwards them to clients but does not enforce behavior based on them.

| Hint          | Meaning                                                                           |
|---------------|-----------------------------------------------------------------------------------|
| `ReadOnly`    | The tool does not modify its environment.                                         |
| `Idempotent`  | Repeated calls with the same arguments have the same effect.                      |
| `Destructive` | The tool may perform irreversible actions.                                        |
| `OpenWorld`   | The tool reaches outside the process, such as network calls or external services. |

With fluent configuration, hints are nullable. Leave a hint unset if you don't want to advertise it.

### MCP Options

Configure MCP behavior in **AddMcp()**.

| Option                 | Default                    | Notes                                                             |
|------------------------|----------------------------|-------------------------------------------------------------------|
| `ToolFilter`           | `null`                     | Static filter for which opt-in endpoints are registered as tools. |
| `ToolVisibilityFilter` | authenticated callers only | Per-caller filter used for tool listing and tool invocation.      |
| `IncludeOutputSchemas` | `true`                     | Includes `outputSchema` for object-shaped response DTOs.          |

**ToolFilter** is for app-wide inclusion. **ToolVisibilityFilter** is for request-time authorization and user-specific visibility.

### MCP Input Schemas

The MCP package builds an input schema from the endpoint request DTO using **System.Text.Json** metadata.

| Feature                      | Behavior                                                          |
|------------------------------|-------------------------------------------------------------------|
| EndpointWithoutRequest       | Exposes an empty object schema.                                   |
| Complex request DTO          | Exposes an object schema with `additionalProperties: false`.      |
| Scalar or array request root | Rejected because MCP tool arguments must have an object root.     |
| Endpoint serializer context  | Honored for schema property names and invocation payloads.        |
| FluentValidation             | Common rules are added to the schema where possible.              |
| Unknown arguments            | Rejected as validation failures before the endpoint handler runs. |

The validation rules currently reflected into the schema include required values, length limits, numeric ranges, regex patterns, and email format. Rules that cannot be expressed as JSON Schema still run through the normal FastEndpoints validation pipeline.

### MCP Output Schemas And Structured Content

When the endpoint has an object-shaped response DTO, MCP output schemas are included by default.

| Response Shape                                  | MCP Behavior                                                      |
|-------------------------------------------------|-------------------------------------------------------------------|
| Complex response DTO                            | Adds `outputSchema` and attempts to populate `structuredContent`. |
| `object`,`void`, scalar, or array response root | Omits `outputSchema`; response is returned as text content only.  |
| Response JSON violates output schema            | Keeps the call successful but omits `structuredContent`.          |

Every successful MCP call includes the endpoint response body as a text content block. If the response body is a JSON object matching the advertised output schema, `structuredContent` is also populated.

Disable output schemas globally if your clients don't need them:

```cs
bld.Services.AddMcp(o => o.IncludeOutputSchemas = false);
```

### MCP Result Mapping

| Endpoint Outcome    | MCP Result                                                                                     |
|---------------------|------------------------------------------------------------------------------------------------|
| 2xx response        | `IsError = false`, response body in text content, optional `structuredContent`.                |
| Validation failure  | `IsError = true`, JSON payload with `validationErrors`.                                        |
| Non-2xx response    | `IsError = true`, JSON payload with `statusCode`, `contentType`, and `body`.                   |
| Unhandled exception | `IsError = true`, generic `Endpoint invocation failed.` message, exception logged server-side. |
| Hidden tool         | MCP exception: tool is not available for the current caller.                                   |

### Calling From An MCP Client

Point any MCP client that supports HTTP transport at the mapped route:

```txt
https://localhost:5001/mcp
```

The **get_weather** tool from the quick start accepts arguments matching the request DTO:

```json |copy
{
  "City": "London",
  "Units": "metric"
}
```

---

## A2A Skills

The **FastEndpoints.A2A** package exposes opt-in endpoints as A2A v1 skills. It serves an agent card for discovery and a JSON-RPC 2.0 endpoint for skill dispatch.

The current implementation is intentionally narrow:

- A2A protocol version **1.0**
- JSON-RPC protocol binding
- **SendMessage** method only
- No JSON-RPC batch requests
- No task state, streaming, or push notifications
- JSON request/response DTOs by default

### Setup

The minimum A2A wiring is just:

```cs
bld.Services
   .AddFastEndpoints()
   .AddA2A();

app.UseFastEndpoints()
   .UseA2A();
```

This maps the agent card at **/.well-known/agent-card.json** and the JSON-RPC endpoint at **/a2a**. However, the default **SkillVisibilityFilter** only allows authenticated callers to see and dispatch skills. Anonymous callers can still reach the A2A routes, but the agent card will contain no visible skills and dispatch will fail for opted-in skills.

The following example shows the production-style extras: agent-card metadata, a custom per-caller visibility filter, and ASP.NET authorization on the A2A routes.

```cs |copy|title=Program.cs
using FastEndpoints;
using FastEndpoints.A2A;

var bld = WebApplication.CreateBuilder();

bld.Services
   .AddFastEndpoints()
   .AddA2A(o =>
   {
       o.AgentName = "orders-agent";
       o.Description = "Order lookup and maintenance agent.";
       o.Version = "1.0.0";
       o.Provider = new()
       {
           Organization = "Acme Inc.",
           Url = "https://acme.example"
       };

       // set this when the public URL differs from the incoming request host.
       o.Url = "https://api.acme.example/a2a";

       // optional. default is authenticated callers only.
       o.SkillVisibilityFilter = (_, user, _) =>
           user.Identity?.IsAuthenticated == true &&
           user.HasClaim("scope", "agents");
   });

var app = bld.Build();

app.UseAuthentication()
   .UseAuthorization()
   .UseFastEndpoints()
   .UseA2A(
       rpcPattern: "/a2a",
       agentCardPattern: "/.well-known/agent-card.json",
       // optional. recommended for production.
       configureRpcRoute: route => route.RequireAuthorization(),
       configureCardRoute: route => route.RequireAuthorization());

app.Run();
```

Call **UseA2A()** after **UseFastEndpoints()** so the endpoint registry is ready. Route authorization is not required for A2A to function. It protects the transport and discovery routes. **SkillVisibilityFilter** controls which opted-in endpoints appear in the agent card and can be dispatched by the current caller.

### A2A Options

Configure A2A behavior in **AddA2A()**.

| Option                  | Default                    | Notes                                                                                         |
|-------------------------|----------------------------|-----------------------------------------------------------------------------------------------|
| `AgentName`             | `fastendpoints-agent`      | Agent card name.                                                                              |
| `Description`           | `null`                     | Agent card description. Serialized as empty text when unset.                                  |
| `Version`               | `0.1.0`                    | Agent card version.                                                                           |
| `Provider`              | `null`                     | Optional `organization` and `url` provider block.                                             |
| `Url`                   | `null`                     | Public JSON-RPC URL. When unset, built from request scheme/host/path base plus the RPC route. |
| `SkillFilter`           | `null`                     | Static filter for which opt-in endpoints are published as skills.                             |
| `SkillVisibilityFilter` | authenticated callers only | Per-caller filter used for agent card generation and dispatch.                                |

If your app sits behind a reverse proxy and the incoming scheme/host are not the public values, set **Url** explicitly or configure forwarded headers correctly.

### Opt In With Fluent Configuration

```cs
public override void Configure()
{
    Post("/orders/{orderId}/status");

    this.A2ASkill(
        id: "get_order_status",
        tags: ["orders", "read"],
        configure: skill =>
        {
            skill.Name = "Get Order Status";
            skill.Description = "Returns the latest status for an order.";
            skill.Examples = ["What is the status of order 123?"];
            skill.InputModes = ["application/json"];
            skill.OutputModes = ["application/json"];
        });
}
```

You can also call **Definition.A2ASkill(...)** from helper methods that receive an **EndpointDefinition**.

### Opt In With An Attribute

```cs
[A2ASkill(
    "get_order_status",
    Name = "Get Order Status",
    Description = "Returns the latest status for an order.",
    Tags = ["orders", "read"],
    Examples = ["What is the status of order 123?"],
    InputModes = ["application/json"],
    OutputModes = ["application/json"])]
[HttpGet("/orders/{orderId}/status")]
sealed class GetOrderStatusEndpoint : Endpoint<OrderStatusRequest, OrderStatusResponse>
{
    public override Task HandleAsync(OrderStatusRequest req, CancellationToken ct)
        => Send.OkAsync(new OrderStatusResponse(), ct);
}
```

### Skill IDs And Metadata

| Field         | Behavior                                                                                                           |
|---------------|--------------------------------------------------------------------------------------------------------------------|
| `Id`          | Stable identifier used in the agent card and `metadata.skill`. Explicit values must match `^[A-Za-z0-9_-]{1,64}$`. |
| `Name`        | Short display name. Defaults to endpoint summary text, then the skill id.                                          |
| `Description` | Skill description. Defaults to endpoint summary description, then empty text.                                      |
| `Tags`        | Free-form tags for discovery and filtering.                                                                        |
| `Examples`    | Natural-language prompts that should route to this skill.                                                          |
| `InputModes`  | Accepted input MIME types. Defaults to the agent card default of `application/json` when unset.                    |
| `OutputModes` | Produced output MIME types. Defaults to the agent card default of `application/json` when unset.                   |

If no explicit **Id** is supplied, FastEndpoints uses the endpoint **Summary** text if set, otherwise the endpoint type name. The generated id is converted to **snake_case**, sanitized, and truncated to 64 chars. Duplicate visible skill ids are rejected. A hidden duplicate does not shadow a visible skill.

### Agent Card

The agent card is served from **/.well-known/agent-card.json** by default.

```json
{
  "name": "orders-agent",
  "description": "Order lookup and maintenance agent.",
  "version": "1.0.0",
  "supportedInterfaces": [
    {
      "url": "https://api.acme.example/a2a",
      "protocolBinding": "JSONRPC",
      "protocolVersion": "1.0"
    }
  ],
  "provider": {
    "organization": "Acme Inc.",
    "url": "https://acme.example"
  },
  "capabilities": {
    "streaming": false,
    "pushNotifications": false
  },
  "defaultInputModes": [
    "application/json"
  ],
  "defaultOutputModes": [
    "application/json"
  ],
  "skills": []
}
```

The actual **skills** list is filtered through **SkillVisibilityFilter** for the current caller. If an anonymous caller requests the card, and you kept the default visibility filter, the card will contain no skills.

### Sending A Message

Invoke a skill by posting JSON-RPC 2.0 to the A2A route.

```json |copy
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "SendMessage",
  "params": {
    "message": {
      "messageId": "client-message-1",
      "role": "user",
      "parts": [
        {
          "data": {
            "OrderId": 123
          }
        }
      ]
    },
    "metadata": {
      "skill": "get_order_status"
    }
  }
}
```

If only one skill is visible to the caller, `metadata.skill` may be omitted. If multiple skills are visible, `metadata.skill` is required.

`role` may be either `user` or `ROLE_USER`. The response role is always `ROLE_AGENT`.

### Message Parts

Each incoming A2A part must contain exactly one of `text`, `data`, `raw`, or `url`. For endpoint invocation, FastEndpoints supports only:

| Part   | Behavior                                                                    |
|--------|-----------------------------------------------------------------------------|
| `data` | Used directly as the endpoint request arguments. Recommended.               |
| `text` | Must contain valid JSON. Parsed and used as the endpoint request arguments. |
| `raw`  | Rejected for endpoint invocation.                                           |
| `url`  | Rejected for endpoint invocation.                                           |

If the message contains multiple parts, the first supported `data` or JSON `text` part is used as the request DTO payload.

### Output Modes

The dispatcher checks requested and actual output modes.

```json
{
  "configuration": {
    "acceptedOutputModes": [
      "application/json"
    ]
  }
}
```

If **acceptedOutputModes** is supplied, at least one requested mode must be supported by the skill before the endpoint runs. After the endpoint runs, the actual response content type must also be accepted.

JSON responses are returned as **data** parts. Non-JSON responses are returned as **text** parts. The response part includes the normalized **mediaType**.

### A2A Result Mapping

| Endpoint Outcome             | JSON-RPC Result                                                                              |
|------------------------------|----------------------------------------------------------------------------------------------|
| 2xx JSON response            | `result.message.parts[0].data` contains the parsed JSON.                                     |
| 2xx non-JSON response        | `result.message.parts[0].text` contains the response body.                                   |
| Validation failure           | Error `-32602`, message `validation failed`, validation failures in `data`.                  |
| Non-2xx response             | Error `-32000`, endpoint status/content/body in `data`.                                      |
| Unhandled exception          | Error `-32603`, generic `Endpoint invocation failed.` message, exception logged server-side. |
| Unknown method or skill      | Error `-32601`.                                                                              |
| Unsupported input media type | Error `-32005`.                                                                              |
| Unsupported A2A version      | Error `-32009`.                                                                              |
| Request with `taskId`        | Error `-32001`; task continuation is not implemented.                                        |

If a JSON-RPC request omits `id`, it is treated as a notification. The skill is executed and the HTTP response is **204 No Content**. Per JSON-RPC rules, success and failure details are not returned for notifications.

### A2A Version Header

If the client sends an A2A version, it must be `1.0`.

```txt
A2A-Version: 1.0
```

The same value may also be supplied as an `A2A-Version` query string value. Unsupported versions are rejected before endpoint execution.

---

## Argument Binding

Both packages execute the selected FastEndpoints endpoint in-process. There is no HTTP hop back into your own app. The bridge builds a synthetic **HttpContext**, feeds the agent arguments to the normal FastEndpoints binder, and runs the endpoint pipeline.

The following parts of the normal endpoint pipeline still run:

- Request binding
- Validators
- Pre-processors
- Endpoint handler or executor
- Post-processors
- Response serialization

Agent calls can bind the same DTO shapes used by normal HTTP clients.

| DTO / Binding Source                  | Agent Argument Behavior                                         |
|---------------------------------------|-----------------------------------------------------------------|
| Route/path parameters                 | Matched by route parameter name or DTO property aliases.        |
| `[RouteParam]`                        | Bound into the synthetic route values.                          |
| `[QueryParam]`                        | Bound into query string values.                                 |
| `[FromQuery]`                         | Complex values are expanded into query values.                  |
| `[FromBody]`                          | Matching argument value becomes the request body payload.       |
| `[FromHeader]`                        | Bound into synthetic request headers unless hidden from schema. |
| `[FromCookie]`                        | Bound into synthetic request cookies unless hidden from schema. |
| Unbound properties on GET/HEAD/DELETE | Prefer query values by default.                                 |
| Unbound properties on POST/PUT/PATCH  | Prefer JSON body values by default.                             |

Arguments may use the JSON serializer property name, the CLR property name, or the FastEndpoints field name. Endpoint-specific serializer contexts are honored.

Unknown object properties are rejected as validation failures. This is intentional, because unknown agent arguments are usually prompt mistakes or attempted argument smuggling.

### Principal And Transport Values

The caller identity is propagated to **HttpContext.User**. Use it for claim-based binding and handler logic.

Some DTO properties are intentionally not advertised as client input and are not bound from agent-supplied arguments:

| Attribute                               | Behavior                                       |
|-----------------------------------------|------------------------------------------------|
| `[HasPermission]`                       | Always hidden from agent input.                |
| Required `[FromClaim]`                  | Hidden and resolved from the caller principal. |
| `[FromClaim(RemoveFromSchema = true)]`  | Hidden and resolved from the caller principal. |
| `[FromHeader(RemoveFromSchema = true)]` | Hidden from agent input.                       |
| `[FromCookie(RemoveFromSchema = true)]` | Hidden from agent input.                       |

Optional claim-bound properties can be agent-supplied if you leave them visible. Set `RemoveFromSchema = true` when a property should only come from the authenticated caller or server-side transport state.

---

## Security

MCP/A2A visibility is separate from normal REST endpoint authorization.

That means endpoint configuration such as `Roles()`, `Permissions()`, or `AllowAnonymous()` is not used to decide which tools or skills an agent can see or invoke. Configure the agent routes and the bridge visibility filters explicitly.

### Recommended Production Setup

```cs
app.UseAuthentication()
   .UseAuthorization()
   .UseFastEndpoints()
   .UseMcp(configureRoute: route => route.RequireAuthorization())
   .UseA2A(
       configureRpcRoute: route => route.RequireAuthorization(),
       configureCardRoute: route => route.RequireAuthorization());
```

```cs
bld.Services
   .AddFastEndpoints()
   .AddMcp(o =>
   {
       o.ToolVisibilityFilter = (def, user, ctx) =>
           user.Identity?.IsAuthenticated == true &&
           user.HasClaim("scope", "agents") &&
           def.EndpointType.Namespace?.Contains("AgentSafe") == true; // filter on endpoint metadata
   })
   .AddA2A(o =>
   {
       o.SkillVisibilityFilter = (def, user, ctx) =>
           user.Identity?.IsAuthenticated == true &&
           user.HasClaim("scope", "agents") &&
           def.EndpointType.Namespace?.Contains("AgentSafe") == true; // filter on endpoint metadata
   });
```

Use **ToolFilter** and **SkillFilter** to remove whole classes of endpoints from the agent surface. Use **ToolVisibilityFilter** and **SkillVisibilityFilter** for per-caller checks.

Good defaults for production:

- Require authentication on `/mcp` and `/a2a`.
- Decide whether the A2A agent card should be public or protected.
- Keep destructive operations hidden unless a caller is explicitly trusted.
- Set MCP `Destructive` and `OpenWorld` hints accurately.
- Use explicit names, descriptions, examples, and tags.
- Keep request DTOs small and purpose-built for agent use.

---

## Practical Notes

- You can expose the same endpoint to both MCP and A2A by calling both opt-in methods.
- You do not need separate agent-specific endpoint base classes.
- MCP publishes JSON Schemas for tool inputs and, when possible, outputs.
- A2A does not publish request/response JSON Schemas in the agent card, so descriptions and examples matter more.
- Keep agent DTOs object-shaped. MCP requires object-root request DTOs, and A2A clients are easier to reason about with the same shape.
- If a tool or skill is missing, check opt-in metadata, static filters, per-caller visibility filters, duplicate names/ids, and route authentication first.