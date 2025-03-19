'use client'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import Form from '@components/Form'
import DirectionalIcon from '@components/DirectionalIcon'
import Illustrations from '@components/Illustrations'
import Logo from '@components/layout/shared/Logo'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useState } from 'react'

const ForgotPassword = () => {
  const [data, setData] = useState<any>({
    email: '',
    message: ''
  })

  const [controls, setControls] = useState<any>({
    email: false
  })
  const clearForm = () => {
    setData({ email: '' })
    setControls(false)
  }
  async function handleSave() {
    try {
      const url = `${window.location.origin}/api/forgot-password/send-mail`

      const canGo: boolean = true

      if (canGo) {
        const requestBody = JSON.stringify({ to: data.email })

        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: requestBody
        }

        // Send the request
        const response = await fetch(url, requestOptions)
        const responseData = await response.json()

        // Clear the form after successful submission
        // clearForm()
      } else {
        console.log('Validation failed: Some fields are empty.')
      }
    } catch (error) {
      console.log('Erreur:', error)
    }
  }

  return (
    <div className='flex flex-col lg:flex-row min-h-screen w-full md:w-full items-center justify-center relative h-screen w-screen bg-white'>
      <div className='hidden lg:flex flex-1 justify-center items-center min-h-screen bg-gray-100'>
        <span className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </span>
        <img src='/images/pages/doc3.svg' className='max-w-[800px]' />
      </div>

      {/* Formulaire */}
      <div className='flex flex-col justify-center items-center w-full max-w-xl p-12 min-h-screen space-y-6'>
        <div className='mb-5'>
          <h3 className='text-3xl font-bold mb-3'>Forgot Password 🔒</h3>
          <Typography className='mbs-1 text-lg'>
            Enter your email and we&#39;ll send you instructions to reset your password
          </Typography>
        </div>
        <form noValidate autoComplete='off' className='w-full space-y-6 mt-8'>
          <TextField
            value={data?.email || null}
            fullWidth
            label='Email'
            autoFocus
            InputLabelProps={{ sx: { fontSize: '1rem' } }}
            InputProps={{
              sx: { height: 60 }
            }}
            className={`${controls?.email === true ? 'isReq' : ''}`}
            onChange={(e: any) => {
              if (e.target?.value.trim() === '') {
                setControls({ ...controls, email: true })
                setData((prev: any) => ({
                  ...prev,
                  email: e.target.value
                }))
              } else {
                setControls({ ...controls, email: false })
                setData((prev: any) => ({
                  ...prev,
                  email: e.target.value
                }))
              }
            }}
          />
          {controls?.email === true ? <span className='errmsg'>Please enter the email !</span> : null}
          <Button
            fullWidth
            variant='contained'
            type='button'
            sx={{
              height: 40,
              fontSize: '1rem'
            }}
            onClick={() => {
              handleSave()
            }}
          >
            Send reset link
          </Button>

          <Typography className='flex justify-center items-center mt-4' color='primary'>
            <Link href='/login' className='flex items-center'>
              <DirectionalIcon ltrIconClass='ri-arrow-left-s-line' rtlIconClass='ri-arrow-right-s-line' />
              <span>Back to Login</span>
            </Link>
          </Typography>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword
