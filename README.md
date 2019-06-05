# familyvideoshare
A video streamer for internal use.

### set up
install node and npm

run within backsrc and reactfront
```
npm install -s
```
## PM2

install pm2:
```
npm install pm2 -g
```

start project:
```
cd reactfront && pm2 start
```

check ecosystem file for app info
```
ecosystem.config.js
```

list your app:
```
pm2 ls
```

monitor your app:
```
pm2 monit
```

check logs in
```
$Project home/log/
```