# vim: syntax=dockerfile:
FROM nginx
MAINTAINER Aleksi Romanov "aleksi.romanov@elisanet.fi"
RUN apt-get update && apt-get install -y bash-completion net-tools iproute tcpdump 


RUN apt-get install -y mongodb-server
RUN apt-get install -y python-setuptools
RUN easy_install pymongo==2.7
RUN apt-get install -y git
RUN git clone https://github.com/mongodb-labs/sleepy.mongoose.git /opt/sleepymongoose
COPY files/docker-start.sh /
RUN chmod +x /docker-start.sh

#RUN echo "deb http://packages.erlang-solutions.com/debian jessie contrib" > /etc/apt/sources.list.d/erlang-solutions.list
#RUN wget -qO - http://packages.erlang-solutions.com/debian/erlang_solutions.asc | apt-key add -
#RUN apt-get install -y couchdb

EXPOSE 80
COPY files/nginx.conf /etc/nginx/
COPY dist/bootstrap.min.css /opt/ttn/
COPY dist/bundle.js /opt/ttn/
COPY dist/index.html /opt/ttn/
COPY dist/style.css /opt/ttn/
ENV TERM=linux
ENV PS1="\n\u@\h \j \w # "
#CMD ["/usr/sbin/nginx"]
CMD ["/docker-start.sh"]

