export const LOGIN_NAME = 'pl';

// 路由白名单
export const whiteNameList = [LOGIN_NAME,  '404'] as const; // no redirect whitelist

export type WhiteNameList = typeof whiteNameList;

export type WhiteName = typeof whiteNameList[number];