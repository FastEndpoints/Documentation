---
title: Command Rules
description: Match arbitrary input models with command rules and dispatch the resulting commands immediately or as queued jobs.
---

# Command Rules

Command rules are a small layer on top of the [Command Bus](command-bus) and [Job Queues](job-queues). It lets you take any input model, evaluate it against one or more rules, build the commands that should be executed, and dispatch them from one place.

Think of it as a lightweight, purpose-built rules engine for commands. It evaluates ordered rules against an input model, collects commands from matching rules, and dispatches those commands. It is not a general-purpose business rules engine and does not provide inference, rule chaining, working memory, a DSL, dynamic rule loading, or persisted rule state.

This is useful when the caller should not know which command should run. Common examples are webhooks, integration messages, scheduled imports, state-machine transitions, or any input that can fan out to different commands depending on its contents.

Example scenarios:

- A payment webhook can inspect event type, payment status, and customer metadata to create an order, send a receipt, schedule fulfillment, or ignore duplicate notifications.
- A scheduled import can inspect each row or record and fan out to create, update, archive, or notify commands without putting that routing logic in the import job itself.
- An integration message can inspect source system, entity type, and operation to sync customers, update inventory, publish audit events, or skip unsupported messages.
- A state-machine transition can inspect the current state, requested action, and actor permissions to approve, reject, escalate, or queue follow-up commands.
- A document intake flow can inspect document type, extracted fields, and validation results to start review, request missing information, create a case, or notify a team.

## Installation

Install the command rules package:

```shell | copy
dotnet add package FastEndpoints.CommandRules
```

## 1. Define The Input Model

The input model is whatever you need to evaluate. It does not need to implement any FastEndpoints interface.

```cs
public sealed class OrderMessage
{
    public string MessageType { get; set; }
    public string OrderId { get; set; }
    public string CustomerEmail { get; set; }
}
```

## 2. Define Commands

Rules return normal FastEndpoints commands. The commands and handlers are defined exactly as shown in the [Command Bus](command-bus) documentation.

```cs
public sealed class CreateOrder : ICommand
{
    public string OrderId { get; set; }
}

public sealed class SendOrderEmail : ICommand
{
    public string OrderId { get; set; }
    public string CustomerEmail { get; set; }
}

public sealed class CreateOrderHandler : ICommandHandler<CreateOrder>
{
    public Task ExecuteAsync(CreateOrder command, CancellationToken ct)
    {
        // create the order here
    }
}

public sealed class SendOrderEmailHandler : ICommandHandler<SendOrderEmail>
{
    public Task ExecuteAsync(SendOrderEmail command, CancellationToken ct)
    {
        // send the email here
    }
}
```

## 3. Define A Command Rule

The easiest way to create a rule is to inherit from **CommandRule<TInput>** and implement **CanHandle()** and **Build()**.

```cs
public sealed class OrderCreatedRule : CommandRule<OrderMessage>
{
    public override bool CanHandle(OrderMessage input)
        => input.MessageType == "order.created";

    public override IEnumerable<PlannedCommand> Build(OrderMessage input)
    {
        yield return new(new CreateOrder
        {
            OrderId = input.OrderId
        });

        yield return new(new SendOrderEmail
        {
            OrderId = input.OrderId,
            CustomerEmail = input.CustomerEmail
        });
    }
}
```

When **CanHandle()** returns **true**, the commands returned from **Build()** are added to the rule plan. When it returns **false**, the rule is skipped.

A matched rule is allowed to return no commands. This is different from a rule that does not match, and the result will still show that a rule matched.

## 4. Register Rules

Register each rule with the input type it handles:

```cs | title=Program.cs | copy
var bld = WebApplication.CreateBuilder();

bld.Services.AddFastEndpoints();
bld.Services.AddCommandRule<OrderMessage, OrderCreatedRule>();

var app = bld.Build();
app.UseFastEndpoints();
app.Run();
```

Calling **AddCommandRule<TInput, TRule>()** also registers the default **ICommandRuleEngine<TInput>** and **ICommandDispatcher<TInput>** services if they have not already been registered.

Registered rules are transient and can use constructor injection. The default engine and dispatcher are scoped services. **CommandRulesOptions** is registered as a singleton.

Register each rule once. Re-registering the same rule implementation for the same input type is ignored by the default registration helper.

## 5. Dispatch From Anywhere

Inject **ICommandDispatcher<TInput>** and call **DispatchAsync()** with the input model.

```cs
public sealed class WebhookEndpoint(ICommandDispatcher<OrderMessage> dispatcher)
    : Endpoint<OrderMessage>
{
    public override void Configure()
    {
        Post("/webhooks/orders");
        AllowAnonymous();
    }

    public override async Task HandleAsync(OrderMessage req, CancellationToken ct)
    {
        var result = await dispatcher.DispatchAsync(req, ct);

        await Send.OkAsync(new
        {
            result.MatchedRuleCount,
            result.DispatchedAny
        });
    }
}
```

The dispatcher first asks the engine for a **CommandRulePlan** and then dispatches each command in that plan.

## Rule Ordering

Rules are evaluated in ascending **Order**. Lower values run first. Rules with the same order keep their registration order.

```cs
public sealed class PriorityRule : CommandRule<OrderMessage>
{
    public override int Order => -10;

    public override bool CanHandle(OrderMessage input)
        => input.MessageType == "priority.order.created";

    public override IEnumerable<PlannedCommand> Build(OrderMessage input)
    {
        yield return new(new CreateOrder { OrderId = input.OrderId });
    }
}
```

The default order is **0**.

Rules that inherit from **CommandRule<TInput>** expose **Order** directly. If you implement **ICommandRule<TInput>** yourself, also implement **IOrderedCommandRule** to control ordering. Otherwise, the rule uses order **0**.

## Match Modes

By default, the engine collects commands from all matching rules. You can change that behavior with **CommandRuleMatchMode.First**.

```cs | title=Program.cs
bld.Services.AddCommandRules(o =>
{
    o.MatchMode = CommandRuleMatchMode.First;
});
```

The available modes are:

| Mode  | Behavior                                                                   |
|-------|----------------------------------------------------------------------------|
| All   | Collect commands from every matching rule. This is the default.            |
| First | Stop after the first matching rule. Rule ordering decides which rule wins. |

## Unhandled Inputs

When no rule matches, the default behavior is to return an empty plan/result.

```cs
var result = await dispatcher.DispatchAsync(message, ct);

if (!result.HasMatches)
{
    // no rule matched the input
}
```

If you'd rather fail fast, configure **UnhandledRuleBehavior.Throw**.

```cs | title=Program.cs
bld.Services.AddCommandRules(o =>
{
    o.UnhandledBehavior = UnhandledRuleBehavior.Throw;
});
```

With this option enabled, the engine throws **CommandRuleNotFoundException** when no rule matches the input.

## Dispatch Modes

A planned command can be dispatched in one of two ways:

| Mode       | Behavior                                                                  |
|------------|---------------------------------------------------------------------------|
| ExecuteNow | Execute the command immediately via the command bus. This is the default. |
| QueueAsJob | Queue the command as a background job via the job queue system.           |

### Execute Immediately

If no mode is specified, commands are executed immediately.

```cs
public override IEnumerable<PlannedCommand> Build(OrderMessage input)
{
    yield return new(new CreateOrder { OrderId = input.OrderId });
}
```

You can also set the default mode globally:

```cs | title=Program.cs
bld.Services.AddCommandRules(o =>
{
    o.DefaultMode = CommandDispatchMode.ExecuteNow;
});
```

:::admonition type="note"
**ExecuteNow** currently supports regular **ICommand** commands that do not return a result. **ICommand&lt;TResult&gt;** and **IStreamCommand&lt;TResult&gt;** commands are not executed directly by command rules.
:::

### Queue As A Job

Set the planned command's **Mode** to **QueueAsJob** to queue it instead of executing it immediately.

```cs
public override IEnumerable<PlannedCommand> Build(OrderMessage input)
{
    yield return new PlannedCommand(new SendOrderEmail
    {
        OrderId = input.OrderId,
        CustomerEmail = input.CustomerEmail
    })
    {
        Mode = CommandDispatchMode.QueueAsJob,
        Job = new JobDispatchOptions(
            ExecuteAfter: DateTime.UtcNow.AddMinutes(5),
            ExpireOn: DateTime.UtcNow.AddHours(4))
    };
}
```

**JobDispatchOptions** maps to the **executeAfter** and **expireOn** arguments of **QueueJobAsync()**. **ExecuteAfter** and **ExpireOn** must be UTC values when supplied. **ExpireOn** must be later than the effective execution time, otherwise **QueueJobAsync()** throws **ArgumentException**.

:::admonition type="tip"
Queueing requires job queues to be configured. See the [Job Queues](job-queues#enabling-job-queues) documentation for storage provider and startup setup.
:::

**QueueAsJob** supports command jobs that implement **ICommand** or **ICommand&lt;TResult&gt;**. **IStreamCommand&lt;TResult&gt;** and open generic command types are not supported.

### Force A Mode At Dispatch Time

The dispatcher can force one mode for every planned command. This overrides both the planned command's **Mode** and the configured default mode.

```cs
await dispatcher.DispatchAsync(
    message,
    CommandDispatchMode.QueueAsJob,
    ct);
```

## Failure Behavior

By default, dispatching stops at the first failure and the exception is rethrown.

```cs | title=Program.cs
bld.Services.AddCommandRules(o =>
{
    o.FailureBehavior = CommandDispatchFailureBehavior.StopOnFirstFailure;
});
```

If you want to attempt the remaining commands, use **Continue**.

```cs | title=Program.cs
bld.Services.AddCommandRules(o =>
{
    o.FailureBehavior = CommandDispatchFailureBehavior.Continue;
});
```

With **Continue**, failed dispatch attempts are captured as **CommandDispatchOutcome** items in the result.

```cs
var result = await dispatcher.DispatchAsync(message, ct);

foreach (var outcome in result.Outcomes)
{
    if (!outcome.Succeeded)
        logger.LogError(outcome.Exception, "command failed");
}
```

**Continue** only captures failures that occur while dispatching individual commands. Rule evaluation errors, invalid rule plans, and cancellation still propagate.

Cancellation is not swallowed. **OperationCanceledException** is always allowed to propagate.

## Inspecting A Rule Plan

If you only want to know which commands would be created, inject **ICommandRuleEngine<TInput>** instead of the dispatcher.

```cs
public sealed class PreviewEndpoint(ICommandRuleEngine<OrderMessage> engine)
    : Endpoint<OrderMessage>
{
    public override void Configure()
    {
        Post("/webhooks/orders/preview");
    }

    public override async Task HandleAsync(OrderMessage req, CancellationToken ct)
    {
        var plan = await engine.EvaluateAsync(req, ct);

        await Send.OkAsync(new
        {
            plan.MatchedRuleCount,
            CommandCount = plan.Commands.Count
        });
    }
}
```

**CommandRulePlan** contains:

| Member           | Description                                     |
|------------------|-------------------------------------------------|
| MatchedRuleCount | Number of rules that matched the input.         |
| Commands         | Planned commands produced by the matched rules. |
| HasMatches       | **true** when at least one rule matched.        |

## Dispatch Results

**DispatchAsync()** returns a **CommandDispatchResult**.

| Member           | Description                                           |
|------------------|-------------------------------------------------------|
| MatchedRuleCount | Number of rules that matched the input.               |
| HasMatches       | **true** when at least one rule matched.              |
| DispatchedAny    | **true** when at least one command was attempted.     |
| Outcomes         | One **CommandDispatchOutcome** per attempted command. |

Each **CommandDispatchOutcome** contains the command, dispatch mode, success flag, queued job tracking id if one was created, and any captured exception.

```cs
var result = await dispatcher.DispatchAsync(message, ct);

foreach (var outcome in result.Outcomes)
{
    if (outcome.Mode == CommandDispatchMode.QueueAsJob)
        logger.LogInformation("queued job: {id}", outcome.TrackingId);
}
```

## Asynchronous Or Custom Rules

If a rule needs async work, implement **ICommandRule<TInput>** directly or override **EvaluateAsync()**.

```cs
public sealed class CustomerLookupRule(ICustomerApi api)
    : ICommandRule<OrderMessage>
{
    public async ValueTask<CommandRuleMatch> EvaluateAsync(
        OrderMessage input,
        CancellationToken ct = default)
    {
        var customer = await api.FindAsync(input.CustomerEmail, ct);

        if (customer is null)
            return CommandRuleMatch.NoMatch;

        return CommandRuleMatch.Match(
            new PlannedCommand(new CreateOrder { OrderId = input.OrderId }));
    }
}
```

Use **CommandRuleMatch.NoMatch** when the rule does not apply. Use **CommandRuleMatch.Match()** when it applies, with or without commands.

**CommandRuleMatch.Match()** has convenience overloads for empty matches, normal commands, and planned commands:

```cs
return CommandRuleMatch.Match();
return CommandRuleMatch.Match(new CreateOrder { OrderId = input.OrderId });
return CommandRuleMatch.Match(new PlannedCommand(new CreateOrder { OrderId = input.OrderId }));
```

## All Options

```cs | title=Program.cs
bld.Services.AddCommandRules(o =>
{
    o.MatchMode = CommandRuleMatchMode.All;
    o.UnhandledBehavior = UnhandledRuleBehavior.NoOp;
    o.DefaultMode = CommandDispatchMode.ExecuteNow;
    o.FailureBehavior = CommandDispatchFailureBehavior.StopOnFirstFailure;
});
```

| Option            | Default              | Description                                                       |
|-------------------|----------------------|-------------------------------------------------------------------|
| MatchMode         | `All`                | Whether to collect all matching rules or stop at the first match. |
| UnhandledBehavior | `NoOp`               | Whether no-match inputs return an empty result or throw.          |
| DefaultMode       | `ExecuteNow`         | Dispatch mode used when a planned command does not specify one.   |
| FailureBehavior   | `StopOnFirstFailure` | Whether dispatch stops on the first failure or continues.         |

## Command Rules Without FastEndpoints

Command rules can be used outside FE endpoints. Register messaging and command rules with the IOC container, then initialize messaging from the built host/service provider.

```cs | title=Program.cs | copy
using FastEndpoints;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var bld = Host.CreateApplicationBuilder();

bld.Services.AddMessaging();
bld.Services.AddCommandRule<OrderMessage, OrderCreatedRule>();

var host = bld.Build();
host.Services.UseMessaging();

var dispatcher = host.Services.GetRequiredService<ICommandDispatcher<OrderMessage>>();
await dispatcher.DispatchAsync(new OrderMessage
{
    MessageType = "order.created",
    OrderId = "12345",
    CustomerEmail = "customer@example.com"
});

await host.RunAsync();
```

If you dispatch with **QueueAsJob**, configure and start job queues as well.

## Validation & Exceptions

Command rules validate rule results before dispatching. It throws **CommandRuleException** if a rule returns a null match, null command list, null planned command, null command, or an invalid rule plan.

The more specific exceptions are:

| Exception                          | When it's thrown                                             |
|------------------------------------|--------------------------------------------------------------|
| CommandRuleNotFoundException       | No rule matches and **UnhandledBehavior** is **Throw**.      |
| UnsupportedPlannedCommandException | A planned command cannot be dispatched by the selected mode. |

Streaming commands are not supported by command rules dispatch modes. Result-returning commands are not supported by **ExecuteNow** dispatch.