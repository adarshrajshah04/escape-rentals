import { createSlice } from "@reduxjs/toolkit";
import { fetchReview } from "../action/review.action";





const initialState={
    review:[],
    isLoading:false,
    errorMsg:'',
}


const reviewSlice=createSlice({
    name:'review',
    initialState,
    extraReducers:(builders)=>{
        builders
        .addCase(fetchReview.pending,(state,action)=>{
            state.isLoading=true
        })
        .addCase(fetchReview.fulfilled,(state,action)=>{
            state.isLoading=false
            state.review=action.payload
        })
        .addCase(fetchReview.rejected,(state,action)=>{
            state.isLoading=false
            state.errorMsg='Something is wrong '
        } )
    }
})


export const reviewAction = reviewSlice.actions
const reviewReducer = reviewSlice.reducer
export default reviewReducer