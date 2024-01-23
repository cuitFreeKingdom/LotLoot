package com.aloneatwar.xdemo.bean.pojo;

import twitter4j.AccessToken;
import twitter4j.v1.User;

public class UserInfo {
    private boolean bindTwitter=true;
    private Long  userId;
    private String screenName;

    private String notes;

    private String address;


    public static UserInfo unBindTwitter(String address,String notes){
        return new UserInfo(false,0L,"未绑定Twitter账号",address,notes);
    }

    public static UserInfo unBindAddress(AccessToken accessToken){
        return new UserInfo(false, accessToken.getUserId(), accessToken.getScreenName(),"未设置address","");
    }


    public UserInfo() {
    }



    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    private UserInfo(boolean bindTwitter, Long userId, String screenName, String address,String notes) {
        this.bindTwitter = bindTwitter;
        this.userId = userId;
        this.screenName = screenName;
        this.address = address;
        this.notes = notes;
    }


    public boolean isBindTwitter() {
        return bindTwitter;
    }


    public String getScreenName() {
        return screenName;
    }

    public void setScreenName(String screenName) {
        this.screenName = screenName;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
