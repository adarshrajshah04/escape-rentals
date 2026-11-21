    import { createSlice } from "@reduxjs/toolkit";
    import { fetchCategory } from "../action/category.action";


    const initialState={
        category:[],
        isLoading:false,
        errorMsg:'',
    }

    const categorySlice=createSlice({
        name:"category",
        initialState,
        extraReducers:(builders)=>{
            builders
            .addCase(fetchCategory.pending,(state,action)=>{
                state.isLoading=true;
            })
            .addCase(fetchCategory.fulfilled,(state,action)=>{
                state.isLoading=false;
                state.category=action.payload;
            })
            .addCase(fetchCategory.rejected,(state,action)=>{
                state.isLoading=false;
                state.errorMsg = action.payload || "Something went wrong";
            })
        }
    })

    export const categoryAction=categorySlice.actions
    const categoryReducer = categorySlice.reducer
    export default categoryReducer