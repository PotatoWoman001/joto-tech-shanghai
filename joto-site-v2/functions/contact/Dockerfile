FROM node:24.18.0-bookworm-slim

WORKDIR /workspace
RUN chown node:node /workspace

USER node
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci
COPY --chown=node:node . .

EXPOSE 9000
CMD ["npm", "start"]
