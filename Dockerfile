from alpine

ENV IP=0

RUN apk add --no-cache git
RUN apk add --no-cache 'hugo<0.119.0'
RUN apk add --no-cache 'asciidoctor<2.0.20'
RUN gem install --no-document asciidoctor-html5s -v 0.5.1

RUN mkdir /hugo
WORKDIR /hugo

CMD hugo serve --bind "0.0.0.0" --baseURL=${IP}