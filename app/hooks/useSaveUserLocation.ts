// import { useState } from "react";
// import { Alert } from "react-native";
// import { useDispatch, useSelector } from "react-redux";
// import { unwrapResult } from "@reduxjs/toolkit";
// import { saveUserLocation } from "../redux/reducer/userReducer";
// import { AppDispatch } from "../redux/store";

// export const useSaveUserLocation = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const userId = useSelector((x: any) => x?.user?.userInfo.id);

//   const [loading, setLoading] = useState(false);

//   const saveLocation = async ({
//     governorate,
//     city,
//     block,
//     onSuccess,
//   }: {
//     governorate: any;
//     city: any;
//     block: any;
//     onSuccess?: () => void;
//   }) => {
//     const payload = {
//       userId,
//       country: "Kuwait",
//       governorate: governorate?.name,
//       city: city?.name,
//       block: block?.name,
//     };

//     try {
//       setLoading(true);
//       const result = await dispatch(saveUserLocation(payload));
//       unwrapResult(result);
//       onSuccess?.();
//     } catch (error) {
//       Alert.alert(
//         "Registration Error",
//         "Failed to register user. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { saveLocation, loading };
// };


import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { saveUserLocation } from "../redux/reducer/userReducer";
import { AppDispatch } from "../redux/store";
import { LocationRequest } from "../types/requests/locationRequest";

type SaveLocationParams = {
  payload: LocationRequest;
  onSuccess?: () => void;
  onError?: (error: any) => void;
};

export const useSaveUserLocation = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);

  const saveLocation = async ({
    payload,
    onSuccess,
    onError,
  }: SaveLocationParams) => {
    try {
        console.log('payload in hook',payload);
      setLoading(true);
      const response = await dispatch(saveUserLocation(payload));
      unwrapResult(response);
      onSuccess?.();
    } catch (error) {
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  return { saveLocation, loading };
};

