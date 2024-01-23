<template>
  <div class="title">Carport</div>
  <div class="mycars" :class="{ detail: isDisplay }">
    <div class="right-btn" :class="{ leftBtn: isDisplay }" @click="switchDetails">
      <img :src="require('../../assets/right2.png')" class="right" v-show="!isDisplay">
      <img :src="require('../../assets/left2.png')" class="right" v-show="isDisplay">
    </div>
    <div class="cars-show" :class="{ carsShowHover: isDisplay }">
      <img src="../../assets/game/red-car.png" class="rcar">
      <img src="../../assets/game/yellow-car.png" class="ycar">
      <img src="../../assets/game/yellow-car.png" class="ycar">
      <div class="purchase-btn ripple" v-show="isDisplay">Buy Car</div>
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
import { ref } from 'vue';

const isDisplay = ref<boolean>(false);
const switchDetails = () => {
  isDisplay.value = !isDisplay.value;
}
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
    flex-wrap: wrap;


    .rcar {
      width: 240px;
      margin-top: 5px;
    }

    .ycar {
      width: 180px;
      margin-top: 30px;
    }

    .purchase-btn {
      margin-top: 30px;
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
    height: 630px;
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

.ripple {
  position: relative;
  //隐藏溢出的径向渐变背景
  overflow: hidden;
}

.ripple:after {
  content: "";
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  //设置径向渐变
  background-image: radial-gradient(circle, #666 10%, transparent 10.01%);
  background-repeat: no-repeat;
  background-position: 50%;
  transform: scale(10, 10);
  opacity: 0;
  transition: transform .3s, opacity .5s;
}

.ripple:active:after {
  transform: scale(0, 0);
  opacity: .3;
  //设置初始状态
  transition: 0s;
}
</style>