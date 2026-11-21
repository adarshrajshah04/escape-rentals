import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./slice/category.slice";
import propertiesReducer from "./slice/properties.slice";
import bookingReducer from "./slice/booking.slice";
import usersReducer from "./slice/user.slice";
import reviewsReducer from "./slice/review.slice";




const store=configureStore({
    reducer:{
        category:categoryReducer,
        properties:propertiesReducer,
        booking:bookingReducer,
        users:usersReducer,
        reviews:reviewsReducer,
    }
})

export default store