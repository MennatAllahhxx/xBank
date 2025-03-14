FROM node:23 as development

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

FROM node:23-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json .

RUN npm ci --only=production

RUN addgroup -S devgroup &&\
    adduser -S -G devgroup devuser

COPY --from=development /usr/src/app/dist ./dist

USER devuser

CMD [ "node", "dist/index.js" ]