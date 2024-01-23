package com.aloneatwar.xdemo.bean.dto.resp;

public class BaseResp<T> {

    private String code;

    private T   data;

    private String msg;


    public BaseResp(String code, T data, String msg) {
        this.code = code;
        this.data = data;
        this.msg = msg;
    }

    public BaseResp() {
    }

    public static <T> BaseResp<T> success(T data) {
        return new BaseResp<T>("200", data, "success");
    }

    public static <T> BaseResp<T> success() {
        return new BaseResp<T>("200", null, "success");
    }

    public static <T> BaseResp<T> fail(String msg) {
        return new BaseResp<T>("500", null, msg);
    }

    public static <T> BaseResp<T> fail(String code, String msg) {
        return new BaseResp<T>(code, null, msg);
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
