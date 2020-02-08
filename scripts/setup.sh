#!/bin/bash

BASE_DIRECTORY=$(cd `dirname $0` && pwd)
PROJECT_NS="amq-starwars-quarkus-nodejs"

cd $BASE_DIRECTORY/..

oc new-project $PROJECT_NS

echo -e "\nCreating an AMQ Online AddressSpace, and Address in that AddressSpace."
oc apply -f openshift/amq/amq.address-space.yml
oc apply -f openshift/amq/amq.address.yml

echo -e "\nCreating two AMQ Online users that can act as producers and consumers."
oc apply -f openshift/amq/amq.user-producer.yml
oc apply -f openshift/amq/amq.user-consumer.yml

echo -e "\nCreating role and role binding that enables AMQ Online to create a"
echo "ConfigMap containing connection information in our project."
oc apply -f openshift/amq/role.config-map.yml
oc apply -f openshift/amq/role-binding.config-map.yml

echo -e "\nDeploying producer (nodejs) and consumer (quarkus)"
oc apply -f openshift/project.yml
oc start-build amq-nodejs-producer
oc start-build amq-quarkus-consumer

echo -e "\nDone! Note it can take 2 or more minutes for both services to become available."
