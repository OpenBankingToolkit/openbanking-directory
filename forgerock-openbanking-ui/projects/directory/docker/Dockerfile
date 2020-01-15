# Stage 1 - the build process
FROM node:10 as build-ui

WORKDIR /src
ADD package.json package-lock.json /src/

RUN NG_CLI_ANALYTICS=ci npm ci

ADD . /src

RUN npm run build.directory.themes

# Stage 2 - the production environment
FROM nginx:1.13.9-alpine

EXPOSE 80

ARG BUILD_VERSION
ENV BUILD_VERSION ${BUILD_VERSION}

ENV TEMPLATE "forgerock"
ENV DOMAIN ""
ENV DIRECTORY_BACKEND_URL "https://service.directory.DOMAIN"
ENV AUTH_BACKEND_URL "https://am.DOMAIN"
ENV ACCOUNT_REQUEST_BACKEND_URL "https://rs.aspsp.DOMAIN/api/account-requests"

RUN rm -rf /etc/nginx/conf.d
COPY --from=build-ui /src/dist /usr/share/nginx
COPY projects/directory/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY projects/directory/docker/start.sh /opt/start.sh

CMD ["/opt/start.sh"]
