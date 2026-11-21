import axios from "axios";

// ==========================================
// 1. MAIN AXIOS INSTANCE
// ==========================================

// Ye instance normal API requests ke liye use hogi.
// Example: Login, Register, Get Categories, Create Property etc.
const axiosNew = axios.create({
  baseURL: "http://127.0.0.1:8000/",
});

// ==========================================
// 2. SEPARATE AXIOS INSTANCE FOR REFRESH TOKEN
// ==========================================

// Refresh token API call ke liye alag Axios instance banaya hai.
// Isse refresh request main Axios ke response interceptor mein nahi fasegi.
const refreshClient = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// ==========================================
// 3. REQUEST INTERCEPTOR
// ==========================================

// Har API request backend par jaane se pehle ye interceptor execute hoga.
axiosNew.interceptors.request.use(
  (config) => {

    // localStorage se current access token nikal rahe hain.
    const accessToken = localStorage.getItem("access_token");

    // Agar access token available hai,
    // toh request ke Authorization header mein attach karenge.
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Modified request ko backend par bhejne ki permission dete hain.
    return config;
  },
  (error) => {

    // Agar request interceptor mein koi error aata hai,
    // toh usse reject kar denge.
    return Promise.reject(error);
  }
);

// ==========================================
// 4. REFRESH PROMISE
// ==========================================

// Is variable mein refresh API ki running promise store hogi.
// Agar multiple API requests ek saath 401 return karti hain,
// toh sabhi requests ek hi refresh API call ka wait karengi.
let refreshPromise = null;

// ==========================================
// 5. RESPONSE INTERCEPTOR
// ==========================================

// Backend se response aane ke baad ye interceptor execute hoga.
axiosNew.interceptors.response.use(

  // Agar API request successful hai (2xx response),
  // toh response directly return kar denge.
  (response) => response,

  // Agar API request fail hoti hai, toh ye function execute hoga.
  async (error) => {

    // Failed request ki original configuration store kar rahe hain.
    const originalRequest = error.config;

    // Check kar rahe hain:
    // 1. Kya response status 401 hai?
    // 2. Kya original request available hai?
    // 3. Kya request pehle retry nahi hui?
    // 4. Kya failed request refresh-token API nahi hai?
    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url?.includes("/users/refresh-token/")
    ) {

      // Agar conditions match nahi hoti hain,
      // toh error ko directly reject kar denge.
      return Promise.reject(error);
    }

    // Is request ko retry mark kar rahe hain.
    // Isse same request baar-baar retry nahi hogi.
    originalRequest._retry = true;

    try {

      // ==========================================
      // 6. REFRESH ACCESS TOKEN
      // ==========================================

      // Agar refresh request already chal rahi hai,
      // toh nayi refresh API call nahi hogi.
      if (!refreshPromise) {

        // Backend ke refresh-token endpoint ko call kar rahe hain.
        refreshPromise = refreshClient
          .post("/users/refresh-token/", {

            // Existing refresh token backend ko send kar rahe hain.
            refresh_token: localStorage.getItem("refresh_token"),
          })

          // Refresh API successful hone par:
          .then((response) => {

            // Backend se naya access token receive kar rahe hain.
            const newAccessToken = response.data.access_token;

            // Naye access token ko localStorage mein save kar rahe hain.
            localStorage.setItem("access_token", newAccessToken);

            // Naya token return kar rahe hain,
            // taaki pending requests iska use kar sakein.
            return newAccessToken;
          })

          // Refresh request complete hone ke baad
          // refreshPromise ko null kar denge.
          // Isse future mein zarurat padne par nayi refresh call ho sakegi.
          .finally(() => {
            refreshPromise = null;
          });
      }

      // Refresh request complete hone ka wait karenge.
      // Agar multiple requests pending hain, sabko same token milega.
      const newAccessToken = await refreshPromise;

      // ==========================================
      // 7. ORIGINAL REQUEST RETRY
      // ==========================================

      // Original failed request ke Authorization header mein
      // naya access token attach kar rahe hain.
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      // Ab original API request ko naye access token ke saath
      // dobara execute kar rahe hain.
      return axiosNew(originalRequest);

    } catch (refreshError) {

      // ==========================================
      // 8. REFRESH TOKEN ALSO EXPIRED / INVALID
      // ==========================================

      // Agar refresh API bhi fail ho jaati hai,
      // toh dono tokens localStorage se remove kar denge.
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      // User ko login page par redirect kar denge.
      window.location.href = "/login";

      // Refresh error ko reject kar denge.
      return Promise.reject(refreshError);
    }
  }
);

// ==========================================
// 9. EXPORT AXIOS INSTANCE
// ==========================================

// Is instance ko components aur services mein import karke
// normal API requests perform kar sakte hain.
export default axiosNew;