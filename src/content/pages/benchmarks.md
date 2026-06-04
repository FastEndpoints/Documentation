---
title: Benchmarks
description: A light-weight REST Api framework for ASP.Net that implements REPR (Request-Endpoint-Response) Pattern.
---

<h1>Benchmarks</h1>

## BenchmarkDotNet

Ratio is relative to FastEndpoints. Lower is better.

| Endpoint       |     Mean | Ratio |   Gen0 | Allocated | Alloc Ratio |
|----------------|---------:|------:|-------:|----------:|------------:|
| MinimalApi     | 19.84 μs |  0.87 | 0.7324 |  15.12 KB |        0.99 |
| FastEndpoints  | 22.95 μs |  1.01 | 0.7324 |  15.25 KB |        1.00 |
| MVC Controller | 36.78 μs |  1.61 | 1.2207 |  22.52 KB |        1.48 |

## NBomber Throughput Load Tests

```
hardware: AMD Ryzen 9 5950X (16c/32t), 32GB RAM
software: .NET 10.0 (CachyOS)
payload: same JSON payload as BenchmarkDotNet
load model: closed workload with 8 concurrent users
duration: 5 second warm-up, 1 minute test
```

Throughput ratio is relative to FastEndpoints. Higher is better for requests/sec and throughput ratio. Lower is better for latency.

| Endpoint       | Successful Requests | Requests/sec | Throughput Ratio | Mean Latency | P95 Latency | P99 Latency |
|----------------|--------------------:|-------------:|-----------------:|-------------:|------------:|------------:|
| Minimal APIs   |          12,679,923 |   211,332.05 |             1.03 |      0.04 ms |     0.03 ms |     0.05 ms |
| FastEndpoints  |          12,250,861 |   204,181.02 |             1.00 |      0.04 ms |     0.04 ms |     0.05 ms |
| MVC Controller |           8,678,790 |   144,646.50 |             0.71 |      0.05 ms |     0.05 ms |     0.90 ms |

## TechEmpower Benchmark (Preliminary)

<a href="https://www.techempower.com/benchmarks/#section=test&runid=3c2e9871-9c2a-4ff3-bc31-620f65da4e74&hw=ph&test=json&l=zik0zh-6bj&p=zik0zi-zik0zj-zik0zj-zik0zj-zik0zj-1r&c=8" target="_blank">
  <img src="/techempower-benchmarks.png" alt="TechEmpower Benchmark" />
</a>