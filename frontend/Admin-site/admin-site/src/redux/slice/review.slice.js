import { createSlice } from "@reduxjs/toolkit";
import { fetchReview } from "../action/review.action";




const initialState = {
    reviews: [],
    isLoading: false,
    errorMsg: '',
}

const reviewsSlice = createSlice({
    name: "reviews",
    initialState,
    extraReducers: (builders) => {
        builders
            .addCase(fetchReview.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(fetchReview.fulfilled, (state, action) => {
                state.isLoading = false;
                state.reviews = action.payload;
            })
            .addCase(fetchReview.rejected, (state, action) => {
                state.isLoading = false;
                state.errorMsg = action.payload || "Something went wrong";
            })
    }
})

export const reviewsAction = reviewsSlice.actions
const reviewsReducer = reviewsSlice.reducer
export default reviewsReducer