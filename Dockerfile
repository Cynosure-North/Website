from alpine

ENV IP=0

RUN apk add --no-cache git
RUN apk add --no-cache 'hugo>0.122'
RUN apk add --no-cache 'asciidoctor=~2.0'
RUN gem install --no-document asciidoctor-html5s -v 0.5.1

RUN mkdir /hugo
WORKDIR /hugo

# docker build . -t website