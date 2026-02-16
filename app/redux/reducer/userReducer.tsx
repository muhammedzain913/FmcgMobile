import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Url } from "../userConstant";
import axios from "axios";
import { PURGE } from "redux-persist";
import { ApiClient } from "../api";
import axiosConfig from "../axios";
import { LocationRequest } from "../../types/requests/locationRequest";
import { LocationResponse } from "../../types/response/locationResponse";
import { AddressRequest } from "../../types/requests/addressRequest";
import { AddressResponse } from "../../types/response/addressResponse";


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
  addresses: AddressResponse[];
};

const initialState: UserState = {
  userInfo: {},
  status: "idle",
  error: null,
  defaultAddress: null,
  reuseDefaultAddress: false,
  addresses: [],
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
  async (_, { rejectWithValue }) => {
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


export const saveUserAddress = createAsyncThunk<
  any,
  AddressRequest,
  { rejectValue: string }
>(
  "user/saveUserAddress",
  async (address: AddressRequest, { getState, rejectWithValue }) => {
    console.log("reached save address thunk successfully", address);

    try {
      const response = await apiPath.post(`${Url}/api/addresses`, address, {});
      console.log("from api", response.data);

      return response.data;
    } catch (error: any) {
      console.log(error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to save address"
      );
    }
  }
);

export const updateUserAddress = createAsyncThunk<
  any,
  AddressRequest & { id: string },
  { rejectValue: string }
>(
  "user/updateUserAddress",
  async (address: AddressRequest & { id: string }, { getState, rejectWithValue }) => {
    console.log("reached update address thunk successfully", address);

    try {
      const { id, ...addressData } = address; // Extract id from address
      const response = await apiPath.put(`${Url}/api/addresses/${id}`, addressData, {});
      console.log("updated address from api", response.data);

      return response.data;
    } catch (error: any) {
      console.log(error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update address"
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
      state.addresses = [];
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
      .addCase(saveUserAddress.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(saveUserAddress.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log("address payload", action.payload);
        // Add the new address to the addresses array
        if (action.payload?.data) {
          state.addresses.push(action.payload.data);
        }
      })
      .addCase(saveUserAddress.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to save address";
      })
      .addCase(updateUserAddress.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateUserAddress.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log("updated address payload", action.payload);
        if (action.payload?.data) {
          const updatedAddress = action.payload.data;
          // Filter out the old address with the same id and add the updated one
          state.addresses = [
            ...state.addresses.filter((addr) => addr.id !== updatedAddress.id),
            updatedAddress,
          ];
        }
      })
      .addCase(updateUserAddress.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update address";
      })
      .addCase(PURGE, (state, action) => {
        state.status = "failed";
      });
  },
});

export const { setToken, saveDefaultAddress, setReuseDefaultAddress, logout } =
  userSlice.actions;

export default userSlice.reducer;
