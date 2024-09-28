import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface IUserState {
  user : any,
  isAuthenticated : boolean
  forgotPasswordEmail: string
}

const initialState : IUserState = {
  user : null,
  isAuthenticated : false,
  forgotPasswordEmail : ""
}

export const userSlice = createSlice({
  initialState,
  name : "userSlice",
  reducers : {
    setUser : (state, action : PayloadAction<any>) => {
      state.user = action.payload
    },
    setIsAuthenticated : (state, action : PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload
    },
    setForgotPasswordEmail : (state, action: PayloadAction<string>) => {
      state.forgotPasswordEmail = action.payload
      console.log(state.forgotPasswordEmail)
    }
  }
})

export default userSlice.reducer
export const {setUser, setIsAuthenticated, setForgotPasswordEmail} = userSlice.actions