<template>
  <div class="search-bar">
    <a-input-search size="large" enter-button @search="funcOnSearch" allowClear v-model:value="searchValue"
      placeholder="Input your friend's wallet address" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { GameEventGoFriendHome } from "../../events/GameEventGoFriendHome";
import { EventBus } from "../../plugins/EventBus";
import { walletData } from "../../data/WalletData";
import { GO_HOME, REG_ETH_ADDRESS } from "../../const/Constants";
import { Toast } from "../../plugins/Toast";
import { StringUtil } from "../../core/utils/StringUtil";
import { getFriendList, addFriend } from '@/request/addressBook'
import { Loading } from "@/plugins/Loading";

const emit = defineEmits(['search', 'reset'])

const searchValue = ref<string>('');
const funcOnSearch = async () => {
  try {
    Loading.open();
    let inputValue = "";
    if (StringUtil.isEmpty(searchValue.value)) {
      inputValue = "0xc8a715389d408A5392A379B5f2dc8DE72154a1aC";
    }
    if (!walletData.isAuth) {
      Toast.warn("SignIn first");
      return;
    }
    if (StringUtil.isEmpty(inputValue)) {
      inputValue = searchValue.value.trim();
    }

    if (!REG_ETH_ADDRESS.test(inputValue)) {
      Toast.warn("It's not an address");
      emit('reset');
      return;
    }

    if (inputValue === walletData.address) {
      Toast.warn(`It's your address.`);
      emit('reset');
      return;
    }

    emit('search', inputValue);

    const playerAddressBook: any[] = (await getFriendList(walletData.address)).data;
    if (!playerAddressBook.some(e => e.address === inputValue)) {
      const res = await addFriend({
        address: walletData.address,
        friendAddress: inputValue,
        notes: ''
      });
      // EventBus.instance.emit(GameEventGoFriendHome.event, inputValue);
      // @ts-ignore
      if (res.code === '200') {
        Toast.success(`Add friend success`);
        return;
      }
    }
  } catch (error) {
    console.error(error);
    Loading.close();
  }

};
</script>

<style scoped lang="less">
.search-bar {
  position: fixed;
  top: 168px;
  left: 25%;
  width: 50%;
}
</style>
