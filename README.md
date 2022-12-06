# Monorepo

## Objective

The objective of this monorepo is to provide a framework for NFT projects
that want to incorporate into web3 and blockchain but do not want to deal with
all of the intricacies manually (RPCs, contracts, private keys, etc).

We build in **public** and welcome contributions from the community.

## Services To Provide

- Creation, verification, management, and deployments of ERC-720, ERC-1155 collections.
- Metadata, asset, and minting management of NFTs.
- Private key management of developer wallets in a trustless manner.

## Packages (NX Monorepo Orchestrator)

Foundry-tk: Toolkit to create smart contracts, interact and test them.
Nestjs: API to manage private keys, metadata, and deployment of NFTs.
Frontend: Developer portal to interact with the API and manage your projects NFTs.

## Scripts

To clone the monorepo and install submodules:
`git clone git@github.com:reliksdao/monorepo.git <name-you-want> --recurse-submodules`

To run a task in a package (the package must support it):
`npx nx <script-name> <package-name>` OR `npx nx run <package-name>:<script-name>`

**Happy Hacking!**
