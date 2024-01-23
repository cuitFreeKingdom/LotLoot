<template>
  <div class="welcome3">
    <div class="left wow lightSpeedInLeft" data-wow-duration="1s">
      <div class="content">
        <p class="head">Explore Our NFT Collection</p>
        <p class="text">Invest in our unique NFTs crafted by talented artists. Discover our Opensea gallery and buy into
          the Web3 revolution. Each NFT is a gateway to a world where art and innovation come together, with ownership
          transparently secured on the blockchain. Explore, acquire, and be part of the future of digital art.</p>

      </div>
      <div class="play-btn">Explore On Opensea →</div>
    </div>
    <div class="right wow fadeIn" data-wow-duration="1.5s" data-wow-delay="0.5s">
      <img class="logo" :src="require('../assets/cyber-car.png')">
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";

export default defineComponent({
  name: "WelcomeFirst",
  setup() {
  }
})
</script>

<style scoped lang="less">
.welcome3 {
  display: flex;
  width: 100%;
  height: calc(100vh - 64px);
  min-height: 880px;
  gap: 10px;
  justify-content: center;

  .left {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;
    width: 645px;

    .content {
      .head {
        font-family: Copperplate, Papyrus, fantasy;
        font-size: 84px;
        font-weight: 700;
        line-height: 116.06px;
        color: #FFFFFF;
        text-align: left;
        margin: 48px 0px 24px 0px;
      }

      .text {
        font-size: 32px;
        line-height: 38px;
        color: #A7A9BE;
        text-align: center;
        letter-spacing: 0.75px;
        word-spacing: 1.5px;
        margin-bottom: 56px;
      }


    }

    .play-btn {
      width: 300px;
      height: 50px;
      border-radius: 15px;
      background-color: #FFFFFF;
      color: #000000;
      text-align: center;
      padding-top: 12px;
      font-size: 20px;
      line-height: 24px;
      font-weight: 600;

      &:hover {
        cursor: pointer;
      }
    }
  }

  .right {
    width: 455px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    margin-top: 280px;

    .logo {
      width: 92%;
    }
  }
}
</style>