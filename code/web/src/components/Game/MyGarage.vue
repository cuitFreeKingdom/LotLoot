<template>
  <div class="garage">
    <div class="car"></div>
    <div class="car"></div>
    <div class="car"></div>
    <div class="car"></div>
    <div class="car"></div>
  </div>
</template>

<script lang="ts" setup>


</script>

<style scoped lang="less">
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

    &:hover {
      cursor: pointer;
    }
  }
}
</style>
