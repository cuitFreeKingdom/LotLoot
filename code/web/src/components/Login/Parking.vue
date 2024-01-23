<template>
  <div class="parking-page">
    <MyCars />
    <AddrList />
    <SearchBar />
    <MyGarage
      @click="showConfirm('Do you want to save this address to the address book?', 'Add it to the address book for the next visit.')" />
    <Dialog ref="confirmRef" confirmBtnText="YES" cancelBtnText="NO" @confirm="confirmMessage" @cancel="cancelMessage" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import SearchBar from "../Game/SearchBar.vue";
import MyCars from "../Game/MyCars.vue";
import AddrList from "../Game/AddrList.vue";
import MyGarage from "../Game/MyGarage.vue";
import Dialog from "../Util/Dialog.vue";

// 拿到confirm的dom
const confirmRef = ref();
// 唤起confirm
const showConfirm = (text: string, others: string) => {
  confirmRef.value.show(text, others);
};
// 点击确认按钮后的事件处理
const confirmMessage = () => {
  // confirmRef.value.hide();
};
const cancelMessage = () => {

}
</script>

<style scoped lang="less">
.parking-page {
  // margin-top: 64px;
  width: 100%;
  min-height: 100vh;
  background: url('../../assets/bg-s.png') no-repeat 0 0 fixed;
}
</style>
