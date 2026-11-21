import { createSlice } from "@reduxjs/toolkit";
import { fetchCategory } from "../action/category.action";




const initialState={
    categories:[],
    isLoading:false,
    errorMsg:'',
}


const categoriesSlice=createSlice({
    name:'categories',
    initialState,
    extraReducers:(builders)=>{
        builders
        .addCase(fetchCategory.pending,(state,action)=>{
            state.isLoading=true
        })
        .addCase(fetchCategory.fulfilled,(state,action)=>{
            state.isLoading=false
            state.categories=action.payload
        })
        .addCase(fetchCategory.rejected,(state,action)=>{
            state.isLoading=false
            state.errorMsg='Something is wrong '
        } )
    }
})


export const categoriesAction = categoriesSlice.actions
const categoriesReducer = categoriesSlice.reducer
export default categoriesReducer