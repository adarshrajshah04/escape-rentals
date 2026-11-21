import React from 'react'
import { Outlet ,Navigate } from 'react-router-dom'


export const Private = () => {
    const token = localStorage.getItem("access_token")
  return (
    
    <div>
        {token?<Outlet/>:<Navigate to={'/login'}/>}
    </div>
  )
}