import { img } from 'framer-motion/client';
import logo from '../assets/images/logo.svg';
import React from 'react'

const Logo = () => {
  return (
    <img src={logo} alt='Mavericks@' className='logo' />
  )
}

export default Logo