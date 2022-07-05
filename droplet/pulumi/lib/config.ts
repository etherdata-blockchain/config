import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config();

export enum Config {
  numberOfPublicEndpoints = 2,
  numberofProxyedEndpoints = 1,
  numberOfTestnetEndpoints = 1,
  etdChainCertificateName = "ETDChainAuto",
  debugchainCertificateName = "DebugChainAuto",
}

export enum Tags {
  publicEndpointWithoutProxy = "etd-without-proxy",
  publicEndpointWithProxy = "etd-with-proxy",
  testnetEndpoint = "etd-testnet",
}

export const Secrets = {
  zoneId: config.require("zoneId"),
  password: config.require("password"),
};
