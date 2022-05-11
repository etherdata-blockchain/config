import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config();

export enum Config {
  numberOfPublicEndpoints = 5,
  numberofUnProxydEndpoints = 1,
  numberOfTestnetEndpoints = 1,
  etdChainCertificateName = "ETDChainAuto",
  debugchainCertificateName = "DebugChainAuto",
}

export enum Tags {
  publicEndpointWithoutProxy = "etd-without-proxy",
  publicEndpointWithProxy = "etd-with-proxy",
}

export const Secrets = {
  zoneId: config.require("zoneId"),
  password: config.require("password"),
};
