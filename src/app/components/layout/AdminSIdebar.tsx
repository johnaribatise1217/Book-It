'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const AdminSideBar = () => {
  const menuItems = [
    {
      name : "Dashboard",
      url : "/admin/dashboard",
      icon : "fas fa-tachometer-alt"
    },
    {
      name : "Rooms",
      url : "/admin/rooms",
      icon : "fas fa-hotel"
    },
    {
      name : "Bookings",
      url : "/admin/bookings",
      icon : "fas fa-receipt"
    },
    {
      name : "Users",
      url : "/admin/users",
      icon : "fas fa-users"
    },
    {
      name : "Reviews",
      url : "/admin/reviews",
      icon : "fas fa-star"
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
          ${activeMenuItem === item.url ? 'text-white bg-danger' : ''}`}
          onClick={() => handleClick(item.url)}
          aria-current={activeMenuItem === item.url ? "true" : "false"}
        >
          <i className={`${item.icon} fa-fw pe-2`}></i> {item.name}
        </Link>
      ))}
    </div>
  )
}

export default AdminSideBar