<template>
  <div class="home-page">
    <div class="garage">
      <div class="car"></div>
      <div class="car"></div>
      <div class="car"></div>
      <div class="car"></div>
      <div class="car"></div>
      <div class="add-car"><img :src="require('../../assets/adddto.png')" class="add-png"></div>
    </div>

    <MyCars />
  </div>
</template>

<script lang="ts" setup>
import MyCars from "../Game/MyCars.vue";
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
