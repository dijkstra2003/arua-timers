# Admin Application

Internship project of Luc Dijkstra

## Development

Docker is required, to install docker for windows click [here](https://docs.docker.com/docker-for-windows/), for mac click [here](https://docs.docker.com/docker-for-mac/)

In the source folder run the following commands
```
docker-compose pull
docker-compose up -d
```

## Available url's
Progressive Web App: https://localhost

Api Docs: https://localhost:8443

Admin App: https://localhost:444


## Software versions used

API Platform 2.3.6

PHP 7.3.2

Docker 18.09.2

Symfony 4.2.2

## Code generation commands

Importing all tables, entities and mappings from a known database:

* docker-compose exec php bin/console app:import entities

Generating the front-end React application with CRUD functionality:

* docker-compose exec client src/scripts/generate-react-app.js

