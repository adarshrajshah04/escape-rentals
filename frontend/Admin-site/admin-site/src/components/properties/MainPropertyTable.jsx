import React, { useEffect } from 'react'
import { fetchProperties } from '../../redux/action/properties.action'

import { useDispatch, useSelector } from 'react-redux'
import PropertiesTable from './PropertiesTable'
import PageHeading from '../common/PageHeading'

const MainPropertyTable = () => {

    const dispatch=useDispatch()
    const {properties, isLoading, errorMsg}=useSelector((state)=>state.properties)
   
    useEffect(() => {
      dispatch(fetchProperties())
      
    
    }, [dispatch])
    // console.log(properties);
    
    
  return (
    <div className="admin-list-page">
        <PageHeading
          eyebrow="Inventory"
          title="Properties"
          description="Manage your rental listings, availability, and details."
        />
        <div className="overflow-x-auto">
          <PropertiesTable 
          properties={properties} 
          isLoading={isLoading}
          errorMsg={errorMsg} 
          />
          </div>
    </div>
  )
}

export default MainPropertyTable