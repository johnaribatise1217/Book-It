'use client'
import { useRouter } from 'next/navigation'
import React, { FormEvent, useContext, useEffect, useState } from 'react'
import { useResetPasswordMutation } from '../../../../redux/api/authApi'
import toast from 'react-hot-toast'
import ButtonLoader from '../layout/ButtonLoader'
import { useAppSelector } from '../../../../redux/hooks'
import { StoreForgotPassword } from '@/app/provider/GlobalProvider'

interface Props {
 token : string
}

const NewPassword = ({token} : Props) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const router = useRouter()

  const {state : {Email}} = useContext(StoreForgotPassword)

  const [ResetPassword, {isLoading, isSuccess, error}] = useResetPasswordMutation()
 
  useEffect(() => {
    if(error && "data" in error){
      toast.error(error?.data?.errMessage)
    }
  
    if(isSuccess){
      toast.success("Password reset")
      router.push('/login')
    }
  }, [error, isSuccess])

  const submitHandler = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const passwords = {password, confirmPassword, Email}

    ResetPassword({token , body : passwords})
  }

  return (
    <div className="row wrapper mt-auto">
      <div className="col-10 col-lg-5">
        <form
          className="shadow rounded bg-body"
          onSubmit={submitHandler}
        >
          <h2 className="mb-4">New Password</h2>

          <div className="mb-3">
            <label htmlFor="password_field" className="form-label"> Password </label>
            <input
              type="password"
              id="password_field"
              className="form-control"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="confirm_password_field" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm_password_field"
              className="form-control"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn bg-danger text-white form-btn w-100 py-2">
            {isLoading ? <ButtonLoader/> : "Set Password"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default NewPassword