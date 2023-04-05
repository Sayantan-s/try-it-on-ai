# Production stage
FROM node:16-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn run install:prod

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
