#!/bin/bash

BASE_DIRECTORY=$(cd `dirname $0` && pwd)
GENERATOR_NS="amq-starwars-tx-gen"
SNIFFER_NS="amq-starwars-tx-sniffer"

cd $BASE_DIRECTORY/..

oc new-project $GENERATOR_NS
oc new-project $SNIFFER_NS

echo -e "\nCreating an AMQ Online AddressSpace, and Address in that AddressSpace."
oc apply -f openshift/amq/amq.address-space.yml
oc apply -f openshift/amq/amq.address.yml

echo -e "\nCreating two AMQ Online users that can act as producers and consumers."
oc apply -f openshift/amq/amq.user-producer.yml
oc apply -f openshift/amq/amq.user-consumer.yml

create_role_and_binding () {
  echo -e "\nCreating role and role binding that enables AMQ Online to create a"
  echo "ConfigMap containing connection information in our project."

  oc project $1
  oc apply -f openshift/amq/role.config-map.yml
  oc apply -f openshift/amq/role-binding.config-map.yml
}

create_role_and_binding $GENERATOR_NS
create_role_and_binding $SNIFFER_NS
