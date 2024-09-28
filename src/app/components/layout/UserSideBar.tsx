'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const UserSideBar = () => {
  const menuItems = [
    {
      name : "Update Profile",
      url : "/me/update",
      icon : "fas fa-user"
    },
    {
      name : "Upload Avatar",
      url : "/me/upload_avatar",
      icon : "fas fa-user-circle"
    },
    {
      name : "Update Password",
      url : "/me/update_password",
      icon : "fas fa-lock"
    }
  ]

  const [activeMenuItem, setActiveMenuItem] = useState(menuItems[0].url)
  const path = usePathname()

  const handleClick = (item: string) => {
    setActiveMenuItem(item)
  }

  useEffect(() => {
    const activeItem = menuItems.find(item => item.url === path)

    if(activeItem) {
      setActiveMenuItem(activeItem.url)
    }
  }, [path])

  return (
    <div className="list-group gap-2 mt-5 pl-4">
      {menuItems.map((item, index) => (
        <Link
          key={index}
          href={item.url}
          className={`fw-bold cursor-pointer list-group-item list-group-item-action 
          ${activeMenuItem === item.url ? 'active' : ''}`}
          onClick={() => handleClick(item.url)}
          aria-current={activeMenuItem === item.url ? "true" : "false"}
        >
          <i className={`${item.icon} fa-fw pe-2`}></i> {item.name}
        </Link>
      ))}
    </div>
  )
}

export default UserSideBar