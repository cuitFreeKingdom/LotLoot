package com.aloneatwar.xdemo.mapper;

import com.aloneatwar.xdemo.bean.pojo.UserInfo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.lang.Nullable;

import java.util.List;





@Mapper
public interface UserMapper {
    boolean save(UserInfo userInfo);

    List<UserInfo> queryByName(String name);

    @Nullable
    UserInfo queryById(Long id);

    List<UserInfo> queryByAddressList(@Param("friendList") List<String> friendList);
}
