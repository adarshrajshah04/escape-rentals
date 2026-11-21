import React, { useEffect } from 'react'
import { fetchCategory } from '../../redux/action/category.action'
import { useDispatch, useSelector } from 'react-redux'
import CategoryTable from './CategoryTable'
import PageHeading from '../common/PageHeading'
const ManiCatrgoryTable = () => {

    const dispatch=useDispatch()
    const {category, isLoading, errorMsg}=useSelector((state)=>state.category)
   
    useEffect(() => {
      dispatch(fetchCategory())
      
    
    }, [dispatch])
    console.log(category);
    
    
  return (
    <div className="admin-list-page">
        <PageHeading
          eyebrow="Catalog"
          title="Categories"
          description="Organize the property types available on your platform."
        />
        <div className="overflow-x-auto">
          <CategoryTable 
          category={category} 
          isLoading={isLoading}
          errorMsg={errorMsg} 
          />
          </div>
    </div>
  )
}

export default ManiCatrgoryTable