import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Url } from "../userConstant";
import axios from "axios";
import { PURGE } from "redux-persist";
import { ApiClient } from "../api";
import axiosConfig from "../axios";
import { store } from "../store";

const apiPath = ApiClient()

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (userData, { getState, rejectWithValue }) => {
    console.log("reached thunk successfully");
    try {
      const response = await axios.post(`${Url}/api/users`, userData);

      console.log("from api", response.data);
      return response.data;
    } catch (error: any) {
      console.log(error.message);
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (userData, { getState, rejectWithValue }) => {
    console.log("reached thunk successfully", axiosConfig);
    try {
      const response = await axiosConfig.post(
        `${Url}/api/users/login`,
        userData
      );
      console.log("from api", response.data);
      return response.data;
    } catch (error: any) {
      console.log(error.message);
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const test = createAsyncThunk(
  "user/test",
  async (getState, rejectWithValue) => {
    console.log("reached test thunk successfully", axiosConfig);
    try {
      const response = await apiPath.get(`${Url}/api/categories`);
      console.log("from api", response);
      return response.data;
    } catch (error: any) {
      console.log(error.message);
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: {},
    status: "idle",
    error: null,
  },
  reducers: {
    setToken : (state,action) => {
        state.userInfo.accessToken = action.payload.accessToken;
        state.userInfo.refreshToken = action.payload.refreshToken
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        const profileData = action.payload.userData;
        state.userInfo = profileData;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log("payload");
        state.status = "succeeded";
        state.userInfo = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
      })
      .addCase(PURGE, (state, action) => {
        state.status = "failed";
      });
  },
});

export const {setToken} = userSlice.actions;

export default userSlice.reducer;
