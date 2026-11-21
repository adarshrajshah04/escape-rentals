import {createAsyncThunk } from "@reduxjs/toolkit";
import axiosNew from "../../utils/axiosNew";


export const fetchBooking=createAsyncThunk("booking",async()=>{
    const res = await axiosNew.get('/booking/all')
    console.log(res.data);
    
    return  res.data
})
