# Quick Start Guide - Load & Stress Testing

**⚡ Panduan Cepat untuk Memulai Performance Testing**

---

## 🚀 Quick Start - K6 Load Test

### 1. Install K6 (One-time)

```bash
# macOS
brew install k6

# Windows
choco install k6

# Linux
sudo apt-get install k6
```

### 2. Start LOS Application

```bash
cd Demo_Pegadaian/los-mvp
npm run dev
```

Pastikan aplikasi berjalan di: http://localhost:5174/

### 3. Run Load Test

```bash
cd Demo_Pegadaian/skenario_test
k6 run k6_load_test.js
```

**Expected Output:**
```
✓ Login page loaded
✓ Dashboard loaded
✓ All checks passed

http_req_duration: avg=850ms p(95)=1.8s
http_req_failed: 0.15%
http_reqs: 10000 (50/s)
```

---

## 🔥 Quick Start - K6 Stress Test

```bash
cd Demo_Pegadaian/skenario_test
k6 run k6_stress_test.js
```

**Expected Output:**
```
🔥 STRESS TEST SUMMARY
Max Users: 200
Response Time p95: 8.5s
Error Rate: 5.2%
Breaking Point: ~150 users
```

---

## 🔧 Quick Start - JMeter Load Test

### 1. Install JMeter (One-time)

1. Download dari: https://jmeter.apache.org/download_jmeter.cgi
2. Extract ke folder pilihan
3. Pastikan Java terinstall: `java -version`

### 2. Run Load Test (GUI Mode)

```bash
cd apache-jmeter-5.6.3/bin
./jmeter -t /path/to/Demo_Pegadaian/skenario_test/LOS_Load_Test.jmx
```

1. Klik tombol hijau "Start" ▶️
2. Monitor hasil di "Summary Report"
3. Klik "Stop" ⏹️ setelah selesai

### 3. Run Load Test (CLI Mode)

```bash
./jmeter -n -t /path/to/LOS_Load_Test.jmx -l results.jtl -e -o report
open report/index.html
```

---

## 📊 Quick Interpretation

### ✅ Good Results
- Response time p95 < 2s
- Error rate < 1%
- Throughput > 50 req/s

### ⚠️ Warning Signs
- Response time p95 > 3s
- Error rate > 5%
- Throughput dropping

### ❌ Critical Issues
- Response time p95 > 5s
- Error rate > 10%
- Many timeout errors

---

## 🆘 Quick Troubleshooting

### Problem: "k6: command not found"
```bash
# Reinstall K6
brew install k6
```

### Problem: "Connection refused"
```bash
# Start the application
cd Demo_Pegadaian/los-mvp
npm run dev
```

### Problem: "High error rate"
```bash
# Reduce concurrent users
k6 run --vus 25 k6_load_test.js
```

---

## 📚 Next Steps

1. ✅ Run basic load test
2. ✅ Check results
3. 📖 Read [PENJELASAN_LENGKAP.md](./PENJELASAN_LENGKAP.md) for details
4. 📖 Read [README.md](./README.md) for full documentation

---

## 🎯 Test Checklist

- [ ] K6 installed
- [ ] JMeter downloaded
- [ ] LOS application running
- [ ] Load test executed
- [ ] Results documented
- [ ] Stress test executed
- [ ] Breaking point identified
- [ ] Report generated

---

**Need Help?** Check [PENJELASAN_LENGKAP.md](./PENJELASAN_LENGKAP.md) for detailed explanations!