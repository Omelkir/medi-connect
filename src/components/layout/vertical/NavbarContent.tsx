'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import IconButton from '@mui/material/IconButton'
import classnames from 'classnames'

import NavToggle from './NavToggle'
import NavSearch from '@components/layout/shared/search'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'
import { useNotification } from '@/context/NotificationContext'

const NavbarContent = () => {
  const { show, trigger } = useNotification()
  const [isMessageVisible, setMessageVisible] = useState(false)

  useEffect(() => {
    trigger()
  }, [])

  const handleIconClick = () => {
    setMessageVisible(true)
  }

  const handleCloseMessage = () => {
    setMessageVisible(false)
  }

  return (
    <div
      className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}
      style={{ backgroundColor: 'rgb(17, 106, 239)', padding: '20px', borderRadius: '10px' }}
    >
      <div className='flex items-center gap-2 sm:gap-4'>
        <NavToggle />
        <NavSearch />
      </div>
      <div className='flex items-center'>
        <ModeDropdown />

        <IconButton className='text-textPrimary' onClick={handleIconClick}>
          <i className='ri-notification-2-line' style={{ color: 'white', fontSize: '25px' }} />

          {show && <span className='absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping' />}

          {isMessageVisible && (
            <div className='absolute top-10 right-0 w-60 bg-white p-2 rounded-md shadow-md'>
              <p>This is your notification message!</p>
              <button onClick={handleCloseMessage} className='text-sm text-blue-500'>
                Close
              </button>
            </div>
          )}
        </IconButton>

        <UserDropdown />
      </div>
    </div>
  )
}

export default NavbarContent
