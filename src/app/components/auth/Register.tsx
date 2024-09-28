'use client'
import React , {ChangeEventHandler, FormEvent, useEffect, useState} from 'react'
import { useRegisterMutation } from '../../../../redux/api/authApi'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import ButtonLoader from '../layout/ButtonLoader'

interface USER {
  name : string
  password : string
  email : string
}

const Register = () => {
  const [user, setUser] = useState<USER>({
    name :'',
    password : '',
    email : ''
  })

  const router = useRouter()

  const {name , password , email} = user

  const [register, {isLoading, error, isSuccess}] = useRegisterMutation()

  useEffect(() => {
    if(error && "data" in error){
      toast.error(error?.data?.errMessage)
    }

    if(isSuccess){
      router.push("/login")
      toast.success("Account registered. You can login now")
    }
  }, [error, isSuccess])

  const submitHandler = (e : FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const userRegistrationData = {name , email , password}

    register(userRegistrationData)
  }

  const onChange : ChangeEventHandler<HTMLInputElement> = (e) => {
    setUser({
      ...user,
      [e.target.name] : e.target.value
    })
  }

  return (
    <div className="wrapper">
      <div className="col-10 col-lg-5">
        <form className="shadow rounded bg-body" onSubmit={submitHandler}>
          <h2 className="mb-4">Join Us</h2>

          <div className="mb-3">
            <label htmlFor="name_field" className="form-label"> Full Name </label>
            <input
              type="text"
              id="name_field"
              className="form-control"
              name="name"
              value={name}
              onChange={onChange}
              disabled={isLoading}
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="email_field"> Email </label>
            <input
              type="email"
              id="email_field"
              className="form-control"
              name="email"
              value={email}
              onChange={onChange}
              disabled={isLoading}
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="password_field"> Password </label>
            <input
              type="password"
              id="password_field"
              className="form-control"
              name="password"
              value={password}
              onChange={onChange}
              disabled={isLoading}
            />
          </div>

          <button type="submit" className="btn btn-danger form-btn w-100 py-2">
            {isLoading ? <ButtonLoader/> : "Register"}
          </button>
          <div className="mt-3 mb-4">
            <a href="/login" className="float-end"> Already have an account? Login Here </a>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register