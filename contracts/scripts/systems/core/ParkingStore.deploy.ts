// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

import { EonDeploy } from "../../deploy/eon-deploy.class";

async function main() {
  const deployer = new EonDeploy();
  // mumbai
  // const contract = await deployer.deployUpgradeWithData("ParkingStore", [
  //   "0xb792f1E31D3a19DB2C8A88eE10b35D8bC2DEA6A5",
  //   "0x38cf1C772EC1121b5a9cc1A4CCE07B25c71305eE",
  //   "0x6cf706A92a234652f36995e5004c4Cb72483E529",
  // ]);
  // scroll
  // const contract = await deployer.deployUpgradeWithData("ParkingStore", [
  //   "0x27F4108167D3B38ca45f533F6197635927A29A63",
  //   "0x6550755AEE41CC87E72A849Fdf9022aa74DEC1F4",
  //   "0xf412719c2dDe7e83B2Ff3bDdBE92C48525C4DE18",
  // ]);
  const contract = await deployer.deployUpgradeWithData("ParkingStore", [
    "0x2B5f1EdCc23C66C9696f0F36fFD9b82C6B457F8D",
    "0xa58dc1053e4250786BCB94E4566Ad69D3B588E15",
    "0xcb8481fa44270716AE5fB65D69eef5439c1D87eF",
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
