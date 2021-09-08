from node:lts-alpine

WORKDIR /usr/sails/backend

copy yarn.lock ./

COPY . ./

RUN yarn \
&& yarn prisma generate \
&& yarn pisma migrate deploy \
&& yarn build \
&& yarn --production

EXPOSE 4000

CMD ["yarn", "start"]

