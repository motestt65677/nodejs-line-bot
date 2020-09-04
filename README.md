# nodejs-line-bot-gif
## setting up testing envornment
- Create .env file
- Install node js. (see https://nodejs.org/en/download/)
- Use Ngrok to get a https url. 
- Set webhook on https://developers.line.biz/, make sure the route is https. (ex. https://dc7112cf3391.ngrok.io/linewebhook)
- run ```node app.js```
## .env file
```
LINE_CHANNEL_ID=""
LIEN_CHANNEL_SECRET=""
LINE_CHANNEL_ACCESS_TOKEN=""
```

- This file holds the environmental variables related to your line bot account.
## docker-compose.yml file
```
version: '3'
services:
  nodejs:
    build: .
    ports:
      - "8080:8080"
     #environment:
       #VIRTUAL_HOST: app.example.com
       #LETSENCRYPT_HOST: app.example.com
       #LETSENCRYPT_EMAIL: example@gmail.com
 #networks:
   #default:
     #external:
       #name: nginx-proxy

```
- This file is not necessary if you are only setting up a testing environment.
- The commented out section of the docker-compose.yml file works with another docker environment. It is for setting up ssl website on a server with docker and nginx. (see https://blog.ssdnodes.com/blog/host-multiple-ssl-websites-docker-nginx/)