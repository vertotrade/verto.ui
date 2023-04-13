# 1. Install dependencies only when needed
FROM node:16-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
# RUN yarn add sharp
 
# 2. Add Nginx to the image
FROM node:16-alpine AS nginx
RUN apk add --no-cache nginx
COPY nginx.conf /etc/nginx/nginx.conf

# 3. Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Automatically leverage output traces to reduce image size 
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --chown=nextjs:nodejs build/standalone ./
COPY --chown=nextjs:nodejs build/_next/static ./
COPY --chown=nextjs:nodejs build/public ./public
COPY --chown=nextjs:nodejs build/node_modules ./node_modules
COPY --chown=nextjs:nodejs build/.env.production ./

# Copy sharp module
# COPY --from=deps --chown=nextjs:nodejs /app/node_modules/sharp ./sharp

# Copy Nginx configuration, binary, and required files and libraries
COPY --from=nginx /etc/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=nginx /etc/nginx/mime.types /etc/nginx/mime.types
COPY --from=nginx /usr/sbin/nginx /usr/sbin/nginx
COPY --from=nginx /usr/lib/libpcre* /usr/lib/

# Create required directories for Nginx and set ownership and permissions
RUN mkdir -p /var/lib/nginx/logs /var/lib/nginx/tmp/client_body /var/lib/nginx/tmp/proxy && \
    chown -R nextjs:nodejs /var/lib/nginx && \
    chmod -R 755 /var/lib/nginx


# Copy .htpasswd file
COPY --chown=nextjs:nodejs .htpasswd ./

USER nextjs

ENV PORT 3001

EXPOSE 3000

# Run Nginx and Next.js app together (Next.js app listens on port 3001)
CMD ["sh", "-c", "nginx && PORT=3001 node server.js"]
