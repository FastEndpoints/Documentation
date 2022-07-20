---
title: Benchmarks
description: A light-weight REST Api framework for ASP.Net 6 that implements REPR (Request-Endpoint-Response) Pattern.
---

<h1 align="center">Benchmarks</h1>

## Head-To-Head Benchmark

| Method                           |   Mean   | Ration | Gen 0  | Gen 1  | Allocated |
| -------------------------------- | :------: | -----: | ------ | ------ | --------- |
| FastEndpoints                    | 45.99 μs |   1.00 | 2.0000 | -      | 17 KB     |
| FastEndpoints (CodeGen)          | 46.27 μs |   1.01 | 2.0000 | -      | 17 KB     |
| ASP NET 6 Minimal Api            | 47.22 μs |   1.03 | 2.1000 | -      | 18 KB     |
| FastEndpoints (Throttling)       | 48.14 μs |   1.05 | 2.2000 | -      | 18 KB     |
| FastEndpoints (Scoped Validator) | 66.50 μs |   1.45 | 3.2000 | 0.1000 | 26 KB     |
| ASP NET 6 MVC Controller         | 80.51 μs |   1.75 | 2.9000 | -      | 24 KB     |

## Bombardier Load Test (best out of 5 runs)

```
hardware: AMD Ryzen 7 3700X (8c/16t), 16GB RAM, Windows 11
parameters: -c 512 -m POST -f "body.json" -H "Content-Type:application/json" -d 30s
```

### FastEndpoints (45,000 more requests per second than mvc controller)

```
Statistics        Avg      Stdev        Max
  Reqs/sec    152719.41   15319.65  237177.27
  Latency        3.31ms   233.06us    61.00ms
  HTTP codes:
    1xx - 0, 2xx - 4635227, 3xx - 0, 4xx - 0, 5xx - 0
    others - 0
  Throughput:    75.30MB/s
```

### ASP NET Minimal Api

```
Statistics        Avg      Stdev        Max
  Reqs/sec    149415.35   14544.34  185050.95
  Latency        3.38ms     0.89ms   431.99ms
  HTTP codes:
    1xx - 0, 2xx - 4529011, 3xx - 0, 4xx - 0, 5xx - 0
    others - 0
  Throughput:    75.73MB/s
```

### FastEndpoints with throttling

```
Statistics        Avg      Stdev        Max
  Reqs/sec    137547.83   18167.83  215500.00
  Latency        3.69ms     2.02ms   568.63ms
  HTTP codes:
    1xx - 0, 2xx - 4154347, 3xx - 0, 4xx - 0, 5xx - 0
    others - 0
  Throughput:    72.77MB/s
```

### ASP NET MVC Controller

```
Statistics        Avg      Stdev        Max
  Reqs/sec    107381.33   13064.54  184073.63
  Latency        4.73ms     1.25ms   416.00ms
  HTTP codes:
    1xx - 0, 2xx - 3245222, 3xx - 0, 4xx - 0, 5xx - 0
    others - 0
  Throughput:    54.26MB/s
```

## TechEmpower Benchmark (Preliminary)

<img src="/techempower-benchmarks.png" alt="TechEmpower Benchmark" />
