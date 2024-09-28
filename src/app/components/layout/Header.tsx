'use client'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import { setIsAuthenticated, setUser } from '../../../../redux/features/UserSlice'

const Header = () => {
  const {data} = useSession()
  const dispatch = useAppDispatch()
  const {user} = useAppSelector((state) => state.auth)

  useEffect(() => {
    if(data){
      dispatch(setUser(data?.user))
      dispatch(setIsAuthenticated(true))
    }
  }, [data])
  
  const handleLogout = () => {
    signOut()
  }

  return (
    <nav className="navbar sticky-top py-2 ">
      <div className="container">
        <div className="col-6 col-lg-3  px-2">
          <div className="navbar-brand">
            <Link href="/">
              <img
                style={{cursor: "pointer", width : '6.5rem'}}
                src="/images/bookit_logo.png"
                alt="BookIT"
              />
            </Link>
          </div>
        </div>

        <div className="col-6 col-lg-3  mt-md-0 text-end">
          {user ? 
            ( 
              <div className="ml-4 dropdown flex items-center d-line">
                <button
                  className="btn dropdown-toggle flex items-center"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <figure className="avatar avatar-nav">
                    <img
                      src={user?.avatar ? user?.avatar?.url : "/images/default_avatar.jpg"}
                      alt="John Doe"
                      className="rounded-circle placeholder-glow"
                      height="50"
                      width="50"
                    />
                  </figure>
                  <span className="placeholder-glow pl-px-3"> {user?.name}</span>
                </button>

                <div
                  className="dropdown-menu w-100 ml-px-[1rem]"
                  aria-labelledby="dropdownMenuButton1"
                >
                  <Link href="/admin/dashboard" className="dropdown-item">Dashboard</Link>
                  <Link href="/bookings/me" className="dropdown-item">My Bookings</Link>
                  <Link href="/me/update" className="dropdown-item">Profile</Link>
                  <Link href="/" className="dropdown-item text-danger" onClick={handleLogout}>Logout</Link>
                </div>
              </div>
            ) : (
              <>
                {data === undefined && (
                  <div className="placeholder-glow">
                    <figure className="avatar avatar-nv placeholder bg-secondary"></figure>
                    <span className="placeholder w-25 bg-secondary ms-2"></span>
                  </div>
                )}
                {data === null && (
                  <Link href="/login" className='btn btn-danger text-white float-right login-header-btn cursor-pointer'>
                    Login
                  </Link>
                )}
              </>
            )
          }
        </div>
      </div>
    </nav>
  )
}

export default Header