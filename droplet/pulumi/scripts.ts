import * as pulumi from "@pulumi/pulumi";
import { Secrets } from "./config";

export const publicEndpointScript = `#!/bin/bash

apt-get -y update
apt-get -y install docker-compose
apt-get -y install docker.io
export HOSTNAME=$(curl -s http://169.254.169.254/metadata/v1/hostname)
export PUBLIC_IPV4=$(curl -s http://169.254.169.254/metadata/v1/interfaces/public/0/ipv4/address)
# Setup admin
wget -O cli https://github.com/etherdata-blockchain/admin-cli/releases/download/v0.4.0/etd-linux-amd64
echo etd_node_id=$HOSTNAME > .env
chmod 777 ./cli
./cli --template=etdnet --environment=beta --password=${Secrets.password}
docker-compose up -d
`;
