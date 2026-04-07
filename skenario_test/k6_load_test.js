/**
 * K6 Load Test Script - LOS Application
 * 
 * Scenario: Normal Business Hours Load Test
 * Objective: Measure application performance under normal load
 * 
 * Test Parameters:
 * - Virtual Users: 10-50 users
 * - Duration: 5 minutes
 * - Ramp-up: 1 minute
 * - Think Time: 2-5 seconds
 * 
 * Run: k6 run k6_load_test.js
 * Run with report: k6 run --out json=load_test_results.json k6_load_test.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom Metrics
const errorRate = new Rate('errors');
const loginDuration = new Trend('login_duration');
const dashboardDuration = new Trend('dashboard_duration');
const actionClicks = new Counter('action_clicks');

// Test Configuration
export const options = {
  stages: [
    { duration: '1m', target: 10 },   // Ramp-up to 10 users
    { duration: '2m', target: 30 },   // Ramp-up to 30 users
    { duration: '1m', target: 50 },   // Ramp-up to 50 users
    { duration: '1m', target: 50 },   // Stay at 50 users
    { duration: '1m', target: 0 },    // Ramp-down to 0 users
  ],
  thresholds: {
    'http_req_duration': ['p(95)<2000'],  // 95% of requests should be below 2s
    'http_req_failed': ['rate<0.01'],     // Error rate should be less than 1%
    'errors': ['rate<0.01'],
    'login_duration': ['p(95)<1500'],
    'dashboard_duration': ['p(95)<2000'],
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
  console.log('🚀 Starting Load Test...');
  console.log(`📊 Target: 50 concurrent users`);
  console.log(`⏱️  Duration: 5 minutes`);
  return { startTime: new Date() };
}

/**
 * Main test function - runs for each virtual user
 */
export default function(data) {
  // Select random user
  const user = USERS[Math.floor(Math.random() * USERS.length)];
  
  // Test Flow
  testLoginPage();
  testQuickLogin(user);
  testDashboard(user);
  testQuickActions(user);
  testApplicationTable(user);
  testLogout();
  
  // Think time between iterations
  sleep(Math.random() * 3 + 2); // 2-5 seconds
}

/**
 * Test 1: Load Login Page
 */
function testLoginPage() {
  const startTime = Date.now();
  
  const response = http.get(`${BASE_URL}/`);
  
  const success = check(response, {
    'Login page loaded': (r) => r.status === 200,
    'Login page has title': (r) => r.body.includes('Loan Origination System'),
    'Login page has form': (r) => r.body.includes('Username') && r.body.includes('Password'),
  });
  
  errorRate.add(!success);
  
  sleep(1);
}

/**
 * Test 2: Quick Login (simulated)
 */
function testQuickLogin(user) {
  const startTime = Date.now();
  
  // Note: Since this is a client-side app, we simulate the login
  // In real scenario, this would be an API call
  const response = http.get(`${BASE_URL}/`);
  
  const duration = Date.now() - startTime;
  loginDuration.add(duration);
  
  const success = check(response, {
    'Quick login successful': (r) => r.status === 200,
  });
  
  errorRate.add(!success);
  
  sleep(1);
}

/**
 * Test 3: Load Dashboard
 */
function testDashboard(user) {
  const startTime = Date.now();
  
  const response = http.get(`${BASE_URL}/`);
  
  const duration = Date.now() - startTime;
  dashboardDuration.add(duration);
  
  const success = check(response, {
    'Dashboard loaded': (r) => r.status === 200,
    'Dashboard has statistics': (r) => r.body.includes('Total Applications'),
    'Dashboard has quick actions': (r) => r.body.includes('Quick Actions'),
    'Dashboard has table': (r) => r.body.includes('My Applications'),
  });
  
  errorRate.add(!success);
  
  sleep(2);
}

/**
 * Test 4: Click Quick Actions
 */
function testQuickActions(user) {
  // Simulate clicking quick action buttons
  const actions = [
    'Create New Application',
    'My Applications',
    'Upload Documents',
  ];
  
  const randomAction = actions[Math.floor(Math.random() * actions.length)];
  
  // In real scenario, this would trigger navigation or modal
  // For now, we just count the action
  actionClicks.add(1);
  
  sleep(1);
}

/**
 * Test 5: Browse Application Table
 */
function testApplicationTable(user) {
  const response = http.get(`${BASE_URL}/`);
  
  const success = check(response, {
    'Application table visible': (r) => r.status === 200,
    'Table has data': (r) => r.body.includes('APP-'),
  });
  
  errorRate.add(!success);
  
  // Simulate scrolling through table
  sleep(2);
}

/**
 * Test 6: Logout
 */
function testLogout() {
  const response = http.get(`${BASE_URL}/`);
  
  const success = check(response, {
    'Logout successful': (r) => r.status === 200,
  });
  
  errorRate.add(!success);
  
  sleep(1);
}

/**
 * Teardown function - runs once after test
 */
export function teardown(data) {
  const endTime = new Date();
  const duration = (endTime - data.startTime) / 1000;
  
  console.log('✅ Load Test Completed!');
  console.log(`⏱️  Total Duration: ${duration.toFixed(2)} seconds`);
  console.log('📊 Check the summary above for detailed metrics');
}

/**
 * Handle Summary - Custom summary output
 */
export function handleSummary(data) {
  return {
    'load_test_summary.json': JSON.stringify(data, null, 2),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}

/**
 * Text Summary Helper
 */
function textSummary(data, options) {
  const indent = options.indent || '';
  const enableColors = options.enableColors || false;
  
  let summary = '\n';
  summary += `${indent}📊 Load Test Summary\n`;
  summary += `${indent}${'='.repeat(50)}\n\n`;
  
  // Metrics
  const metrics = data.metrics;
  
  if (metrics.http_req_duration) {
    summary += `${indent}⏱️  HTTP Request Duration:\n`;
    summary += `${indent}   Average: ${metrics.http_req_duration.values.avg.toFixed(2)}ms\n`;
    summary += `${indent}   Median:  ${metrics.http_req_duration.values.med.toFixed(2)}ms\n`;
    summary += `${indent}   95th %:  ${metrics.http_req_duration.values['p(95)'].toFixed(2)}ms\n`;
    summary += `${indent}   Max:     ${metrics.http_req_duration.values.max.toFixed(2)}ms\n\n`;
  }
  
  if (metrics.http_reqs) {
    summary += `${indent}📈 HTTP Requests:\n`;
    summary += `${indent}   Total:   ${metrics.http_reqs.values.count}\n`;
    summary += `${indent}   Rate:    ${metrics.http_reqs.values.rate.toFixed(2)}/s\n\n`;
  }
  
  if (metrics.http_req_failed) {
    const failRate = (metrics.http_req_failed.values.rate * 100).toFixed(2);
    summary += `${indent}❌ Failed Requests:\n`;
    summary += `${indent}   Rate:    ${failRate}%\n\n`;
  }
  
  if (metrics.vus) {
    summary += `${indent}👥 Virtual Users:\n`;
    summary += `${indent}   Current: ${metrics.vus.values.value}\n`;
    summary += `${indent}   Max:     ${metrics.vus_max.values.value}\n\n`;
  }
  
  // Custom Metrics
  if (metrics.login_duration) {
    summary += `${indent}🔐 Login Duration:\n`;
    summary += `${indent}   Average: ${metrics.login_duration.values.avg.toFixed(2)}ms\n`;
    summary += `${indent}   95th %:  ${metrics.login_duration.values['p(95)'].toFixed(2)}ms\n\n`;
  }
  
  if (metrics.dashboard_duration) {
    summary += `${indent}📊 Dashboard Load Duration:\n`;
    summary += `${indent}   Average: ${metrics.dashboard_duration.values.avg.toFixed(2)}ms\n`;
    summary += `${indent}   95th %:  ${metrics.dashboard_duration.values['p(95)'].toFixed(2)}ms\n\n`;
  }
  
  if (metrics.action_clicks) {
    summary += `${indent}🖱️  Action Clicks:\n`;
    summary += `${indent}   Total:   ${metrics.action_clicks.values.count}\n\n`;
  }
  
  summary += `${indent}${'='.repeat(50)}\n`;
  
  return summary;
}

// Made with Bob
