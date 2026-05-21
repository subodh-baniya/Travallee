
FROM node:20-alpine AS base

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    bash \
    && rm -rf /var/lib/apt/lists/*

# Install Expo CLI globally
RUN npm install -g expo-cli eas-cli

WORKDIR /app

FROM base AS deps


COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./

RUN \
  if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install --frozen-lockfile; \
  else echo "No lockfile found." && exit 1; \
  fi


FROM base AS development

WORKDIR /app


COPY --from=deps /app/node_modules ./node_modules

COPY . .

# Expose Expo DevTools and Metro Bundler ports
EXPOSE 8081
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002


CMD ["npx", "expo", "start", "--tunnel"]