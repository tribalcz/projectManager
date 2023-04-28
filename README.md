## Instalace

Naklonujeme si repozitář a přejdeme do nově vytvořeného adresáře.



### Instalace `DOCKER`

Nyní již můžeme aplikaci spustit pomocí utilitky __docker-compose__:

```shell
docker-compose up -d --build
docker-compose run --rm php composer install
docker-compose run --rm npm install # je li použito npm
docker-compose run --rm npm run dev # je li použito npm
```

#### Testovací data

Vstoupíme do php kontejneru a spustíme a seed.


```shell
docker-compose exec php /bin/bash
```
A následně spustíme seed
```shell
bin/console doctrine:fixtures:load
```
eventuelně lze použít i
```shell
docker-compose run --rm php bin/console doctrine:fixtures:load

```

### Update `DOCKER`

```shell
docker-compose up -d
docker-compose run --rm composer install
docker-compose run --rm npm install # je li použito npm
docker-compose run --rm npm run dev # je li použito npm
```

