package com.aloneatwar.xdemo.controller;


import com.aloneatwar.xdemo.bean.dto.resp.BaseResp;
import com.aloneatwar.xdemo.bean.pojo.UserInfo;
import com.aloneatwar.xdemo.mapper.UserMapper;
import com.github.benmanes.caffeine.cache.Cache;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import twitter4j.*;

@RestController
@CrossOrigin
public class LoginController {



    @Value("${twitter.consumerKey}")
    private String consumerKey ;


    @Value("${twitter.consumerSecret}")
    private String consumerSecret;

    public OAuthAuthorization authorization(){
        return OAuthAuthorization.getInstance(consumerKey,consumerSecret);
    }

    @Autowired
    Cache<String, Object> caffeineCache;

    @RequestMapping("/getTwitterLoginUrl")
    public BaseResp<String> getTwitterLoginUrl() throws TwitterException {
        OAuthAuthorization authorization = authorization();
        RequestToken oAuthRequestToken = authorization.getOAuthRequestToken();
        caffeineCache.put(oAuthRequestToken.getToken(),authorization);
        return BaseResp.success(oAuthRequestToken.getAuthenticationURL());
    }


    @Autowired
    private UserMapper userMapper;

    @RequestMapping("/oauthLogin")
    public BaseResp<UserInfo> oauthLogin(String oauth_token, String oauth_verifier) throws TwitterException {
        OAuthAuthorization authorization = (OAuthAuthorization) caffeineCache.getIfPresent(oauth_token);
        if(authorization==null){
            return BaseResp.fail("oauth_toke不存在或者已过期");
        }
        AccessToken accessToken = authorization.getOAuthAccessToken(oauth_verifier);
        UserInfo info = userMapper.queryById(accessToken.getUserId());
        if(info==null){
            info = UserInfo.unBindAddress(accessToken);
        }
        return BaseResp.success(info);
    }


}
