<template>
  <div class="part">
    <img :src="require('../../assets/car-part.png')" class="part-icon">
    <div class="info"></div>
  </div>
</template>

<style scoped lang="less">
.part {
  height: 214px;
  width: 104px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .part-icon {
    height: 100px;
    width: 100px;
  }

  .info {
    border: 1px #ffffff solid;
    width: 100px;
    height: 100px;
  }
}
</style>