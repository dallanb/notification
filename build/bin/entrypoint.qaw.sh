#!/bin/sh

bash bin/init-pg.sh

pm2-runtime dist/index.js
