import React from 'react'
import { Hero ,FeaturedData} from '../Components'
import { Outlet } from 'react-router-dom'

const DictionaryLanding = () => {
  return (
    <>
      <Hero />
      <FeaturedData />
    </>
  );
}

export default DictionaryLanding
