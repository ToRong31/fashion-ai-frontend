# Components & Pages

React components and pages structure.

## Pages

### HomePage (`/`)

Landing page with hero section and featured products.

```
- Hero banner with branding
- Featured products grid
- Call-to-action buttons
```

### ProductsPage (`/products`)

Product listing page with grid layout.

```
- ProductGrid component
- ProductCard for each item
- Category filtering (future)
```

### ProductDetailPage (`/products/:id`)

Single product details.

```
- Large product image
- Name, description, price
- Size selector
- Stock status
- Add to cart button
```

### CartPage (`/cart`)

Shopping cart review.

```
- CartItem list
- Quantity controls
- Remove item button
- Order summary
- Checkout button
```

### LoginPage (`/login`)

Authentication page.

```
- Login form
- Register form (toggle)
- Error handling
```

## Components

### ChatWidget

Floating AI assistant widget.

```
- Fixed position (bottom-right)
- Toggle button (MessageCircle icon)
- Expandable panel (480px wide, 650px tall)
- Message list with auto-scroll
- ChatInput for sending messages
- ProductCard for product recommendations
- Typing indicator
```

**Props/State:**
```typescript
interface ChatWidgetProps {}
```

### ChatMessage

Individual chat message.

```
- Avatar (user/assistant)
- Message content (markdown support)
- Agent badge (optional)
- Timestamp
```

### ChatProductCard

Product card within chat.

```
- Compact product display
- Image, name, price
- "Add to Cart" button
```

### ChatInput

Message input for chat.

```
- Text input
- Send button
- Loading state
```

### Header

Site header/navigation.

```
- Logo
- Nav links (Home, Products)
- Cart icon with badge
- User menu (Login/Logout)
```

### Footer

Site footer.

```
- Copyright
- Links
```

### ProductCard

Product grid item.

```
- Product image
- Name
- Price
- Stock indicator
- Click → ProductDetailPage
```

### ProductGrid

Product listing container.

```
- Responsive grid (1-4 columns)
- ProductCard children
```

### CartItem

Cart line item.

```
- Product info
- Size
- Quantity stepper
- Remove button
- Subtotal
```

## Key Files

### Pages
- `src/pages/HomePage.tsx`
- `src/pages/ProductsPage.tsx`
- `src/pages/ProductDetailPage.tsx`
- `src/pages/CartPage.tsx`
- `src/pages/LoginPage.tsx`

### Components
- `src/components/chat/ChatWidget.tsx`
- `src/components/chat/ChatMessage.tsx`
- `src/components/chat/ChatInput.tsx`
- `src/components/chat/ChatProductCard.tsx`
- `src/components/chat/ChatMarkdown.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/product/ProductCard.tsx`
- `src/components/product/ProductGrid.tsx`
- `src/components/cart/CartItem.tsx`

## Component Hierarchy

```
App
├── Header
├── Routes
│   ├── HomePage
│   ├── ProductsPage → ProductGrid → ProductCard
│   ├── ProductDetailPage
│   ├── CartPage → CartItem[]
│   └── LoginPage
├── Footer
└── ChatWidget
    ├── ChatMessage[]
    └── ChatInput
```
