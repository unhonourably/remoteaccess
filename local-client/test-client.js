import fetch from 'node-fetch';

const LOCAL_PORT = process.env.LOCAL_PORT || 3001;
const CLIENT_URL = `http://localhost:${LOCAL_PORT}`;

const testData = {
  image: 'https://cdn.discordapp.com/app-icons/356875221078245376/6a853b4c87fce0e76b8a6e0a7d96c4c9.png',
  title: 'Test Activity',
  line1: 'Testing Discord RPC',
  line2: 'From local test script'
};

console.log('🧪 Testing local Discord RPC client...');
console.log(`📡 Client URL: ${CLIENT_URL}`);
console.log(`📝 Test data:`, testData);

try {
  console.log('\n1️⃣ Testing status endpoint...');
  const statusResponse = await fetch(`${CLIENT_URL}/status`);
  const statusData = await statusResponse.json();
  console.log('✅ Status response:', statusData);

  console.log('\n2️⃣ Testing update endpoint...');
  const updateResponse = await fetch(`${CLIENT_URL}/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(testData)
  });
  const updateData = await updateResponse.json();
  console.log('✅ Update response:', updateData);

  console.log('\n⏳ Waiting 5 seconds...');
  await new Promise(resolve => setTimeout(resolve, 5000));

  console.log('\n3️⃣ Testing clear endpoint...');
  const clearResponse = await fetch(`${CLIENT_URL}/clear`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  const clearData = await clearResponse.json();
  console.log('✅ Clear response:', clearData);

  console.log('\n🎉 All tests completed!');

} catch (error) {
  console.error('❌ Test failed:', error.message);
  console.log('\n💡 Make sure the local client is running with: npm start');
}
