<template>
  <div class="home-page">
    <div class="garage">
      <div class="car" v-for="(item, index) in playerParkingList" :key="index">
        <img class="elec" src="../../assets/game/elec-green.png" />
        <div class="elec-dis">{{ item.electric }}%</div>
        <div class="mask-green" v-show="item.status === 2 && isMyCar(item.carOwner)"></div>
        <div class="mask-red" v-show="item.status === 2 && !isMyCar(item.carOwner)"></div>
        <div class="bottom-btn" v-show="item.status === 2" @click="unParkCar(item)">Leave</div>
        <div class="bottom-btn park-btn" v-show="item.status === 1" @click="parkCar(item)">Park</div>
        <div class="bottom-btn ticket-btn" v-show="item.status !== 1 && item.status !== 2"
          @click="ticketCar(item.tokenId)">Ticket</div>
        <img :src="require(`../../assets/topview/${item.partsInfo?.body || 0}${item.partsInfo?.plate || 0}.png`)"
          class="parking-car" v-if="item.status !== 1">
      </div>
      <div class="add-car" @click="buyParkingPlace">
        <img :src="require('../../assets/adddto.png')" class="add-png">
      </div>
    </div>

    <MyCars />
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, onUnmounted, ref } from "vue";
import MyCars from "../Game/MyCars.vue";
import { walletData } from "@/data/WalletData";
import { playerData } from "@/data/PlayerData";
import { Loading } from "@/plugins/Loading";
import { contractData } from "@/data/ContractData";
import { Toast } from "@/plugins/Toast";
import { ParkingDTO } from "@/data/dto/ParkingDTO";
import { EventBus } from "@/plugins/EventBus";
import { GameEventBuyCar } from "@/events/GameEventBuyCar";
import { GameEventWalletConnected } from "@/events/GameEventWalletConnected";
import { GameEventBuyParkings } from "@/events/GameEventBuyParkings";
import { GameEventWalletAccountChanged } from "@/events/GameEventWalletAccountChanged";
import { GameEventParkCar } from "@/events/GameEventParkCar";
import { CONTRACT_ADDRESS_MUMBAI } from "@/const/Contracts";

interface CarItem {
  tokenId: number;
  status: any;
  ParkingAddress: string | number;
  url: string;
  ProspectiveEarnings: number;
}
onBeforeMount(async () => {
  EventBus.instance.on(GameEventBuyCar.eventAsync, onCarBought);
  EventBus.instance.on(GameEventWalletConnected.eventAsync, refreshCar);
  EventBus.instance.on(GameEventBuyParkings.eventAsync, onParkingBought);
  EventBus.instance.on(GameEventParkCar.eventAsync, onCarParked);
  EventBus.instance.on(
    GameEventWalletAccountChanged.eventAsync,
    refreshHome
  );
  if (walletData.address) {
    refreshCar();
    refreshHome();
  }
})
onUnmounted(() => {
  EventBus.instance.off(GameEventWalletConnected.eventAsync, refreshCar);
  EventBus.instance.off(GameEventBuyCar.eventAsync, onCarBought);
  EventBus.instance.off(GameEventBuyParkings.eventAsync, onParkingBought);
  EventBus.instance.off(GameEventParkCar.eventAsync, onCarParked);
  EventBus.instance.off(
    GameEventWalletAccountChanged.eventAsync,
    refreshHome
  );
});

//buy car 
const onCarBought = async () => {
  await refreshCar();
  // Toast.success(`mint car success.`)
}
const userCarList = ref<CarItem[]>([]);
const refreshCar = async () => {
  const player = await playerData.getPlayerData(walletData.address);
  let cars = player
    ? player.cars.map((car) => {
      return {
        tokenId: car.tokenId,
        status: car.status,
        ParkingAddress:
          car.parkingTokenId === 0 ? "IDLE" : car.parkingTokenId,
        url: "0",
        ProspectiveEarnings: 999,
      };
    })
    : [];
  userCarList.value = cars;

  Loading.close();
};
const showCarInfo = async (tokenId: number[]): Promise<Array<number[]>> => {
  let carAddrList: string[] = [];
  let tokenIdList: Array<number[]> = [];
  const promiseArr = [];
  const promiseIdArr = [];
  for (let i = 0; i < tokenId.length; i++) {
    promiseArr.push(contractData.registry6551Contract.account(tokenId[i], CONTRACT_ADDRESS_MUMBAI.CarERC721));
  }
  carAddrList = await Promise.all(promiseArr);
  for (let i = 0; i < carAddrList.length; i++) {
    promiseIdArr.push(contractData.componentContract.getPlayerComponent(carAddrList[i]));
  }
  tokenIdList = await Promise.all(promiseIdArr);
  return tokenIdList;
}
interface CarComInfo {
  tire: number,
  body: number,
  plate: number,
}
const getAllCom = async (tokenIdArr: number[]) => {
  let allComList: CarComInfo = {
    tire: 0,
    body: 0,
    plate: 0,
  };
  if (tokenIdArr.length === 0) {
    return allComList;
  }
  // 每辆车最多安装3个组件
  if (tokenIdArr.length > 3) {
    Toast.warn('Install up to three parts per vehicle!');
    return allComList;
  }

  let promiseIdArr = [];
  let promiseGradeArr = [];
  for (let i = 0; i < tokenIdArr.length; i++) {
    promiseIdArr.push(contractData.componentStoreContract.getComId(tokenIdArr[i]));
    promiseGradeArr.push(contractData.componentStoreContract.getGrade(tokenIdArr[i]));
  }
  const idArr = await Promise.all(promiseIdArr);
  const gradeArr = await Promise.all(promiseGradeArr);
  console.log('grade', gradeArr)
  for (let i = 0; i < tokenIdArr.length; i++) {
    if (idArr[i] === 1) {
      allComList.tire = gradeArr[i] - 1;
    }
    if (idArr[i] === 2) {
      allComList.body = gradeArr[i] - 1;
    }
    if (idArr[i] === 3) {
      allComList.plate = gradeArr[i] - 1;
    }
  }
  return allComList;
}


// buy parking
const playerParkingList = ref<ParkingDTO[]>([]);
const onParkingBought = async () => {
  await refreshHome();
  Loading.close();

  Toast.success(`mint parking success.`)
};
// refresh parking position
const refreshHome = async () => {
  const player = await playerData.getPlayerData(walletData.address);

  if (player) {
    //@ts-ignore
    playerParkingList.value = player.parkings.map((parking) => {
      return {
        status: parking.status,
        carTokenId: parking.carTokenId,
        balance: 123.456,
        tokenId: parking.tokenId
      };
    });
    const res = await refreshCurrentElec();
    let allParkedCarTokenId: number[] = [];
    playerParkingList.value.map((e, i) => {
      allParkedCarTokenId.push(e.carTokenId)
      return Object.assign(e, { electric: res[i] })
    })

    // 获取所有车辆的tokenId数组
    const resArr = await showCarInfo(allParkedCarTokenId);
    // 将每辆车的TokenId数组转化成对应的组件的类别和等级
    let promiseComArr = [];
    for (let i = 0; i < allParkedCarTokenId.length; i++) {
      promiseComArr.push(getAllCom(resArr[i]))
    }
    const allComList = await Promise.all(promiseComArr);
    playerParkingList.value.map((e, i) => {
      return Object.assign(e, { partsTokenIdList: resArr[i] }, { partsInfo: allComList[i] })
    });
    // console.log('yyy', playerParkingList.value)

  }
};
const buyParkingPlace = async () => {
  // TODO Dialog
  Loading.open();
  try {
    // @ts-ignore
    if (playerParkingList.value?.length > 0) {
      Toast.warn("You already have parking space.")
      return;
    }
    await contractData.parkingStoreContract.buyParkings();
  } catch (e) {
    Toast.error("Buy parking place failed.");
    console.error(e);
  } finally {
    Loading.close();
  }
};

const refreshCurrentElec = async (): Promise<number[]> => {
  let res: number[] = [];
  try {
    const playerPL = playerParkingList.value;
    if (playerPL.length === 0) {
      return res;
    } else {
      const promiseArr = [];
      for (let i = 0; i < playerPL.length; i++) {
        promiseArr.push(contractData.lotLootContract.getCurrentElectric(playerPL[i].tokenId))
      }
      res = await Promise.all(promiseArr);
      console.log('elec', res)
      return res;
    }
  } catch (error) {
    console.error(error);
  }
  return res;
}

const parkCar = async (item: ParkingDTO) => {
  try {
    Loading.open();
    // 获取车位停车信息
    const res = await contractData.lotLootContract.getParkingCar(item.tokenId);
    if (res !== 0) {
      Toast.warn('There is already a car in this parking space!');
      return;
    }
    if (userCarList.value.length === 0) {
      Toast.warn("You have not cars!");
      return;
    } else {
      const flag = chooseParkCar();
      if (flag === -1) {
        Toast.warn('You have parked all your cars!');
        return;
      } else {
        console.log('park outcome', await contractData.lotLootContract.park(userCarList.value[flag].tokenId, item.tokenId));
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    Loading.close();
  }
}
const onCarParked = async () => {
  await refreshCar();
}
const chooseParkCar = (): number => {
  try {
    if (userCarList.value.length > 0) {
      for (let i = 0; i < userCarList.value.length; i++) {
        if (userCarList.value[i].ParkingAddress === 'IDLE') {
          return i;
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
  return -1;
}

const unParkCar = async (item: ParkingDTO) => {
  Loading.open();
  try {
    if (item.carTokenId === 0) {
      Toast.warn("There is no car in this parking space yet!");
      return;
    }
    console.log('unpark success', await contractData.lotLootContract.unPark(item.carTokenId));
  } catch (error) {
    console.error(error);
  } finally {
    Loading.close();
  }
}
const isMyCar = async (address: string) => {
  return address === walletData.address;
}

const ticketCar = async (parkId: number) => {
  console.log('ticket car', await contractData.lotLootContract.fineCar(parkId));
}
</script>

<style scoped lang="less">
.home-page {
  // margin-top: 64px;
  width: 100%;
  min-height: 100vh;
  height: 100%;
  background: url('../../assets/bg-s.png') no-repeat 0 0 fixed;
}

.garage {
  width: 55%;
  min-width: 820px;
  padding-top: 230px;
  margin-left: 22%;
  display: flex;
  gap: 80px;
  flex-wrap: wrap;
  justify-content: center;

  .car {
    height: 290px;
    width: 220px;
    background: url("../../assets/parking.jpg");
    position: relative;

    .elec {
      position: absolute;
      top: 6px;
      left: 80px;
      width: 45px;
      height: 30px;
    }

    .elec-dis {
      position: absolute;
      top: 13px;
      left: 125px;
      width: 45px;
      font-size: 14px;
      color: #FFFFFF;

    }

    .bottom-btn {
      position: absolute;
      bottom: 10px;
      left: 60px;
      width: 100px;
      height: 30px;
      background-color: #2687FA;
      color: #FFFFFF;
      font-weight: 600;
      font-size: 20px;
      line-height: 30px;
      text-align: center;
      border-radius: 3px;
      z-index: 1;

      &:hover {
        cursor: pointer;
      }
    }

    .ticket-btn {
      background-color: rgb(255, 79, 128);
    }

    .park-btn {
      background-color: rgb(233, 207, 39);
    }

    .parking-car {
      position: absolute;
      top: 35px;
      left: 60px;
      height: 210px;
      width: 100px;
      // background-color: rgba(38, 189, 57, 0.5);
      z-index: 1;
    }

    .mask-green {
      position: absolute;
      top: 10px;
      left: 10px;
      width: 200px;
      height: 270px;
      background-color: rgba(38, 189, 57, 0.5);
    }

    .mask-red {
      position: absolute;
      top: 10px;
      left: 10px;
      width: 200px;
      height: 270px;
      background-color: rgba(176, 49, 96, 0.5);
    }
  }

  .add-car {
    height: 290px;
    width: 220px;
    border: 5px #cdcdcd dashed;
    display: flex;
    justify-content: center;
    align-items: center;

    .add-png {
      width: 128px;
      height: 128px;
    }

    &:hover {
      cursor: pointer;
    }
  }
}
</style>
