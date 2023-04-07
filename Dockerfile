FROM node:16-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --ignore-scripts

COPY . .

ARG UNSPLASH_API_KEY=G1jsrl5j4SjbgyPd4M-ZmfasNfTUF_KttBMguP3qcuc
ENV UNSPLASH_API_KEY=${UNSPLASH_API_KEY}

ARG UNSPLASH_SECRET_KEY=zPhanTqlY2rqRF7jEwVF8PN5ecsuQNI4_sfHdQy8EMU
ENV UNSPLASH_SECRET_KEY=${UNSPLASH_SECRET_KEY}

ARG MASTER_KEY=$2b$10$0yLCbylmLsYAdOefSO5iA./psg8HbVFnJSCoLRffSnBcrKd6f/gwi
ENV MASTER_KEY=${MASTER_KEY}

ARG ACCESS_KEY=$2b$10$2tEiGm/EFZcGjGhgmUYzYOsZoUlx5U6xDxbS6oDHwoXR4NDW55uNK
ENV ACCESS_KEY=${ACCESS_KEY}

ARG BIN_ID=642fb904ebd26539d0a61a4d
ENV BIN_ID=${BIN_ID}

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
