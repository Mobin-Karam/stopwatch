# syntax=docker/dockerfile:1

FROM node:22-alpine AS builder
WORKDIR /app

ENV NODE_ENV=development

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV NODE_OPTIONS=--enable-source-maps

COPY package*.json ./
COPY --from=builder /app/package-lock.json ./package-lock.json
RUN npm ci --omit=dev --ignore-scripts

COPY --from=builder /app/dist ./dist
COPY .env.example ./.env.example

EXPOSE 3000
USER node

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 CMD node -e "fetch('http://127.0.0.1:3000/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "dist/main.js"]
