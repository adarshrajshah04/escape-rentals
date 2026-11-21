import {createAsyncThunk } from "@reduxjs/toolkit";
import axiosNew from "../../utils/axiosNew";


export const fetchProperties=createAsyncThunk("category",async()=>{
    const res = await axiosNew.get('/properties')
    // console.log(res.data.data);
    
    return  res.data.data
})
