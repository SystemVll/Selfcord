FROM oven/bun:latest

COPY package.json ./
COPY bun.lock ./
COPY tsconfig.json ./
COPY src/ ./src/


ENV TOKEN="DISCORD_TOKEN"

RUN bun install

CMD ["bun", "run", "start"]