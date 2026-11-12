const http = require('http');

const postData = JSON.stringify({
  email: 'admin@autocare.com',
  password: 'Admin@123',
});

const req = http.request(
  {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
  },
  (res) => {
    let data = '';
    res.on('data', (chunk) => (data += chunk));
    res.on('end', () => {
      console.log('Status code:', res.statusCode);
      const parsed = JSON.parse(data);
      console.log('Login success:', parsed.success);
      console.log('User role:', parsed.user?.role);
      console.log('User name:', parsed.user?.name);
      console.log('Token generated:', !!parsed.token);
    });
  }
);

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(postData);
req.end();
