# 1. Install dependencies only when needed
FROM node:16-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.


WORKDIR /app
COPY package.json yarn.lock ./


# 3. Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app


RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001


# Automatically leverage output traces to reduce image size 
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --chown=nextjs:nodejs build/standalone ./
COPY --chown=nextjs:nodejs build/node_modules ./node_modules
COPY --chown=nextjs:nodejs build/public ./public

USER nextjs

ENV PORT 3000

EXPOSE 3000

CMD ["node", "server.js"]
