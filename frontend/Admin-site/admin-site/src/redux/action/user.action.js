import {createAsyncThunk } from "@reduxjs/toolkit";
import axiosNew from "../../utils/axiosNew";


export const fetchUsers=createAsyncThunk("user",async()=>{
    const res = await axiosNew.get('/users/admin/all-users/')
    console.log(res.data.users);
    
    return  res.data.users
})
