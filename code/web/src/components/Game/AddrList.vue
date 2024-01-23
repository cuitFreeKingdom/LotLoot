<template>
  <div class="address-list" @click="switchDisplay">
    <img :src="require('../../assets/address-book.png')" />
    <div class="address-text">Address Book</div>
    <img :src="require('../../assets/down2.png')" class="down-icon" v-show="!isDisplay" />
    <img :src="require('../../assets/up2.png')" class="down-icon" v-show="isDisplay" />
  </div>
  <div class="address-detail" :class="{ addressDetail: isDisplay }">
    <AddrItem v-show="isDisplay" />
    <AddrItem v-show="isDisplay" />
    <AddrItem v-show="isDisplay" />
    <AddrItem v-show="isDisplay" />
    <AddrItem v-show="isDisplay" />
    <AddrItem v-show="isDisplay" />
    <AddAddrItem v-show="isDisplay" />
    <div class="add-item" v-show="isDisplay">
      <div class="add-item-btn">Add</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import AddrItem from './AddrItem.vue';
import AddAddrItem from './AddAddrItem.vue';

const isDisplay = ref<boolean>(false);

const switchDisplay = () => {
  isDisplay.value = !isDisplay.value;
}
</script>

<style scoped lang="less">
.address-list {
  position: fixed;
  top: 230px;
  right: 20px;
  width: 280px;
  height: 32px;
  background-color: #2687FA;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 10px 0px 10px;

  .address-text {
    color: #ffffff;
    font-size: 17px;
    line-height: 32px;
    letter-spacing: 0em;
    text-align: left;
    font-weight: 600;
  }

  .down-icon {
    width: 24px;
    height: 24px;

  }

  :hover {
    cursor: pointer;
  }
}

.address-detail {
  background-color: #ffffff;
  width: 280px;
  position: fixed;
  top: 263px;
  right: 20px;
  overflow-y: auto;

  .add-item {
    margin-top: 12px;
    margin-bottom: 4px;
    width: 100%;
    display: flex;
    justify-content: center;

    .add-item-btn {
      height: 24px;
      width: 60px;
      border-radius: 5px;
      font-size: 14px;
      line-height: 24px;
      letter-spacing: 0.5px;
      font-weight: 500;
      color: #FFFFFF;
      background-color: #2687FA;
      text-align: center;

      &:hover {
        cursor: pointer;
      }
    }
  }
}

@keyframes show-addr {
  from {
    height: 0px;
  }

  to {
    height: 320px;
  }
}

.addressDetail {
  animation-name: show-addr;
  animation-duration: .5s;
  animation-fill-mode: forwards;
}
</style>