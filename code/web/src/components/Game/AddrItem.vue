<template>
  <div class="address-item" :class="{ addressItemDetail: isDisplay }">
    <p class="name" @click="swithcDisplay" v-show="!isEdit">{{ props.notes }}</p>
    <input class="edit-note" v-show="isEdit" type="text" v-model="editNotes" placeholder="edit notes" />
    <p class="address" v-show="isDisplay">{{ getAddressSnapshot(props.address) }}</p>
    <!-- <input class="edit-addr" v-show="isEdit" type="text" :value="editAddress"> -->
    <div class="operation-btn" v-show="isDisplay">
      <div class="btn ripple" @click="copyAddrItem">copy</div>
      <div class="btn ripple" @click="switchEdit">edit</div>
      <div class="btn ripple" @click="deleteItem">delete</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { StringUtil } from '@/core/utils/StringUtil';
import { updateFriendNotes } from '@/request/addressBook';
import { walletData } from '@/data/WalletData';
import { Toast } from '@/plugins/Toast';
import copy from 'copy-to-clipboard';

interface Props {
  notes: string,
  address: string,
};
const props = withDefaults(defineProps<Props>(), {
  notes: '秋名山车神',
  address: '0xc8a715389d408A......'
});
const emit = defineEmits<{
  (e: 'delete'): void,
  (e: 'edit'): void,
  (e: 'refresh'): void,
}>();
const getAddressSnapshot = (str: string) => {
  if (!StringUtil.isEmpty(str)) {
    return StringUtil.getAddressSnapshot(str);
  }
  return '0xc8a715389d408A......';
}

const editNotes = ref<string>("");
// const editAddress = ref<string>(props.address);

const deleteItem = () => {
  emit('delete');
}

const isDisplay = ref<boolean>(false);
const swithcDisplay = () => {
  isDisplay.value = !isDisplay.value;
}

const isEdit = ref<boolean>(false);
const switchEdit = async () => {
  isEdit.value = !isEdit.value;
  if (!isEdit.value) {
    if (StringUtil.isEmpty(editNotes.value)) {
      Toast.warn('Notes cannot be empty!')
      return;
    }
    const res = await updateFriendNotes({
      address: walletData.address,
      friendAddress: props.address,
      notes: editNotes.value
    });
    // @ts-ignore
    if (res.code === '200' && res.data) {
      emit('refresh');
      Toast.success("Edit notes success.");
    } else {
      Toast.error("Edit notes error!");
    }
  }
}

const copyAddrItem = () => {
  copy(props.address);
  Toast.success('Copied to clipboard!')
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
  height: 26px;
  border-top: 1px solid #FFFFFF;
  background-color: #FFB1BF;
  display: flex;
  flex-direction: column;
  align-items: center;

  .name {
    width: 100%;
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
    margin-top: 2px;
    height: 24px;
    display: flex;
    justify-content: center;
    gap: 30px;
    color: #FFFFFF;

    .btn {
      font-size: 18px;
      line-height: 24px;
    }

    &:hover {
      cursor: pointer;
    }
  }
}

.addressItemDetail {
  height: 70px;
  background-color: #FF4F80;
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