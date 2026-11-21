import { configureStore } from "@reduxjs/toolkit";
import propertiesReducer from "./slice/properties.slice";
import categoriesReducer from "./slice/category.slice";
import reviewReducer from "./slice/review.slice";






const store=configureStore({

    reducer:{
        properties:propertiesReducer,
        categories:categoriesReducer,
        review:reviewReducer,
    }
})

export default store