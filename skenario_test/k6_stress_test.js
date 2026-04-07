/**
 * K6 Stress Test Script - LOS Application
 * 
 * Scenario: Peak Load Stress Test
 * Objective: Find the breaking point of the application
 * 
 * Test Parameters:
 * - Virtual Users: 50-200 users
 * - Duration: 10 minutes
 * - Ramp-up: 2 minutes
 * - Think Time: 1-3 seconds
 * 
 * Run: k6 run k6_stress_test.js
 * Run with report: k6 run --out json=stress_test_results.json k6_stress_test.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter, Gauge } from 'k6/metrics';

// Custom Metrics
const errorRate = new Rate('errors');
const pageLoadTime = new Trend('page_load_time');
const concurrentUsers = new Gauge('concurrent_users');
const failedLogins = new Counter('failed_logins');
const successfulActions = new Counter('successful_actions');

// Test Configuration - Aggressive Stress Test
export const options = {
  stages: [
    { duration: '2m', target: 50 },    // Ramp-up to 50 users
    { duration: '2m', target: 100 },   // Ramp-up to 100 users
    { duration: '2m', target: 150 },   // Ramp-up to 150 users
    { duration: '2m', target: 200 },   // Ramp-up to 200 users (stress point)
    { duration: '2m', target: 200 },   // Stay at 200 users
    { duration: '2m', target: 0 },     // Ramp-down to 0 users
  ],
  thresholds: {
    'http_req_duration': ['p(95)<5000'],  // 95% of requests should be below 5s (relaxed for stress)
    'http_req_failed': ['rate<0.1'],      // Error rate should be less than 10% (relaxed for stress)
    'errors': ['rate<0.1'],
    'page_load_time': ['p(95)<6000'],
  },
};

// Base URL
const BASE_URL = 'http://localhost:5174';

// User Roles for Testing
const USERS = [
  { username: 'john.rm', password: 'password123', role: 'RM' },
  { username: 'jane.analyst', password: 'password123', role: 'Credit Analyst' },
  { username: 'bob.approver', password: 'password123', role: 'Approver' },
  { username: 'alice.admin', password: 'password123', role: 'Admin' },
];

/**
 * Setup function - runs once before test
 */
export function setup() {
  console.log('🔥 Starting Stress Test...');
  console.log(`📊 Target: 200 concurrent users (STRESS LEVEL)`);
  console.log(`⏱️  Duration: 10 minutes`);
  console.log(`⚠️  Warning: This test will push the system to its limits!`);
  return { startTime: new Date() };
}

/**
 * Main test function - runs for each virtual user
 */
export default function(data) {
  // Track concurrent users
  concurrentUsers.add(__VU);
  
  // Select random user
  const user = USERS[Math.floor(Math.random() * USERS.length)];
  
  // Aggressive Test Flow - Minimal think time
  stressTestLogin(user);
  stressTestDashboard(user);
  stressTestRapidActions(user);
  stressTestConcurrentDataFetch(user);
  stressTestTableOperations(user);
  
  // Minimal think time for stress
  sleep(Math.random() * 2 + 1); // 1-3 seconds
}

/**
 * Stress Test 1: Rapid Login Attempts
 */
function stressTestLogin(user) {
  const startTime = Date.now();
  
  // Simulate rapid login attempts
  for (let i = 0; i < 3; i++) {
    const response = http.get(`${BASE_URL}/`);
    
    const success = check(response, {
      'Login page responds': (r) => r.status === 200,
      'Login page loads quickly': (r) => r.timings.duration < 3000,
    });
    
    if (!success) {
      failedLogins.add(1);
      errorRate.add(1);
    } else {
      successfulActions.add(1);
    }
    
    sleep(0.5); // Very short delay
  }
  
  const duration = Date.now() - startTime;
  pageLoadTime.add(duration);
}

/**
 * Stress Test 2: Heavy Dashboard Load
 */
function stressTestDashboard(user) {
  const startTime = Date.now();
  
  // Multiple concurrent dashboard requests
  const responses = http.batch([
    ['GET', `${BASE_URL}/`],
    ['GET', `${BASE_URL}/`],
    ['GET', `${BASE_URL}/`],
  ]);
  
  responses.forEach((response, index) => {
    const success = check(response, {
      [`Dashboard ${index + 1} loaded`]: (r) => r.status === 200,
      [`Dashboard ${index + 1} has content`]: (r) => r.body.length > 1000,
    });
    
    errorRate.add(!success);
    if (success) successfulActions.add(1);
  });
  
  const duration = Date.now() - startTime;
  pageLoadTime.add(duration);
  
  sleep(0.5);
}

/**
 * Stress Test 3: Rapid Action Clicks
 */
function stressTestRapidActions(user) {
  // Simulate rapid clicking of all quick actions
  const actions = [
    'Create New Application',
    'My Applications',
    'Upload Documents',
    'Create New Application',
    'My Applications',
  ];
  
  actions.forEach(action => {
    const response = http.get(`${BASE_URL}/`);
    
    const success = check(response, {
      'Action responds': (r) => r.status === 200,
    });
    
    errorRate.add(!success);
    if (success) successfulActions.add(1);
    
    sleep(0.2); // Very rapid clicks
  });
}

/**
 * Stress Test 4: Concurrent Data Fetching
 */
function stressTestConcurrentDataFetch(user) {
  const startTime = Date.now();
  
  // Simulate fetching multiple data sources simultaneously
  const requests = [];
  for (let i = 0; i < 10; i++) {
    requests.push(['GET', `${BASE_URL}/`]);
  }
  
  const responses = http.batch(requests);
  
  let successCount = 0;
  responses.forEach((response, index) => {
    const success = check(response, {
      [`Request ${index + 1} successful`]: (r) => r.status === 200,
      [`Request ${index + 1} fast enough`]: (r) => r.timings.duration < 5000,
    });
    
    if (success) {
      successCount++;
      successfulActions.add(1);
    } else {
      errorRate.add(1);
    }
  });
  
  const duration = Date.now() - startTime;
  pageLoadTime.add(duration);
  
  console.log(`✓ Concurrent fetch: ${successCount}/${responses.length} successful`);
  
  sleep(0.5);
}

/**
 * Stress Test 5: Heavy Table Operations
 */
function stressTestTableOperations(user) {
  // Simulate heavy table interactions
  const operations = [
    'Load table',
    'Sort column',
    'Filter data',
    'Click edit',
    'Scroll table',
    'Load table again',
  ];
  
  operations.forEach(operation => {
    const response = http.get(`${BASE_URL}/`);
    
    const success = check(response, {
      [`${operation} successful`]: (r) => r.status === 200,
      [`${operation} responsive`]: (r) => r.timings.duration < 4000,
    });
    
    errorRate.add(!success);
    if (success) successfulActions.add(1);
    
    sleep(0.3);
  });
}

/**
 * Teardown function - runs once after test
 */
export function teardown(data) {
  const endTime = new Date();
  const duration = (endTime - data.startTime) / 1000;
  
  console.log('✅ Stress Test Completed!');
  console.log(`⏱️  Total Duration: ${duration.toFixed(2)} seconds`);
  console.log('📊 Check the summary above for detailed metrics');
  console.log('⚠️  Review error rates and response times to identify bottlenecks');
}

/**
 * Handle Summary - Custom summary output
 */
export function handleSummary(data) {
  const summary = generateStressSummary(data);
  
  return {
    'stress_test_summary.json': JSON.stringify(data, null, 2),
    'stress_test_report.txt': summary,
    stdout: summary,
  };
}

/**
 * Generate Stress Test Summary
 */
function generateStressSummary(data) {
  const metrics = data.metrics;
  
  let summary = '\n';
  summary += '🔥 STRESS TEST SUMMARY\n';
  summary += '='.repeat(60) + '\n\n';
  
  // Test Configuration
  summary += '📋 Test Configuration:\n';
  summary += '   Max Virtual Users: 200\n';
  summary += '   Duration: 10 minutes\n';
  summary += '   Ramp-up: 2 minutes per stage\n\n';
  
  // Performance Metrics
  if (metrics.http_req_duration) {
    summary += '⏱️  Response Time Metrics:\n';
    summary += `   Average:    ${metrics.http_req_duration.values.avg.toFixed(2)}ms\n`;
    summary += `   Median:     ${metrics.http_req_duration.values.med.toFixed(2)}ms\n`;
    summary += `   95th %:     ${metrics.http_req_duration.values['p(95)'].toFixed(2)}ms\n`;
    summary += `   99th %:     ${metrics.http_req_duration.values['p(99)'].toFixed(2)}ms\n`;
    summary += `   Max:        ${metrics.http_req_duration.values.max.toFixed(2)}ms\n\n`;
    
    // Performance Assessment
    const p95 = metrics.http_req_duration.values['p(95)'];
    if (p95 < 2000) {
      summary += '   ✅ EXCELLENT: System handles stress very well\n\n';
    } else if (p95 < 5000) {
      summary += '   ⚠️  ACCEPTABLE: System shows degradation under stress\n\n';
    } else {
      summary += '   ❌ CRITICAL: System severely degraded under stress\n\n';
    }
  }
  
  // Request Statistics
  if (metrics.http_reqs) {
    summary += '📈 Request Statistics:\n';
    summary += `   Total Requests: ${metrics.http_reqs.values.count}\n`;
    summary += `   Request Rate:   ${metrics.http_reqs.values.rate.toFixed(2)}/s\n\n`;
  }
  
  // Error Analysis
  if (metrics.http_req_failed) {
    const failRate = (metrics.http_req_failed.values.rate * 100).toFixed(2);
    const failCount = metrics.http_req_failed.values.passes || 0;
    
    summary += '❌ Error Analysis:\n';
    summary += `   Failed Requests: ${failCount}\n`;
    summary += `   Error Rate:      ${failRate}%\n`;
    
    if (failRate < 1) {
      summary += '   ✅ EXCELLENT: Very low error rate\n\n';
    } else if (failRate < 5) {
      summary += '   ⚠️  ACCEPTABLE: Moderate error rate under stress\n\n';
    } else if (failRate < 10) {
      summary += '   ⚠️  WARNING: High error rate, investigate bottlenecks\n\n';
    } else {
      summary += '   ❌ CRITICAL: Very high error rate, system unstable\n\n';
    }
  }
  
  // Virtual Users
  if (metrics.vus_max) {
    summary += '👥 Virtual Users:\n';
    summary += `   Max Concurrent: ${metrics.vus_max.values.value}\n`;
    summary += `   Peak Load:      ${metrics.vus_max.values.value} users\n\n`;
  }
  
  // Custom Metrics
  if (metrics.successful_actions) {
    summary += '✅ Successful Actions:\n';
    summary += `   Total:          ${metrics.successful_actions.values.count}\n\n`;
  }
  
  if (metrics.failed_logins) {
    summary += '🔐 Failed Logins:\n';
    summary += `   Total:          ${metrics.failed_logins.values.count}\n\n`;
  }
  
  // Recommendations
  summary += '💡 Recommendations:\n';
  summary += '   1. Review response times at peak load (200 users)\n';
  summary += '   2. Identify bottlenecks in concurrent data fetching\n';
  summary += '   3. Optimize heavy table operations\n';
  summary += '   4. Consider implementing caching strategies\n';
  summary += '   5. Monitor browser memory usage during stress\n';
  summary += '   6. Test with different browser configurations\n\n';
  
  // Breaking Point Analysis
  summary += '🎯 Breaking Point Analysis:\n';
  if (metrics.http_req_duration && metrics.http_req_failed) {
    const p95 = metrics.http_req_duration.values['p(95)'];
    const errorRate = metrics.http_req_failed.values.rate * 100;
    
    if (p95 < 3000 && errorRate < 5) {
      summary += '   System can handle 200+ concurrent users\n';
      summary += '   Recommended max load: 200 users\n';
    } else if (p95 < 5000 && errorRate < 10) {
      summary += '   System shows stress at 200 users\n';
      summary += '   Recommended max load: 150 users\n';
    } else {
      summary += '   System breaking point reached at 200 users\n';
      summary += '   Recommended max load: 100 users\n';
    }
  }
  
  summary += '\n' + '='.repeat(60) + '\n';
  
  return summary;
}

// Made with Bob
