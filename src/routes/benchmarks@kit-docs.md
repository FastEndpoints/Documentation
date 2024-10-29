---
title: Benchmarks
description: A light-weight REST Api framework for ASP.Net 6 that implements REPR (Request-Endpoint-Response) Pattern.
---

<h1>Benchmarks</h1>

## BenchmarkDotNet

| Method         |     Mean | Ratio | Allocated | Alloc Ratio |
|----------------|---------:|------:|----------:|------------:|
| Minimal APIs   | 24.69 us |  0.92 |  14.75 KB |        0.97 |
| FastEndpoints  | 26.76 us |  1.00 |  15.23 KB |        1.00 |
| MVC Controller | 40.58 us |  1.52 |   22.1 KB |        1.45 |

## Bombardier Load Tests

```
hardware: AMD Ryzen 9 5950X (16c/32t), 32GB RAM
software: .NET 9.0 RC2, Windows 11
parameters: -c 512 -m POST -f "body.json" -H "Content-Type:application/json" -d 30s
```

### Minimal APIs

```
Statistics        Avg      Stdev        Max
  Reqs/sec    257730.00   18733.46  360540.81
  Latency        1.97ms     0.91ms   390.00ms
  HTTP codes:
    1xx - 0, 2xx - 7787939, 3xx - 0, 4xx - 0, 5xx - 0
    others - 0
  Throughput:   130.23MB/s
```

### FastEndpoints

```
Statistics        Avg      Stdev        Max
  Reqs/sec    254103.07   17146.14  289439.60
  Latency        1.99ms     0.95ms   415.00ms
  HTTP codes:
    1xx - 0, 2xx - 7679513, 3xx - 0, 4xx - 0, 5xx - 0
    others - 0
  Throughput:   128.41MB/s
```

### MVC Controller

```
Statistics        Avg      Stdev        Max
  Reqs/sec    224798.56   17129.93  258658.48
  Latency        2.25ms     1.01ms   388.00ms
  HTTP codes:
    1xx - 0, 2xx - 6800642, 3xx - 0, 4xx - 0, 5xx - 0
    others - 0
  Throughput:   113.71MB/s
```

## TechEmpower Benchmark (Preliminary)

<a href="https://www.techempower.com/benchmarks/#section=test&runid=3c2e9871-9c2a-4ff3-bc31-620f65da4e74&hw=ph&test=json&l=zik0zh-6bj&p=zik0zi-zik0zj-zik0zj-zik0zj-zik0zj-1r&c=8" target="_blank">
  <img src="/techempower-benchmarks.png" alt="TechEmpower Benchmark" />
</a>