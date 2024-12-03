import React from 'react'
import { NmfGrid,NmfHeaders } from '../Components'
import { div } from 'framer-motion/client'
const Nmf = () => {
  return (
    <div>
      <NmfHeaders />
      <NmfGrid />
    </div>
  )
}

export default Nmf