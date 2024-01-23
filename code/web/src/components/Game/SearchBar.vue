<template>
  <div class="search-bar">
    <a-input-search size="large" enter-button @search="funcOnSearch" allowClear v-model:value="searchValue"
      placeholder="Input your friend's wallet address" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { GameEventGoFriendHome } from "../../events/GameEventGoFriendHome";
import { EventBus } from "../../plugins/EventBus";
import { walletData } from "../../data/WalletData";
import { GO_HOME, REG_ETH_ADDRESS } from "../../const/Constants";
import { Toast } from "../../plugins/Toast";
import { StringUtil } from "../../core/utils/StringUtil";

export default defineComponent({
  name: "SearchBar",

  emits: ["query-and-submit"],

  setup() {
    const searchValue = ref();

    const funcOnSearch = async () => {
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
        return;
      }

      if (inputValue === walletData.address) {
        Toast.warn(`It's your address.`);
        return;
      }

      EventBus.instance.emit(GameEventGoFriendHome.event, inputValue);
    };

    return {
      searchValue,
      funcOnSearch,
    };
  },
});
</script>

<style scoped lang="less">
.search-bar {
  position: fixed;
  top: 168px;
  left: 25%;
  width: 50%;
}
</style>
