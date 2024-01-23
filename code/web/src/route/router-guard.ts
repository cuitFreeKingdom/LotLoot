import { Router } from "vue-router";
import { walletData } from "../data/WalletData";
import { LOGIN_NAME, WhiteNameList } from "./constant";

const defaultRoutePath = '/index';

export function createRouterGuards(router: Router, whiteNameList: WhiteNameList) {
    router.beforeEach(async (to, _, next) => {
        const isLogin = walletData.isAuth;

        if (isLogin) {
            if (to.name === LOGIN_NAME) {
                next({ path: defaultRoutePath });
            } else {
                next();
            }
        } else {
            // not login
            if (whiteNameList.some((n) => n === to.name)) {
                // 在免登录名单，直接进入
                next();
            } else {
                next({ name: LOGIN_NAME, replace: true });
            }
        }
    });
}