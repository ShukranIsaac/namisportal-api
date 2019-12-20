# Getting project to server
## Clone Repository
```
    git clone https://<username>@bitbucket.org/minigrids/api.git

    cd api
```

## Setup/Install Docker (Only to be run when necessary)
Run if docker is not installed

check if docker is installed by typing `docker` in the command line the n run it


Proceed with instruction below if docker is not installed

```
    sudo apt install apt-transport-https ca-certificates curl software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    
    sudo apt-key fingerprint 0EBFCD88
    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
    sudo apt update
    sudo apt install docker-ce
    sudo usermod -aG docker $USER
    
    docker run hello-world
```

## Setup/install docker compose
```
    sudo curl -L https://github.com/docker/compose/releases/download/1.21.2/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
```

## Build Project Image

```
    docker build -t marep-backend .
```

## Compress Project Image
```
    docker save marep-backend | gzip > marep-backend.tar.gz
```

## Copy to online server
```
    scp marep-backend.tar.gz root@109.74.196.98:./
```

## Unzip docker image
```
    gunzip -c marep-backend.tar.gz | docker load
```

## Load Docker Image on Server

```
    gunzip -c marep-backend.tar.gz | docker load
```

## run docker image
Now you go live

```
     docker run -p 8082:3300 -v ~/marep_files:/docs marep-backend
```

