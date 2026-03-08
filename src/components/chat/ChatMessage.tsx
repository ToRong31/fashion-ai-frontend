import type { ChatMessage as ChatMessageType } from '../../types/chat';
import { Bot, UserIcon, Package, Sparkles, ShoppingCart, Check } from 'lucide-react';
import ChatProductCard, { type ChatProduct } from './ChatProductCard';
import ChatMarkdown from './ChatMarkdown';

interface ChatMessageProps {
  message: ChatMessageType;
}

/** Extract products from structured data (search agent → data.products) */
function getSearchProducts(data?: Record<string, unknown> | null): ChatProduct[] | null {
  if (!data?.products || !Array.isArray(data.products)) return null;
  return (data.products as Array<Record<string, unknown>>)
    .filter((p) => p.id && p.name)
    .map((p) => {
      const meta = p.metadata as Record<string, unknown> | null | undefined;
      return {
        id: Number(p.id),
        name: String(p.name),
        price: `$${p.price ?? 0}`,
        description: String(p.description ?? ''),
        color: meta?.color ? String(meta.color) : undefined,
        category: meta?.category ? String(meta.category) : undefined,
      };
    });
}

/** Extract products from structured data (stylist agent → data.items) */
function getStylistProducts(data?: Record<string, unknown> | null): ChatProduct[] | null {
  if (!data?.items || !Array.isArray(data.items)) return null;
  return (data.items as Array<Record<string, unknown>>)
    .filter((p) => p.product_id && p.name)
    .map((p) => ({
      id: Number(p.product_id),
      name: String(p.name),
      price: `$${p.price ?? 0}`,
      description: String(p.role ?? ''),
    }));
}

/** Strip markdown table lines from text so we can show products as cards instead. */
function stripTableLines(content: string): string {
  return content
    .split('\n')
    .filter((line) => {
      const t = line.trim();
      return !t.startsWith('|') && !/^\*{0,2}search results?\*{0,2}$/i.test(t);
    })
    .join('\n')
    .trim();
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isCartAction = message.data?.action === 'add_to_cart' && message.data?.cart_item;
  const cartItem = isCartAction
    ? (message.data!.cart_item as { product_id: number; product_name: string; price: number })
    : null;

  // Try to extract products from structured data
  const searchProducts = !isUser ? getSearchProducts(message.data) : null;
  const stylistProducts = !isUser ? getStylistProducts(message.data) : null;
  const products = searchProducts ?? stylistProducts;
  const isStylist = !!stylistProducts;

  return (
    <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser ? 'bg-gold/20 text-gold' : 'bg-surface text-text-secondary'
      }`}>
        {isUser ? <UserIcon size={14} /> : <Bot size={14} />}
      </div>
      <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
        isUser
          ? 'bg-gold/15 text-text-primary'
          : 'bg-surface text-text-primary border border-border'
      }`}>
        {isCartAction && cartItem ? (
          <div className="flex items-start gap-2.5">
            <div className="w-10 h-10 rounded-md bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <ShoppingCart size={16} className="text-green-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Check size={12} className="text-green-400" />
                <span className="text-xs font-medium text-green-400">Added to cart</span>
              </div>
              <p className="text-xs font-medium text-text-primary">{cartItem.product_name}</p>
              <p className="text-xs font-heading text-gold">${cartItem.price}</p>
            </div>
          </div>
        ) : products && products.length > 0 ? (
          <>
            {/* Header */}
            <div className="flex items-center gap-1.5 mb-2">
              {isStylist ? (
                <Sparkles size={13} className="text-gold" />
              ) : (
                <Package size={13} className="text-gold" />
              )}
              <span className="text-xs font-medium text-gold">
                {isStylist
                  ? String((message.data as Record<string, unknown>)?.outfit_name ?? 'Outfit Recommendation')
                  : `${products.length} product${products.length > 1 ? 's' : ''} found`}
              </span>
            </div>

            {/* Product cards */}
            <div className="grid grid-cols-2 gap-1.5 -mx-1 mb-2">
              {products.map((p) => (
                <ChatProductCard key={p.id} product={p} />
              ))}
            </div>

            {/* Remaining text (strip table lines for search, show full for stylist) */}
            {message.content && (
              <ChatMarkdown content={isStylist ? message.content : stripTableLines(message.content)} />
            )}
          </>
        ) : (
          <ChatMarkdown content={message.content} />
        )}
        {message.agent_used && (
          <span className="text-[10px] text-text-secondary mt-1 block uppercase tracking-wider">
            via {message.agent_used}
          </span>
        )}
      </div>
    </div>
  );
}
