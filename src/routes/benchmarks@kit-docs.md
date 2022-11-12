---
title: Benchmarks
description: A light-weight REST Api framework for ASP.Net 6 that implements REPR (Request-Endpoint-Response) Pattern.
---

<h1>Benchmarks</h1>

## Head-To-Head Benchmark

|                           Method |     Mean | Ratio |   Gen0 |   Gen1 | Allocated | Alloc-Ratio |
|--------------------------------- |---------:|------:|-------:|-------:|----------:|------------:|
|                    FastEndpoints | 40.32 μs |  1.00 | 2.0000 |      - |  16.71 KB |        1.00 |
|           ASP NET 7 Minimal APIs | 44.07 μs |  1.09 | 2.1000 |      - |  17.07 KB |        1.02 |
|          FastEndpoints (CodeGen) | 44.67 μs |  1.11 | 2.0000 |      - |  16.75 KB |        1.00 |
| FastEndpoints (Scoped Validator) | 57.83 μs |  1.43 | 3.4000 | 0.1000 |  28.08 KB |        1.68 |
|         ASP NET 7 MVC Controller | 63.97 μs |  1.59 | 2.8000 | 0.1000 |  23.58 KB |        1.41 |

## Bombardier Load Test (best out of 5 runs)

```
hardware: AMD Ryzen 7 3700X (8c/16t), 16GB RAM, Windows 11
parameters: -c 512 -m POST -f "body.json" -H "Content-Type:application/json" -d 30s
```

### ASP NET Minimal API (~1k more requests per second than fastendpoints)

```
Statistics        Avg      Stdev        Max
  Reqs/sec    133862.82   13910.17  176864.72
  Latency        3.76ms     1.42ms   397.78ms
  HTTP codes:
    1xx - 0, 2xx - 4072279, 3xx - 0, 4xx - 0, 5xx - 0
    others - 0
  Throughput:    68.10MB/s
```

### FastEndpoints (~35k more requests per second than mvc controller)

```
Statistics        Avg      Stdev        Max
  Reqs/sec    132920.30   13080.95  292207.79
  Latency        3.80ms     2.43ms   636.79ms
  HTTP codes:
    1xx - 0, 2xx - 4033570, 3xx - 0, 4xx - 0, 5xx - 0
    others - 0
  Throughput:    67.43MB/s
```

### ASP NET MVC Controller

```
Statistics        Avg      Stdev        Max
  Reqs/sec     97704.36   11639.55  137931.03
  Latency        5.18ms     2.46ms   571.64ms
  HTTP codes:
    1xx - 0, 2xx - 2962086, 3xx - 0, 4xx - 0, 5xx - 0
    others - 0
  Throughput:    49.53MB/s
```

## TechEmpower Benchmark (Preliminary)
<a href="https://www.techempower.com/benchmarks/#section=test&runid=b0f80483-5664-4bfb-9614-de615d1ac8f8&hw=ph&test=json&l=zik0zh-sf&c=8&a=2" target="_blank">
  <img src="/techempower-benchmarks.png" alt="TechEmpower Benchmark" />
</a>
