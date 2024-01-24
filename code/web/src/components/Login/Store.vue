<template>
  <div class="store-page">
    <div class="category">
      <div class="all active">ALL</div>
      <div class="type">Type 1</div>
      <div class="type">Type 2</div>
    </div>
    <div class="content">
      <span v-for="(grade, index1) in [1, 2, 3, 4]" :key="index1 + 'q'">
        <span v-for="(part, index2) in [1, 2, 3]" :key="index2 + 'w'">
          <div class="part">
            <img :src="require(`../../assets/parts/grade${grade}/${part}.png`)" class="part-icon"
              @click="purchasePart(grade, part)">
            <div class="info">{{ generateInfoText(grade, part) }}</div>
          </div>
        </span>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { playerData } from '@/data/PlayerData';
import { walletData } from '@/data/WalletData';
import { Loading } from '@/plugins/Loading';
import { Toast } from '@/plugins/Toast';
import { onBeforeMount } from 'vue';


onBeforeMount(async () => {
  const res = await playerData.getPlayerComponents(walletData.address);
  console.log('player components', res)
})

const generateInfoText = (grade: number, id: number): string => {
  let text = '';
  switch (id) {
    case 1:
      text += `Tire: `;
      break;
    case 2:
      text += `Body: `;
      break;
    case 3:
      text += `Plate: `;
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
    }

    .active {
      background-color: #2687FA;
    }
  }
}

.content {
  // position: absolute;
  // top: 240px;
  padding-top: 200px;
  padding-bottom: 20px;
  width: 60%;
  min-width: 842px;
  margin-left: 20%;
  display: flex;
  gap: 100px;
  flex-wrap: wrap;
  // border: 1px black solid;

  .car {
    height: 290px;
    width: 220px;
    background: url("../../assets/parking.jpg");
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
      width: 100px;
      height: 100px;
      color: #ffffff;
      padding: 10px;
    }
  }
}
</style>
