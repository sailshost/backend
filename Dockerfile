from registry.gitlab.com/sailshost/backend/sails_api_depen:latest

WORKDIR /usr/sails/backend

copy yarn.lock ./

COPY . ./

RUN yarn build

EXPOSE 4000

CMD ["yarn", "start"]

