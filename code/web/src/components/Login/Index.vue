<template>
  <Header />
  <!-- <TabSwitch />
    <SearchBar />
    <ParkingList />
    <CarList /> -->
  <TabSwitch />
  <router-view />
  <NavigationBar />
  <ModalConfirm />
  <Loading />
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onBeforeMount,
  onUnmounted,
  onMounted,
} from "vue";
import Header from "../Header.vue";
import ParkingList from "../ParkingList.vue";
import CarList from "../CarList.vue";
import TabSwitch from "../Util/TabSwitch.vue"
import ModalConfirm from "../ModalConfirm.vue";
import Loading from "../Loading.vue";
import NavigationBar from "../Util/NavigationBar.vue";

import { walletData } from "../../data/WalletData";
import { EventBus } from "../../plugins/EventBus";
import { GameEventWalletDisconnect } from "../../events/GameEventWalletDisconnect";
import { GameEventWalletConnected } from "../../events/GameEventWalletConnected";
import { GameEventWalletAccountChanged } from "../../events/GameEventWalletAccountChanged";

export default defineComponent({
  name: "LoginIndex",

  components: { ParkingList, CarList, TabSwitch, Header, ModalConfirm, Loading, NavigationBar },
  setup() {
    const isLogin = ref(walletData.isAuth);

    onBeforeMount(() => {
      EventBus.instance.on(GameEventWalletConnected.eventAsync, onSignIn);
      EventBus.instance.on(GameEventWalletDisconnect.eventAsync, onSignOut);
      EventBus.instance.on(
        GameEventWalletAccountChanged.eventAsync,
        onAccountChanged
      );
    });

    onMounted(() => {

      if (isLogin.value) {
        EventBus.instance.emit(
          GameEventWalletConnected.event,
          walletData.address
        );
      }
    });

    onUnmounted(() => {
      EventBus.instance.off(GameEventWalletConnected.eventAsync, onSignIn);
      EventBus.instance.off(GameEventWalletDisconnect.eventAsync, onSignOut);
      EventBus.instance.off(
        GameEventWalletAccountChanged.eventAsync,
        onAccountChanged
      );
    });

    const onSignIn = async () => {
      isLogin.value = true;
    };

    const onSignOut = () => {
      isLogin.value = false;
    };

    const onAccountChanged = () => {
    };

    return {
      isLogin,
    };
  },
});
</script>

<style scoped lang="less"></style>
