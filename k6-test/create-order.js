import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 200,
  duration: '30s',
  stages: [
    { duration: '10s', target: 200 },
    { duration: '20s', target: 200 },
  ],
};

export default function () {
  const url = 'http://localhost:8080/orders';

  const productId = '<YOUR_PRODUCT_ID>';

  const payload = JSON.stringify({
    productId: productId,
    quantity: 1, 
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

  sleep(1); 
}
