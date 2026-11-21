    import { createSlice } from "@reduxjs/toolkit";
import { fetchBooking } from "../action/booking.action";


    const initialState={
        booking:[],
        isLoading:false,
        errorMsg:'',
    }

    const bookingSlice=createSlice({
        name:"booking",
        initialState,
        extraReducers:(builders)=>{
            builders
            .addCase(fetchBooking.pending,(state,action)=>{
                state.isLoading=true;
            })
            .addCase(fetchBooking.fulfilled,(state,action)=>{
                state.isLoading=false;
                state.booking=action.payload;
            })
            .addCase(fetchBooking.rejected,(state,action)=>{
                state.isLoading=false;
                state.errorMsg = action.payload || "Something went wrong";
            })
        }
    })

    export const bookingAction=bookingSlice.actions
    const bookingReducer = bookingSlice.reducer
    export default bookingReducer