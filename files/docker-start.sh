#!/bin/sh
cd /opt/sleepymongoose
/etc/init.d/mongodb start
/usr/bin/mongoimport --db decisions --collection issues --file /tmp/lastDataDumb.json
/usr/bin/python httpd.py &
/usr/sbin/nginx

