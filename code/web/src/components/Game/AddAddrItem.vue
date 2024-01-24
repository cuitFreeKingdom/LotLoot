<template>
  <div class="address-item">
    <input class="edit-note" type="text" v-model="noteText" placeholder="input notes" />
    <input class="edit-addr" type="text" v-model="addrText" placeholder="input address">
    <div class="operation-btn">
      <img src="../../assets/false-icon.png" class="btn" @click="cancleAdd">
      <img src="../../assets/true-icon.png" class="btn" @click="confirmAdd">
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const emit = defineEmits(['cancle', 'confirm']);

const noteText = ref<string>('');
const addrText = ref<string>('');
const cancleAdd = () => {
  emit('cancle');
}
const confirmAdd = () => {
  emit('confirm', addrText.value, noteText.value);
}
</script>

<style scoped lang="less">
input,
button,
select,
textarea {
  background: none;
  outline: none;
  -webkit-appearance: none;
  border-radius: 0;
  box-shadow: none;
  border: none;
}

.address-item {
  width: 100%;
  height: 70px;
  border-top: 1px solid #FFFFFF;
  background-color: #FF4F80;
  display: flex;
  flex-direction: column;
  align-items: center;

  .name {
    font-size: 14px;
    line-height: 25px;
    text-shadow: 0 0 .5px #202739;
    color: #464F65;
    text-align: center;
    margin-bottom: 0px;

    &:hover {
      cursor: pointer;
    }
  }

  .address {
    font-size: 12px;
    line-height: 15px;
    color: #464F65;
    text-align: center;
    margin-bottom: 0px;
  }

  .edit-note {
    color: #757E8B;
    outline: none;
    font-size: 12px;
    line-height: 12px;
    width: 50%;
    margin-top: 4px;
    padding-bottom: 3px;
    border-bottom: 1px #757E8B solid;
    text-align: center;
    overflow: hidden;
  }

  .edit-addr {
    color: #757E8B;
    outline: none;
    font-size: 12px;
    line-height: 12px;
    width: 50%;
    margin-top: 4px;
    padding-bottom: 3px;
    border-bottom: 1px #757E8B solid;
    text-align: center;
    overflow: hidden;
  }

  .operation-btn {
    margin-top: 5px;
    height: 24px;
    display: flex;
    justify-content: center;
    gap: 50px;
    color: #FFFFFF;

    .btn {
      width: 15px;
      height: 15px;
    }

    &:hover {
      cursor: pointer;
    }
  }
}
</style>