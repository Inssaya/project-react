#!/usr/bin/env node
/**
 * Simple API test script to verify backend is working
 * Run: node test-api.js
 */

const BASE_URL = 'http://localhost:3001';

async function testEndpoint(name, url, options = {}) {
  try {
    console.log(`\n🧪 Testing: ${name}`);
    console.log(`   URL: ${url}`);
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Response:`, JSON.stringify(data, null, 2));
    return { success: response.ok, data };
  } catch (error) {
    console.log(`   ❌ Error:`, error.message);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 MySchools API Test Suite');
  console.log('='  .repeat(50));

  // Test 1: Health check
  await testEndpoint(
    'Health Check',
    `${BASE_URL}/`
  );

  // Test 2: API routes list
  await testEndpoint(
    'API Routes',
    `${BASE_URL}/api`
  );

  // Test 3: Login with admin credentials
  console.log('\n📝 To test login, first create an admin user:');
  console.log('   cd backend && npm run create-admin');
  console.log('\n   Then uncomment the login test below and add your credentials.');

  /*
  const loginResult = await testEndpoint(
    'Login',
    `${BASE_URL}/api/auth/login`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'your_password_here'
      })
    }
  );

  if (loginResult.success && loginResult.data.data && loginResult.data.data.token) {
    const token = loginResult.data.data.token;
    console.log('\n✅ Login successful! Token:', token.substring(0, 20) + '...');

    // Test 4: Get schools (authenticated)
    await testEndpoint(
      'Get Schools (Authenticated)',
      `${BASE_URL}/api/schools`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
  }
  */

  console.log('\n' + '='.repeat(50));
  console.log('✅ Basic tests completed!');
  console.log('\n💡 Next steps:');
  console.log('   1. Create admin user: npm run create-admin');
  console.log('   2. Uncomment login test above with your credentials');
  console.log('   3. Run this script again to test authenticated endpoints');
}

runTests();
