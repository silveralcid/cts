FROM node:20-alpine

WORKDIR /app

# Install dependencies first for better layer caching
COPY landing/package*.json ./
RUN npm ci

# Copy source (bind mount will override in dev compose)
COPY landing ./

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0", "-p", "3000"]

