# Next.js Caching Implementation Guide

## Overview
This project now includes comprehensive caching strategies for optimal performance:

## 🚀 Implemented Caching Features

### 1. Server-side Caching
- **Next.js Configuration**: Optimized `next.config.js` with caching headers, compression, and webpack caching
- **Static Generation (SSG)**: Stats and leaderboard pages with automatic regeneration
- **Incremental Static Regeneration (ISR)**: Pages revalidate every 5-10 minutes
- **API Route Caching**: Built-in cache headers with stale-while-revalidate

### 2. Client-side Caching
- **SWR Integration**: Automatic data fetching, caching, and revalidation
- **Optimistic Updates**: Instant UI updates before server confirmation
- **Background Revalidation**: Fresh data without blocking UI
- **Error Handling**: Automatic retry logic with exponential backoff

### 3. Memory & Redis Caching
- **Memory Cache**: In-memory caching for development and simple use cases
- **Redis Support**: Production-ready Redis caching layer (optional)
- **Cache Invalidation**: Smart invalidation by tags and patterns
- **Query Caching**: Database query caching with TTL

## 📁 File Structure

```
src/
├── lib/
│   ├── cache.ts              # Memory cache utilities
│   ├── redis-cache.ts        # Redis caching layer
│   └── swr-config.ts         # SWR configuration
├── hooks/
│   └── useApi.ts             # Custom SWR hooks
├── components/
│   ├── providers/
│   │   └── SWRProvider.tsx   # SWR context provider
│   ├── CachedUserProfile.tsx # User profile with caching
│   ├── CachedTasksList.tsx   # Tasks list with caching
│   └── CachedAdsList.tsx     # Ads list with caching
├── app/
│   ├── api/
│   │   ├── user/[id]/route.ts # User API with caching
│   │   ├── tasks/route.ts     # Tasks API with caching
│   │   └── ads/route.ts       # Ads API with caching
│   ├── stats/page.tsx         # ISR stats page
│   ├── leaderboard/page.tsx   # ISR leaderboard page
│   └── demo/page.tsx          # Caching demo page
```

## ⚙️ Cache Configuration

### API Routes TTL
- **User Data**: 5 minutes
- **Tasks**: 10 minutes  
- **Ads**: 3 minutes
- **Stats**: 5 minutes (ISR)
- **Leaderboard**: 10 minutes (ISR)

### SWR Settings
- **Revalidation**: Background revalidation enabled
- **Deduplication**: 2 seconds
- **Error Retry**: 3 attempts with 5s intervals
- **Focus Revalidation**: Disabled by default

## 🔧 Usage Examples

### Using Cached API Hooks
```tsx
import { useUser, useCompleteTask } from '@/hooks/useApi'

function UserComponent({ userId }: { userId: string }) {
  const { user, isLoading, revalidate } = useUser(userId)
  const { trigger: completeTask } = useCompleteTask()
  
  // Data is automatically cached and revalidated
  return <div>{user?.balanceTK}</div>
}
```

### Manual Cache Operations
```tsx
import { memoryCache, revalidateTag } from '@/lib/cache'

// Set cache
memoryCache.set('key', data, 300) // 5 minutes TTL

// Get from cache
const cached = memoryCache.get('key')

// Invalidate by tag
revalidateTag('user:123')
```

### Optimistic Updates
```tsx
import { useOptimisticUpdate } from '@/hooks/useApi'

function Component() {
  const { updateUserBalance } = useOptimisticUpdate()
  
  const handleAction = () => {
    // Update UI immediately
    updateUserBalance(userId, 50)
    // API call happens in background
  }
}
```

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   yarn install
   ```

2. **Run Development Server**:
   ```bash
   yarn dev
   ```

3. **View Caching Demo**:
   Navigate to `/demo` to see all caching features in action

4. **Check Cache Headers**:
   Open browser DevTools → Network tab to see cache headers

## 🔍 Monitoring Cache Performance

### Browser DevTools
- **Network Tab**: Check cache headers (Cache-Control, X-Cache)
- **Application Tab**: View cached data in browser storage
- **Performance Tab**: Monitor loading times

### Cache Headers to Look For
- `Cache-Control: public, s-maxage=300, stale-while-revalidate=60`
- `X-Cache: HIT` or `X-Cache: MISS`
- `X-Cache-Tags: user,tasks`

## 🔧 Production Optimization

### Redis Setup (Optional)
```typescript
// Uncomment in redis-cache.ts
import Redis from 'ioredis'

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
})
```

### Environment Variables
```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password
NEXT_PUBLIC_API_URL=/api
```

### CDN Configuration
- Configure your CDN to respect cache headers
- Set longer TTL for static assets
- Enable compression (gzip/brotli)

## 📊 Cache Strategies by Data Type

| Data Type | Strategy | TTL | Revalidation |
|-----------|----------|-----|--------------|
| User Profile | SWR + API Cache | 5min | 30s |
| Tasks | SWR + API Cache | 10min | 1min |
| Ads | SWR + API Cache | 3min | 30s |
| Stats | ISR | 5min | On-demand |
| Leaderboard | ISR | 10min | On-demand |

## 🐛 Troubleshooting

### Cache Not Working
1. Check browser DevTools for cache headers
2. Verify SWR provider is wrapping your app
3. Ensure API routes return proper cache headers

### Stale Data Issues
1. Check TTL settings in cache configuration
2. Verify revalidation intervals
3. Use manual revalidation if needed

### Performance Issues
1. Monitor cache hit rates
2. Adjust TTL values based on data freshness needs
3. Consider Redis for high-traffic applications

## 🔄 Cache Invalidation Strategies

### Automatic Invalidation
- Time-based (TTL expiration)
- Background revalidation
- Focus revalidation

### Manual Invalidation
- Tag-based invalidation
- Pattern-based invalidation
- Full cache clear

### Smart Invalidation
- Invalidate related data on mutations
- Optimistic updates with rollback
- Selective cache warming

This implementation provides a robust, scalable caching solution that significantly improves your application's performance and user experience.
