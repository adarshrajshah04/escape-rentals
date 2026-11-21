import React, { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { fetchUsers } from '../../redux/action/user.action'
import UserTable from './UserTable'
import PageHeading from '../common/PageHeading'
const MainUserTable = () => {

    const dispatch=useDispatch()
    const {users, isLoading, errorMsg}=useSelector((state)=>state.users)

    const [filteruser, setFilteruser] = useState([])
   
    useEffect(() => {
      dispatch(fetchUsers())

      
    
    }, [dispatch])

    useEffect(() => {
        if (users) {
            setFilteruser(
                users.filter((user) => user.is_admin === false)
            )
        }
    }, [users])

    
    
    
  return (
    <div className="admin-list-page">
        <PageHeading
          eyebrow="People"
          title="Users"
          description="View and manage customer accounts on your platform."
        />
        <div className="overflow-x-auto">
          <UserTable 
          users={filteruser} 
          isLoading={isLoading}
          errorMsg={errorMsg} 
          />
          </div>
    </div>
  )
}

export default MainUserTable