import { ContractBase } from "./ContractBase";
import ContractComponentStoreABI from "../abi/contracts/systems/core/CompoentStore.sol/ComponentStore.json";
import { contractData } from "../../data/ContractData";
import { EventBus } from "../../plugins/EventBus";
import { GameEventBuyCar } from "../../events/GameEventBuyCar";
import { BigNumber, ethers } from "ethers";

export class ContractComponentStore extends ContractBase {
  static create(): any {
    const address = contractData.contractAddress.ComponentStore;
    const contract = new ContractComponentStore(
      ContractComponentStoreABI,
      address,
      "",
      ""
    );
    return contract.createContract();
  }
  async buy(id: number, grade: number) {
    await this.contract.buy(id, grade);
  }
  async sell(tokenId: number) {
    await this.contract.sell(tokenId);
  }
  async getSpeedUp(tokenId: number): Promise<number> {
    const speedUp = await this.contract.getSpeedUp(tokenId);
    return speedUp.toNumber();
  }
  async getMaxTimeUp(tokenId: number): Promise<number> {
    const maxTimeUp = await this.contract.getMaxTimeUp(tokenId);
    return maxTimeUp.toNumber();
  }
  async getPunishRate(tokenId: number): Promise<number> {
    const punishRate = await this.contract.getPunishRate(tokenId);
    return punishRate.toNumber();
  }
  async getComId(tokenId: number): Promise<number> {
    const comId = await this.contract.getComId(tokenId);
    return comId.toNumber();
  }
  async getGrade(tokenId: number): Promise<number> {
    const grade = await this.contract.getGrade(tokenId);
    return grade.toNumber();
  }
}
