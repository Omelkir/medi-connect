'use client'

import React, { useRef, useState } from 'react'

import { IoMdMenu } from 'react-icons/io'
import { motion } from 'framer-motion'

import Badge from '@mui/material/Badge'

import Avatar from '@mui/material/Avatar'
import { styled } from '@mui/material/styles'

import Logo from '@/components/layout/shared/Logo'
import { getStorageData } from '@/utils/helpers'

const userData = getStorageData('user')

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

const BadgeContentSpan = styled('span')({
  width: 8,
  height: 8,
  borderRadius: '50%',
  cursor: 'pointer',
  backgroundColor: 'var(--mui-palette-success-main)',
  boxShadow: '0 0 0 2px var(--mui-palette-background-paper)'
})

const Navbar = () => {
  const anchorRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  const handleDropdownOpen = () => {
    !open ? setOpen(true) : setOpen(false)
  }

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

        <div className='lg:hidden'>
          <IoMdMenu className='text-4xl' />
        </div>
        {/* {userData.role === '4' ? (
          <Badge
            ref={anchorRef}
            overlap='circular'
            badgeContent={<BadgeContentSpan onClick={handleDropdownOpen} />}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            className='mis-2'
          >
            <Avatar
              ref={anchorRef}
              alt='John Doe'
              src='/images/avatars/1.png'
              onClick={handleDropdownOpen}
              className='cursor-pointer bs-[38px] is-[38px]'
            />
          </Badge>
        ) : null} */}
      </motion.div>
    </nav>
  )
}

export default Navbar
