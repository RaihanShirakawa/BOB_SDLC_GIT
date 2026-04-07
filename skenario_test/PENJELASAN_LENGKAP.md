# Penjelasan Lengkap - Load Test & Stress Test LOS Application

**Dibuat:** 2026-03-11  
**Aplikasi:** Loan Origination System (LOS) MVP  
**Tools:** K6, Apache JMeter  
**Bahasa:** Indonesia

---

## 📋 Daftar Isi

1. [Pengenalan](#pengenalan)
2. [Persiapan Environment](#persiapan-environment)
3. [Penjelasan Skenario Test](#penjelasan-skenario-test)
4. [Cara Menjalankan K6 Tests](#cara-menjalankan-k6-tests)
5. [Cara Menjalankan JMeter Tests](#cara-menjalankan-jmeter-tests)
6. [Interpretasi Hasil Test](#interpretasi-hasil-test)
7. [Troubleshooting](#troubleshooting)
8. [Best Practices](#best-practices)

---

## 🎯 Pengenalan

### Apa itu Load Test?
Load test adalah pengujian untuk mengukur performa aplikasi pada kondisi beban normal. Tujuannya adalah memastikan aplikasi dapat menangani jumlah user yang diharapkan dengan response time yang acceptable.

**Contoh Skenario:**
- 50 user concurrent mengakses aplikasi
- Setiap user melakukan 5 iterasi
- Total durasi: 5 menit
- Think time: 2-5 detik (simulasi user berpikir)

### Apa itu Stress Test?
Stress test adalah pengujian untuk menemukan breaking point aplikasi. Tujuannya adalah mengetahui batas maksimal beban yang dapat ditangani sebelum aplikasi mulai error atau crash.

**Contoh Skenario:**
- 200 user concurrent (beban ekstrem)
- Ramp-up bertahap: 50 → 100 → 150 → 200 users
- Total durasi: 10 menit
- Think time minimal: 1-3 detik (simulasi beban tinggi)

### Perbedaan Load Test vs Stress Test

| Aspek | Load Test | Stress Test |
|-------|-----------|-------------|
| **Tujuan** | Ukur performa normal | Cari breaking point |
| **Jumlah User** | 10-50 users | 50-200+ users |
| **Think Time** | 2-5 detik | 1-3 detik |
| **Error Rate Target** | < 1% | < 10% (acceptable) |
| **Response Time** | < 2 detik | < 5 detik |
| **Durasi** | 5-10 menit | 10-30 menit |

---

## 🔧 Persiapan Environment

### 1. Install K6

**macOS:**
```bash
brew install k6
```

**Windows (Chocolatey):**
```bash
choco install k6
```

**Linux (Debian/Ubuntu):**
```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

**Verifikasi Instalasi:**
```bash
k6 version
```

### 2. Install Apache JMeter

**Download:**
1. Kunjungi https://jmeter.apache.org/download_jmeter.cgi
2. Download Apache JMeter 5.6.3 (Binary)
3. Extract ke folder pilihan Anda

**macOS/Linux:**
```bash
cd apache-jmeter-5.6.3/bin
./jmeter
```

**Windows:**
```bash
cd apache-jmeter-5.6.3\bin
jmeter.bat
```

### 3. Pastikan Aplikasi LOS Berjalan

```bash
cd Demo_Pegadaian/los-mvp
npm install
npm run dev
```

Aplikasi akan berjalan di: http://localhost:5174/

---

## 📊 Penjelasan Skenario Test

### Skenario 1: Load Test (k6_load_test.js)

**Objective:** Mengukur performa aplikasi pada kondisi normal

**Tahapan:**
1. **Ramp-up (1 menit):** 0 → 10 users
2. **Increase (2 menit):** 10 → 30 users
3. **Peak (1 menit):** 30 → 50 users
4. **Sustain (1 menit):** 50 users (constant)
5. **Ramp-down (1 menit):** 50 → 0 users

**User Journey:**
```
1. Load Login Page (1-2s think time)
2. Quick Login as RM (1-2s think time)
3. Load Dashboard (2-4s think time)
4. Click Quick Actions (1-3s think time)
5. Browse Application Table (2-5s think time)
6. Logout
```

**Metrics yang Diukur:**
- `http_req_duration`: Response time per request
- `http_req_failed`: Error rate
- `login_duration`: Waktu login
- `dashboard_duration`: Waktu load dashboard
- `action_clicks`: Jumlah action yang diklik

**Success Criteria:**
- ✅ Response time 95th percentile < 2 detik
- ✅ Error rate < 1%
- ✅ Throughput > 100 requests/second

### Skenario 2: Stress Test (k6_stress_test.js)

**Objective:** Menemukan breaking point aplikasi

**Tahapan:**
1. **Stage 1 (2 menit):** 0 → 50 users
2. **Stage 2 (2 menit):** 50 → 100 users
3. **Stage 3 (2 menit):** 100 → 150 users
4. **Stage 4 (2 menit):** 150 → 200 users (STRESS!)
5. **Sustain (2 menit):** 200 users (constant)
6. **Ramp-down (2 menit):** 200 → 0 users

**Stress Test Actions:**
```
1. Rapid Login Attempts (3x dengan delay 0.5s)
2. Concurrent Dashboard Loads (3x parallel)
3. Rapid Action Clicks (5x dengan delay 0.2s)
4. Concurrent Data Fetching (10x parallel)
5. Heavy Table Operations (6x dengan delay 0.3s)
```

**Metrics yang Diukur:**
- `page_load_time`: Waktu load halaman
- `concurrent_users`: Jumlah user concurrent
- `failed_logins`: Jumlah login gagal
- `successful_actions`: Jumlah action berhasil
- `errors`: Total error rate

**Success Criteria (Relaxed):**
- ⚠️ Response time 95th percentile < 5 detik
- ⚠️ Error rate < 10%
- ⚠️ System masih responsive

### Skenario 3: JMeter Load Test (LOS_Load_Test.jmx)

**Objective:** Load test menggunakan JMeter dengan GUI

**Konfigurasi:**
- Thread Group: 50 users
- Ramp-up: 60 seconds
- Loop Count: 5 iterations
- Duration: ~5 minutes

**Test Steps:**
1. Load Login Page
2. Quick Login as RM
3. Load Dashboard
4. Click Create New Application
5. Browse Application Table

**Listeners:**
- View Results Tree
- Summary Report
- Graph Results
- View Results in Table

### Skenario 4: JMeter Stress Test (LOS_Stress_Test.jmx)

**Objective:** Stress test menggunakan JMeter

**Konfigurasi:**
- Thread Group: 200 users
- Ramp-up: 120 seconds
- Loop Count: 10 iterations
- Duration: 600 seconds (10 minutes)

**Test Steps:**
1. Rapid Login
2. Concurrent Dashboard Loads (3x)
3. Rapid Actions (3x)
4. Heavy Table Operations

**Listeners:**
- Aggregate Report
- Summary Report
- Response Time Graph
- Backend Listener (optional - untuk Grafana)

---

## 🚀 Cara Menjalankan K6 Tests

### 1. Load Test

**Basic Run:**
```bash
cd Demo_Pegadaian/skenario_test
k6 run k6_load_test.js
```

**Run dengan JSON Output:**
```bash
k6 run --out json=load_test_results.json k6_load_test.js
```

**Run dengan Custom VUs:**
```bash
k6 run --vus 30 --duration 3m k6_load_test.js
```

**Run dengan HTML Report (requires extension):**
```bash
k6 run --out html=load_test_report.html k6_load_test.js
```

**Output yang Diharapkan:**
```
     ✓ Login page loaded
     ✓ Quick login successful
     ✓ Dashboard loaded
     ✓ Dashboard has statistics
     ✓ Dashboard has quick actions
     ✓ Dashboard has table
     ✓ Application table visible
     ✓ Table has data
     ✓ Logout successful

     checks.........................: 100.00% ✓ 2250      ✗ 0
     data_received..................: 45 MB   150 kB/s
     data_sent......................: 1.2 MB  4.0 kB/s
     http_req_duration..............: avg=850ms  min=200ms med=750ms max=2.5s  p(95)=1.8s
     http_req_failed................: 0.15%   ✓ 15        ✗ 9985
     http_reqs......................: 10000   33.33/s
     login_duration.................: avg=650ms  p(95)=1.2s
     dashboard_duration.............: avg=920ms  p(95)=1.9s
     action_clicks..................: 2500
     vus............................: 50      min=0       max=50
     vus_max........................: 50      min=50      max=50
```

### 2. Stress Test

**Basic Run:**
```bash
cd Demo_Pegadaian/skenario_test
k6 run k6_stress_test.js
```

**Run dengan Monitoring:**
```bash
k6 run --out influxdb=http://localhost:8086/k6 k6_stress_test.js
```

**Output yang Diharapkan:**
```
🔥 STRESS TEST SUMMARY
============================================================

📋 Test Configuration:
   Max Virtual Users: 200
   Duration: 10 minutes
   Ramp-up: 2 minutes per stage

⏱️  Response Time Metrics:
   Average:    3200ms
   Median:     2800ms
   95th %:     8500ms
   99th %:     12000ms
   Max:        15000ms

   ⚠️  ACCEPTABLE: System shows degradation under stress

📈 Request Statistics:
   Total Requests: 45000
   Request Rate:   75.00/s

❌ Error Analysis:
   Failed Requests: 2340
   Error Rate:      5.20%
   ⚠️  ACCEPTABLE: Moderate error rate under stress

👥 Virtual Users:
   Max Concurrent: 200 users
   Peak Load:      200 users

✅ Successful Actions:
   Total:          42660

🎯 Breaking Point Analysis:
   System shows stress at 200 users
   Recommended max load: 150 users
```

---

## 🔧 Cara Menjalankan JMeter Tests

### 1. GUI Mode (untuk Development)

**Load Test:**
```bash
cd apache-jmeter-5.6.3/bin
./jmeter -t /path/to/Demo_Pegadaian/skenario_test/LOS_Load_Test.jmx
```

**Stress Test:**
```bash
./jmeter -t /path/to/Demo_Pegadaian/skenario_test/LOS_Stress_Test.jmx
```

**Langkah-langkah di GUI:**
1. File akan terbuka di JMeter GUI
2. Klik tombol hijau "Start" (▶️) untuk memulai test
3. Monitor hasil di berbagai Listeners:
   - View Results Tree: Lihat detail setiap request
   - Summary Report: Lihat ringkasan statistik
   - Graph Results: Lihat grafik response time
4. Klik tombol merah "Stop" (⏹️) untuk menghentikan test
5. Save results: File → Save Test Plan

### 2. CLI Mode (untuk Production Testing)

**Load Test:**
```bash
cd apache-jmeter-5.6.3/bin
./jmeter -n -t /path/to/LOS_Load_Test.jmx -l load_results.jtl -e -o load_report
```

**Stress Test:**
```bash
./jmeter -n -t /path/to/LOS_Stress_Test.jmx -l stress_results.jtl -e -o stress_report
```

**Parameter Explanation:**
- `-n`: Non-GUI mode
- `-t`: Test plan file
- `-l`: Log file untuk hasil
- `-e`: Generate HTML report
- `-o`: Output folder untuk HTML report

**Custom Parameters:**
```bash
./jmeter -n -t LOS_Load_Test.jmx \
  -l results.jtl \
  -Jusers=100 \
  -Jduration=600 \
  -e -o report_folder
```

### 3. Membaca HTML Report

Setelah test selesai, buka file `index.html` di folder report:

```bash
open load_report/index.html  # macOS
xdg-open load_report/index.html  # Linux
start load_report/index.html  # Windows
```

**Report Sections:**
1. **Dashboard:** Overview metrics
2. **Charts:** Grafik response time, throughput, errors
3. **Statistics:** Detail per request
4. **Errors:** Daftar error yang terjadi

---

## 📈 Interpretasi Hasil Test

### 1. Response Time Analysis

**Excellent (✅):**
- Average: < 1 second
- 95th percentile: < 2 seconds
- 99th percentile: < 3 seconds

**Acceptable (⚠️):**
- Average: 1-2 seconds
- 95th percentile: 2-3 seconds
- 99th percentile: 3-5 seconds

**Poor (❌):**
- Average: > 2 seconds
- 95th percentile: > 3 seconds
- 99th percentile: > 5 seconds

**Contoh Interpretasi:**
```
http_req_duration: avg=850ms med=750ms p(95)=1.8s p(99)=2.5s

✅ EXCELLENT: 
- Average 850ms sangat bagus (< 1s)
- 95% request selesai dalam 1.8s (< 2s)
- Hanya 1% request yang > 2.5s
```

### 2. Error Rate Analysis

**Excellent (✅):**
- Error rate: < 0.1%
- Failed requests: < 10 dari 10,000

**Acceptable (⚠️):**
- Error rate: 0.1% - 1%
- Failed requests: 10-100 dari 10,000

**Poor (❌):**
- Error rate: > 1%
- Failed requests: > 100 dari 10,000

**Contoh Interpretasi:**
```
http_req_failed: 0.15% (15 failed dari 10,000)

✅ EXCELLENT:
- Error rate sangat rendah
- Sistem stabil
- Tidak ada masalah signifikan
```

### 3. Throughput Analysis

**Excellent (✅):**
- Throughput: > 100 requests/second
- Consistent rate throughout test

**Acceptable (⚠️):**
- Throughput: 50-100 requests/second
- Some fluctuation acceptable

**Poor (❌):**
- Throughput: < 50 requests/second
- Significant drops during test

**Contoh Interpretasi:**
```
http_reqs: 15000 (50/s)

⚠️ ACCEPTABLE:
- Throughput 50 req/s cukup untuk aplikasi internal
- Untuk public-facing app, target 100+ req/s
```

### 4. Breaking Point Analysis (Stress Test)

**Cara Menentukan Breaking Point:**

1. **Monitor Response Time:**
   - Jika p95 > 5s → System under stress
   - Jika p95 > 10s → System breaking

2. **Monitor Error Rate:**
   - Jika error > 5% → System degrading
   - Jika error > 10% → System breaking

3. **Monitor Throughput:**
   - Jika throughput menurun drastis → Bottleneck
   - Jika throughput flat saat user naik → Limit reached

**Contoh Analysis:**
```
Stage 1 (50 users):  p95=1.8s, error=0.2%  ✅ GOOD
Stage 2 (100 users): p95=3.2s, error=1.5%  ⚠️ DEGRADING
Stage 3 (150 users): p95=6.5s, error=4.8%  ⚠️ STRESSED
Stage 4 (200 users): p95=12s,  error=8.2%  ❌ BREAKING

CONCLUSION: Breaking point at ~150 users
RECOMMENDATION: Max production load = 100 users
```

### 5. Metrics Comparison Table

| Metric | Load Test Target | Stress Test Limit | Your Result | Status |
|--------|------------------|-------------------|-------------|--------|
| Avg Response Time | < 1s | < 3s | 850ms | ✅ |
| 95th Percentile | < 2s | < 5s | 1.8s | ✅ |
| Error Rate | < 1% | < 10% | 0.15% | ✅ |
| Throughput | > 100/s | > 50/s | 50/s | ⚠️ |
| Max Users | 50 | 200 | 150 | ⚠️ |

---

## 🔍 Troubleshooting

### Problem 1: K6 Command Not Found

**Error:**
```
bash: k6: command not found
```

**Solution:**
```bash
# Verify installation
which k6

# If not found, reinstall
brew install k6  # macOS
```

### Problem 2: Connection Refused

**Error:**
```
ERRO[0001] GoError: Get "http://localhost:5174/": dial tcp [::1]:5174: connect: connection refused
```

**Solution:**
```bash
# Pastikan aplikasi berjalan
cd Demo_Pegadaian/los-mvp
npm run dev

# Verify di browser
open http://localhost:5174/
```

### Problem 3: High Error Rate

**Symptoms:**
- Error rate > 10%
- Many timeout errors
- Connection refused errors

**Possible Causes & Solutions:**

1. **Server Overloaded:**
   ```bash
   # Reduce concurrent users
   k6 run --vus 25 k6_load_test.js
   ```

2. **Network Issues:**
   ```bash
   # Increase timeout
   # Edit script: http.setDefaultTimeout(30000)
   ```

3. **Application Crash:**
   ```bash
   # Check application logs
   # Restart application
   npm run dev
   ```

### Problem 4: JMeter Won't Start

**Error:**
```
Java not found
```

**Solution:**
```bash
# Install Java
brew install openjdk@11  # macOS

# Set JAVA_HOME
export JAVA_HOME=/usr/local/opt/openjdk@11
```

### Problem 5: Memory Issues

**Symptoms:**
- K6 crashes
- System becomes slow
- Out of memory errors

**Solutions:**

1. **Reduce VUs:**
   ```bash
   k6 run --vus 25 k6_load_test.js
   ```

2. **Increase System Memory:**
   ```bash
   # Close other applications
   # Monitor with: top or htop
   ```

3. **Use Distributed Testing:**
   ```bash
   # Run on multiple machines
   k6 run --out cloud k6_load_test.js
   ```

---

## 💡 Best Practices

### 1. Test Preparation

✅ **DO:**
- Test di environment yang mirip production
- Pastikan aplikasi dalam kondisi fresh (restart)
- Monitor system resources (CPU, Memory, Network)
- Backup data sebelum test
- Inform team sebelum test

❌ **DON'T:**
- Test di production environment
- Test saat ada user aktif
- Test tanpa monitoring
- Test dengan data production

### 2. Test Execution

✅ **DO:**
- Start dengan smoke test (1-5 users)
- Gradually increase load
- Monitor metrics real-time
- Take screenshots of results
- Document findings

❌ **DON'T:**
- Jump directly to max load
- Ignore warnings/errors
- Run multiple tests simultaneously
- Forget to save results

### 3. Result Analysis

✅ **DO:**
- Compare with baseline
- Look for trends
- Identify bottlenecks
- Document recommendations
- Share with team

❌ **DON'T:**
- Focus only on averages
- Ignore outliers
- Make conclusions without data
- Skip documentation

### 4. Continuous Testing

✅ **DO:**
- Run tests regularly (weekly/monthly)
- Track metrics over time
- Test after major changes
- Automate test execution
- Set up alerts

❌ **DON'T:**
- Test only once
- Ignore performance degradation
- Skip regression testing
- Forget to update tests

---

## 📚 Resources & References

### K6 Documentation
- Official Docs: https://k6.io/docs/
- Examples: https://k6.io/docs/examples/
- Best Practices: https://k6.io/docs/testing-guides/

### JMeter Documentation
- Official Docs: https://jmeter.apache.org/usermanual/
- Best Practices: https://jmeter.apache.org/usermanual/best-practices.html
- Plugins: https://jmeter-plugins.org/

### Performance Testing
- Web Performance: https://web.dev/performance/
- Load Testing Guide: https://www.guru99.com/load-testing-tutorial.html
- Stress Testing: https://www.softwaretestinghelp.com/stress-testing-tutorial/

---

## 📞 Support

Jika ada pertanyaan atau masalah:

1. **Check Documentation:** Baca README.md dan file ini
2. **Check Logs:** Review K6/JMeter output
3. **Check Application:** Verify LOS app is running
4. **Contact Team:** Reach out to Bob (Performance Testing Engineer)

---

**Document Version:** 1.0  
**Last Updated:** 2026-03-11  
**Maintained By:** Bob (Performance Testing Engineer)  
**Language:** Bahasa Indonesia