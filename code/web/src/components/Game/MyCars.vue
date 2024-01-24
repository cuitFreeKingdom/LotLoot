<template>
  <div class="title">Carport</div>
  <div class="mycars" :class="{ detail: isDisplay }">
    <div class="right-btn" :class="{ leftBtn: isDisplay }" @click="switchDetails">
      <img :src="require('../../assets/right2.png')" class="right" v-show="!isDisplay">
      <img :src="require('../../assets/left2.png')" class="right" v-show="isDisplay">
    </div>
    <div class="cars-show" :class="{ carsShowHover: isDisplay }">
      <div v-for="(item, index) in userCarList">
        <img v-if="index === 0" src="../../assets/game/red-car.png" class="rcar">
        <img v-else src="../../assets/game/yellow-car.png" class="ycar">
      </div>
      <div class="purchase-btn" v-show="isDisplay" @click="funcFreeMintCar">Buy Car</div>
    </div>
    <div class="middle-info" v-show="isDisplay">
      <img src="../../assets/game/red-car.png" class="rcar-info">
      <div class="car-info"></div>
    </div>
    <div class="right-parts" v-show="isDisplay">
      <div class="parts-title">PARTS</div>
      <div class="parts-info"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { contractData } from '@/data/ContractData';
import { playerData } from '@/data/PlayerData';
import { walletData } from '@/data/WalletData';
import { GameEventBuyCar } from '@/events/GameEventBuyCar';
import { GameEventWalletAccountChanged } from '@/events/GameEventWalletAccountChanged';
import { GameEventWalletConnected } from '@/events/GameEventWalletConnected';
import { EventBus } from '@/plugins/EventBus';
import { Loading } from '@/plugins/Loading';
import { Toast } from '@/plugins/Toast';
import { onBeforeMount, onUnmounted, ref } from 'vue';
interface CarItem {
  tokenId: number;
  status: any;
  ParkingAddress: string | number;
  url: string;
  ProspectiveEarnings: number;
}
onBeforeMount(async () => {
  EventBus.instance.on(GameEventWalletConnected.eventAsync, refreshCar);
  EventBus.instance.on(GameEventBuyCar.eventAsync, onCarBought);
  EventBus.instance.on(
    GameEventWalletAccountChanged.eventAsync,
    refreshCar
  );
  if (walletData.address) {
    refreshCar();
  }
})
onUnmounted(() => {
  EventBus.instance.off(GameEventBuyCar.eventAsync, onCarBought);
  EventBus.instance.off(GameEventWalletConnected.eventAsync, refreshCar);
  EventBus.instance.off(
    GameEventWalletAccountChanged.eventAsync,
    refreshCar
  );
});
const onCarBought = async () => {
  await refreshCar();
  Toast.success(`Mint car success.`)
}

const userCarList = ref<CarItem[]>();
const refreshCar = async () => {
  const player = await playerData.getPlayerData(walletData.address);
  let cars = player
    ? player.cars.map((car: { tokenId: number; status: any; parkingTokenId: number; }) => {
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
  console.log('player cars info', await getComId(userCarList.value[0].tokenId))
  Loading.close();
};

const getComId = async (tokenId: number) => {
  return await playerData.getComponentId(tokenId);
}

const isDisplay = ref<boolean>(false);
const switchDetails = () => {
  isDisplay.value = !isDisplay.value;
}

const funcFreeMintCar = async () => {
  Loading.open();
  try {
    await contractData.carStoreContract.buyCar();
  } catch (e) {
    Loading.close();
    console.error(e);
    Toast.error("Buy car failed");
  }
};
</script>

<style scoped lang="less">
.title {
  width: 178px;
  height: 50px;
  position: fixed;
  top: 215px;
  left: 20px;
  background-color: #FFFFFF;
  color: #202739;
  font-size: 20px;
  font-weight: 700;
  line-height: 50px;
  text-align: center;
  z-index: 10;
}

.mycars {
  position: fixed;
  height: 591px;
  width: 263px;
  left: 0;
  top: 240px;
  background-color: rgba(60, 77, 97, 0.5);
  display: flex;
  gap: 80px;

  .right-btn {
    position: absolute;
    bottom: 0px;
    width: 100%;
    height: 36px;
    background-color: #1D2538;
    font-size: 30px;
    line-height: 36px;
    text-align: center;

    .right {
      height: 24px;
      width: 32px;
      margin-top: -6px;
    }

    :hover {
      cursor: pointer;
    }
  }

  .leftBtn {
    position: absolute;
    right: 5px;
    height: 100%;
    width: 35px;
    display: flex;
    align-items: center;

    .left {
      vertical-align: middle;
    }

    :hover {
      cursor: pointer;
    }
  }

  .cars-show {
    margin-top: 25px;
    width: 262px;
    height: 530px;
    margin-left: 1px;
    display: flex;
    align-items: center;
    flex-direction: column;
    flex-wrap: nowrap;
    overflow-y: hidden;

    .rcar {
      width: 240px;
      margin-top: 5px;
    }

    .ycar {
      width: 180px;
      margin-top: 30px;
    }

    .purchase-btn {
      display: block;
      margin-top: 30px;
      margin-bottom: 30px;
      width: 150px;
      height: 50px;
      font-size: 20px;
      line-height: 50px;
      color: #ffffff;
      background-color: #2687FA;
      text-align: center;

      &:hover {
        cursor: pointer;
      }
    }
  }

  .carsShowHover {
    border: 2px #ffffff solid;
    height: 620px;
    overflow-y: auto;
  }

  .middle-info {
    margin-top: 20px;
    width: 373px;
    height: 650px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .rcar-info {
      width: 100%;
    }

    .car-info {
      margin-top: 50px;
      height: 350px;
      width: 80%;
      border: 1px #000000 solid;
    }
  }

  .right-parts {
    width: 183px;
    height: 662px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .parts-title {
      margin-top: 60px;
      background-color: #FFFFFF;
      width: 115px;
      height: 50px;
      font-size: 20px;
      font-weight: 500;
      color: #202739;
      line-height: 50px;
      text-align: center;
    }

    .parts-info {
      width: 100%;
      height: 600px;
      border: 1px #FFFFFF solid;
    }
  }
}

@keyframes right {
  from {
    width: 263px;
    background-color: rgba(60, 77, 97, 0.5);
  }

  to {
    min-width: 1058px;
    width: calc(100vh - 320px);
    height: 680px;
    min-height: calc(100vh - 240px);
    background-color: #1D2538;
  }
}

.detail {
  animation-name: right;
  animation-duration: .25s;
  animation-fill-mode: forwards;
}
</style>