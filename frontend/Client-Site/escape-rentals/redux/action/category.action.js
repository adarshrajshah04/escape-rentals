import { createAsyncThunk } from "@reduxjs/toolkit";

import axiosNew from '@/utils/axiosNew'


export const fetchCategory= createAsyncThunk('category',async()=>{
    const res = await axiosNew.get('/categories')
    // console.log(res.data)
    return  res.data.data

})