FROM node:16-alpine as builder

WORKDIR /app

COPY ./package.json .
COPY ./yarn.lock .
COPY ./tsconfig.json .
COPY ./tsconfig.build.json .

RUN yarn install
COPY ./src ./src

RUN yarn build

FROM node:16-alpine

WORKDIR /app

COPY --from=builder /app/dist .
COPY --from=builder /app/package.json .

RUN yarn install --production

CMD ["main.js"]
