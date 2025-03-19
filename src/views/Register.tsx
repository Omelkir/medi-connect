'use client'

// React Imports
import { useEffect, useState } from 'react'

// Next Imports
import Link from 'next/link'

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
import Illustrations from '@components/Illustrations'
import Logo from '@components/layout/shared/Logo'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { FormControl, Input, InputLabel, MenuItem, Select, Grid } from '@mui/material'
import { Label } from 'recharts/types/component/Label'

const Register = () => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)

  const [data, setData] = useState<any>({
    imageSrc: '/img/placeholder-image.jpg',
    image: '',
    email: '',
    mdp: '',
    role: 0,
    tarif: 0,
    ville: 0,
    horaires: '',
    info: '',
    nom_ut: '',
    spe: 0,
    ser: 0
  })
  const villes = [
    { label: 'Ariana', value: 1 },
    { label: 'Béja', value: 2 },
    { label: 'Ben Arous', value: 3 },
    { label: 'Bizerte', value: 4 },
    { label: 'Gabès', value: 5 },
    { label: 'Gafsa', value: 6 },
    { label: 'Jendouba', value: 7 },
    { label: 'Kairouan', value: 8 },
    { label: 'Kasserine', value: 9 },
    { label: 'Kébili', value: 10 },
    { label: 'Kef', value: 11 },
    { label: 'Mahdia', value: 12 },
    { label: 'Manouba', value: 13 },
    { label: 'Médenine', value: 14 },
    { label: 'Monastir', value: 15 },
    { label: 'Nabeul', value: 16 },
    { label: 'Sfax', value: 17 },
    { label: 'Sidi Bouzid', value: 18 },
    { label: 'Siliana', value: 19 },
    { label: 'Sousse', value: 20 },
    { label: 'Tataouine', value: 21 },
    { label: 'Tozeur', value: 22 },
    { label: 'Tunis', value: 23 },
    { label: 'Zaghouan', value: 24 }
  ]

  const handleImageChange = (e: any) => {
    const file = e.target.files[0]
    if (file) {
      // Créer une URL pour l'aperçu de l'image
      setData((prev: any) => ({
        ...prev,
        imageSrc: URL.createObjectURL(file) // Prévisualisation de l'image
      }))

      // Lire le fichier en Base64
      const reader = new FileReader()
      reader.onloadend = () => {
        // Une fois l'image convertie en Base64, mettre à jour l'état
        setData((prev: any) => ({
          ...prev,
          image: reader.result // Image en Base64
        }))
      }
      reader.readAsDataURL(file) // Convertir le fichier en Base64
    }
  }

  const [controls, setControls] = useState<any>({
    email: false,
    mdp: false,

    role: false,

    nom_ut: false
  })
  const options = [
    { label: 'Admin', value: 1 },
    { label: 'Médecin', value: 2 },
    { label: 'Laboratoire', value: 3 }
  ]
  const optionsMed = [
    { label: 'Médecine dentaire', value: 1 },
    { label: 'Cardiologie', value: 2 },
    { label: 'Dermatologie', value: 3 },
    { label: 'Ophtalmologie', value: 4 },
    { label: 'Pneumologie', value: 5 },
    { label: 'Orthopédie - Traumatologie', value: 6 },
    { label: 'Médecine interne', value: 7 }
  ]
  const optionsLab = [
    { label: 'Sr1', value: 1 },
    { label: 'Sr2', value: 2 },
    { label: 'Sr3', value: 3 }
  ]

  const clearForm = () => {
    setData({
      imageSrc: '/img/placeholder-image.jpg',
      image: '',
      email: '',
      mdp: '',
      role: 0,
      tarif: 0,
      ville: 0,
      horaires: '',
      info: '',
      nom_ut: '',
      spe: 0,
      ser: 0
    })
    setControls({
      email: false,
      mdp: false,
      role: false,
      nom_ut: false
    })
  }

  const handleSave = async () => {
    try {
      const url = `${window.location.origin}/api/register/ajouter`

      const newControls = {
        email: data.email.trim() === '',
        mdp: data.mdp.trim() === '',
        nom_ut: data.nom_ut.trim() === '',
        role: data.role === 0
      }

      setControls(newControls)

      if (Object.values(newControls).some(value => value)) {
        return
      }

      const requestBody = JSON.stringify(data)
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: requestBody
      }

      const response = await fetch(url, requestOptions)
      const responseData = await response.json()

      if (responseData.erreur) {
        alert(responseData.message)
      } else {
        setData(responseData)
        clearForm()
      }
    } catch (error) {
      console.log('Erreur:', error)
    }
  }

  // Vars
  const darkImg = '/images/pages/auth-v1-mask-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-light.png'

  // Hooks

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  return (
    <div className='flex flex-col w-full md:w-full lg:flex-row min-h-screen items-center justify-center relative h-screen bg-white'>
      <div className='hidden lg:flex flex-1 justify-center items-center min-h-screen bg-gray-100'>
        <span className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </span>
        <img src='/images/pages/doc2.svg' className='max-w-[800px]' />
      </div>

      {/* Formulaire */}
      <div className='flex flex-col justify-center items-center w-full max-w-xl p-12 min-h-screen space-y-6'>
        <div className='mb-3'>
          <h3 className='text-3xl font-bold'>S'inscrire </h3>
        </div>
        <form noValidate autoComplete='off' className='w-full space-y-6 mt-8'>
          <Grid container spacing={6}>
            <Grid item xs={10} md={10}>
              {' '}
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  label='Type'
                  className={`${controls?.role === true ? 'isReq' : ''}`}
                  value={data?.role || null}
                  onChange={(e: any) => {
                    if (e === null) {
                      setControls({ ...controls, role: true })
                      setData((prev: any) => ({
                        ...prev,
                        role: e.target.value
                      }))
                    } else {
                      setControls({ ...controls, role: false })
                      setData((prev: any) => ({
                        ...prev,
                        role: e.target.value
                      }))
                    }
                  }}
                >
                  {options.map(item => (
                    <MenuItem value={item.value} key={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {controls?.role === true ? <span className='errmsg'>Please enter the role !</span> : null}
            </Grid>
            <Grid item xs={2} md={2}>
              <Input
                type='file'
                id='image_prod'
                onChange={(e: any) => {
                  setData((prev: any) => ({
                    ...prev,
                    image: e.target.files[0] // Corrected here
                  }))

                  handleImageChange(e)
                }}
                style={{ zoom: 0.8, display: 'none' }}
              />
              <InputLabel htmlFor='image_prod'>
                <img src={data.imageSrc} style={{ cursor: 'pointer' }} alt='' width={60} height={60} />
              </InputLabel>
            </Grid>
            <Grid item xs={data.role == 2 || data.role === 3 ? 6 : 12} md={data.role == 2 || data.role === 3 ? 6 : 12}>
              <TextField
                fullWidth
                label='Nom utilisateur'
                value={data?.nom_ut ?? ''}
                className={`${controls?.nom_ut === true ? 'isReq' : ''}`}
                onChange={(e: any) => {
                  if (e.target?.value.trim() === '') {
                    setControls({ ...controls, nom_ut: true })
                    setData((prev: any) => ({
                      ...prev,
                      nom_ut: e.target.value
                    }))
                  } else {
                    setControls({ ...controls, nom_ut: false })
                    setData((prev: any) => ({
                      ...prev,
                      nom_ut: e.target.value
                    }))
                  }
                }}
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
              />
              {controls?.nom_ut === true ? <span className='errmsg'>Please enter the user name !</span> : null}
            </Grid>
            <Grid item xs={data.role == 2 || data.role === 3 ? 6 : 12} md={data.role == 2 || data.role === 3 ? 6 : 12}>
              <TextField
                fullWidth
                label='Email'
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
                value={data?.email ?? ''}
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
            </Grid>
            <Grid item xs={data.role == 2 || data.role === 3 ? 6 : 12} md={data.role == 2 || data.role === 3 ? 6 : 12}>
              <TextField
                fullWidth
                value={data?.mdp ?? ''}
                label='Password'
                type={isPasswordShown ? 'text' : 'password'}
                InputLabelProps={{
                  sx: { fontSize: '1rem' }
                }}
                className={`${controls?.mdp === true ? 'isReq' : ''}`}
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
              />
              {controls?.mdp === true ? <span className='errmsg'>Please enter the password !</span> : null}
            </Grid>
            {data?.role === 2 ? (
              <Grid item xs={6} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Spéciallité</InputLabel>
                  <Select
                    label='Spéciallité'
                    value={data?.spe ?? ''}
                    onChange={(e: any) => {
                      if (e === null) {
                        setData({ ...data, spe: e.target.value })
                      } else {
                        setData({ ...data, spe: e.target.value })
                      }
                    }}
                  >
                    {optionsMed.map(item => (
                      <MenuItem value={item.value} key={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ) : null}
            {data?.role === 3 ? (
              <Grid item xs={6} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Service</InputLabel>
                  <Select
                    label='Service'
                    value={data?.ser || null}
                    onChange={(e: any) => {
                      if (e === null) {
                        setData({ ...data, ser: e.target.value })
                      } else {
                        setData({ ...data, ser: e.target.value })
                      }
                    }}
                  >
                    {optionsLab.map(item => (
                      <MenuItem value={item.value} key={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ) : null}{' '}
            {data?.role === 2 ? (
              <Grid item xs={6} md={6}>
                <TextField
                  fullWidth
                  label='Tarif'
                  value={data?.tarif ?? ''}
                  onChange={(e: any) => {
                    setData((prev: any) => ({
                      ...prev,
                      tarif: e.target.value
                    }))
                  }}
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
                />
              </Grid>
            ) : null}
            {data?.role === 2 || data?.role === 3 ? (
              <Grid item xs={6} md={6}>
                <TextField
                  fullWidth
                  label='Horaire'
                  value={data?.horaires ?? ''}
                  onChange={(e: any) => {
                    setData((prev: any) => ({
                      ...prev,
                      horaires: e.target.value
                    }))
                  }}
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
                />
              </Grid>
            ) : null}
            {data?.role === 2 || data?.role === 3 ? (
              <Grid item xs={data.role == 3 ? 6 : 12} md={data.role === 3 ? 6 : 12}>
                <FormControl fullWidth>
                  <InputLabel>Ville</InputLabel>
                  <Select
                    label='Ville'
                    value={data?.ville || null}
                    onChange={(e: any) => {
                      if (e === null) {
                        setData({ ...data, ville: e.target.value })
                      } else {
                        setData({ ...data, ville: e.target.value })
                      }
                    }}
                  >
                    {villes.map(item => (
                      <MenuItem value={item.value} key={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ) : null}
            {data?.role === 2 || data?.role === 3 ? (
              <Grid item xs={12} md={12}>
                <TextField
                  fullWidth
                  label='Informations complémentaires'
                  multiline
                  value={data?.info ?? ''}
                  onChange={(e: any) => {
                    setData((prev: any) => ({
                      ...prev,
                      info: e.target.value
                    }))
                  }}
                  minRows={2}
                  maxRows={3}
                  InputLabelProps={{
                    sx: { fontSize: '1rem' }
                  }}
                />
              </Grid>
            ) : null}
          </Grid>
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
            S'inscrire
          </Button>
          <div className='flex justify-center items-center flex-wrap gap-2'>
            <Typography>Vous avez déjà un compte ?</Typography>
            <Typography component={Link} href='/login' color='primary'>
              Connectez-vous à la place
            </Typography>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
