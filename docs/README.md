# ToRoMe Frontend

React-based fashion e-commerce frontend with AI assistant chat widget.

## Overview

| Property | Value |
|----------|-------|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 6 |
| State Management | Zustand |
| Styling | TailwindCSS 4 |
| Port | 3000 |

## Project Structure

```
src/
├── api/                    # API client functions
│   ├── auth.ts            # Login, register, user profile
│   ├── cart.ts            # Cart operations
│   ├── chat.ts            # AI chat
│   ├── client.ts          # Axios configuration
│   ├── orders.ts          # Order operations
│   └── products.ts        # Product queries
├── components/
│   ├── cart/              # Cart UI components
│   ├── chat/              # AI chat widget
│   │   ├── ChatInput.tsx
│   │   ├── ChatMarkdown.tsx
│   │   ├── ChatMessage.tsx
│   │   ├── ChatProductCard.tsx
│   │   └── ChatWidget.tsx  # Floating AI assistant
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── product/
│       ├── ProductCard.tsx
│       └── ProductGrid.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── ProductDetailPage.tsx
│   ├── ProductsPage.tsx
│   └── CartPage.tsx
├── stores/                 # Zustand state stores
│   ├── authStore.ts       # Auth & user state
│   ├── cartStore.ts      # Shopping cart state
│   └── chatStore.ts      # Chat messages & AI state
├── types/                 # TypeScript interfaces
│   ├── cart.ts
│   ├── chat.ts
│   ├── order.ts
│   ├── product.ts
│   └── user.ts
├── App.tsx                # Main app with routing
├── main.tsx               # Entry point
└── index.css              # Global styles (Tailwind)
```

## Tech Stack

- **React 19** - UI library with hooks
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **TailwindCSS 4** - Utility-first CSS
- **Zustand** - Lightweight state management
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **Lucide React** - Icons

## API Integration

### Backend API (port 9000)

All API calls go through the Gateway Service:

```typescript
// src/api/client.ts
export const backendApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000',
});
```

### AI Orchestrator (port 8000)

Chat API calls directly to AI orchestrator:

```typescript
export const orchesApi = axios.create({
  baseURL: import.meta.env.VITE_ORCHES_URL || 'http://localhost:8000',
});
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_BACKEND_URL` | Backend gateway URL | `http://localhost:9000` |
| `VITE_ORCHES_URL` | AI orchestrator URL | `http://localhost:8000` |

## Key Features

### Authentication
- JWT-based login/register
- Token stored in localStorage
- Auto-attached to API requests via interceptor

### Shopping Cart
- Persistent cart (stored on backend)
- Add/remove/update items
- Size selection support

### AI Chat Assistant
- Floating widget (bottom-right)
- Product search via natural language
- Styling recommendations
- Order creation from chat

## Routing

| Path | Page | Description |
|------|------|-------------|
| `/` | HomePage | Hero + featured products |
| `/products` | ProductsPage | Product listing |
| `/products/:id` | ProductDetailPage | Product details |
| `/cart` | CartPage | Shopping cart |
| `/login` | LoginPage | Login/Register |

## State Management

### Auth Store (Zustand)
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  register: (username, password) => Promise<void>;
  login: (username, password) => Promise<void>;
  logout: () => void;
}
```

### Cart Store (Zustand)
```typescript
interface CartState {
  items: CartItem[];
  isLoading: boolean;
  fetchCart: (userId) => Promise<void>;
  addItem: (req) => Promise<void>;
  removeItem: (itemId) => Promise<void>;
  updateQuantity: (itemId, quantity) => Promise<void>;
  clear: (userId) => Promise<void>;
}
```

### Chat Store (Zustand)
```typescript
interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  toggleOpen: () => void;
  sendMessage: (userId, message) => Promise<void>;
  loadHistory: (userId) => Promise<void>;
}
```

## Components

### ChatWidget
- Floating button (bottom-right)
- Expandable chat panel
- Product card display
- Auto-scroll messages
- "Add to cart" action handling

### ProductCard
- Image display
- Name, price
- Stock indicator
- Click to detail page

### Header
- Logo
- Navigation links
- Cart icon with count badge
- User menu (login/logout)

## Quick Start

```bash
cd fashion-ai-frontend
npm install
npm run dev
```

Frontend runs at http://localhost:3000

## Development Notes

- Frontend calls only Gateway (port 9000), never directly to backend services
- AI chat uses separate orchestrator API (port 8000)
- TailwindCSS 4 uses CSS-based configuration
- Zustand with persist middleware for auth state
