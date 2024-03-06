# Privacy-Pools

![Privacy-Pools banner image](./.github/privacy_pools_banner.png)

## What is Privacy-Pools

Privacy-Pools is a decentralized application (dApp) designed to enhance privacy in financial transactions. It allows users to deposit assets and withdraw using unlinked addresses. Withdrawals are accompanied by a second proof of inclusion within an arbitrary subset of deposits. This unique feature enables users to remove themselves from an anonymity set containing hacked funds, all while preserving their privacy through zero-knowledge proofs.

Privacy-Pools also facilitates community-driven efforts to improve security by allowing the exclusion of laundered funds or funds originating from on-chain hacks.

## Repository Details

This repository contains the frontend codebase for Privacy-Pools, forked from the [pools-ui](https://github.com/ameensol/pools-ui) project.

The frontend works with smart contracts from [pools-sol](https://github.com/0x132fabb5bc2fb61fc68bcfb5508841ddb11e9/pools-sol).

The frontend utilizes the minified snarkjs v0.6.9 library for zero-knowledge proof (zkProof) operations. Verifier keys required for zkProofs are generated using scripts available in the contracts repository.

# Getting Started

To get started with the Privacy-Pools frontend, follow these steps:

1. **Clone the Repository**: Clone this repository to your local machine using the following command:
```bash
   git clone https://github.com/zksat134/pools-ui
```

2. **Install Dependencies**: Navigate to the project directory and install project dependencies by running the following command:
```bash
   cd pools-ui && yarn install
```

3. **Build the Project**: Once the dependencies are installed, build the project using the following command:
```bash
   yarn build
```

4. **Start the Development Server**: After the build process is complete, start the development server by running the following command:
```bash
   yarn start
```

5. **View the Application**: Open your web browser and navigate to [http://localhost:3000](http://localhost:3000) to view the Privacy-Pools application running locally on your machine.