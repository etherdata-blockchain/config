import * as digitalocean from "@pulumi/digitalocean";
import * as cloudflare from "@pulumi/cloudflare";
import {
  publicEndpointScript,
  publicEndpointWithProxyScript,
} from "./lib/scripts";
import { Config, Secrets, Tags } from "./lib/config";

function makePublicEndpoint() {
  //Create a public endpoint
  for (let i = 1; i <= Config.numberOfPublicEndpoints; i++) {
    const dropletName = `public-endpoint-${i}`;
    new digitalocean.Droplet(dropletName, {
      name: dropletName,
      image: "ubuntu-20-04-x64",
      region: digitalocean.Region.SGP1,
      size: "s-1vcpu-2gb",
      userData: publicEndpointScript,
      tags: [Tags.publicEndpointWithoutProxy],
    });
  }
  // create a loadbalancer for public endpoint
  const loadBalancer = new digitalocean.LoadBalancer("public-endpoint-lb", {
    region: digitalocean.Region.SGP1,
    dropletTag: Tags.publicEndpointWithoutProxy,
    forwardingRules: [
      {
        entryProtocol: "https",
        entryPort: 443,
        certificateName: Config.etdChainCertificateName as string,
        targetProtocol: "http",
        targetPort: 8547,
      },
      {
        entryProtocol: "tcp",
        entryPort: 8546,
        targetProtocol: "tcp",
        targetPort: 8548,
      },
    ],
    healthcheck: {
      protocol: "http",
      port: 8547,
      path: "/",
    },
  });
  const record = new cloudflare.Record("public-endpoint-record", {
    zoneId: Secrets.zoneId,
    name: "rpc",
    type: "A",
    value: loadBalancer.ip,
    proxied: true,
  });
}

function makePublicProxyEndpoint() {
  //Create a public endpoint
  for (let i = 1; i <= Config.numberofProxyedEndpoints; i++) {
    const dropletName = `public-proxy-endpoint-proxy-${i}`;
    new digitalocean.Droplet(dropletName, {
      name: dropletName,
      image: "ubuntu-20-04-x64",
      region: digitalocean.Region.SGP1,
      size: "s-1vcpu-2gb",
      userData: publicEndpointWithProxyScript,
      tags: [Tags.publicEndpointWithProxy],
    });
  }
  // create a loadbalancer for public endpoint
  const loadBalancer = new digitalocean.LoadBalancer(
    "public-proxy-endpoint-lb",
    {
      region: digitalocean.Region.SGP1,
      dropletTag: Tags.publicEndpointWithProxy,
      forwardingRules: [
        {
          entryProtocol: "https",
          entryPort: 443,
          certificateName: Config.etdChainCertificateName as string,
          targetProtocol: "http",
          targetPort: 8546,
        },
      ],
      healthcheck: {
        protocol: "http",
        port: 8546,
        path: "/health",
      },
    }
  );
  const record = new cloudflare.Record("public-proxy-endpoint-record", {
    zoneId: Secrets.zoneId,
    name: "debug",
    type: "A",
    value: loadBalancer.ip,
    proxied: true,
  });
}

function makePublicTestnet() {
  //Create a public endpoint
  for (let i = 1; i <= Config.numberofProxyedEndpoints; i++) {
    const dropletName = `testnet-${i}`;
    new digitalocean.Droplet(dropletName, {
      name: dropletName,
      image: "ubuntu-20-04-x64",
      region: digitalocean.Region.SGP1,
      size: "s-1vcpu-2gb",
      userData: publicEndpointScript,
      tags: [Tags.testnetEndpoint],
    });
  }
}

makePublicEndpoint();
makePublicProxyEndpoint();
makePublicTestnet();
