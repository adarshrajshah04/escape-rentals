import { createAsyncThunk } from "@reduxjs/toolkit";

import axiosNew from '@/utils/axiosNew'


export const fetchReview= createAsyncThunk('review',async()=>{
    const res = await axiosNew.get('/reviews')
    console.log(res.data.data)
    return  res.data.data

})