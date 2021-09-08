from node:lts-alpine

WORKDIR /usr/sails/backend

copy yarn.lock ./

COPY . ./

RUN yarn \
&& yarn build \
&& yarn --production \
&& yarn prisma generate

EXPOSE 4000

CMD ["yarn", "start"]

