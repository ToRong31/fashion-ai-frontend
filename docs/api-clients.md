# API Clients

Frontend API layer for communicating with Backend Gateway and AI Orchestrator.

## Overview

All API calls are centralized in `src/api/` directory using Axios.

## Client Configuration

### backendApi

HTTP client for Backend Gateway (port 9000).

```typescript
// src/api/client.ts
import axios from 'axios';

export const backendApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000',
  headers: { 'Content-Type': 'application/json' },
});

// JWT interceptor - auto-attaches token to requests
backendApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### orchesApi

HTTP client for AI Orchestrator (port 8000).

```typescript
export const orchesApi = axios.create({
  baseURL: import.meta.env.VITE_ORCHES_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
});
```

## API Modules

### auth.ts

Authentication endpoints.

```typescript
// Login
POST /api/auth/login { username, password } → { token, user_id, username }

// Register
POST /api/auth/register { username, password } → { token, user_id, username }

// Get user profile
GET /api/users/{id} → { id, username, preferences, createdAt }

// Update preferences
PATCH /api/users/profile { preferences } → { id, username, preferences, createdAt }
```

### products.ts

Product catalog endpoints.

```typescript
// List all products
GET /api/products → { products: Product[] }

// Get product by ID
GET /api/products/{id} → Product

// Vector search (semantic)
POST /api/products/vector-search { query, top_k } → { products: Product[] }
```

### cart.ts

Shopping cart endpoints.

```typescript
// Get user's cart
GET /api/cart?userId={id} → { userId, items: CartItem[], totalAmount }

// Add item to cart
POST /api/cart/items { userId, productId, size, quantity } → CartItem

// Update cart item
PUT /api/cart/items/{id} { size?, quantity? } → CartItem | null

// Remove item
DELETE /api/cart/items/{id} → void

// Clear cart
DELETE /api/cart?userId={id} → void
```

### orders.ts

Order management endpoints.

```typescript
// Create order
POST /api/orders { userId, items: [{ productId, size, quantity }] } → CreateOrderResponse

// Create order from cart
POST /api/orders/auto-create { userId } → AutoCreateOrderResponse

// Checkout from cart
POST /api/orders/checkout { userId } → AutoCreateOrderResponse (with vnpayRef)

// Get order
GET /api/orders/{id} → AutoCreateOrderResponse
```

### chat.ts

AI Chat endpoints (calls orchestrator directly).

```typescript
// Send message
POST /chat { user_id, message } → ChatResponse

// Get conversation history
GET /conversation/{userId} → { history: [{ role, content }] }
```

## Usage Examples

```typescript
import { backendApi } from './api/client';
import * as authApi from './api/auth';
import * as productsApi from './api/products';
import * as cartApi from './api/cart';

// Login
const { token, user_id } = await authApi.login({ username, password });

// Get products
const { products } = await productsApi.getProducts();

// Add to cart
await cartApi.addToCart({ userId: 1, productId: 5, size: 'M', quantity: 1 });
```

## Key Files

- `src/api/client.ts` - Axios instances & interceptors
- `src/api/auth.ts` - Authentication
- `src/api/products.ts` - Product queries
- `src/api/cart.ts` - Cart operations
- `src/api/orders.ts` - Order operations
- `src/api/chat.ts` - AI chat
