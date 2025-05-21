'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import IconButton from '@mui/material/IconButton'
import classnames from 'classnames'

import { Badge } from '@mui/material'

import { toast } from 'react-toastify'

import NavToggle from './NavToggle'
import NavSearch from '@components/layout/shared/search'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'
import { useNotification } from '@/context/NotificationContext'
import { getStorageData } from '@/utils/helpers'

const NavbarContent = () => {
  const { show, trigger } = useNotification()
  const [isMessageVisible, setMessageVisible] = useState(false)
  const [notification, setNotification] = useState<any>({})
  const userData = getStorageData('user')

  useEffect(() => {
    trigger()
  }, [])

  const handleIconClick = () => {
    setMessageVisible(true)
  }

  const handleCloseMessage = () => {
    setMessageVisible(false)
  }

  async function getNotification(id: any) {
    try {
      const url = `${window.location.origin}/api/notification/get-notification?id_recepteur=${id}`

      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }

      const response = await fetch(url, requestOptions)

      if (!response.ok) throw new Error('Erreur lors de la requête')

      const responseData = await response.json()

      setNotification(responseData)
      console.log(responseData)
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Une erreur est survenue lors de la récupération des données.')
    }
  }

  const notificationVu = async (id: any) => {
    try {
      const response = await fetch(`${window.location.origin}/api/notification/vu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: id
        })
      })

      const result = await response.json()

      if (!response.ok || result.erreur) {
        toast.error('Erreur !')
      }
    } catch (err) {
      toast.error('Erreur !')
    }
  }

  useEffect(() => {
    const interval = setInterval(async () => {
      await getNotification(userData?.id)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

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
          <Badge badgeContent={`${notification?.vuno > 0 ? notification?.vuno : ''}`} color='error'>
            <i className='ri-notification-2-line' style={{ color: 'white', fontSize: '25px' }} />
            {isMessageVisible && (
              <div className='absolute top-10 right-0 w-60 bg-white p-2 rounded-md shadow-md'>
                {notification?.data?.map((x: any) => {
                  return (
                    <div key={x.id}>
                      <h5>{x.titre}</h5>
                      <p>{x.message}</p>
                      <button onClick={handleCloseMessage} className='text-sm text-blue-500'>
                        X
                      </button>
                    </div>
                  )
                })}
              </div>
            )}{' '}
          </Badge>
        </IconButton>

        <UserDropdown />
      </div>
    </div>
  )
}

export default NavbarContent
