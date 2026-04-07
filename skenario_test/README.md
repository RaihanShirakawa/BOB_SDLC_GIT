# Load Test & Stress Test Scenarios - LOS Application

**Application:** Loan Origination System (LOS) MVP  
**URL:** http://localhost:5174/  
**Created:** 2026-03-11  
**Tools:** K6, Apache JMeter

---

## 📋 Daftar Isi

1. [Overview](#overview)
2. [Test Scenarios](#test-scenarios)
3. [K6 Scripts](#k6-scripts)
4. [JMeter Scripts](#jmeter-scripts)
5. [How to Run](#how-to-run)
6. [Expected Results](#expected-results)
7. [Performance Metrics](#performance-metrics)

---

## 🎯 Overview

Dokumen ini berisi skenario load test dan stress test untuk aplikasi LOS menggunakan K6 dan Apache JMeter. Test ini dirancang untuk mengukur performa aplikasi dalam berbagai kondisi beban.

### Test Types

1. **Load Test** - Mengukur performa aplikasi pada beban normal
2. **Stress Test** - Mengukur batas maksimal aplikasi sebelum crash
3. **Spike Test** - Mengukur respons aplikasi terhadap lonjakan traffic mendadak
4. **Soak Test** - Mengukur stabilitas aplikasi dalam jangka waktu lama

---

## 📊 Test Scenarios

### Scenario 1: Load Test - Normal Business Hours
**Objective:** Mengukur performa aplikasi pada kondisi normal (jam kerja)

**Parameters:**
- Virtual Users: 10-50 users
- Duration: 5 minutes
- Ramp-up: 1 minute
- Think Time: 2-5 seconds

**User Journey:**
1. Login as RM
2. View Dashboard
3. Browse Applications
4. Click Quick Actions
5. Logout

**Expected Results:**
- Response Time: < 2 seconds (95th percentile)
- Error Rate: < 1%
- Throughput: > 100 requests/second

---

### Scenario 2: Stress Test - Peak Load
**Objective:** Menemukan breaking point aplikasi

**Parameters:**
- Virtual Users: 50-200 users
- Duration: 10 minutes
- Ramp-up: 2 minutes
- Think Time: 1-3 seconds

**User Journey:**
1. Login (multiple roles)
2. Heavy Dashboard usage
3. Concurrent data fetching
4. Rapid button clicks

**Expected Results:**
- Find maximum concurrent users
- Identify bottlenecks
- Measure degradation point

---

### Scenario 3: Spike Test - Sudden Traffic
**Objective:** Mengukur respons terhadap lonjakan traffic mendadak

**Parameters:**
- Virtual Users: 10 → 100 → 10 users
- Duration: 5 minutes
- Spike Duration: 30 seconds
- Think Time: 1 second

**Expected Results:**
- Recovery time after spike
- Error rate during spike
- System stability

---

### Scenario 4: Soak Test - Endurance
**Objective:** Mengukur stabilitas jangka panjang

**Parameters:**
- Virtual Users: 20 users (constant)
- Duration: 30 minutes
- Think Time: 3-5 seconds

**Expected Results:**
- Memory leaks detection
- Performance degradation over time
- Resource utilization trends

---

## 🚀 K6 Scripts

### Available K6 Scripts

1. `k6_load_test.js` - Load test scenario
2. `k6_stress_test.js` - Stress test scenario
3. `k6_spike_test.js` - Spike test scenario
4. `k6_soak_test.js` - Soak test scenario
5. `k6_smoke_test.js` - Quick smoke test

### K6 Installation

```bash
# macOS
brew install k6

# Windows (using Chocolatey)
choco install k6

# Linux
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

### Running K6 Tests

```bash
# Load Test
k6 run k6_load_test.js

# Stress Test
k6 run k6_stress_test.js

# Spike Test
k6 run k6_spike_test.js

# Soak Test
k6 run k6_soak_test.js

# With HTML Report
k6 run --out json=results.json k6_load_test.js
k6 run --out html=report.html k6_load_test.js

# With InfluxDB (for Grafana visualization)
k6 run --out influxdb=http://localhost:8086/k6 k6_load_test.js
```

---

## 🔧 JMeter Scripts

### Available JMeter Scripts

1. `LOS_Load_Test.jmx` - Load test scenario
2. `LOS_Stress_Test.jmx` - Stress test scenario
3. `LOS_Spike_Test.jmx` - Spike test scenario
4. `LOS_Soak_Test.jmx` - Soak test scenario

### JMeter Installation

```bash
# Download from https://jmeter.apache.org/download_jmeter.cgi
# Extract and run

# macOS/Linux
./apache-jmeter-5.x/bin/jmeter

# Windows
apache-jmeter-5.x\bin\jmeter.bat
```

### Running JMeter Tests

```bash
# GUI Mode (for test development)
jmeter -t LOS_Load_Test.jmx

# CLI Mode (for actual testing)
jmeter -n -t LOS_Load_Test.jmx -l results.jtl -e -o report_folder

# With specific properties
jmeter -n -t LOS_Load_Test.jmx -l results.jtl -Jusers=50 -Jduration=300
```

---

## 📈 Performance Metrics

### Key Metrics to Monitor

1. **Response Time**
   - Average Response Time
   - 95th Percentile
   - 99th Percentile
   - Max Response Time

2. **Throughput**
   - Requests per Second
   - Data Transfer Rate
   - Concurrent Users

3. **Error Rate**
   - HTTP Errors (4xx, 5xx)
   - Failed Requests
   - Timeout Errors

4. **Resource Utilization**
   - CPU Usage
   - Memory Usage
   - Network I/O
   - Browser Performance

### Success Criteria

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| Avg Response Time | < 1s | 1-2s | > 2s |
| 95th Percentile | < 2s | 2-3s | > 3s |
| Error Rate | < 0.1% | 0.1-1% | > 1% |
| Throughput | > 100 rps | 50-100 rps | < 50 rps |
| CPU Usage | < 70% | 70-85% | > 85% |
| Memory Usage | < 80% | 80-90% | > 90% |

---

## 🎯 Test Execution Plan

### Phase 1: Smoke Test (5 minutes)
- 1-5 users
- Verify basic functionality
- Ensure no critical errors

### Phase 2: Load Test (10 minutes)
- 10-50 users
- Normal business scenario
- Baseline performance metrics

### Phase 3: Stress Test (15 minutes)
- 50-200 users
- Find breaking point
- Identify bottlenecks

### Phase 4: Spike Test (10 minutes)
- Sudden traffic increase
- Recovery testing
- Stability verification

### Phase 5: Soak Test (30-60 minutes)
- Constant load
- Memory leak detection
- Long-term stability

---

## 📊 Expected Results

### Load Test Results (50 users)
```
✓ http_req_duration..............: avg=850ms  min=200ms med=750ms max=2.5s  p(95)=1.8s
✓ http_req_failed................: 0.15%
✓ http_reqs......................: 15000 (50/s)
✓ vus............................: 50
✓ vus_max........................: 50
```

### Stress Test Results (200 users)
```
✓ http_req_duration..............: avg=3.2s   min=500ms med=2.8s max=15s   p(95)=8.5s
✗ http_req_failed................: 5.2%
✓ http_reqs......................: 45000 (75/s)
✓ vus............................: 200
✓ vus_max........................: 200
```

---

## 🔍 Troubleshooting

### Common Issues

1. **High Response Time**
   - Check network latency
   - Verify server resources
   - Optimize database queries
   - Enable caching

2. **High Error Rate**
   - Check server logs
   - Verify API endpoints
   - Check authentication
   - Review error messages

3. **Memory Leaks**
   - Monitor memory usage over time
   - Check for unclosed connections
   - Review Redux store size
   - Optimize component lifecycle

---

## 📝 Notes

1. **Application is Client-Side Only**
   - No backend API calls
   - All data from JSON files
   - localStorage for state
   - Performance mainly browser-based

2. **Test Limitations**
   - Cannot test database performance
   - Cannot test API response times
   - Focus on frontend rendering
   - Browser resource utilization

3. **Recommendations**
   - Test on different browsers
   - Test on different devices
   - Monitor browser console
   - Use browser DevTools

---

## 📚 References

- [K6 Documentation](https://k6.io/docs/)
- [JMeter Documentation](https://jmeter.apache.org/usermanual/index.html)
- [Performance Testing Best Practices](https://k6.io/docs/testing-guides/performance-testing/)
- [Web Performance Metrics](https://web.dev/metrics/)

---

**Maintained By:** Bob (Performance Testing Engineer)  
**Last Updated:** 2026-03-11  
**Version:** 1.0