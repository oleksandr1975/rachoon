FROM zenika/alpine-chrome 

USER root

RUN apk add --no-cache --update nodejs npm graphicsmagick ghostscript caddy


WORKDIR /app
RUN npm install -g pnpm@latest nuxt@3
COPY . .
RUN pnpm install
RUN pnpm run build
# COPY startup.sh /app
ENTRYPOINT ["sleep", "infinity"]
