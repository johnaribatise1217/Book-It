'use client'
import React, { useContext, useEffect, useState } from 'react'
import { useForgotPasswordMutation } from '../../../../redux/api/authApi'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import ButtonLoader from '../layout/ButtonLoader'
import { StoreForgotPassword } from '@/app/provider/GlobalProvider'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [ForgotPassword, {error, isLoading, isSuccess}] = useForgotPasswordMutation()
  const router = useRouter()
  const {dispatch} = useContext(StoreForgotPassword)
  const {state : {Email}} = useContext(StoreForgotPassword)

  useEffect(() => {
    if(error && 'data' in error){
      toast.error(error?.data?.errMessage)
    }

    if(isSuccess){
      toast.success('Email sent successfully, check your mail!')
    }
  })

  const submitHandler = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const userData = {email}

    dispatch({
      type : "ENTER EMAIL",
      payload : email
    })

    console.log(Email)

    ForgotPassword(userData)
  }

  return (
    <div className="mt-auto row wrapper">
      <div className="col-10 col-lg-5">
        <form
          className="shadow rounded bg-body"
          onSubmit={submitHandler}
        >
          <h2 className="mb-4">Forgot Password</h2>
          <div className="mb-3">
            <label htmlFor="email_field" className="form-label"> Enter Email </label>
            <input
              type="email"
              id="email_field"
              className="form-control"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit" className="btn bg-danger text-white form-btn w-100 py-2" disabled={isLoading}>
            {isLoading ? <ButtonLoader/> : "Send Email"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword