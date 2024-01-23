package com.aloneatwar.xdemo.controller;


import com.aloneatwar.xdemo.bean.pojo.UserInfo;
import com.aloneatwar.xdemo.mapper.UserMapper;
import com.aloneatwar.xdemo.bean.dto.resp.BaseResp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
public class UserController {


    @Autowired
    private UserMapper userMapper;



    @PostMapping("/bindAddress")
    public BaseResp<Boolean> bindAddress(@RequestBody UserInfo userInfo){
        userMapper.save(userInfo);
        return BaseResp.success(true);
    }

    @GetMapping("/queryByName")
    public BaseResp<List<UserInfo>> queryByName(String name){
        List<UserInfo> userInfos = userMapper.queryByName(name);
        return BaseResp.success(userInfos);
    }





}
