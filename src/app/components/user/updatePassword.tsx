'use client'
import React, { FormEvent, useEffect, useState } from 'react'
import { useUpdatePasswordMutation } from '../../../../redux/api/userApi'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import ButtonLoader from '../layout/ButtonLoader'

const UpdatePassword = () => {
  const [newPassword , setNewPassword] = useState<string>('')
  const [oldPassword , setOldPassword] = useState<string>('')

  const [updatePassword, {isLoading, error, isSuccess}] = useUpdatePasswordMutation()
  const router = useRouter()

  useEffect(() => {
    if(error && 'data' in error){
      toast.error(error?.data?.errMessage)
    }

    if(isSuccess){
      toast.success("Password updated successfully")
      signOut().then(() => {
        router.push("/login")
      })
    }
  }, [error, isSuccess, router])

  const submitHandler = (e : FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const passwords = {newPassword, oldPassword}

    updatePassword(passwords)
  }

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-8">
        <form
          className="shadow rounded bg-body"
          onSubmit={submitHandler}
        >
          <h2 className="mb-4">Change Password</h2>

          <div className="mb-3">
            <label className="form-label" htmlFor="old_password_field">
              Old Password
            </label>
            <input
              type="password"
              id="old_password_field"
              className="form-control"
              name="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="new_password_field">
              New Password
            </label>
            <input
              type="password"
              id="new_password_field"
              className="form-control"
              name="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <button type="submit" disabled={isLoading} className="btn bg bg-danger text-white form-btn w-100 py-2">
            {isLoading ? <ButtonLoader/> : "Update"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default UpdatePassword