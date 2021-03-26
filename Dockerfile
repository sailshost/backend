from node:latest

WORKDIR /usr/app/backend

copy package*.json ./

COPY . .

RUN yarn \
&& yarn build \
&& yarn --production

EXPOSE 4000

CMD ["yarn", "start"]
