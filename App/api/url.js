import axios from "axios";

const instance = axios.create({

    // baseURL: "https://shoe-bip-bip-2229beceb537.herokuapp.com/",
    //baseURL: "http://172.20.10.2",
 

     baseURL: "http://192.168.0.101",

   // baseURL: "http://192.168.2.22:3000/",

});


instance.interceptors.request.use(//thêm yêu cầu trước mỗi lần gọi 
    async (config) => {//chứa thông tin cấu hình

        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);

export default instance;