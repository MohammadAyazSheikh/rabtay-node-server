#specifying the  valid base docker image
FROM node:16

#we set working dir == /app all our code will be in app dir and all the cmd will be run from /app dir like "node index.js"
WORKDIR /app 

#coping package.json in root dir in our case root dir is /app and we can also set like this "COPY package.json /app"  
COPY package.json .

# RUN npm install

#the arg is pass to docker when the image is building
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ];\
        then npm install;\
        else npm install --only=production;\
        fi



#copying all files and also it copies package.json again
#actullay each step in docker file acts as layer of docker image
#when we build docker image each layer cachesd in memory 
#packege file only changes when we install a new lib
#so when we re bilud our image when our code changes only "COPY . ./" will run
COPY . ./

#listening on port 3000
#EXPOSE 3000 

#setting ennvrinment default variable
ENV PORT 3000
EXPOSE ${PORT} 

CMD ["npm","start"]
# CMD ["npm","run","dev"]