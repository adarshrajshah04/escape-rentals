import { createSlice } from "@reduxjs/toolkit";
import { fetchProperties } from "../action/properties.action";



const initialState={
    properties:[],
    isLoading:false,
    errorMsg:'',
}


const propertiesSlice=createSlice({
    name:'properties',
    initialState,
    extraReducers:(builders)=>{
        builders
        .addCase(fetchProperties.pending,(state,action)=>{
            state.isLoading=true
        })
        .addCase(fetchProperties.fulfilled,(state,action)=>{
            state.isLoading=false
            state.properties=action.payload
        })
        .addCase(fetchProperties.rejected,(state,action)=>{
            state.isLoading=false
            state.errorMsg='Something is wrong '
        } )
    }
})


export const propertiesAction = propertiesSlice.actions
const propertiesReducer = propertiesSlice.reducer
export default propertiesReducer