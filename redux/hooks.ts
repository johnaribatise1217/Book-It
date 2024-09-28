import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";

//use throughout the app instead of plain useSelector and useDispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector : TypedUseSelectorHook<RootState> = useSelector