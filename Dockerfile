# ---- Base Node ----
    FROM node:18-alpine AS base
    WORKDIR /app
    RUN chown -R node:node /app
    USER node
    
    # ---- Dependencies ----
    FROM base AS dependencies
    COPY --chown=node:node ./package*.json ./
    COPY --chown=node:node ./yarn.lock ./
    RUN yarn cache clean && yarn install --silent --production
    
    # ---- Release ----
    FROM node:18-alpine AS release
    WORKDIR /app
    RUN mkdir -v src node_modules
    RUN chown -R node:node /app
    USER node
    COPY ./src /app/src
    COPY --from=dependencies /app/node_modules node_modules/
    EXPOSE 9000
    CMD ["node", "src/index.js"]