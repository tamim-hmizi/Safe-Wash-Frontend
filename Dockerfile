# Step 1: Build the React app
FROM node:22.11.0 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build  

# Step 2: Use serve to serve the app
FROM node:22.11.0
WORKDIR /app
COPY --from=build /app/dist /app/dist 
RUN npm install -g serve
EXPOSE 8080
CMD ["serve", "-s", "dist", "-l", "8080"]
