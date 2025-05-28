# Use the official Node.js image as the base image
FROM node:20.11.1-bullseye


# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies
RUN npm install -g npm@10.8.1

# Copy the rest of the application code into the container
COPY . .

# Ensure old Next.js build is removed before building
RUN rm -rf .next

# Build the Next.js application
RUN npx prisma generate
#RUN npx prisma db push
RUN npm run build

# Expose the port the app runs on
EXPOSE 3001

# Define the command to run the app
CMD ["npm", "start"]
