'use client'

// React Imports
import { useState } from 'react'
import type { FormEvent } from 'react'

// Next Imports
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import Illustrations from '@components/Illustrations'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { Box } from '@mui/material'
import { getStorageData, setStorageData } from '@/utils/helpers'
import { log } from 'console'
import { IconExclamationCircle } from '@tabler/icons-react'

const Login = () => {
  const router = useRouter()
  const isLogged: any =
    getStorageData('typeOfLogger') !== -1 &&
    getStorageData('typeOfLogger') !== null &&
    getStorageData('typeOfLogger') !== undefined

  if (isLogged) {
    router.push('/')
  }
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [data, setData] = useState<any>({ email: '', mdp: '' })
  const [typeOfLogger, setTypeOfLogger] = useState<number>(-1)
  const [controls, setControls] = useState<any>({
    email: false,
    mdp: false
  })

  async function handleSave() {
    try {
      // setControls((prev: any) => ({ ...prev, email: data.email?.trim() === '' }));
      // setControls((prev: any) => ({ ...prev, mdp: data.mdp?.trim() === '' }));
      const url = `${window.location.origin}/api/login/auth`
      const requestBody = JSON.stringify({ email: data.email, mdp: data.mdp })

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: requestBody
      }
      const response = await fetch(url, requestOptions)

      const result = await response.json()

      if (!result.erreur) {
        setStorageData('typeOfLogger', result.role)
        router.push('/')
      } else {
        setTypeOfLogger(0)
      }
    } catch (error) {
      console.error('Erreur de connexion', error)
    }
  }

  const darkImg = '/images/pages/auth-v1-mask-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-light.png'

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.push('/')
  }

  return (
    <div className='flex flex-col lg:flex-row min-h-screen items-center justify-center w-full md:w-full relative h-screen w-screen bg-white'>
      <div className='hidden lg:flex flex-1 justify-center items-center min-h-screen bg-gray-100'>
        <span className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </span>
        <img src='/images/pages/doc1.svg' className='max-w-[800px]' />
      </div>

      {/* Formulaire */}
      <div className='flex flex-col justify-center items-center w-full max-w-xl p-12 min-h-screen space-y-6'>
        <div className='mb-5'>
          <h3 className='text-3xl font-bold mb-3'>Welcome to MediConnect ! 👋🏻</h3>
          <Typography className='mbs-1 text-lg '>Please sign-in to your account and start the adventure</Typography>
        </div>
        <form className='w-full space-y-6 mt-8'>
          {typeOfLogger === 0 ? (
            <div className='err'>
              <IconExclamationCircle stroke={2} color='red' className='posIconErreur' />
              <p className='posErreur'>Email ou mot de passe incorrect, veuillez réessayer</p>
            </div>
          ) : null}

          <div>
            <TextField
              value={data.email}
              fullWidth
              className={`${controls?.email === true ? 'isReq' : ''}`}
              label='Email'
              type='email'
              autoFocus
              InputLabelProps={{
                sx: { fontSize: '1rem' }
              }}
              InputProps={{
                sx: {
                  height: 60,
                  '&.Mui-focused': {
                    '& + .MuiInputLabel-root': {
                      fontSize: '1rem'
                    }
                  }
                }
              }}
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
            {controls.email === true ? <span className='errmsg'>Please enter the email !</span> : null}
          </div>
          <div>
            <TextField
              fullWidth
              value={data.mdp}
              className={`${controls?.mdp === true ? 'isReq' : ''}`}
              label='Password'
              id='outlined-adornment-password'
              type={isPasswordShown ? 'text' : 'password'}
              InputLabelProps={{
                sx: { fontSize: '1rem' }
              }}
              onChange={(e: any) => {
                if (e.target?.value.trim() === '') {
                  setControls({ ...controls, mdp: true })
                  setData((prev: any) => ({
                    ...prev,
                    mdp: e.target.value
                  }))
                } else {
                  setControls({ ...controls, mdp: false })
                  setData((prev: any) => ({
                    ...prev,
                    mdp: e.target.value
                  }))
                }
              }}
              InputProps={{
                sx: {
                  height: 60,
                  '&.Mui-focused': {
                    '& + .MuiInputLabel-root': {
                      fontSize: '1rem'
                    }
                  },
                  paddingRight: 5
                },
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      size='large'
                      edge='end'
                      onClick={handleClickShowPassword}
                      onMouseDown={e => e.preventDefault()}
                    >
                      <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            {controls?.mdp === true ? <span className='errmsg'>Please enter the password !</span> : null}
          </div>
          <Box
            className='flex justify-between items-center'
            sx={{
              fontSize: '1rem'
            }}
          >
            <FormControlLabel
              control={<Checkbox />}
              label='Remember me'
              sx={{
                '& .MuiFormControlLabel-label': {
                  fontSize: '1rem'
                }
              }}
            />
            <Link href='/forgot-password' className='text-primary'>
              Forgot password?
            </Link>
          </Box>
          <Button
            fullWidth
            variant='contained'
            color='primary'
            sx={{
              height: 40,
              fontSize: '1rem'
            }}
            onClick={() => {
              handleSave()
            }}
          >
            Log In
          </Button>
          <Box
            className='text-center'
            sx={{
              fontSize: '1rem'
            }}
          >
            <span>New on our platform? </span>
            <Link href='/register' className='text-primary'>
              Create an account
            </Link>
          </Box>
        </form>
      </div>
    </div>
  )
}

export default Login
