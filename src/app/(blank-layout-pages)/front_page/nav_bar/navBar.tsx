'use client'
import React from 'react'
import { IoMdMenu } from 'react-icons/io'
import { motion } from 'framer-motion'
import Logo from '@/components/layout/shared/Logo'
import { Button } from '@mui/material'
import { useRouter } from 'next/navigation'
import path from 'path'
import Link from '@/components/Link'

const NavbarMenu = [
  {
    id: 1,
    title: 'Acceuil',
    path: '/front_page'
  },
  {
    id: 2,
    title: 'À propos de nous',
    path: '/front_page/a-propos-de-nous'
  },
  {
    id: 3,
    title: 'Médecin',
    path: '/front_page/med'
  },
  {
    id: 4,
    title: 'Laboratoire',
    path: '/front_page/labo'
  },
  {
    id: 5,
    title: 'Contactez-nous',
    path: '/front_page/contactez-nous'
  },
  {
    id: 6,
    title: 'Se connecter',
    path: '/login'
  }
]
const Navbar = () => {
  const router = useRouter()
  return (
    <nav className='relative z-20'>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className='py-2 px-20 bg-white flex justify-between font-poppins items-center'
        // style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}
      >
        {/* Logo section */}
        <div>
          <Logo />
        </div>
        {/* Menu section */}
        <div className='hidden lg:block'>
          <ul className='flex items-center gap-3' style={{ listStyle: 'none' }}>
            {NavbarMenu.map(menu => (
              <li key={menu.id}>
                <a href={menu.path} className='inline-block py-2 px-3 navigation relative group'>
                  <div className='w-2 h-2 absolute mt-4 left-1/2 -translate-x-1/2 top-1/2 bottom-0 group-hover:block hidden'></div>
                  {menu.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
        {/* Mobile Hamburger menu section */}

        <div className='lg:hidden'>
          <IoMdMenu className='text-4xl' />
        </div>
      </motion.div>
    </nav>
  )
}

export default Navbar
