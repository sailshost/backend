from node:latest

WORKDIR /gql

copy package*.json ./

COPY . .

RUN yarn

RUN yarn build

EXPOSE 4000

CMD ["yarn", "start"]
