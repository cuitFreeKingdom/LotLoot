<template>
  <div class="title">Carport</div>
  <div class="mycars" :class="{ detail: isDisplay }">
    <div class="right-btn" :class="{ leftBtn: isDisplay }" @click="switchDetails">
      <img :src="require('../../assets/right2.png')" class="right" v-show="!isDisplay">
      <img :src="require('../../assets/left2.png')" class="right" v-show="isDisplay">
    </div>
    <div class="cars-show" :class="{ carsShowHover: isDisplay }">
      <div v-for="(item, index) in userCarList" @click="changeCurrentPickCar(index)">
        <img v-if="index === 0"
          :src="require(`../../assets/mixed/${item.partsInfo?.body || 0}${item.partsInfo?.plate || 0}${item.partsInfo?.tire || 0}.png`)"
          class="rcar">
        <img v-else
          :src="require(`../../assets/mixed/${item.partsInfo?.body || 0}${item.partsInfo?.plate || 0}${item.partsInfo?.tire || 0}.png`)"
          class="ycar">
      </div>
      <div class="purchase-btn" v-show="isDisplay" @click="funcFreeMintCar">Buy Car</div>
    </div>
    <div class="middle-info" v-if="isDisplay">
      <img
        :src="require(`../../assets/mixed/${userCarList.length === 0 ? 0 : userCarList[currentPickCar].partsInfo?.body}${userCarList.length === 0 ? 0 : userCarList[currentPickCar].partsInfo?.plate}${userCarList.length === 0 ? 0 : userCarList[currentPickCar].partsInfo?.tire}.png`)"
        class="rcar-info">
      <div class="car-info">
        <p class="text">LLT: {{ userCarList[currentPickCar].ProspectiveEarnings }}</p>
        <p class="text">ID: {{ userCarList[currentPickCar].tokenId }}</p>
        <p class="text">Max Parking Time: {{ LEVEL_MAP[1][userCarList[currentPickCar].partsInfo?.body || 0] }}hours</p>
        <p class="text">Mining Rate: {{ LEVEL_MAP[0][userCarList[currentPickCar].partsInfo?.tire || 0] }}%</p>
        <p class="text">Tax Reliefs: {{ LEVEL_MAP[2][userCarList[currentPickCar].partsInfo?.plate || 0] }}%</p>
        <p class="text">parts && abrasion:</p>
        <div class="part-abrasion">
          <div class="part-icon-box" v-for="(item, index) in playerAllComInfo" :key="index"
            v-show="userCarList[currentPickCar].partsTokenIdList?.includes(item.tokenId)">
            <img :src="require(`../../assets/parts/grade${item.grade}/${item.id}.png`)" class="part-icon"
              @click="unLoadComponent(item)">
            <div class="abrasion">0%</div>
          </div>
        </div>
      </div>
    </div>
    <div class="right-parts" v-show="isDisplay">
      <div class="parts-title">PARTS</div>
      <div class="parts-info">

        <div class="component-item" v-for="(item, index) in componentList" :key="index">
          <div class="top">
            <div class="top-left">
              <img :src="require(`../../assets/parts/grade${item.grade}/${item.id}.png`)" class="component-icon">
            </div>
            <div class="top-right">
              <div class="install-btn" @click="loadComponent(item)">install</div>
              <div class="breakdown-btn" @click="sellComponent(item)">sell</div>
            </div>
          </div>
          <div class="bottom">
            <p class="bt-text">abrasion: 0%</p>
            <p class="bt-text">{{ generateInfoText(item) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CONTRACT_ADDRESS_MUMBAI } from '@/const/Contracts';
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
  partsTokenIdList?: number[];
  partsInfo?: CarComInfo;
}
const LEVEL_MAP = [
  [100, 300, 500, 800],
  [2, 3, 5, 10],
  [10, 20, 30, 50]
];

const generateInfoText = (item: PlayerComponent): string => {
  let text = '';
  switch (item.id) {
    case 1:
      switch (item.grade) {
        case 1:
          text += 'mining rate: 100% faster';
          break;
        case 2:
          text += 'mining rate: 300% faster';
          break;
        case 3:
          text += 'mining rate: 500% faster';
          break;
        case 4:
          text += 'mining rate: 800% faster';
          break;
      }
      break;
    case 2:
      switch (item.grade) {
        case 1:
          text += 'max parking time: +2 hours';
          break;
        case 2:
          text += 'max parking time: +3 hours';
          break;
        case 3:
          text += 'max parking time: +5 hours';
          break;
        case 4:
          text += 'max parking time: +10 hours';
          break;
      }
      break
    case 3:
      switch (item.grade) {
        case 1:
          text += 'tax reliefs: -10% penalty';
          break;
        case 2:
          text += 'tax reliefs: -20% penalty';
          break;
        case 3:
          text += 'tax reliefs: -30% penalty';
          break;
        case 4:
          text += 'tax reliefs: -50% penalty';
          break;
      }
      break
  }
  return text;
}

const currentPickCar = ref<number>(0);
const changeCurrentPickCar = (index: number) => {
  currentPickCar.value = index;
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

const userCarList = ref<CarItem[]>([]);
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
        ProspectiveEarnings: 999
      };
    })
    : [];
  //@ts-ignore
  userCarList.value = cars;

  // 获取所有车辆的tokenId数组
  const resArr = await showCarInfo();
  // 将每辆车的TokenId数组转化成对应的组件的类别和等级
  let promiseComArr = [];
  for (let i = 0; i < cars.length; i++) {
    promiseComArr.push(getAllCom(resArr[i]))
  }
  const allComList = await Promise.all(promiseComArr);
  cars.map((e, i) => {
    return Object.assign(e, { partsTokenIdList: resArr[i] }, { partsInfo: allComList[i] })
  });
  userCarList.value = cars;
  // 获取用户所拥有的所有组件
  await getPlayerComponents();
  console.log('player all car info:', userCarList.value)

  // init
  const playerAllComponentTokenid: number[] = [];
  componentList.value.forEach(e => {
    playerAllComponentTokenid.push(e.tokenId)
  });
  userCarList.value.forEach(e => {
    e.partsTokenIdList?.forEach(q => {
      playerAllComponentTokenid.push(q)
    });
  });
  console.log('player all tokenid', playerAllComponentTokenid);
  playerAllComInfo.value = await allTokenId2Info(playerAllComponentTokenid);
  Loading.close();
};
const playerAllComInfo = ref<PlayerComponent[]>([])
const allTokenId2Info = async (arr: number[]) => {
  let promiseIdArr = [];
  let promiseGradeArr = [];
  for (let i = 0; i < arr.length; i++) {
    promiseIdArr.push(contractData.componentStoreContract.getComId(arr[i]));
    promiseGradeArr.push(contractData.componentStoreContract.getGrade(arr[i]));
  }
  const idList: number[] = await Promise.all(promiseIdArr);
  const gradeList: number[] = await Promise.all(promiseGradeArr);
  const comList: PlayerComponent[] = [];
  for (let i = 0; i < arr.length; i++) {
    comList.push({
      id: idList[i],
      grade: gradeList[i],
      tokenId: arr[i]
    });
  }
  return comList;
}

interface PlayerComponent {
  id: number,
  grade: number,
  tokenId: number,
}
const componentList = ref<PlayerComponent[]>([]);
const getPlayerComponents = async () => {
  let promiseIdArr = [];
  let promiseGradeArr = [];
  const tokenIdArr: number[] = await contractData.componentContract.getPlayerComponent(walletData.address);
  for (let i = 0; i < tokenIdArr.length; i++) {
    promiseIdArr.push(contractData.componentStoreContract.getComId(tokenIdArr[i]));
    promiseGradeArr.push(contractData.componentStoreContract.getGrade(tokenIdArr[i]));
  }
  const idList: number[] = await Promise.all(promiseIdArr);
  const gradeList: number[] = await Promise.all(promiseGradeArr);

  const comList: PlayerComponent[] = [];
  for (let i = 0; i < tokenIdArr.length; i++) {
    comList.push({
      id: idList[i],
      grade: gradeList[i],
      tokenId: tokenIdArr[i]
    });
  }
  componentList.value = comList;
  console.log('player component list', componentList.value);
}

const showCarInfo = async (): Promise<Array<number[]>> => {
  const userCL = userCarList.value;
  let carAddrList: string[] = [];
  let tokenIdList: Array<number[]> = [];
  const promiseArr = [];
  const promiseIdArr = [];
  for (let i = 0; i < userCL.length; i++) {
    promiseArr.push(contractData.registry6551Contract.account(userCL[i].tokenId, CONTRACT_ADDRESS_MUMBAI.CarERC721));
  }
  carAddrList = await Promise.all(promiseArr);
  for (let i = 0; i < carAddrList.length; i++) {
    promiseIdArr.push(contractData.componentContract.getPlayerComponent(carAddrList[i]));
  }
  tokenIdList = await Promise.all(promiseIdArr);
  // console.log('car 6551s', carAddrList, tokenIdList);
  return tokenIdList;
}

interface CarComInfo {
  tire: number,
  body: number,
  plate: number,
}
// 对tokenIdArr进行处理，获取到每辆车上的所有组件的类别和品阶
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

const sellComponent = async (item: PlayerComponent) => {
  try {
    Loading.open();
    await contractData.componentStoreContract.sell(item.tokenId);
  } catch (error) {
    console.error(error);
  } finally {
    Loading.close();
  }
}

const loadComponent = async (item: PlayerComponent) => {
  try {
    Loading.open();
    await contractData.lotLootContract.load(userCarList.value[currentPickCar.value].tokenId, item.tokenId);
  } catch (error) {
    console.error(error);
  } finally {
    Loading.close();
  }
}

const unLoadComponent = async (item: PlayerComponent) => {
  try {
    Loading.open();
    await contractData.lotLootContract.unload(userCarList.value[currentPickCar.value].tokenId, item.tokenId);
  } catch (error) {
    console.error(error);
  } finally {
    Loading.close();
  }
}

// const getAbrision = aysnc ()=> {
//   await contractData.lotLootContract.getCurrentAbrasion()
// }
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
  gap: 50px;
  z-index: 5;

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
      height: 126px;
      margin-top: 5px;
    }

    .ycar {
      width: 180px;
      height: 94px;
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
    width: 380px;
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
      border: 2px #000000 solid;

      .text {
        margin: 12px 0px 0px 16px;
        color: #FFFFFF;
        font-size: 20px;
      }

      .part-abrasion {
        width: 88%;
        height: 120px;
        margin-top: 10px;
        margin-left: 6%;
        border: 1px solid rgba(217, 217, 217, 0.3);
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        overflow: auto;
        gap: 5px;
        // background-color: pink;

        .part-icon-box {
          margin: 5px 0px 0px 3px;
          height: 70px;
          width: 120px;
          display: flex;
          flex-direction: column;
          justify-content: center;

          .part-icon {
            width: 110px;
            height: 60px;

            &:hover {
              cursor: pointer;
              background-color: rgba(57, 69, 84, 0.9);
            }
          }

          .abrasion {
            font-size: 10px;
            text-align: center;
            color: #FFFFFF;
            font-weight: 600;
          }
        }
      }
    }
  }

  .right-parts {
    width: 235px;
    height: 662px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .parts-title {
      margin-top: 60px;
      background-color: #FFFFFF;
      width: 125px;
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
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex-wrap: nowrap;
      overflow-y: auto;

      .component-item {
        height: 130px;
        width: 100%;
        background-color: rgb(45, 57, 76);

        .top {
          height: 80px;
          display: flex;
          flex-direction: row;

          .top-left {
            width: 150px;

            .component-icon {
              height: 100%;
              width: 100%;
            }
          }

          .top-right {
            // margin-left: 5px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 10px;

            .install-btn {
              height: 25px;
              width: 80px;
              font-size: 12px;
              color: #FFFFFF;
              line-height: 25px;
              font-weight: 600;
              text-align: center;
              background-color: rgb(37, 132, 245);
              border-radius: 2px;

              &:hover {
                cursor: pointer;
              }
            }

            .breakdown-btn {
              height: 25px;
              width: 80px;
              font-size: 12px;
              color: #FFFFFF;
              line-height: 20px;
              font-weight: 600;
              text-align: center;
              background-color: rgb(233, 207, 39);
              border-radius: 2px;

              &:hover {
                cursor: pointer;
              }
            }
          }
        }

        .bottom {
          border-top: 2px solid #ffffff;
          padding-top: 6px;
          height: 50px;
          width: 100%;

          .bt-text {
            margin-bottom: 4px;
            margin-left: 8px;
            color: #FFFFFF;
            font-size: 14px;
          }
        }
      }
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

*::-webkit-scrollbar {
  width: 10px;
  height: 9px;
}

//滚动条的轨道的两端按钮 此处隐藏
*::-webkit-scrollbar-button {
  width: 0px;
  height: 0px;
  display: none;
}

//边角，即垂直滚动条和水平滚动条相交的地方
*::-webkit-scrollbar-corner {
  background-color: transparent;
}

//
*::-webkit-scrollbar-thumb {
  border: 3px solid rgba(244, 207, 152, 0);
  border-style: dashed;
  border-radius: 4px;
  background-clip: padding-box;
  background-color: rgba(45, 57, 76, 0.40);
  cursor: pointer;
}

//滚动条里面的小方块，能向上向下移动(或向左向右移动) 指上去的时候显示border和改变颜色造成视觉上的加粗变色
*::-webkit-scrollbar-thumb:hover {
  border: 2px solid rgba(45, 57, 76, 0.7);
  background-color: rgba(45, 57, 76, 0.70);
}
</style>