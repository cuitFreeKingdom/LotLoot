// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

import { EonDeploy } from "../../deploy/eon-deploy.class";

async function main() {
  const deployer = new EonDeploy();
  const properties = [
    [1, 3, 5, 8],
    [2 * 3600, 3 * 3600, 5 * 3600, 10 * 3600],
    [10, 20, 30, 50],
  ];
  const contract = await deployer.deployUpgradeWithData("ComponentStore", [
    "0x7A6b23E93c69127A111D0193430dC30C31a7460C",
    properties,
  ]);
  console.log("deployed to:", contract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
