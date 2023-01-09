import axios from "axios";
import { makeCancelable } from "./utils";

export class APIWrapper {
    constructor({
        baseUrl = "",
        apiToken = "",
        systemToken = undefined,
        userToken = undefined,
    }) {
        this.baseUrl = baseUrl;
        this.apiToken = apiToken;
        this.systemToken = systemToken;
        this.userToken = userToken;
    }
    request = ({ path = '', method = '', body = {}, headers }) => {
        switch (method) {
            case "get":
                return makeCancelable(new Promise(async (resolve, reject) => {
                    try {
                        var url = this.baseUrl + path;
                        console.log(url);
                        axios({
                            method: "get",
                            url: url,
                        }).then((res) => {
                            console.log(res)
                            resolve({
                                ...res.data,
                                isSuccess: res.status >= 200 && res.status < 300,
                            });
                        }).catch(err => {
                            resolve({
                                ...err.response,
                                isSuccess: false,
                            })
                        });
                    }
                    catch (err) {
                        console.log(`request.catch`, err);
                        reject(err);
                    }
                }));
            case "post":
                return makeCancelable(new Promise(async (resolve, reject) => {
                    try {
                        var url = this.baseUrl + path;
                        console.log(url);
                        axios({
                            method: "post",
                            url: url,
                            data: body,
                            headers: headers
                        }).then((res) => {
                            console.log(res)
                            resolve({
                                ...res.data,
                                isSuccess: res.status >= 200 && res.status < 300,
                            });
                        }).catch(err => {
                            console.log(err)
                            resolve({
                                ...err.response,
                                isSuccess: false,
                            })
                        });
                    }
                    catch (err) {
                        console.log(`request.catch`, err);
                        reject(err);
                    }
                }));
            default: return undefined;
        }

    }
}