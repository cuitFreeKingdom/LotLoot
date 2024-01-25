<template>
  <div class="address-list" @click="switchDisplay">
    <img :src="require('../../assets/address-book.png')" />
    <div class="address-text">Address Book</div>
    <img :src="require('../../assets/down2.png')" class="down-icon" v-show="!isDisplay" />
    <img :src="require('../../assets/up2.png')" class="down-icon" v-show="isDisplay" />
  </div>
  <div class="address-detail" :class="{ addressDetail: isDisplay }">
    <AddrItem v-show="isDisplay" v-for="(item, index) in addrItemList" :key="index" :address="item.address"
      :notes="item.notes || '秋名山车神'" @delete="deleteItem(item)" @refresh="refreshList" />
    <AddAddrItem v-show="isDisplay && isAddItemDisplay" @cancle="cancleAddItem" @confirm="confirmAddItem" />
    <div class="add-item" v-show="isDisplay">
      <div class="add-item-btn" @click="addAddressItem">Add</div>
    </div>
  </div>
  <Dialog ref="confirmRef" confirmBtnText="YES" cancelBtnText="NO" @confirm="confirmMessage" @cancel="cancelMessage" />
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import { getFriendList, deleteFriend, addFriend } from '@/request/addressBook';
import { walletData } from '@/data/WalletData';
import { Toast } from '@/plugins/Toast';
import { StringUtil } from '@/core/utils/StringUtil';
import AddrItem from './AddrItem.vue';
import AddAddrItem from './AddAddrItem.vue';
import Dialog from '../Util/Dialog.vue';
import { REG_ETH_ADDRESS } from '@/const/Constants';

interface AddrItem {
  address: string,
  bindTwitter: boolean,
  notes: string,
  screenName: string,
  userId: number
};
const addrItemList = ref<AddrItem[]>();
onBeforeMount(async () => {
  await refreshList()
});
const refreshList = async () => {
  const res = await getFriendList(walletData.address);
  // @ts-ignore
  if (res.code === '200') {
    addrItemList.value = res.data;
  }
}

const deleteData = ref<AddrItem>();
const deleteItem = async (item: AddrItem) => {
  showConfirm('Do you want to delete this address from your address book?', 'This operation is irreversible!');
  deleteData.value = item;
}
// 点击确认按钮后的事件处理
const confirmMessage = async () => {
  const item = deleteData.value as AddrItem;
  const res = await deleteFriend({
    address: walletData.address,
    friendAddress: item.address
  });
  // @ts-ignore
  if (res.code === '200') {
    await refreshList();
    Toast.success(`delete address '${StringUtil.getAddressSnapshot(item.address)}' success!`);
  }
  console.log("delete", res.data, addrItemList)
};

const cancelMessage = () => {
  Toast.warn(`have canceled operation!`)
}
// 拿到confirm的dom
const confirmRef = ref();
// 唤起confirm
const showConfirm = (text: string, others: string) => {
  confirmRef.value.show(text, others);
};

const isDisplay = ref<boolean>(false);
const switchDisplay = async () => {
  if (!isDisplay.value) {
    await refreshList();
  }
  isDisplay.value = !isDisplay.value;
}

const isAddItemDisplay = ref<boolean>(false);
const addAddressItem = () => {
  isAddItemDisplay.value = true;
}
const cancleAddItem = () => {
  isAddItemDisplay.value = false;
}
const confirmAddItem = async (addr: string, notes: string) => {
  console.log('aaa', addr, notes)
  if (StringUtil.isEmpty(addr)) {
    Toast.warn("Please input the address!")
    return;
  }
  if (!walletData.isAuth) {
    Toast.warn("SignIn first.");
    return;
  }
  if (!REG_ETH_ADDRESS.test(addr)) {
    Toast.warn("It's not an address!");
    return;
  }
  if (addr === walletData.address) {
    Toast.warn(`It's your address.`);
    return;
  }

  const playerAddressBook: any[] = (await getFriendList(walletData.address)).data;
  let flag = 0;
  for (let i = 0; i < playerAddressBook.length; i++) {
    if (playerAddressBook[i].address === addr) {
      flag++;
    }
  }
  if (flag === 0) {
    const res = await addFriend({
      address: walletData.address,
      friendAddress: addr,
      notes: notes
    });
    // @ts-ignore
    if (res.code === '200') {
      isAddItemDisplay.value = false;
      await refreshList();
      Toast.success(`Add friend success!`);
      return;
    }
  } else {
    Toast.warn("You have added this address!")
  }
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
  z-index: 2;

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
  z-index: 2;

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