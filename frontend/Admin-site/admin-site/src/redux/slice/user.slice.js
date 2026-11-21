import { createSlice } from "@reduxjs/toolkit";
import { fetchUsers } from "../action/user.action";



const initialState = {
    users: [],
    isLoading: false,
    errorMsg: '',
}

const usersSlice = createSlice({
    name: "users",
    initialState,
    extraReducers: (builders) => {
        builders
            .addCase(fetchUsers.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.errorMsg = action.payload || "Something went wrong";
            })
    }
})

export const usersAction = usersSlice.actions
const usersReducer = usersSlice.reducer
export default usersReducer