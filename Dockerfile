from registry.gitlab.com/sailshost/backend/sails_api_depen:latest

WORKDIR /usr/sails/backend

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

copy yarn.lock ./

COPY . ./

RUN yarn \
&& yarn prisma generate \
&& yarn prisma migrate deploy \
&& yarn build 

EXPOSE 4000

CMD ["yarn", "start"]

