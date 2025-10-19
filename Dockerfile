# ---- Base ----
FROM node:20-slim AS base
WORKDIR /app
ENV NODE_ENV=production

# Install OS deps (none needed currently) and create non-root user
RUN groupadd -r nodejs && useradd -r -g nodejs nodejs

# ---- Dependencies ----
FROM base AS deps
# Only copy package manifests for better layer caching
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
  npm ci --include=dev

# ---- Build ----
FROM deps AS build
COPY tsconfig.json ./
COPY src ./src
COPY codegen.ts ./
COPY README.md ./
RUN npm run build

# ---- Production runtime ----
FROM base AS runtime
# Copy only necessary files
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./package.json

# Use non-root user
USER nodejs

# App port
ENV PORT=4000
EXPOSE 4000

CMD ["node", "dist/index.js"] 