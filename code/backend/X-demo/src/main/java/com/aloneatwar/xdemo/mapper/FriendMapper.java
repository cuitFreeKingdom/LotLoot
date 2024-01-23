package com.aloneatwar.xdemo.mapper;


import com.aloneatwar.xdemo.bean.pojo.Friend;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface FriendMapper {

    boolean addFriend(Friend friend);

    List<Friend> getFriendList(String address);


    boolean updateFriendNotes(Friend friend);

    boolean deleteFriend(Friend friend);
}
