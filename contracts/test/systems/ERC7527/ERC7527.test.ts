import { expect } from "chai";
import { Address } from "cluster";
import { Bytes, Contract } from "ethers";
import { ethers, upgrades } from "hardhat";
import { tx } from "@openzeppelin/test-helpers";
describe("ERC7527", () => {
  let erc7527App: Contract;
  let erc7527Agency: Contract;
  let erc7527Factory: Contract;
  let erc20: Contract;

  interface Asset {
    currency: string;
    premium: bigint;
    feeRecipient: string;
    mintFeePercent: number;
    burnFeePercent: number;
  }
  interface AgencySettting {
    implementation: string;
    asset: Asset;
    immutableData: Bytes;
    initData: Bytes;
  }
  interface appSetting {
    implementation: string;
    immutableData: Bytes;
    initData: Bytes;
  }

  beforeEach(async () => {
    const appC = await ethers.getContractFactory("ERC7527App");
    erc7527App = await appC.deploy();

    const agencyC = await ethers.getContractFactory("ERC7527Agency");
    erc7527Agency = await agencyC.deploy();

    // await erc7527App.setAgency(erc7527Agency.address);

    const factoryC = await ethers.getContractFactory("ERC7527Factory");

    erc7527Factory = await factoryC.deploy();

    const tokenC = await ethers.getContractFactory("LLTToken");
    erc20 = await upgrades.deployProxy(tokenC);
  });
  it("should be deployed", async () => {
    await erc7527App.setAgency(erc7527Agency.address);
    expect(await erc7527App.address).to.not.equal("");
    expect(await erc7527Agency.address).to.not.equal("");
    expect(await erc20.address).to.not.equal("");
    expect(await erc7527Factory.address).to.not.equal("");
    await expect(
      erc7527App.setAgency(ethers.constants.AddressZero)
    ).to.be.revertedWith("already set");
  });
  it("test wrap", async () => {
    const [deployer, addr1] = await ethers.getSigners();

    const assert: Asset = {
      currency: erc20.address,
      premium: 500n,
      feeRecipient: deployer.address,
      mintFeePercent: 10,
      burnFeePercent: 10,
    };
    const agencySettting: AgencySettting = {
      implementation: erc7527Agency.address,
      asset: assert,
      immutableData: new Uint8Array(0),
      initData: new Uint8Array(0),
    };
    const appSetting: appSetting = {
      implementation: erc7527App.address,
      immutableData: new Uint8Array(0),
      initData: new Uint8Array(0),
    };
    const result = await erc7527Factory.deployWrap(
      agencySettting,
      appSetting,
      new Uint8Array(0)
    );
    console.log("result", result);

    const reciept = await result.wait();
    console.log(reciept);

    // const uint8Value = 42;
    // const uint256Value1 = ethers.BigNumber.from(
    //   "123456789012345678901234567890"
    // );
    // const uint256Value2 = ethers.BigNumber.from(
    //   "987654321098765432109876543210"
    // );
    // const uint256Value3 = ethers.BigNumber.from(
    //   "000000000000005555555555555555"
    // );
    // console.log(await erc7527Agency.getStrategy());
    // const calldata = ethers.utils.defaultAbiCoder.encode(
    //   ["uint8", "uint256", "uint256", "uint256"],
    //   [uint8Value, uint256Value1, uint256Value2, uint256Value3]
    // );
    // await erc7527Agency.wrap(addr1.address, calldata);
    // const strategy = await erc7527Agency.getStrategy();
    // console.log("strategy", strategy);
  });
  it("test unwrap", async () => {});
});
