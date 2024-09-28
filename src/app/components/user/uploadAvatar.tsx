'use client'
import React, { FormEvent, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import { useLazyUpdateSessionQuery, useUploadAvatarMutation } from '../../../../redux/api/userApi'
import { useRouter } from 'next/navigation'
import { setUser } from '../../../../redux/features/UserSlice'
import toast from 'react-hot-toast'
import ButtonLoader from '../layout/ButtonLoader'

const UploadAvatar = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const [avatar, setAvatar] = useState('')
  const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg')

  const {user} = useAppSelector((state) => state.auth)

  const [uploadAvatar, {error, isLoading, isSuccess}] = useUploadAvatarMutation()
  const [updateSession, {data}] = useLazyUpdateSessionQuery()

  if(data) dispatch(setUser(data?.user))

  useEffect(() => {
    if(user?.avatar){
      setAvatarPreview(user?.avatar?.url)
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
  }, [user, error, isSuccess])

  const submitHandler = (e : FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const userData = {avatar}

    uploadAvatar(userData)
  }

  const handleChange : React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = Array.from(e.target.files || [])

    const reader = new FileReader()

    reader.onload = () => {
      if(reader.readyState === 2) {
        setAvatar(reader.result as string)
        setAvatarPreview(reader.result as string)
      }
    }

    if (files.length > 0) {
      reader.readAsDataURL(files[0])
    }
  }

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-8">
        <form
          className="shadow rounded bg-body"
          onSubmit={submitHandler}
        >
          <h2 className="mb-4">Upload Avatar</h2>

          <div className="form-group">
            <div className="d-flex align-items-center">
              <div className="me-3">
                <figure className="avatar item-rtl">
                  <img src={avatarPreview} className="rounded-circle" alt="image" />
                </figure>
              </div>
              <div className="input-foam">
                <label className="form-label" htmlFor="customFile">
                  Choose Avatar
                </label>
                <input
                  type="file"
                  name="avatar"
                  className="form-control"
                  id="customFile"
                  accept="images/*"

                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="btn bg-danger text-white form-btn w-100 py-2"
          >{isLoading ? <ButtonLoader/> : 'Upload'}</button>
        </form>
      </div>
    </div>
  )
}

export default UploadAvatar