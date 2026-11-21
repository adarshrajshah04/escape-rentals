import axios from "axios";



export const BASE_URL = "http://127.0.0.1:8000/";


const axiosNew = axios.create({
  baseURL: "http://127.0.0.1:8000/",
});

const refreshClient = axios.create({
  baseURL: "http://127.0.0.1:8000",
});


axiosNew.interceptors.request.use(
  (config) => {


    const accessToken = localStorage.getItem("access_token");


    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }


    return config;
  },
  (error) => {


    return Promise.reject(error);
  }
);


let refreshPromise = null;


axiosNew.interceptors.response.use(

  (response) => response,

 
  async (error) => {

    const originalRequest = error.config;


    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url?.includes("/users/refresh-token/")
    ) {

      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {

      if (!refreshPromise) {

  
        refreshPromise = refreshClient
          .post("/users/refresh-token/", {

      
            refresh_token: localStorage.getItem("refresh_token"),
          })


          .then((response) => {

            const newAccessToken = response.data.access_token;

            localStorage.setItem("access_token", newAccessToken);


            return newAccessToken;
          })

          .finally(() => {
            refreshPromise = null;
          });
      }


      const newAccessToken = await refreshPromise;

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return axiosNew(originalRequest);

    } catch (refreshError) {

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");


      window.location.href = "/login";


      return Promise.reject(refreshError);
    }
  }
);

export default axiosNew;