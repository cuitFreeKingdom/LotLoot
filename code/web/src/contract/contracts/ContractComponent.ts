import { ContractBase } from "./ContractBase";
import ContractComponentABI from "../abi/contracts/systems/ERC7527/ERC7527.sol/ERC7527App.json";
import { contractData } from "../../data/ContractData";
import { IndexDB } from "../../plugins/indexDB";
import { StringUtil } from "../../core/utils/StringUtil";

export class ContractComponent extends ContractBase {
  static create(): any {
    const address = contractData.contractAddress.Component;
    const contract = new ContractComponent(
      ContractComponentABI,
      address,
      "",
      ""
    );
    return contract.createContract();
  }

  async getPlayerComponent(address: string): Promise<any[]> {
    const balance = await this.contract.balanceOf(address);
    if (balance && balance.toNumber() < 0) {
      return [];
    }

    const tokenIds = [];
    for (let i = 0; i < balance.toNumber(); i++) {
      const tokenId = await this.contract.tokenOfOwnerByIndex(address, i);
      tokenIds.push(tokenId.toNumber());
    }
    return tokenIds;
  }

  async ownerOf(tokenId: number) {
    const cacheKey = `nft_component_owner_${tokenId}`;
    const cache = await IndexDB.instance.getItem(cacheKey);
    if (!cache) {
      const owner = await this.contract.ownerOf(tokenId);
      if (!StringUtil.isEmpty(owner)) {
        await IndexDB.instance.addItem(cacheKey, owner);
      }
      return owner;
    } else {
      return cache;
    }
  }

  // async getComIdAndGrade(tokenId: number): Promise<[number, number]> {
  //   const comId = await this.contract.getComId(tokenId);
  //   const grade = await this.contract.getGrade(tokenId);
  //   return [comId, grade];
  // }

  public registerEvents() {
    // TODO
  }
}
