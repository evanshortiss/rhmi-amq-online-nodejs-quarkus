# AMQ Online, Node.js, and Quarkus Example

This repository provides an easy to deploy demo that utilises:

* An AMQ Online small queue
* A producer written in Node.js
* A consumer written in Quarkus

The demo is Star Wars themed, and uses the fantastic icons created by
[Symbolicons](https://www.iconfinder.com/sensibleworld). The icon set can be
found [here](https://www.iconfinder.com/search/?q=designer%3Asensibleworld%20star%20wars&from=profile%20preview).

## Requirements

* OpenShift Cluster running Integreatly
* OC CLI on your host machine
* Docker (if running locally)

## Setup

### On an Integreatly OpenShift Cluster

Run the *scripts/setup.sh* included in this repository. This will create the
necessary CRDs for AMQ Online to provision an *AddressSpace*, *Address*, and
two instances of *MessagingUser* - one user is a consumer, and the other is a
producer. It also creates a *Deployment*, *Build*, *Service* for our producer
and consumer applications. A *Route* is created so the consumer web-based UI
can be accessed over https. A *Role* and *RoleBinding* are created to enable
AMQ Online to create a *ConfigMap* in the consumer and producer namespace with
AMQP connection information.

### Locally

Run the *scripts/local.sh* included in this repository. This will build the
consumer (Quarkus) and producer (Node.js) images and run them using Docker. It
will also start and AMQ image locally to provide the queue required for
communication between the producer and consumer. The consumer UI will be
accessible at *http://localhost:8080* after the script finishes running.
