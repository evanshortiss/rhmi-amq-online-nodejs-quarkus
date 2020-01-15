#!/bin/bash

BASE_DIRECTORY=$(cd `dirname $0` && pwd)
cd "$BASE_DIRECTORY/.."

NAME_NODEJS="nodejs-amqp"
NAME_QUARKUS="quarkus-amqp"
NAME_AMQ="amq"

# Clean up previous/conflicting items
docker stop $NAME_AMQ $NAME_NODEJS $NAME_QUARKUS > /dev/null 2>&1
docker rm $NAME_AMQ $NAME_NODEJS $NAME_QUARKUS > /dev/null 2>&1

# Run ActiveMQ and name it (so we can use it's network)
docker run -d -p 5672:5672 -e ARTEMIS_USERNAME=quarkus -e ARTEMIS_PASSWORD=quarkus --name amq vromero/activemq-artemis:2.9.0-alpine

# Build the Quarkus native executable
cd ./amqp-consumer-quarkus
./mvnw package -Pnative -Dquarkus.native.container-build=true
cd ..

# Package it as a container
docker build -f ./amqp-consumer-quarkus/src/main/docker/Dockerfile.native -t $NAME_QUARKUS ./amqp-consumer-quarkus

# Run the Quarkus container (it connects to the "amq" network/)
docker run -d -p 8080:8080 --link amq --name $NAME_QUARKUS $NAME_QUARKUS:latest

# Build and run the Node.js producer
docker build -t $NAME_NODEJS ./amqp-producer-nodejs
docker run -d --link amq --name $NAME_NODEJS $NAME_NODEJS:latest

echo "Visit http://localhost:8080 to see a feed of transactions."
