#!/bin/bash

echo {\"ip\":\"$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{ print $2 }')\"} > ./src/config/ip.json