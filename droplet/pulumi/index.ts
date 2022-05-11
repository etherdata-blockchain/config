import * as digitalocean from "@pulumi/digitalocean";
import * as cloudflare from "@pulumi/cloudflare";
import { publicEndpointScript } from "./scripts";
import { Config, Secrets, Tags } from "./config";

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
      tags: ["etd-without-proxy"],
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
  });
  const record = new cloudflare.Record("public-endpoint-record", {
    zoneId: Secrets.zoneId,
    name: "rpc",
    type: "A",
    value: loadBalancer.ip,
    proxied: true,
  });
}

makePublicEndpoint();
