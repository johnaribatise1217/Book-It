import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react"
import { IUser } from "../backend/models/user"
import { NextRequest } from "next/server"

declare module "@reduxjs/toolkit/query/react"{
  interface FetchBaseQueryError {
    data? : any
  }
}

declare module "next/server" {
  interface NextRequest {
    user : IUser
  }
}

declare module "node-geocoder"