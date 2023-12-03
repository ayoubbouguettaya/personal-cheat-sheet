## Dockernize Nginx as Reverse Proxy and React Js App

let's define the Docker file for our React Application,create a file named `Dockerfile`:

```{dockerfile}
# Base on offical Node.js Alpine image
FROM node:alpine

# Set working directory
WORKDIR /usr/app

# Install PM2 globally
RUN npm install --global pm2

# Copy package.json and package-lock.json before other files
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY ./package*.json ./

# Install dependencies
RUN npm install --production

# Copy all files
COPY ./ ./

# Build app
RUN npm run build

# Expose the listening port
EXPOSE 3000

# Run container as non-root (unprivileged) user
# The node user is provided in the Node.js Alpine base image
USER node

# Run npm start script with PM2 when container starts
CMD [ "pm2-runtime", "npm", "--", "start" ]

```

--- 
create a folder call it Ngnix and before define the `Dockerfile` for Nginx ,let's define the nginx config in a new file `default.conf` and then pass it to Nginx:

```{nginx}
upstream reactjs_upstream {
# Keep this reference in mind "myjournal-app" because we gonna use it later on our docker compose   
  server myjournal-app:3000;
}

server {
  listen 80;
  listen [::]:80;
  
  server_tokens off;

  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection 'upgrade';
  proxy_set_header Host $host;

  proxy_cache_bypass $http_upgrade;
   
  location /_next/static {
    proxy_cache STATIC;
    proxy_pass http://reactjs_upstream;
  }

  location /static {
    proxy_cache STATIC;
    proxy_ignore_headers Cache-Control;
    proxy_cache_valid 60m;
    proxy_pass http://reactjs_upstream;
  }

  location / {
    proxy_pass http://reactjs_upstream;
  }
}   
```

create a `Dockerfile` in the same level as `default.conf`

```
# Base on offical NGINX Alpine image
FROM nginx:alpine

# Remove any existing config files
RUN rm /etc/nginx/conf.d/*

# Copy config files
# *.conf files in conf.d/ dir get included in main config
COPY ./default.conf /etc/nginx/conf.d/

# Expose the listening port
EXPOSE 80

# Launch NGINX
CMD [ "nginx", "-g", "daemon off;" ]
```

the file structure will look something like this ,but keep in mind that this personal preference you can do it whatever you want as long as you are defining the right paths for referencing.

* my-frontend-app
   * nginx
     * `Dockerfile`
     * `default.conf`  
   * `Dockerfile`


Now Docker Compose comes into play to simplify our Dockernarization furthor more By having a single file to Run our containers. 

inside 

```
version: '3'
services:
  myjournal-app:
    build: ./
    ports:
      - 3000:3000
  nginx-myjournal:
    build: ./nginx
    ports:
      - 80:80
      - 433:433
    volumes:
      - ./nginx:/etc/nginx/conf.d

```



> I used this in my-journal app check @ myGithub repos

