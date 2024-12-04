FROM oven/bun:1

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install

COPY . .

ENV NODE_ENV=production
ENV PORT=8848

EXPOSE 8848

CMD ["bun", "run", "start"]

