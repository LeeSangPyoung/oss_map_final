FROM node:20.17.0

# Set the working directory inside the container
WORKDIR /app

# Copy the rest of the application files
COPY . .

# Install dependencies with verbose logging to debug proxy issues
#RUN yarn install --verbose

# Build the frontend app (adjust this command based on your setup)
#RUN yarn build

# Expose the port on which NGINX serves the app (default is 80)
EXPOSE 5173

# Start NGINX server
CMD ["yarn" , "dev"]