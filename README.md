# Monorepo

## Objective

The objective of this monorepo is to serve as an abstraction layer for game developers
that want to incorporate into web3 and blockchain technology but do not want to deal with
all of the intricacies manually (RPCs, contracts, private keys, etc).

We build in public and welcome contributions from the community.

## Services To Provide

- Creation of ERC-720, ERC-1155 smart contracts (custom parameters).
- Metadata, ownership management, and asset management of dynamic NFTs.
- Event tracking of contracts of interest and always up-to-date blockchain state.
- Query helpers for blockchain state.
- Private key management of developer wallets in a trustless manner (sharding).
- Verification of the deployed contracts (Etherscan).

## Packages To Create (NX Monorepo Orchestrator)

- [x] foundry as a blockchain toolkit
  - [ ] ERC-721 and ERC-1155 templates from solmate
  - [ ] deployment scripts for multiple networks
- [x] nestjs for server API
  - [ ] private key management
  - [ ] asset uploading service
- [ ] smart contracts event tracking service/listener (the graph or custom)
- [ ] after API is complete: Unity SDK

## Scripts

To clone the monorepo: `git clone git@github.com:reliksdao/monorepo.git <name-you-want> --recurse-submodules`

To run a script in a package: `npx nx <script-name> <package-name>`

**Happy Hacking!**
