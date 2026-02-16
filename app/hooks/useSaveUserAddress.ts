import { useState } from "react";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { saveUserAddress, updateUserAddress, deleteUserAddress } from "../redux/reducer/userReducer";
import { AppDispatch } from "../redux/store";
import { AddressRequest } from "../types/requests/addressRequest";

type SaveAddressParams = {
  payload: AddressRequest;
  onSuccess?: () => void;
  onError?: (error: any) => void;
};

type UpdateAddressParams = {
  payload: AddressRequest & { id: string };
  onSuccess?: () => void;
  onError?: (error: any) => void;
};

type DeleteAddressParams = {
  id: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
};

export const useUserAddress = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);

  const saveAddress = async ({
    payload,
    onSuccess,
    onError,
  }: SaveAddressParams) => {
    try {
      console.log("payload in hook (save)", payload);
      setLoading(true);
      const response = await dispatch(saveUserAddress(payload));
      unwrapResult(response);
      onSuccess?.();
    } catch (error) {
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  const updateAddress = async ({
    payload,
    onSuccess,
    onError,
  }: UpdateAddressParams) => {
    try {
      console.log("payload in hook (update)", payload);
      setLoading(true);
      const response = await dispatch(updateUserAddress(payload));
      unwrapResult(response);
      onSuccess?.();
    } catch (error) {
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async ({
    id,
    onSuccess,
    onError,
  }: DeleteAddressParams) => {
    try {
      console.log("id in hook (delete)", id);
      setLoading(true);
      const response = await dispatch(deleteUserAddress(id));
      unwrapResult(response);
      onSuccess?.();
    } catch (error) {
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  return { saveAddress, updateAddress, deleteAddress, loading };
};
