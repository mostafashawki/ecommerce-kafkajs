FROM node:14-alpine

# RUN apk update && apk add --no-cache bash

# Install the wait-for-it tool
# RUN wget -O /usr/local/bin/wait-for-it.sh \
#     https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh && \
#     chmod +x /usr/local/bin/wait-for-it.sh

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "app.js"]
