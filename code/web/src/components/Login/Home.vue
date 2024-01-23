<template>
  <div class="home-page">
    <div class="garage">
      <div class="car" v-for="(item, index) in playerParkingList" :key="index">{{ item.tokenId }}</div>
      <div class="add-car" @click="buyParkingPlace"><img :src="require('../../assets/adddto.png')" class="add-png"></div>
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

onBeforeMount(async () => {
  EventBus.instance.on(GameEventBuyCar.eventAsync, onCarBought);
  EventBus.instance.on(GameEventWalletConnected.eventAsync, refreshCar);
  EventBus.instance.on(GameEventBuyParkings.eventAsync, onParkingBought);
  EventBus.instance.on(
    GameEventWalletAccountChanged.eventAsync,
    refreshHome
  );
  if (walletData.address) {
    refreshHome()
  }
})
onUnmounted(() => {
  EventBus.instance.off(GameEventWalletConnected.eventAsync, refreshCar);
  EventBus.instance.off(GameEventBuyCar.eventAsync, onCarBought);
  EventBus.instance.off(GameEventBuyParkings.eventAsync, onParkingBought);
  EventBus.instance.off(
    GameEventWalletAccountChanged.eventAsync,
    refreshHome
  );
});

//buy car 
const onCarBought = async () => {
  await refreshCar();
  Toast.success(`mint car success.`)
}
const userCarList = ref([]);
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
  //@ts-ignore
  userCarList.value = cars;
  Loading.close();
};


// buy parking
const playerParkingList = ref<ParkingDTO[]>();
const onParkingBought = async () => {
  await refreshHome();
  Loading.close();

  Toast.success(`mint parking success.`)
};
const refreshHome = async () => {
  const player = await playerData.getPlayerData(walletData.address);

  if (player) {
    //@ts-ignore
    playerParkingList.value = player.parkings.map((parking) => {
      return {
        status: parking.status,
        carTokenId: parking.carTokenId,
        balance: 123.456,
        tokenId: parking.tokenId,
      };
    });
  }
};
const buyParkingPlace = async () => {
  // TODO Dialog
  Loading.open();
  try {
    // BUG
    await contractData.parkingStoreContract.buyParkings();
  } catch (e) {
    Loading.close();
    Toast.error("Buy parking place failed.");
    console.error(e);
  }
};
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
  padding-top: 240px;
  margin-left: 24%;
  display: flex;
  gap: 80px;
  flex-wrap: wrap;

  .car {
    height: 290px;
    width: 220px;
    background: url("../../assets/parking.jpg");
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
