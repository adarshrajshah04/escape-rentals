import { createAsyncThunk } from "@reduxjs/toolkit";

import axiosNew from '@/utils/axiosNew'


export const fetchProperties= createAsyncThunk('properties',async()=>{
    const res = await axiosNew.get('/properties')
    // console.log(res.data)
    return  res.data.data

})