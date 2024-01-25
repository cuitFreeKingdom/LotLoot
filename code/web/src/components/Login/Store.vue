<template>
  <div class="store-page">
    <div class="category">
      <div class="type" v-for="(item, index) in tabData" :key="index" :class="{ active: currentTabIndex === index }"
        @click="switchTab(index)">{{ item }}
      </div>
    </div>
    <div class="all-store" v-show="currentTabIndex === 0">
      <span v-for="(grade, index1) in [2, 3, 4]" :key="index1 + 'q'">
        <span v-for="(part, index2) in [1, 2, 3]" :key="index2 + 'w'">
          <div class="part">
            <img :src="require(`../../assets/parts/grade${grade}/${part}.png`)" class="part-icon"
              @click="purchasePart(grade, part)">
            <div class="info">
              <h3 class="text-title">{{ generateTitleText(part) }}</h3>
              <p class="text-intro">{{ generateInfoText(grade, part) }}</p>
            </div>
          </div>
        </span>
      </span>
    </div>
    <div class="all-com" v-show="currentTabIndex === 1">
      <div class="part" v-for="(grade, index) in [2, 3, 4]" :key="index">
        <img :src="require(`../../assets/parts/grade${grade}/1.png`)" class="part-icon">
        <div class="info">
          <h3 class="text-title">Tire</h3>
          <p class="text-intro">{{ generateInfoText(grade, 1) }}</p>
        </div>
      </div>
    </div>
    <div class="all-com" v-show="currentTabIndex === 2">
      <div class="part" v-for="(grade, index) in [2, 3, 4]" :key="index">
        <img :src="require(`../../assets/parts/grade${grade}/2.png`)" class="part-icon">
        <div class="info">
          <h3 class="text-title">body</h3>
          <p class="text-intro">{{ generateInfoText(grade, 2) }}</p>
        </div>
      </div>
    </div>
    <div class="all-com" v-show="currentTabIndex === 3">
      <div class="part" v-for="(grade, index) in [2, 3, 4]" :key="index">
        <img :src="require(`../../assets/parts/grade${grade}/3.png`)" class="part-icon">
        <div class="info">
          <h3 class="text-title">Plate</h3>
          <p class="text-intro">{{ generateInfoText(grade, 3) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { playerData } from '@/data/PlayerData';
import { walletData } from '@/data/WalletData';
import { Loading } from '@/plugins/Loading';
import { Toast } from '@/plugins/Toast';
import { onBeforeMount, ref } from 'vue';

const tabData = ['All', 'Tire', 'Body', 'Plate'];
const currentTabIndex = ref<number>(0);
onBeforeMount(async () => {
  const res = await playerData.getPlayerComponents(walletData.address);
  console.log('player components', res)
})

const generateTitleText = (id: number): string => {
  let text = '';
  switch (id) {
    case 1:
      text += `Tire`;
      break
    case 2:
      text += `Body`;
      break
    case 3:
      text += `Plate `;
      break
  }
  return text;
}
const generateInfoText = (grade: number, id: number): string => {
  let text = '';
  switch (id) {
    case 1:
      switch (grade) {
        case 1:
          text += '100% faster';
          break;
        case 2:
          text += '300% faster';
          break;
        case 3:
          text += '500% faster';
          break;
        case 4:
          text += '800% faster';
          break;
      }
      break;
    case 2:
      switch (grade) {
        case 1:
          text += '+2 hours';
          break;
        case 2:
          text += '+3 hours';
          break;
        case 3:
          text += '+5 hours';
          break;
        case 4:
          text += '+10 hours';
          break;
      }
      break
    case 3:
      switch (grade) {
        case 1:
          text += '-10% penalty';
          break;
        case 2:
          text += '-20% penalty';
          break;
        case 3:
          text += '-30% penalty';
          break;
        case 4:
          text += '-50% penalty';
          break;
      }
      break
  }
  return text;
}

const purchasePart = async (grade: number, id: number) => {
  // console.log('buy pare', id, grade, await playerData.purchaseComponent(id, grade));
  Loading.open();
  try {
    const res = await playerData.purchaseComponent(id, grade);
    console.log('buy pare', id, grade, res);
  } catch (error) {
    console.error(error);
    Toast.error("Buy component failed");
  } finally {
    Loading.close();
  }
}

const switchTab = (index: number) => {
  currentTabIndex.value = index;
}
</script>

<style scoped lang="less">
.store-page {
  // margin-top: 64px;
  width: 100%;
  min-height: 100vh;
  height: auto;
  background: url('../../assets/bg-s.png') no-repeat 0 0 fixed;

  .category {
    position: fixed;
    left: 0px;
    top: 325px;
    width: 100px;
    height: 255px;


    .all {
      width: 100%;
      height: 50px;
      background-color: #2D3E52;
      color: #ffffff;
      font-size: 24px;
      line-height: 50px;
      text-align: center;

      &:hover {
        cursor: pointer;
      }
    }

    .type {
      width: 100%;
      height: 50px;
      background-color: #2D3E52;
      color: #ffffff;
      font-size: 24px;
      line-height: 50px;
      text-align: center;
      border-top: 1px solid #FFFFFF;

      &:hover {
        cursor: pointer;
      }

      &:first-child {
        border-top: 0px;
      }
    }

    .active {
      background-color: #2687FA;
    }
  }
}

.all-store {
  // position: absolute;
  // top: 240px;
  padding-top: 200px;
  padding-bottom: 20px;
  width: 40%;
  min-width: 642px;
  margin-left: 26%;
  display: flex;
  gap: 100px;
  flex-wrap: wrap;
  // border: 1px black solid;

  .car {
    height: 290px;
    width: 220px;
    background: url("../../assets/parking.jpg");
  }
}

.part {
  height: 214px;
  width: 104px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;

  .part-icon {
    height: 100px;
    width: 180px;

    &:hover {
      cursor: pointer;
      background-color: rgba(57, 69, 84, 0.9);
      opacity: 0.5;
    }
  }

  .info {
    border: 1px #ffffff solid;
    width: 130px;
    height: 100px;
    color: #ffffff;
    padding: 10px;

    .text-title {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 12px;
      text-align: center;
    }

    .text-intro {
      margin-bottom: 4px;
      text-align: center;
    }
  }
}

.all-com {
  padding-top: 200px;
  padding-bottom: 20px;
  width: 40%;
  min-width: 642px;
  margin-left: 26%;
  display: flex;
  gap: 100px;
  flex-wrap: wrap;
}
</style>
