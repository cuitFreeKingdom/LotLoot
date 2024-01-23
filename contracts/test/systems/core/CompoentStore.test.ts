import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { Contract } from "ethers";

describe("ComponentStore", async () => {
  let compoentStore, erc7527App, erc7527Agency: Contract;
  let token, erc6551Registry, standardERC6551Account, carERC721: Contract;
  let chainId: number;
  beforeEach(async () => {
    const tokenC = await ethers.getContractFactory("LLTToken");
    token = await upgrades.deployProxy(tokenC);

    const storeC = await ethers.getContractFactory("ComponentStore");
    const properties = [
      [1, 3, 5, 8],
      [2 * 3600, 3 * 24 * 3600, 5 * 24 * 3600, 10 * 24 * 3600],
      [10, 20, 30, 50],
    ];

    compoentStore = await upgrades.deployProxy(storeC, [
      token.address,
      properties,
    ]);

    erc7527Agency = await ethers.getContractAt(
      "ERC7527Agency",
      compoentStore.agencyDeployAddress()
    );
    const [app] = await erc7527Agency.getStrategy();
    erc7527App = await ethers.getContractAt("ERC7527App", app);

    const NFTC = await ethers.getContractFactory("CarERC721");
    carERC721 = await NFTC.deploy();

    const Erc6551Registry = await ethers.getContractFactory("ERC6551Registry");
    erc6551Registry = await Erc6551Registry.deploy();

    //deploy StandardERC6551Account
    const StandardERC6551Account = await ethers.getContractFactory(
      "StandardERC6551Account"
    );
    standardERC6551Account = await StandardERC6551Account.deploy();
    chainId = await ethers.provider.getNetwork().then((res) => {
      return res.chainId;
    });
  });
  async function createAccount(
    userAddress: string,
    userChainId?: number,
    tokenId?: number
  ): Promise<string> {
    //mint a token to owner
    const [owner] = await ethers.getSigners();

    await carERC721.connect(owner).safeMint(userAddress, tokenId || 0);

    const accountChainId = userChainId || chainId;

    const salt = ethers.utils.id("mySalt");

    const accountAddress = await erc6551Registry.account(
      standardERC6551Account.address,
      accountChainId,
      carERC721.address,
      tokenId || 0,
      salt
    );

    //create a new account
    await erc6551Registry.createAccount(
      standardERC6551Account.address,
      accountChainId,
      carERC721.address,
      tokenId || 0,
      salt,
      []
    );

    return accountAddress;
  }
  it("should be deployed", async () => {
    expect(compoentStore.adderss).to.be.not.equal(0);

    expect(erc7527Agency.address).to.be.not.equal(0);

    expect(erc7527App.adderss).to.be.not.equal(0);
  });
  it("should be buy", async () => {
    // approve first
    const balance = ethers.utils.parseEther("10");
    const [deployer, addr1] = await ethers.getSigners();
    await token.mint(addr1.address, balance);
    await token.connect(addr1).approve(erc7527Agency.address, balance);
    await token.allowance(addr1.address, erc7527Agency.address).then((n) => {
      expect(n).to.be.equal(balance);
    });
    const id = 1;
    const grade = 3;
    const tokenId1 = 1000;
    const tokenId2 = 1001;
    const beforeBalance = await token.balanceOf(addr1.address);
    // cannot buy invaild id and grade

    await expect(compoentStore.connect(addr1).buy(0, grade)).to.be.revertedWith(
      "have not this component"
    );
    await expect(compoentStore.connect(addr1).buy(4, grade)).to.be.revertedWith(
      "have not this component"
    );
    await expect(compoentStore.connect(addr1).buy(id, 0)).to.be.revertedWith(
      "have not this grade"
    );
    await expect(compoentStore.connect(addr1).buy(id, 5)).to.be.revertedWith(
      "have not this grade"
    );

    expect(await compoentStore.connect(addr1).buy(id, grade)).to.be.emit(
      compoentStore,
      "Buy"
    );
    await token.balanceOf(addr1.address).then((b) => {
      expect(b).to.be.not.equal(beforeBalance);
    });
    await compoentStore.connect(addr1).buy(3, 4);

    await compoentStore.getComIdByTokenId(tokenId1).then((b) => {
      expect(b).to.equal(id);
    });
    await compoentStore.getAbrasion(tokenId1).then((b) => {
      expect(b).to.be.equal(100);
    });
    await erc7527App.tokenOfOwnerByIndex(addr1.address, 0).then((b) => {
      expect(b).to.be.equal(tokenId1);
    });
    await erc7527App.tokenOfOwnerByIndex(addr1.address, 1).then((b) => {
      expect(b).to.equal(tokenId2);
    });
  });
  it("should be sell", async () => {
    //  buy first
    // approve first
    const balance = ethers.utils.parseEther("10");
    const [deployer, addr1] = await ethers.getSigners();
    await token.mint(addr1.address, balance);
    await token.connect(addr1).approve(erc7527Agency.address, balance);
    await token.allowance(addr1.address, erc7527Agency.address).then((n) => {
      expect(n).to.be.equal(balance);
    });
    const id = 1;
    const grade = 3;
    const tokenId1 = 1000;
    const beforeBalance = await token.balanceOf(addr1.address);

    expect(await compoentStore.connect(addr1).buy(id, grade)).to.be.emit(
      compoentStore,
      "Buy"
    );

    await expect(
      compoentStore.connect(deployer).sell(tokenId1)
    ).to.be.revertedWith("It is not your component or you hava to unload it");
    expect(await compoentStore.connect(addr1).sell(tokenId1)).to.be.emit(
      compoentStore,
      "Sell"
    );

    await token.balanceOf(addr1.address).then((b: any) => {
      expect(b).to.be.not.equal(beforeBalance);
    });
    await erc7527App.balanceOf(addr1.address).then((b: any) => {
      expect(b).to.equal(0);
    });
  });
});
