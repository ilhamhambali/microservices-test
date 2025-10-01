import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  // Simulate 200 concurrent users
  vus: 200,
  // For a total duration of 30 seconds
  duration: '30s',
  // Ramp up to 200 users over 10 seconds
  stages: [
    { duration: '10s', target: 200 },
    { duration: '20s', target: 200 },
  ],
};

export default function () {
  const url = 'http://localhost:8080/orders';

  // !!! IMPORTANT: Replace this with an ID of a product you created !!!
  const productId = '<YOUR_PRODUCT_ID>';

  const payload = JSON.stringify({
    productId: productId,
    quantity: 1, // Order one item per request
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'is status 201': (r) => r.status === 201,
    'order created successfully': (r) => r.json('id') !== '',
  });

  sleep(1); // Wait 1 second between requests per VU
}
