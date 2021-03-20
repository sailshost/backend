from node:latest

WORKDIR /gql

copy package*.json ./

# RUN npm install -g yarn

COPY . .

RUN yarn

RUN yarn build

EXPOSE 4000

CMD ["yarn", "start"]
