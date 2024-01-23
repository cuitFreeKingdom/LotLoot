import { expect } from "chai";
import { Contract, utils } from "ethers";
import { addAbortListener } from "events";
import { ethers, upgrades } from "hardhat";

describe("LotLoot", function () {
  let lltToken: Contract;
  let carERC721: Contract;
  let parkERC721: Contract;
  let erc6551Registry: Contract;
  let erc6551Account: Contract;
  let carStore: Contract;
  let parkingStore: Contract;
  let lotLoot: Contract;
  let componentStore, erc7527App, erc7527Agency: Contract;
  let chainId: number;
  beforeEach(async () => {
    const CarERC721 = await ethers.getContractFactory("CarERC721");
    const ParkERC721 = await ethers.getContractFactory("ParkingERC721");
    const ERC6551Registry = await ethers.getContractFactory("ERC6551Registry");
    const ERC6551Account = await ethers.getContractFactory(
      "StandardERC6551Account"
    );
    const CarStore = await ethers.getContractFactory("CarStore");
    const ParkingStore = await ethers.getContractFactory("ParkingStore");
    const LotLoot = await ethers.getContractFactory("LotLoot");
    const ttlTokenFactory = await ethers.getContractFactory("LLTToken");
    lltToken = await upgrades.deployProxy(ttlTokenFactory);
    erc6551Registry = await upgrades.deployProxy(ERC6551Registry);
    erc6551Account = await upgrades.deployProxy(ERC6551Account);

    carERC721 = await upgrades.deployProxy(CarERC721);
    parkERC721 = await upgrades.deployProxy(ParkERC721);

    carStore = await upgrades.deployProxy(CarStore, [
      carERC721.address,
      erc6551Registry.address,
      erc6551Account.address,
    ]);
    parkingStore = await upgrades.deployProxy(ParkingStore, [
      parkERC721.address,
      erc6551Registry.address,
      erc6551Account.address,
    ]);

    const storeC = await ethers.getContractFactory("ComponentStore");
    const properties = [
      [1, 3, 5, 8],
      [24 * 3600, 3 * 24 * 3600, 5 * 24 * 3600, 10 * 24 * 3600],
      [10, 20, 30, 50],
    ];
    componentStore = await upgrades.deployProxy(storeC, [
      lltToken.address,
      properties,
    ]);
    erc7527Agency = await ethers.getContractAt(
      "ERC7527Agency",
      componentStore.agencyDeployAddress()
    );
    const [app] = await erc7527Agency.getStrategy();
    erc7527App = await ethers.getContractAt("ERC7527App", app);
    console.log("deploy lotloot");
    lotLoot = await upgrades.deployProxy(LotLoot, [
      lltToken.address,
      carERC721.address,
      parkERC721.address,
      erc6551Registry.address,
      erc6551Account.address,
      erc7527App.address,
      componentStore.address,
      parkingStore.address,
      1,
      3600,
    ]);
    // access control
    await componentStore.grantRole(
      ethers.utils.id("GAME_ROLE"),
      lotLoot.address
    );
    await parkingStore.grantRole(ethers.utils.id("GAME_ROLE"), lotLoot.address);
    await lltToken.grantRole(ethers.utils.id("MINTER_ROLE"), lotLoot.address);

    await erc7527App.setLotLootAddress(lotLoot.address);
    chainId = await ethers.provider.getNetwork().then((res) => {
      return res.chainId;
    });
  });
  async function createAccount(
    userChainId?: number,
    tokenId?: number
  ): Promise<string> {
    const accountChainId = userChainId || chainId;

    const salt = tokenId || 0;
    const accountAddress = await erc6551Registry.account(
      erc6551Account.address,
      accountChainId,
      carERC721.address,
      tokenId || 0,
      salt
    );

    //create a new account
    await erc6551Registry.createAccount(
      erc6551Account.address,
      accountChainId,
      carERC721.address,
      tokenId || 0,
      salt,
      []
    );

    return accountAddress;
  }
  it("success deploy", async () => {
    expect(await carERC721.address).to.not.equal(null);
    expect(await parkERC721.address).to.not.equal(null);
    expect(await carStore.address).to.not.equal(null);
    expect(await parkingStore.address).to.not.equal(null);
    expect(await lotLoot.address).to.not.equal(null);
    expect(await componentStore.address).to.not.equal(null);
    expect(await erc7527App.address).to.not.equal(null);
    expect(await erc7527Agency.address).to.not.equal(null);
  });

  it("park test", async () => {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const MINTER_ROLE = ethers.utils.id("MINTER_ROLE");
    carERC721.connect(owner).grantRole(MINTER_ROLE, carStore.address);
    parkERC721.connect(owner).grantRole(MINTER_ROLE, parkingStore.address);

    await carStore.connect(addr1).mint();
    const carTokenId1 = await carERC721.tokenOfOwnerByIndex(addr1.address, 0);

    await parkingStore.connect(addr1).mint();
    const parkTokenId1 = await parkERC721.tokenOfOwnerByIndex(addr1.address, 0);

    await carStore.connect(addr2).mint();
    const carTokenId2 = await carERC721.tokenOfOwnerByIndex(addr2.address, 0);

    await parkingStore.connect(addr2).mint();
    const parkTokenId2 = await parkERC721.tokenOfOwnerByIndex(addr2.address, 0);

    await parkingStore.connect(addr2).mint();
    const parkTokenId3 = await parkERC721.tokenOfOwnerByIndex(addr2.address, 1);

    await carStore.connect(addr1).mint();
    const carTokenId3 = await carERC721.tokenOfOwnerByIndex(addr1.address, 1);

    await lotLoot.connect(addr1).parkCar(carTokenId1, parkTokenId2);
    await lotLoot.connect(addr2).parkCar(carTokenId2, parkTokenId1);
    // success parking
    expect(await lotLoot.viewCarOnPark(carTokenId1)).to.equal(parkTokenId2);
    expect(await lotLoot.viewParkOnCar(parkTokenId2)).to.equal(carTokenId1);
    expect(await lotLoot.viewParkOnCar(parkTokenId1)).to.equal(carTokenId2);
    expect(await lotLoot.viewCarOnPark(carTokenId2)).to.equal(parkTokenId1);
    // can't park a parked setting
    await expect(
      lotLoot.connect(addr1).parkCar(carTokenId3, parkTokenId2)
    ).to.be.revertedWith("Park is already full");

    await expect(
      lotLoot.connect(addr1).parkCar(carTokenId1, parkTokenId3)
    ).to.be.revertedWith("Car is already parked");
  });

  it("test unpark", async () => {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const MINTER_ROLE = ethers.utils.id("MINTER_ROLE");
    carERC721.connect(owner).grantRole(MINTER_ROLE, carStore.address);
    parkERC721.connect(owner).grantRole(MINTER_ROLE, parkingStore.address);

    await carStore.connect(addr1).mint();
    const carTokenId1 = await carERC721.tokenOfOwnerByIndex(addr1.address, 0);

    await parkingStore.connect(addr1).mint();
    const parkTokenId1 = await parkERC721.tokenOfOwnerByIndex(addr1.address, 0);

    await carStore.connect(addr2).mint();
    const carTokenId2 = await carERC721.tokenOfOwnerByIndex(addr2.address, 0);

    await parkingStore.connect(addr2).mint();
    const parkTokenId2 = await parkERC721.tokenOfOwnerByIndex(addr2.address, 0);

    await parkingStore.connect(addr2).mint();
    const parkTokenId3 = await parkERC721.tokenOfOwnerByIndex(addr2.address, 1);

    await carStore.connect(addr1).mint();
    const carTokenId3 = await carERC721.tokenOfOwnerByIndex(addr1.address, 1);

    await lotLoot.connect(addr1).parkCar(carTokenId1, parkTokenId2);
    await lotLoot.connect(addr2).parkCar(carTokenId2, parkTokenId1);
    await expect(await lotLoot.viewCarOnPark(carTokenId1)).equal(parkTokenId2);
    await expect(await lotLoot.viewParkOnCar(parkTokenId2)).equal(carTokenId1);
    await expect(await lotLoot.viewCarOnPark(carTokenId2)).equal(parkTokenId1);
    await expect(await lotLoot.viewParkOnCar(parkTokenId1)).equal(carTokenId2);
    await lltToken.connect(owner).grantRole(MINTER_ROLE, lotLoot.address);
    const accountAddress = await erc6551Registry.account(
      erc6551Account.address,
      1337,
      carERC721.address,
      carTokenId1.toNumber(),
      carTokenId1.toNumber()
    );

    await lotLoot.connect(addr1).unParkCar(carTokenId1);
    await expect(
      lotLoot.connect(addr1).unParkCar(carTokenId2)
    ).to.be.revertedWith("Not owner of car");

    expect(await lotLoot.viewCarOnPark(carTokenId1)).to.equal(0);
    expect(await lotLoot.viewParkOnCar(parkTokenId2)).to.equal(0);
    expect(await lltToken.balanceOf(accountAddress)).to.equal(0);
    // await lltToken.balanceOf(addr1.address).then((b) => {
    //   expect(b).to.be.not.equal(0);
    // });
  });
  it("test fine car", async () => {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const MINTER_ROLE = ethers.utils.id("MINTER_ROLE");
    // Grant role
    carERC721.connect(owner).grantRole(MINTER_ROLE, carStore.address);
    parkERC721.connect(owner).grantRole(MINTER_ROLE, parkingStore.address);
    lltToken.connect(owner).grantRole(MINTER_ROLE, lotLoot.address);

    // addr1 has one car and one parking
    await carStore.connect(addr1).mint();
    const carTokenId1 = await carERC721.tokenOfOwnerByIndex(addr1.address, 0);

    await parkingStore.connect(addr1).mint();
    const parkTokenId1 = await parkERC721.tokenOfOwnerByIndex(addr1.address, 0);

    // addr2  has one car and one parking
    await carStore.connect(addr2).mint();
    const carTokenId2 = await carERC721.tokenOfOwnerByIndex(addr2.address, 0);

    await parkingStore.connect(addr2).mint();
    const parkTokenId2 = await parkERC721.tokenOfOwnerByIndex(addr2.address, 0);

    const accountAddress = await erc6551Registry.account(
      erc6551Account.address,
      1337,
      parkERC721.address,
      parkTokenId2,
      parkTokenId2
    );

    await lotLoot.connect(addr1).parkCar(carTokenId1, parkTokenId2);
    expect(await lotLoot.viewParkOnCar(parkTokenId2)).to.equal(carTokenId1);
    expect(await lotLoot.viewCarOnPark(carTokenId1)).to.equal(parkTokenId2);
    // You must be the owner of the parking space
    await expect(
      lotLoot.connect(addr1).fineCar(parkTokenId2)
    ).to.be.revertedWith("Not owner of park");

    // The parking must has a car
    await expect(
      lotLoot.connect(addr1).fineCar(parkTokenId1)
    ).to.be.revertedWith("There are no cars in this space");

    await lotLoot.connect(addr2).fineCar(parkTokenId2);

    expect(await lotLoot.viewParkOnCar(parkTokenId2)).to.equal(0);
    expect(await lotLoot.viewCarOnPark(carTokenId1)).to.equal(0);
    expect(await lltToken.balanceOf(accountAddress)).to.equal(0);
    await lltToken.balanceOf(addr2.address).then((b) => {
      expect(b).to.be.not.equal(0);
    });
  });
  it("test load", async () => {
    const [owner, addr1] = await ethers.getSigners();
    // creat car
    const MINTER_ROLE = ethers.utils.id("MINTER_ROLE");
    carERC721.connect(owner).grantRole(MINTER_ROLE, carStore.address);
    parkERC721.connect(owner).grantRole(MINTER_ROLE, parkingStore.address);
    await carStore.connect(addr1).mint();

    const carTokenId1 = await carERC721.tokenOfOwnerByIndex(addr1.address, 0);

    // wrap
    const balance = ethers.utils.parseEther("10");
    await lltToken.mint(addr1.address, balance);
    await lltToken.connect(addr1).approve(erc7527Agency.address, balance);
    await lltToken.allowance(addr1.address, erc7527Agency.address).then((b) => {
      expect(b).to.equal(balance);
    });
    const comId = 1;
    const comId2 = 2;
    const grade = 3;
    const tokenId1 = 1000;
    const tokenId2 = 1001;
    const tokenId3 = 1002;

    await componentStore.connect(addr1).buy(comId, grade);
    await componentStore.connect(addr1).buy(comId, grade);
    await componentStore.connect(addr1).buy(comId2, grade);
    const carAddress = await createAccount(undefined, carTokenId1);
    await expect(await erc7527App.getApproved(tokenId1)).to.be.equal(
      lotLoot.address
    );
    console.log("start load");
    expect(await lotLoot.connect(addr1).load(carTokenId1, tokenId1)).to.be.emit(
      lotLoot,
      "Load"
    );
    console.log(await componentStore.getComIdByTokenId(tokenId3));
    // you cant load the same component Id
    await expect(
      lotLoot.connect(addr1).load(carTokenId1, tokenId2)
    ).to.be.revertedWith("you have load this type component");
    console.log("has pass");
    await expect(lotLoot.connect(addr1).load(carTokenId1, tokenId3)).to.be.emit(
      lotLoot,
      "Load"
    );
    console.log("pass two");
    expect(await erc7527App.balanceOf(carAddress)).to.be.equal(2);
  });
  it("test unload", async () => {
    // load first
    const [owner, addr1] = await ethers.getSigners();
    // creat car
    const MINTER_ROLE = ethers.utils.id("MINTER_ROLE");
    carERC721.connect(owner).grantRole(MINTER_ROLE, carStore.address);
    parkERC721.connect(owner).grantRole(MINTER_ROLE, parkingStore.address);
    await carStore.connect(addr1).mint();
    const event = await carStore.queryFilter("CarMint");
    console.log(event[0], "evnet");
    console.log(await lotLoot._account(1000));
    console.log(await lotLoot.get());
    console.log(await carStore.get());

    const accountAddress = await erc6551Registry.account(
      erc6551Account.address,
      1337,
      carERC721.address,
      1000,
      1000
    );
    console.log("account", accountAddress);

    const carTokenId1 = await carERC721.tokenOfOwnerByIndex(addr1.address, 0);

    // wrap
    const balance = ethers.utils.parseEther("10");
    await lltToken.mint(addr1.address, balance);

    await lltToken.connect(addr1).approve(erc7527Agency.address, balance);

    const comId = 1;
    const grade = 3;
    const tokenId1 = 1000;

    await componentStore.connect(addr1).buy(comId, grade);
    expect(await erc7527App.getApproved(tokenId1)).to.be.equal(lotLoot.address);
    expect(await lotLoot.connect(addr1).load(carTokenId1, tokenId1)).to.be.emit(
      lotLoot,
      "Load"
    );
    const carAddress = await createAccount(undefined, carTokenId1);

    // expect(await erc7527App.balanceOf(carAddress)).to.be.equal(1);
    // console.log(carAddress);
    const account = await ethers.getContractAt(
      "StandardERC6551Account",
      accountAddress
    );
    expect(account).not.null;
    console.log(await account.token());
    console.log("unload start");

    // await lotLoot.test(carTokenId1);
    // await expect(lotLoot.connect(addr1).unload(carTokenId1, tokenId1)).to.emit(
    //   lotLoot,
    //   "Unload"
    // );
  });
  it("test abrusion and electric", async () => {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const MINTER_ROLE = ethers.utils.id("MINTER_ROLE");
    carERC721.connect(owner).grantRole(MINTER_ROLE, carStore.address);
    parkERC721.connect(owner).grantRole(MINTER_ROLE, parkingStore.address);

    await carStore.connect(addr1).mint();
    const carTokenId1 = await carERC721.tokenOfOwnerByIndex(addr1.address, 0);

    await parkingStore.connect(addr1).mint();
    const parkTokenId1 = await parkERC721.tokenOfOwnerByIndex(addr1.address, 0);

    await carStore.connect(addr2).mint();
    const carTokenId2 = await carERC721.tokenOfOwnerByIndex(addr2.address, 0);

    await parkingStore.connect(addr2).mint();
    const parkTokenId2 = await parkERC721.tokenOfOwnerByIndex(addr2.address, 0);

    await parkingStore.connect(addr2).mint();
    const parkTokenId3 = await parkERC721.tokenOfOwnerByIndex(addr2.address, 1);

    await carStore.connect(addr1).mint();
    const carTokenId3 = await carERC721.tokenOfOwnerByIndex(addr1.address, 1);

    await lotLoot.connect(addr1).parkCar(carTokenId1, parkTokenId2);
    await lotLoot.connect(addr2).parkCar(carTokenId2, parkTokenId1);
    // get electric and abrusion
    const perElectric1 = await lotLoot.getCurrentParkingElectric(parkTokenId1);
    console.log(perElectric1);
    await ethers.provider.send("evm_increaseTime", [86400]);

    console.log("Increased block timestamp by 1 day");
  });
  it("test calculate earning", async () => {
    // load first
    /*
    通过两个账户两台车装备不同等级的组件来比较收益
    */
    const initialBalance = ethers.utils.parseEther("1");
    const [deployer, addr1, addr2, addr3] = await ethers.getSigners();
    // 分配初始余额
    await lltToken.mint(deployer.address, initialBalance);
    await lltToken.mint(addr1.address, initialBalance);
    await lltToken.mint(addr2.address, initialBalance);
    await lltToken.mint(addr3.address, initialBalance);
    await lltToken
      .connect(deployer)
      .approve(erc7527Agency.address, initialBalance);
    await lltToken
      .connect(addr1)
      .approve(erc7527Agency.address, initialBalance);
    await lltToken
      .connect(addr2)
      .approve(erc7527Agency.address, initialBalance);
    await lltToken
      .connect(addr3)
      .approve(erc7527Agency.address, initialBalance);
    await lltToken.balanceOf(addr1.address).then((b) => {
      expect(b).to.equal(initialBalance);
    });
    // buy car

    const MINTER_ROLE = ethers.utils.id("MINTER_ROLE");
    carERC721.connect(deployer).grantRole(MINTER_ROLE, carStore.address);
    parkERC721.connect(deployer).grantRole(MINTER_ROLE, parkingStore.address);
    await carStore.connect(addr1).mint();

    await carStore.connect(addr2).mint();
    await carStore.connect(addr3).mint();

    const carTokenId1 = await carERC721.tokenOfOwnerByIndex(addr1.address, 0);
    const carTokenId2 = await carERC721.tokenOfOwnerByIndex(addr2.address, 0);
    const carTokenId3 = await carERC721.tokenOfOwnerByIndex(addr3.address, 0);
    // TODO buy parking

    await parkingStore.connect(addr1).mint();
    const parkTokenId1 = await parkERC721.tokenOfOwnerByIndex(addr1.address, 0);
    await parkingStore.connect(addr2).mint();
    const parkTokenId2 = await parkERC721.tokenOfOwnerByIndex(addr2.address, 0);
    await parkingStore.connect(addr3).mint();
    const parkTokenId3 = await parkERC721.tokenOfOwnerByIndex(addr3.address, 0);
    // buy component

    const [comId1, comId2, comId3] = [1, 2, 3];
    const [grade1, grade2, grade3, grade4] = [1, 2, 3, 4];

    await componentStore.connect(addr1).buy(comId1, grade1);
    await componentStore.connect(addr1).buy(comId2, grade1);
    await componentStore.connect(addr2).buy(comId2, grade2);
    await componentStore.connect(addr3).buy(comId3, grade3);
    const componentTokenId1 = await erc7527App.tokenOfOwnerByIndex(
      addr1.address,
      0
    );
    const componentTokenId2 = await erc7527App.tokenOfOwnerByIndex(
      addr1.address,
      1
    );
    const componentTokenId3 = await erc7527App.tokenOfOwnerByIndex(
      addr2.address,
      0
    );
    const componentTokenId4 = await erc7527App.tokenOfOwnerByIndex(
      addr3.address,
      0
    );
    // get pre electric and abrasion
    const perElectric1 = await lotLoot.getCurrentParkingElectric(parkTokenId1);
    expect(perElectric1).to.equal(100);
    const perAbrosion1 = await componentStore.getAbrasion(componentTokenId1);
    console.log(perAbrosion1);
    expect(perAbrosion1).to.equal(100);

    // load all
    console.log("start load");
    await lotLoot.connect(addr1).load(carTokenId1, componentTokenId1);
    await lotLoot.connect(addr1).load(carTokenId1, componentTokenId2);
    await lotLoot.connect(addr2).load(carTokenId2, componentTokenId3);
    await lotLoot.connect(addr3).load(carTokenId3, componentTokenId4);

    // park 1=>2 2=>3
    console.log("start park");
    const addr1Balance = await lltToken.balanceOf(addr1.address);
    const addr2Balance = await lltToken.balanceOf(addr2.address);
    const addr3Balance = await lltToken.balanceOf(addr3.address);
    await lotLoot.connect(addr1).parkCar(carTokenId1, parkTokenId2);
    await lotLoot.connect(addr2).parkCar(carTokenId2, parkTokenId3);
    // pass 1 day
    await ethers.provider.send("evm_increaseTime", [86400]);

    console.log("Increased block timestamp by 1 day");
    //unpark
    await lotLoot.connect(addr1).unParkCar(carTokenId1);
    await lotLoot.connect(addr2).unParkCar(carTokenId2);
    const addr1Balance1 = await lltToken.balanceOf(addr1.address);
    const addr2Balance1 = await lltToken.balanceOf(addr2.address);
    const addr3Balance1 = await lltToken.balanceOf(addr3.address);
    expect(addr1Balance1).to.not.equal(addr1Balance);
    expect(addr2Balance1).to.not.equal(addr2Balance);
    console.log(
      addr1Balance1,
      "addr1 have earn :",
      addr1Balance1 - addr1Balance
    );
    console.log(
      addr2Balance1,
      "addr2 have earn :",
      addr2Balance1 - addr2Balance
    );

    // test abrasion
    const abrasion1 = await componentStore.getAbrasion(componentTokenId1);
    const abrasion2 = await componentStore.getAbrasion(componentTokenId2);
    console.log(abrasion1);
    console.log(abrasion2);
    // test fine
    await lotLoot.connect(addr1).parkCar(carTokenId1, parkTokenId3);
    // pass 1 days
    await ethers.provider.send("evm_increaseTime", [86400]);

    console.log("Increased block timestamp by 1 day");
    // fine car
    await lotLoot.connect(addr3).fineCar(parkTokenId3);
    const addr3Balance2 = await lltToken.balanceOf(addr3.address);
    const addr2Balance2 = await lltToken.balanceOf(addr2.address);
    const addr1Balance2 = await lltToken.balanceOf(addr1.address);
    console.log("addr3 have earn :", addr3Balance2 - addr3Balance1);
    console.log("addr2 have earn :", addr2Balance2 - addr2Balance1);

    // test punishRate
    await lotLoot.connect(addr3).parkCar(carTokenId3, parkTokenId1);
    // pass 1 days
    await ethers.provider.send("evm_increaseTime", [86400]);

    console.log("Increased block timestamp by 1 day");
    // punish car
    await lotLoot.connect(addr1).fineCar(parkTokenId1);
    const addr3Balance3 = await lltToken.balanceOf(addr3.address);
    const addr2Balance3 = await lltToken.balanceOf(addr2.address);
    const addr1Balance3 = await lltToken.balanceOf(addr1.address);
    console.log("addr1 have earn : ", addr1Balance3 - addr1Balance2);
    console.log("addr3 have earn : ", addr3Balance3 - addr3Balance2);

    const abrasion11 = await componentStore.getAbrasion(componentTokenId1);
    const abrasion21 = await componentStore.getAbrasion(componentTokenId2);
    const abrasion31 = await componentStore.getAbrasion(componentTokenId3);
    const abrasion41 = await componentStore.getAbrasion(componentTokenId4);
    expect(abrasion11).to.equal(0);
    expect(abrasion21).to.equal(0);
    expect(abrasion31).to.equal(0);
    expect(abrasion41).to.equal(0);
    await lotLoot.connect(addr1).unload(carTokenId1, componentTokenId1);
  });
});
