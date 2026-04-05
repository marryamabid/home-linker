import { createSlice } from "@reduxjs/toolkit";
import { deleteUser } from "firebase/auth";
import { useDebugValue } from "react";

const initialState = {
  currentUser: null,
  isLoading: false,
  error: null,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.isLoading = false;
      state.currentUser = action.payload;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateUserStart: (state) => {
      state.isLoading = true;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = {
        ...state.currentUser,
        ...action.payload,
      };
      state.isLoading = false;
      state.error = null;
    },
    updateUserFailure: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    deleteUserStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.isLoading = false;
      state.error = null;
    },
    deleteUserFailure: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    signoutUserStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    signoutUserSuccess: (state) => {
      state.currentUser = null;
      state.isLoading = false;
      state.error = null;
    },
    signoutUserFailure: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});
export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutUserStart,
  signoutUserSuccess,
  signoutUserFailure,
} = userSlice.actions;
export default userSlice.reducer;
