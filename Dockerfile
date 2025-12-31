FROM hugomods/hugo:latest

RUN apk add --no-cache git 'asciidoctor=~2.0'
RUN gem install --no-document asciidoctor-html5s -v 0.5.1

ENV IP=0

RUN mkdir /hugo
WORKDIR /hugo

# docker build . -t website