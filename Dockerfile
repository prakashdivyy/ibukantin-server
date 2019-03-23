# Dockerfile
FROM node:lts as build-img

# Set environment variables
ENV APPDIR /code

# Set the work directory
RUN mkdir -p ${APPDIR}
WORKDIR ${APPDIR}

ADD . ${APPDIR}

RUN npm install
RUN npm install -g typescript
RUN tsc; exit 0

# Multistage build
FROM node:lts-alpine

ENV APPDIR /code

ARG NODE_ENV
ENV NODE_ENV ${NODE_ENV:-production}

RUN rm -rf docker

RUN mkdir -p ${APPDIR}
WORKDIR ${APPDIR}

# Copy all source code
COPY --from=build-img ${APPDIR} ${APPDIR}

# Remove `/components` folder in favor of `/lib`
RUN rm -rf ${APPDIR}/components
RUN rm -rf ${APPDIR}/interfaces

RUN npm install --production

EXPOSE 8000

HEALTHCHECK --interval=5s --timeout=3s --retries=3 CMD curl -f http://localhost:8000 || exit 1