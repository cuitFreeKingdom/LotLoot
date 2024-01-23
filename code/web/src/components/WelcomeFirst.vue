<template>
  <div class="box animate__animated animate__bounceInDown animate__delay-0.5s animate__slow">
    <img class="logo" :src="require('../assets/erc20_llt.jpg')" />
  </div>
  <div class="welcome">

    <div class="left wow slideInLeft" data-wow-duration="1s">
      <div class="content">
        <p class="head">Welcome to LotLoot!</p>
        <p class="text">LotLoot is a classic parking space grabbing game that combines the dual attributes of SocialFi and
          GameFi. Players can log in through social accounts, own multiple cars and 5 parking spaces, and interact with
          other players to earn token revenue.</p>

      </div>
      <div class="play-btn" @click="connectWallet">play</div>
    </div>
    <div class="right wow slideInRight" data-wow-duration="1s">
      <img class="logo" :src="require('../assets/Union.png')">
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeMount, onUnmounted, onMounted } from "vue";
import { StringUtil } from "../core/utils/StringUtil";
import { EventBus } from "../plugins/EventBus";
import { GameEventWalletConnected } from "../events/GameEventWalletConnected";
import { GameEventWalletDisconnect } from "../events/GameEventWalletDisconnect";
import { GameEventWalletChainChanged } from "../events/GameEventWalletChainChanged";
import { ChainID } from "../const/enum/Chain";
import { walletData } from "../data/WalletData";
import { Toast } from "../plugins/Toast";
import { GameEventWalletAccountChanged } from "../events/GameEventWalletAccountChanged";
import IconSvg from "../components/IconSvg.vue";
import { contractData } from "../data/ContractData";
import { playerData } from "../data/PlayerData";
import { ethers } from "ethers";
import { DialogModal } from "../plugins/DialogModal";
import WOW from "wow.js";
import { useRouter } from 'vue-router';

export default defineComponent({
  name: "WelcomeFirst",
  components: { IconSvg },
  setup() {
    const router = useRouter();
    onMounted(() => {
      // import wow.js
      var wow = new WOW({
        boxClass: "wow", // animated element css class (default is wow)
        animateClass: "animated", // animation css class (default is animated)
        offset: 0, // distance to the element when triggering the animation (default is 0)
        mobile: true, // trigger animations on mobile devices (default is true)
        live: true, // act on asynchronously loaded content (default is true)
        callback: function () {
          // the callback is fired every time an animation is started
          // the argument that is passed in is the DOM node being animated
        },
        scrollContainer: null, // optional scroll container selector, otherwise use window,
        resetAnimation: true, // reset animation on end (default is true)
      });
      wow.init();
    });

    const isLogin = ref(walletData.isAuth);
    const balanceOfLLT = ref("0");
    const userAddress = ref(
      !StringUtil.isEmpty(walletData.address)
        ? walletData.shortAddress
        : "Sign In"
    );

    // connect to wallet
    const connectWallet = async () => {
      const isChainValid = await walletData.isChainValid();
      if (!isChainValid) {
        // Toast.error("Please switch to the Scroll Sepolia network");
        // return Promise.resolve();
        return walletData.switchNetwork();
      }
      if (!StringUtil.isEmpty(walletData.address)) {
        Toast.warn("Wallet already connected");
        return Promise.resolve();
      }
      try {
        await walletData.connectWallet();
        router.replace("index");
      } catch (e) {
        Toast.error("Connect wallet failed");
        console.error(e);
      }
    };

    // event listener
    onBeforeMount(() => {
      EventBus.instance.on(
        GameEventWalletConnected.eventAsync,
        onWalletConnect
      );
      EventBus.instance.on(
        GameEventWalletDisconnect.eventAsync,
        onWalletDisConnect
      );
      EventBus.instance.on(
        GameEventWalletChainChanged.eventAsync,
        onChainChanged
      );
      EventBus.instance.on(
        GameEventWalletAccountChanged.eventAsync,
        onAccountChange
      );
    });
    onUnmounted(() => {
      EventBus.instance.off(
        GameEventWalletConnected.eventAsync,
        onWalletConnect
      );
      EventBus.instance.off(
        GameEventWalletDisconnect.eventAsync,
        onWalletDisConnect
      );
      EventBus.instance.off(
        GameEventWalletChainChanged.eventAsync,
        onChainChanged
      );
      EventBus.instance.off(
        GameEventWalletAccountChanged.eventAsync,
        onAccountChange
      );
    });

    const onWalletConnect = async () => {
      userAddress.value = walletData.shortAddress;
      isLogin.value = walletData.isAuth;

      await refreshLLT();
    };

    const onWalletDisConnect = () => {
      userAddress.value = "Sign In";
      isLogin.value = false;
    };

    const onChainChanged = (chainId: any) => {
      // TODO
      if (chainId === ChainID.Mumbai || chainId === ChainID.Scroll) {
        onWalletConnect();
      }
    };

    const onAccountChange = (account: string) => {
      if (!StringUtil.isEmpty(account)) {
        onWalletConnect();
      }
    };

    const refreshLLT = async () => {
      const player = await playerData.getPlayerData(walletData.address);
      let balance = ethers.constants.Zero;
      if (player) {
        try {
          balance = await player.balance();
        } catch (e) {
          console.error(e);
        }
      }

      const token = await contractData.lltTokenContract.balanceOf(
        walletData.address
      );
      balanceOfLLT.value = ethers.utils.formatEther(balance.add(token));
    };

    const onWalletClicked = async () => {
      DialogModal.open("Do your want to sign out?", async () => {
        await walletData.disconnect();
      });
    };

    const onTwitterLogin = async () => {
      // await particleData.loginWithSocialAccount(SocialLoginType.Github);
    }

    return {
      isLogin,
      userAddress,
      connectWallet,
      balanceOfLLT,
      onWalletClicked,
      onTwitterLogin
    };

  }
})
</script>

<style scoped lang="less">
.welcome {
  display: flex;
  width: 100%;
  height: calc(100vh - 64px);
  min-height: 960px;
  gap: 10px;
  justify-content: center;

  .left {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;
    width: 550px;

    .content {
      .head {
        font-family: Copperplate, Papyrus, fantasy;
        font-size: 96px;
        font-weight: 700;
        line-height: 116.06px;
        color: #FFFFFF;
        text-align: left;
        margin: 120px 0px 16px 0px;
      }

      .text {
        font-size: 32px;
        line-height: 38px;
        color: #A7A9BE;
        text-align: left;
        vertical-align: auto;
        letter-spacing: 0.75px;
        word-spacing: 1.5px;
        margin-bottom: 64px;
      }


    }

    .play-btn {
      width: 266px;
      height: 70px;
      border-radius: 9px;
      background-color: #FF8906;
      color: #FFFFFE;
      text-align: center;
      padding-top: 12px;
      font-size: 34px;
      font-weight: 500;

      &:hover {
        cursor: pointer;
      }
    }
  }

  .right {
    width: 550px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    margin-top: 320px;

    .logo {
      width: 80%;
    }
  }
}

.box {
  z-index: 100;
  position: absolute;
  right: 300px;
  top: 720px;
  width: 160px;
  height: 160px;
  margin: 15px auto 0;
  // animation: falling1 1s ease-in forwards,
  //   falling2 .6s ease-out forwards 1s,
  //   falling3 .6s ease-in forwards 1.6s,
  //   falling4 .8s ease-out forwards 2.2s,
  //   falling5 .6s ease-in forwards 3s;

  .logo {
    width: 100%;
  }
}

@keyframes falling1 {
  to {
    transform: translateY(300px);
  }
}

@keyframes falling2 {
  to {
    transform: translateY(200px);
  }
}

@keyframes falling3 {
  to {
    transform: translateY(300px);
  }
}

@keyframes falling4 {
  to {
    transform: translateY(200px);
  }
}

@keyframes falling5 {
  to {
    transform: translateY(300px);
  }
}
</style>