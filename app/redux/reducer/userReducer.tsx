import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Url } from "../userConstant";
import axios from "axios";
import { PURGE } from "redux-persist";
import { ApiClient } from "../api";
import axiosConfig from "../axios";
import { store } from "../store";
import { SavedAddress } from "../../types/savedAddress";
import { BaseLocation } from "../../types/location";
import { LocationRequest } from "../../types/requests/locationRequest";
import { LocationResponse } from "../../types/response/locationResponse";


const mobileAxios = axios.create({
  baseURL : Url,
  headers : {
    'Content-Type' : 'aplication/json',
    'X-Client-Type' : 'mobile'
  }
})

const apiPath = ApiClient();

interface UserData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

type UserState = {
  userInfo: Record<string, unknown>;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  defaultAddress: LocationResponse | null;
  reuseDefaultAddress: boolean;
};

const initialState: UserState = {
  userInfo: {},
  status: "idle",
  error: null,
  defaultAddress: null,
  reuseDefaultAddress: false,
};

export const registerUser = createAsyncThunk<
  any, // Return type (response.data)
  UserData, // Argument type (userData)
  { rejectValue: string } // ThunkAPI type (optional)
>("user/registerUser", async (userData: any, { getState, rejectWithValue }) => {
  console.log("reached thunk successfully");
  try {
    const response = await mobileAxios.post(`${Url}/api/users`, userData);
    console.log('response from register',response)
    console.log("from api", response.data);
    return response.data;
  } catch (error: any) {
    console.log(error.message);
    return rejectWithValue(
      error.response?.data?.message || "Something went wrong"
    );
  }
});

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (userData: any, { rejectWithValue }) => {
    console.log("reached thunk successfully", axiosConfig);
    try {
      const response = await axios.post(`${Url}/api/users/login`, userData);
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

export const saveUserLocation = createAsyncThunk<
  any,
  LocationRequest,
  { rejectValue: string }
>(
  "user/saveUserLocation",
  async (location: LocationRequest, { getState, rejectWithValue }) => {
    console.log("reached save location thunk successfully", location);

    try {
      const response = await axios.post(`${Url}/api/users/location`, location);
      console.log("from api", response.data);

      return response.data;
    } catch (error: any) {
      console.log(error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to save location"
      );
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.userInfo.accessToken = action.payload.accessToken;
      state.userInfo.refreshToken = action.payload.refreshToken;
    },
    saveDefaultAddress(state, action) {
      state.defaultAddress = action.payload; // { fullName, phone, ... }
      state.reuseDefaultAddress = false;
    },
    setReuseDefaultAddress(state, action) {
      state.reuseDefaultAddress = action.payload; // true when “Use the same location”
    },
    clearDefaultAddress(state) {
      state.defaultAddress = null;
      state.reuseDefaultAddress = false;
    },
    logout(state) {
      // Reset to initial state
      state.userInfo = {};
      state.status = "idle";
      state.error = null;
      state.defaultAddress = null;
      state.reuseDefaultAddress = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log("payload register", action.payload);
        const profileData = action.payload.data;
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
        const { location, ...userWithoutLocation } = action.payload;
        console.log("user info reducer login", action.payload);
        state.userInfo = userWithoutLocation;
        state.defaultAddress = location || null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
      })
      .addCase(saveUserLocation.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(saveUserLocation.fulfilled, (state, action) => {
        console.log("payload");
        state.status = "succeeded";
        console.log("location payload", action.payload);
        state.defaultAddress = action.payload;
      })
      .addCase(saveUserLocation.rejected, (state, action) => {
        state.status = "failed";
      })
      .addCase(PURGE, (state, action) => {
        state.status = "failed";
      });
  },
});

export const { setToken, saveDefaultAddress, setReuseDefaultAddress, logout } =
  userSlice.actions;

export default userSlice.reducer;
