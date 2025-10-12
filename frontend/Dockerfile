FROM node:20-alpine

WORKDIR /app

# Install dependencies first for better layer caching
COPY frontend/package*.json ./
RUN npm ci

# Copy source (bind mount will override in dev compose)
COPY frontend ./

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

