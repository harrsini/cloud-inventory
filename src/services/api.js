import { fetchAuthSession } from 'aws-amplify/auth';

const API_BASE_URL =
  'https://psrd9jxg84.execute-api.us-east-1.amazonaws.com';

async function getAuthHeader() {
  const session = await fetchAuthSession();
  const token = session.tokens?.accessToken?.toString();

  return {
    Authorization: token,
    'Content-Type': 'application/json',
  };
}

/* ================= READ PRODUCTS (FIXED) ================= */

export async function getItems() {
  const headers = await getAuthHeader();

  const res = await fetch(`${API_BASE_URL}/products`, {
    method: 'GET',
    headers,
  });

  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }

  return res.json();
}

/* ================= ADD PRODUCT ================= */

export async function addProduct(product) {
  const headers = await getAuthHeader();

  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers,
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to add product');
  }

  return response.json();
}

/* ================= UPDATE STOCK ================= */

export async function updateStock(productId, quantity) {
  const headers = await getAuthHeader();

  const response = await fetch(`${API_BASE_URL}/stock`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      productId,
      quantity: Number(quantity),
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to update stock');
  }

  return response.json();
}
