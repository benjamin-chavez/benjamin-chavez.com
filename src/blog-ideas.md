# Blog Post Ideas

 - How to fix glitchy/laggy framer motion anmiations
 - styling code blocks like vercel
 - styling form input tags with tailwind
 - Audio Player
 - Zod Async Validation
 - auth0 redirects/return to/callback
 - withMiddlewareAuthRequired
 - Testing the performance difference between:
    ```ts
    static async create({
      systemUserId,
      cartId,
    }: {
      systemUserId: string;
      cartId: string;
    }): Promise<Cart> {
    ```

    ```ts
    static async create(systemUserId: string, cartId: string): Promise<Cart> {
    ```
- Testing the performance difference between using supertest and using an http client like axios and/or fetch
