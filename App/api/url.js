import axios from "axios";

const instance = axios.create({
    baseURL: "https://md26bipbip-496b6598561d.herokuapp.com",
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