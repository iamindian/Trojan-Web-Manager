## Trojan Web Manager

This is a web based user management system for trojan server
![login capture](./captures/login.png?raw=true "login")
![query capture](./captures/query.png?raw=true "query")
![renew capture](./captures/renew.png?raw=true "renew")
![add user capture](./captures/adduser.png?raw=true "adduser")
![users capture](./captures/users.jpg?raw=true "users")
#### prerequisites
1. Trojan user table should be created already using following sql
```
        CREATE TABLE users (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        username VARCHAR(64) NOT NULL,
        password CHAR(56) NOT NULL,
        quota BIGINT NOT NULL DEFAULT 0,
        download BIGINT UNSIGNED NOT NULL DEFAULT 0,
        upload BIGINT UNSIGNED NOT NULL DEFAULT 0,
        PRIMARY KEY (id),
        INDEX (password)
        );
```
2. Add a column named version and add a column named delta to trojan user table for optimistic locking
        ```ALTER users ADD COLUMN version INT(11) DEFAULT 0;```
        ```ALTER users ADD COLUMN delta INT(11) DEFAULT 0;```
3. Nginx should be installed
#### Frontend installation
```pnpm i -g @darren-z-m-lin/trojan-web-manager-server```

#### Backend installation
```pnpm i -g @darren-z-m-lin/trojan-web-manager-client```

#### Backend Configuration

create a file named .env with following content.
```
HOST=0.0.0.0
PORT=8080
DATABASE=trojan
USERNAME=username
PASSWORD=password
ADMIN=admin
ADMIN_PASSWORD=850702
LOG=false

```
#### start frontend
``
nohup twManager > twm.log 2>&1 &
``
#### start backend
``
nohup twManagerServer --config=/path/to/.env > twms.log 2>&1 &
``

#### Remove background jobs from current session
``
disown -a
``

#### Nginx reverse proxy config
```
server {
        listen       8000 default_server;
        listen       127.0.0.1:8000 default_server;
        server_name  127.0.0.1;
        root         /usr/share/nginx/html;
        #ssl_certificate /path/to/fullchain.pem; # REPLACE HERE
        #ssl_certificate_key /path/to/privkey.pem; # REPLACE HERE
        #ssl_session_cache shared:SSL:1m;
        #ssl_session_timeout  10m;
        #ssl_ciphers PROFILE=SYSTEM;
        #ssl_prefer_server_ciphers on;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;


        location /api/ {
            proxy_pass http://127.0.0.1:8080/;
        }

        location / {
            rewrite ^(.*)$ / break;
            proxy_pass http://127.0.0.1:80;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
        location /assets/ {
            proxy_pass http://127.0.0.1:80;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }


        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    }

```

#### Open following url in the browser
```
http://127.0.0.1:8000
```
#### Login system using username and password in .env

## How to start the project from the source

1. checkout the source code
```
git checkout ${project-url}
```
2. cd to the source code
```
cd /path/to/the/source/code
```
3. start the development environment
```
pnpm run dev
```
