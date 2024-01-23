package com.aloneatwar.xdemo.config;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

@Configuration
public class HTTPProxyConfig implements CommandLineRunner {


    @Value("${twitter.proxySet}")
    private boolean proxySet = true;

    @Value("${twitter.proxyHost}")
    private String proxyHost ;

    @Value("${twitter.proxyPort}")
    private String proxyPort ;


    @Override
    public void run(String... args)  {
        System.setProperty("http.proxySet", String.valueOf(proxySet));
        System.setProperty("http.proxyHost", proxyHost);
        System.setProperty("http.proxyPort", proxyPort);
        System.setProperty("https.proxyHost", proxyHost);
        System.setProperty("https.proxyPort", proxyPort);
    }
}

