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
Spustíme příkaz pro zjištění ip adresy kontejneru s databází
```shell
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' database
```

v souboru .env pak upravíme řádek pro připojení k databázi
```dotenv
DATABASE_URL="mysql://symfony:symfony@172.20.0.2:3306/symfony?serverVersion=5.5.5-10.6.12-MariaDB-1:10.6.12+maria~ubu2004&charset=utf8mb4"
```

Není třeba spouštět příkaz pro vytvoření databáze, ta se vytvoří sama při prvním spuštění kontejneru s databází.

Vytvoříme migraci
```shell
docker-compose run --rm php bin/console make:migration
```
Následně pushneme migraci do databáze

```shell    
docker-compose run --rm php bin/console doctrine:migrations:migrate
```

#### Testovací data


A následně spustíme seed
```shell
docker-compose run --rm php bin/console doctrine:fixtures:load
```

### Update `DOCKER`

```shell
docker-compose up -d
docker-compose run --rm php composer install
docker-compose run --rm npm install # je li použito npm
docker-compose run --rm npm run dev # je li použito npm
```

