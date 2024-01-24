<template>
  <div class="parking-page">
    <MyCars />
    <AddrList />
    <SearchBar @search="getPlayerParking" @reset="resetPlayerParkingList" />
    <div class="garage">
      <div class="car" v-for="(item, index) in playerParkingList" :key="index">
        <img class="elec" src="../../assets/game/elec-green.png" />
        <div class="mask-green" v-show="item.isParked && isMyCar(item.carOwner)"></div>
        <div class="mask-red" v-show="item.isParked && !isMyCar(item.carOwner)"></div>
        <div class="bottom-btn" v-show="item.isParked && isMyCar(item.carOwner)" @click="unParkCar(item)">Leave</div>
        <div class="bottom-btn park-btn" v-show="!item.isParked" @click="parkCar(item)">Park</div>
        <img src="../../assets/topview/00.png" class="parking-car" v-show="item.isParked">
      </div>
    </div>
    <Dialog ref="confirmRef" confirmBtnText="YES" cancelBtnText="NO" @confirm="confirmMessage" @cancel="cancelMessage" />
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, onUnmounted, ref } from "vue";
import SearchBar from "../Game/SearchBar.vue";
import MyCars from "../Game/MyCars.vue";
import AddrList from "../Game/AddrList.vue";
import Dialog from "../Util/Dialog.vue";
import { ParkingDTO } from "@/data/dto/ParkingDTO";
import { playerData } from "@/data/PlayerData";
import { Toast } from "@/plugins/Toast";
import { Loading } from "@/plugins/Loading";
import { walletData } from "@/data/WalletData";
import { EventBus } from "@/plugins/EventBus";
import { GameEventParkCar } from "@/events/GameEventParkCar";
import { contractData } from "@/data/ContractData";
interface CarItem {
  tokenId: number;
  status: any;
  ParkingAddress: string | number;
  url: string;
  ProspectiveEarnings: number;
}

onBeforeMount(async () => {
  // EventBus.instance.on(GameEventParkCar.eventAsync, onCarParked);
  refreshCar();
});
// onUnmounted(async()=> {
//   EventBus.instance.off(GameEventParkCar.eventAsync, onCarParked);
// });

// 拿到confirm的dom
const confirmRef = ref();
// 唤起confirm
const showConfirm = (text: string, others: string) => {
  confirmRef.value.show(text, others);
};
// 点击确认按钮后的事件处理
const confirmMessage = () => {
  // confirmRef.value.hide();
};
const cancelMessage = () => {
};

const playerParkingList = ref<ParkingDTO[]>([]);
const getPlayerParking = async (address: string) => {
  try {
    Loading.open();
    resetPlayerParkingList();
    const player = await playerData.getPlayerData(address, true);
    if (!player?.hasParkings || player.parkings.length === 0) {
      Toast.warn('This account has not parking!');
      return;
    } else {
      playerParkingList.value = player.parkings;
    }
    console.log('friend', player)
  } catch (error) {
    console.error(error);
  } finally {
    Loading.close();
  }
}
const resetPlayerParkingList = async () => {
  playerParkingList.value = [];
}

const unParkCar = async (item: ParkingDTO) => {
  try {
    Loading.open()
    if (!item.isParked) {
      Toast.warn('There is not car in this parking!')
      return;
    }
    console.log('unpark success', await contractData.lotLootContract.unPark(item.carTokenId));
  } catch (error) {
    console.error(error)
  } finally {
    Loading.close()
  }
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

const isMyCar = async (address: string) => {
  return address === walletData.address;
}
</script>

<style scoped lang="less">
.parking-page {
  // margin-top: 64px;
  width: 100%;
  min-height: 100vh;
  background: url('../../assets/bg-s.png') no-repeat 0 0 fixed;

  .garage {
    width: 55%;
    min-width: 820px;
    padding-top: 240px;
    margin-left: 22%;
    display: flex;
    justify-content: center;
    gap: 80px;
    flex-wrap: wrap;

    .car {
      height: 290px;
      width: 220px;
      background: url("../../assets/parking.jpg");
      position: relative;

      &:hover {
        cursor: pointer;
      }
    }

    .elec {
      position: absolute;
      top: 6px;
      left: 88px;
      width: 45px;
      height: 30px;
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
}
</style>
