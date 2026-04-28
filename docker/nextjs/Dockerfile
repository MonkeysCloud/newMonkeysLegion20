FROM node:20-alpine

WORKDIR /app

# Copy package files first for better layer caching
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY frontend/ ./

EXPOSE 3000

# Development mode with hot reload
CMD ["npm", "run", "dev"]
