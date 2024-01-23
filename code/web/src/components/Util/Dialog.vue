<template>
  <!-- 对话框组件 -->
  <teleport to="body">
    <transition name="confirm-fade">
      <div class="confirm" v-show="visible">
        <div class="confirm-wrapper">
          <div class="confirm-content">
            <div class="body">
              <img src="../../assets/prompt.png" class="prompt">
              <div class="text">{{ text }}</div>
              <div class="text-add">{{ others }}</div>
            </div>
            <div class="footer-button">
              <div class="btn-no" @click="cancel">{{ cancelBtnText }}</div>
              <div class="btn-yes" @click="confirm">{{ confirmBtnText }}</div>
              <!-- <el-button type="primary" @click="confirm" size="large" class="operate-btn">{{ confirmBtnText }}</el-button> -->
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

interface Props {
  confirmBtnText: string,
  cancelBtnText: string,
};
const props = withDefaults(defineProps<Props>(), {
  confirmBtnText: 'YES',
  cancelBtnText: 'NO'
});
const emit = defineEmits<{
  (e: 'confirm'): void,
  (e: 'cancel'): void,
}>();

const visible = ref<boolean>(false);
const text = ref<string>('');
const others = ref<string>('');
const hide = () => {
  visible.value = false;
};
const show = (val1?: string, val2?: string) => {
  text.value = '';
  others.value = '';
  if (val1) {
    text.value = val1;
  }
  if (val2) {
    others.value = val2;
  }
  visible.value = true;
};
const confirm = () => {
  hide();
  emit('confirm');
};
const cancel = () => {
  hide();
  emit('cancel');
};
defineExpose({
  show
});
</script>

<style scoped lang="less">
@color-background-d: rgba(0, 0, 0, 0.5);
@color-highlight-background: white;
@font-size-large: 20px;
@color-text-l: #333;
@color-text: #222;
@--bg-scroll: rgb(232, 228, 228);

.confirm {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 996;
  background-color: @color-background-d;

  &.confirm-fade-enter-active {
    animation: confirm-fadein .3s;

    .confirm-content {
      animation: confirm-zoom-in .3s;
    }
  }

  &.confirm-fade-leave-active {
    animation: confirm-fadeout .1s;

    .confirm-content {
      animation: confirm-zoom-out .2s;
    }
  }

  .confirm-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 997;

    .confirm-content {
      width: 500px;
      border-radius: 0.25rem;
      background: @color-highlight-background;

      .body {
        padding: 0.5rem 2rem 1rem 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: left;

        .prompt {
          margin-top: 0.5rem;
          width: 35px;
          height: 35px;
        }

        .text {
          color: #FF4F80;
          padding-top: 1rem;
          padding-bottom: 0.75rem;
          width: 85%;
          line-height: 24px;
          letter-spacing: 1px;
          font-size: @font-size-large;
          font-weight: 700;
        }

        .text-add {
          width: 85%;
          padding-bottom: 0.75rem;
          color: #757E8B;
          font-size: 16px;
          font-weight: 500;
        }
      }

      .footer-button {
        display: flex;
        justify-content: center;
        height: 50px;
        line-height: 50px;
        font-size: 20px;
        font-weight: 600;
        background-color: #1D2538;
        text-align: center;

        &:hover {
          cursor: pointer;
        }

        .btn-no {
          width: 50%;
          color: #757E8B;
        }

        .btn-yes {
          width: 50%;
          color: #107C0F;
        }
      }

      .operate {
        display: flex;
        align-items: center;
        text-align: center;
        font-size: @font-size-large;
      }
    }
  }

  @keyframes confirm-fadein {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  // @keyframes confirm-fadeout {
  //   0% {
  //     opacity: 0;
  //   }

  //   100% {
  //     opacity: 1;
  //   }
  // }

  @keyframes confirm-zoom-in {
    0% {
      transform: scale(0);
    }

    50% {
      transform: scale(1.1);
    }

    100% {
      transform: scale(1);
    }
  }

  @keyframes confirm-zoom-out {
    0% {
      transform: scale(1);
    }

    100% {
      transform: scale(0);
    }
  }
}
</style>