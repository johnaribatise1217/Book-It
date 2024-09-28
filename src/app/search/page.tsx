import { title } from 'process'
import React from 'react'
import Search from '../components/Search'

export const metadata = {
  title : "Search Rooms"
}

const SearchPage = () => {
  return (
    <div> <Search/> </div>
  )
}

export default SearchPage