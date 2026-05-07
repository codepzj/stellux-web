# 基础镜像
FROM node:23-alpine AS base

# 设置全局环境
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 依赖层
FROM base AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

# 使用 pnpm
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

# pnpm-workspace.yaml
COPY package.json pnpm-workspace.yaml .npmrc* ./

# 安装依赖
RUN pnpm install

# 构建层
FROM base AS builder

WORKDIR /app

# 启用 pnpm
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm run build

# 运行层
FROM base AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 9003
ENV PORT=9003
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]