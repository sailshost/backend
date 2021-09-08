from node:lts-alpine

WORKDIR /usr/sails/backend

copy yarn.lock ./

COPY . ./

RUN yarn \
&& yarn build \
&& yarn --production

EXPOSE 4000

CMD ["yarn", "start"]

