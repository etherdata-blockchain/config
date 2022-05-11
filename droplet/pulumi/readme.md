# Pulumi setup

This folder will let user set up a cluster of computers on DigitalOcean and create a dns record.

## Set up

1. Setup environment: `pnpm install`
2. Create resources: `pulumi up`

## File structure

> Note: To set up a pulumi config, simply running command `pulumi config KEY VALUE --secret`

1. `index.ts`: Main logic for setting up resources
2. `scripts.ts`: List of setup scripts for droplets
3. `config.ts`: List of configs for pulumi settings using pulumi config

