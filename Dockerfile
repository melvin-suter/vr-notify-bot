FROM node:23-alpine

ENV DISCORD_TOKEN=
RUN mkdir -p /app
WORKDIR /app
COPY src/package.json src/package-lock.json .
RUN npm install
COPY src/ .
CMD [ "npm", "start"]