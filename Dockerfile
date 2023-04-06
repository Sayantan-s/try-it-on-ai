FROM node:16-alpine

WORKDIR /tioai_app

COPY package.json yarn.lock ./

RUN yarn install --ignore-scripts

COPY . .

ARG UNSPLASH_API_KEY=G1jsrl5j4SjbgyPd4M-ZmfasNfTUF_KttBMguP3qcuc
ENV UNSPLASH_API_KEY=${UNSPLASH_API_KEY}

ARG UNSPLASH_SECRET_KEY=zPhanTqlY2rqRF7jEwVF8PN5ecsuQNI4_sfHdQy8EMU
ENV UNSPLASH_SECRET_KEY=${UNSPLASH_SECRET_KEY}

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
