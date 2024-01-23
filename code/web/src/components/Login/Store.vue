<template>
  <div class="store-page">
    <div class="category">
      <div class="all active">ALL</div>
      <div class="type">Type 1</div>
      <div class="type">Type 2</div>
    </div>
    <div class="content">
      <Part />
      <Part />
      <Part />
      <Part />
      <Part />
      <Part />
      <Part />
      <Part />
      <Part />
      <Part />
      <Part />
      <Part />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Part from '../Game/Part.vue';

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
  margin-left: 15%;
  display: flex;
  gap: 80px;
  flex-wrap: wrap;
  // border: 1px black solid;

  .car {
    height: 290px;
    width: 220px;
    background: url("../../assets/parking.jpg");
  }
}
</style>
