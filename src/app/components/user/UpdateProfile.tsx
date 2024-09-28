'use client'
import React, { FormEvent, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import { useLazyUpdateSessionQuery, useUpdateProfileMutation } from '../../../../redux/api/userApi'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import ButtonLoader from '../layout/ButtonLoader'
import { setUser } from '../../../../redux/features/UserSlice'

const UpdateProfile = () => {
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const dispatch = useAppDispatch()

  const {user : currentUser} = useAppSelector((state) => state.auth)

  const [updateProfile, {error, isSuccess, isLoading}] = useUpdateProfileMutation()
  const [updateSession, {data}] = useLazyUpdateSessionQuery()

  if(data) dispatch(setUser(data?.user))

  const router = useRouter()

  useEffect(() => {
    if(currentUser){
      setName(currentUser?.name)
      setEmail(currentUser?.email)
    }

    if(error && 'data' in error){
      toast.error(error?.data?.errMessage)
    }

    if(isSuccess){
      //@ts-ignore
      updateSession()

      toast.success("User updated successfully")
      router.refresh()
    }

  }, [currentUser,error, isSuccess])

  const submitHandler = (e : FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const userData = {name, email}

    updateProfile(userData)
  }

  return (
    <div className="row wrapper mt-auto">
      <div className="col-10 col-lg-8">
        <form
          className="shadow rounded bg-body"
          onSubmit={submitHandler}
        >
          <h2 className="mb-4">Update Profile</h2>

          <div className="mb-3">
            <label htmlFor="name_field" className="form-label">Name</label>
            <input
              type="text"
              id="name_field"
              className="form-control"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email_field" className="form-label">Email</label>
            <input
              type="email"
              id="email_field"
              className="form-control"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit" disabled={isLoading} className="btn btn-danger form-btn w-100 py-2">
            {isLoading ? <ButtonLoader/> : 'UPDATE'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default UpdateProfile