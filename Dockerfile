# Stage 1: Build the TypeScript files
FROM --platform=linux/amd64 node:22.17.0-alpine AS build

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript files
RUN npm run build

# Stage 2: Create the production image
FROM --platform=linux/amd64 node:22.17.0-alpine

# Set the working directory
WORKDIR /app

# Copy only the built files and necessary modules from the build stage
COPY --from=build /app/dist /app/dist
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package*.json /app/

# Expose the application port
EXPOSE 3000

# Set the command to run the application
CMD ["node", "dist/server.js"]
