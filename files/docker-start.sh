#!/bin/sh
cd /opt/sleepymongoose
python httpd.py &
/etc/init.d/mongodb start
/usr/sbin/nginx

