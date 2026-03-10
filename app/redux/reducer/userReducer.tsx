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
  baseURL: Url,
  headers: {
    "Content-Type": "aplication/json",
    "X-Client-Type": "mobile",
  },
});

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
  addresses: AddressResponse[];
  selectedAddress: AddressResponse | null;
};

const initialState: UserState = {
  userInfo: {},
  status: "idle",
  error: null,
  defaultAddress: null,
  selectedAddress: null,
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
    console.log("response from register", response);
    console.log("from api", response.data);
    return response.data;
  } catch (error: any) {
    console.log(error.message);
    return rejectWithValue(
      error.response?.data?.message || "Something went wrong",
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
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
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
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
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
        error.response?.data?.message || "Failed to save location",
      );
    }
  },
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
        error.response?.data?.message || "Failed to save address",
      );
    }
  },
);

export const updateUserAddress = createAsyncThunk<
  any,
  AddressRequest & { id: string },
  { rejectValue: string }
>(
  "user/updateUserAddress",
  async (
    address: AddressRequest & { id: string },
    { getState, rejectWithValue },
  ) => {
    console.log("reached update address thunk successfully", address);

    try {
      const { id, ...addressData } = address; // Extract id from address
      const response = await apiPath.put(
        `${Url}/api/addresses/${id}`,
        addressData,
        {},
      );
      console.log("updated address from api", response.data);

      return response.data;
    } catch (error: any) {
      console.log(error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update address",
      );
    }
  },
);

export const deleteUserAddress = createAsyncThunk<
  any,
  string,
  { rejectValue: string }
>(
  "user/deleteUserAddress",
  async (id: string, { getState, rejectWithValue }) => {
    console.log("reached delete address thunk successfully", id);

    try {
      const response = await apiPath.del(`${Url}/api/addresses/${id}`);
      console.log("deleted address from api", response.data);

      return response.data; // Returns { id }
    } catch (error: any) {
      console.log(error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete address",
      );
    }
  },
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.userInfo.accessToken = action.payload.accessToken;
      state.userInfo.refreshToken = action.payload.refreshToken;
    },
    setSelectedAddress: (state, action) => {
      console.log('setSelectedAddress reducer - payload:', action.payload);
      console.log('setSelectedAddress reducer - payload ID:', action.payload?.id);
      console.log('setSelectedAddress reducer - current state:', state.selectedAddress?.id);
      state.selectedAddress = action.payload;
      console.log('setSelectedAddress reducer - new state:', state.selectedAddress?.id);
    },

    logout(state) {
      // Reset to initial state
      state.userInfo = {};
      state.status = "idle";
      state.error = null;
      state.defaultAddress = null;
      state.selectedAddress = null;
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
        const { location, addresses, ...userWithoutLocation } = action.payload;
        console.log("user info reducer login", action.payload);
        console.log("login info without location", userWithoutLocation);
        state.userInfo = userWithoutLocation;
        state.defaultAddress = location || null;
        state.addresses = addresses || [];
        state.selectedAddress =
          addresses && addresses.length > 0 ? addresses[0] : null;
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
        console.log(
          "default address before api",
          action.payload.governorate,
          action.payload.city,
          action.payload.block,
        );
        state.defaultAddress = action.payload.data;
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
        console.log("address payload", action.payload.data);
        // Add the new address to the addresses array
        if (action.payload?.data) {
          state.addresses.push(action.payload.data);
          state.selectedAddress = action.payload.data; // Optionally set the newly added address as selected
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

          state.selectedAddress = action.payload.data;
        }
      })
      .addCase(updateUserAddress.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update address";
      })
      .addCase(deleteUserAddress.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteUserAddress.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log("deleted address payload", action.payload);
        // Filter out the deleted address by id
        if (action.payload?.id) {
          state.addresses = state.addresses.filter(
            (addr) => addr.id !== action.payload.id,
          );
        }
      })
      .addCase(deleteUserAddress.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to delete address";
      })
      .addCase(PURGE, (state, action) => {
        state.status = "failed";
      });
  },
});

export const { setToken, setSelectedAddress, logout } = userSlice.actions;

export default userSlice.reducer;
