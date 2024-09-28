'use client'
import { SessionProvider } from "next-auth/react"
import React, { createContext, Dispatch, useReducer } from "react"
import { Toaster } from "react-hot-toast"
import { Provider } from "react-redux"
import { store } from "../../../redux/store"

interface ForgotPasswordState {
  Email: string;
}

interface ForgotPasswordAction {
  type: string;
  payload?: any;
}

// Define the type for the context value
interface ForgotPasswordContextValue {
  state: ForgotPasswordState;
  dispatch: Dispatch<ForgotPasswordAction>;
}

// Create the context with a default value
export const StoreForgotPassword = createContext<ForgotPasswordContextValue>({
  state: { Email: "" },
  dispatch: () => null,
});

// Define the reducer function
const EmailReducer = (state: ForgotPasswordState, action: ForgotPasswordAction): ForgotPasswordState => {
  switch (action.type) {
    case "ENTER EMAIL" : 
      if (typeof window !== 'undefined') {
        localStorage.setItem("email", action.payload);
      }
      return {...state, Email : action.payload}
    default:
      return state;
  }
}
export const GlobalProvider = ({children} : {children : React.ReactNode}) => {
  const storedEmail = typeof window !== 'undefined' ? localStorage.getItem("email") || "" : "";

  const forgotPasswordEmail : ForgotPasswordState = {
    Email : storedEmail
  }

  const [state, dispatch] = useReducer(EmailReducer, forgotPasswordEmail)

  return (
    <>
      <Toaster/>
      <Provider store={store}>
          <StoreForgotPassword.Provider value={{state,dispatch}}>
            <SessionProvider>
              {children}
            </SessionProvider>
          </StoreForgotPassword.Provider>
      </Provider>
    </>
  )
}