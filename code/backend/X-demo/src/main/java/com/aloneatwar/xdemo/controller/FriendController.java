package com.aloneatwar.xdemo.controller;


import com.aloneatwar.xdemo.bean.dto.resp.BaseResp;
import com.aloneatwar.xdemo.bean.pojo.Friend;
import com.aloneatwar.xdemo.bean.pojo.UserInfo;
import com.aloneatwar.xdemo.mapper.FriendMapper;
import com.aloneatwar.xdemo.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
public class FriendController {

    @Autowired
    private FriendMapper friendMapper;

    @Autowired
    private UserMapper userMapper;

    @PostMapping("/addFriend")
    public BaseResp<Boolean> addFriend(@RequestBody  Friend friend){
        boolean succuess = friendMapper.addFriend(friend);
        if (succuess){
            return BaseResp.success(true);
        }else {
            return BaseResp.fail("添加失败，已添加好友");
        }
    }

    @GetMapping("/getFriendList")
    public BaseResp<List<UserInfo>> getFriendList(String address) {
        List<Friend> friendList = friendMapper.getFriendList(address);
        if(friendList.isEmpty()){
            return BaseResp.success(Collections.emptyList());
        }
        List<String> friendAddressList = new ArrayList<>();

        friendList.forEach(a -> friendAddressList.add(a.getFriendAddress()));
        List<UserInfo> userInfos = userMapper.queryByAddressList(friendAddressList);
        HashMap<String, UserInfo> map = new HashMap<>();
        userInfos.forEach(a -> map.put(a.getAddress(), a));

        List<UserInfo> result = new ArrayList<>();
        for (Friend friend : friendList) {
            if (map.containsKey(friend.getFriendAddress())) {
                UserInfo info = map.get(friend.getFriendAddress());
                info.setNotes(friend.getNotes());
                result.add(info);
            } else {
                result.add(UserInfo.unBindTwitter(friend.getFriendAddress(),friend.getNotes()));
            }
        }
        return BaseResp.success(result);
    }


    @PostMapping("/updateFriendNotes")
    public BaseResp<Boolean> updateFriendNotes(@RequestBody Friend friend){
        boolean succuess = friendMapper.updateFriendNotes(friend);
        if (succuess){
            return BaseResp.success(true);
        }else {
            return BaseResp.fail("更新失败");
        }
    }

    @DeleteMapping("/deleteFriend")
    public BaseResp<Boolean> deleteFriend(@RequestBody Friend friend){
        boolean succuess = friendMapper.deleteFriend(friend);
        if (succuess){
            return BaseResp.success(true);
        }else {
            return BaseResp.fail("删除失败");
        }
    }

}
