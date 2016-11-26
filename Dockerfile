# vim: syntax=dockerfile:
FROM nginx
MAINTAINER Aleksi Romanov "aleksi.romanov@elisanet.fi"
RUN apt-get update && apt-get install -y bash-completion net-tools iproute tcpdump
EXPOSE 80
COPY nginx.conf /etc/nginx/
COPY dist/bootstrap.min.css /opt/ttn/
COPY dist/bundle.js /opt/ttn/
COPY dist/index.html /opt/ttn/
COPY dist/style.css /opt/ttn/
ENV TERM=linux
ENV PS1="\n\u@\h \j \w # "
CMD ["/usr/sbin/nginx"]

