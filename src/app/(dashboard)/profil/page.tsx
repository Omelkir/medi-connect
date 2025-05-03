'use client'

// React Imports
import { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { Input } from '@mui/material'

import { toast } from 'react-toastify'

import { getStorageData } from '@/utils/helpers'

const AccountDetails = () => {
  const mailCheck = (email: any) => !/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email)
  const userData = getStorageData('user')

  console.log('userData:', userData)

  const [data, setData] = useState<any>({
    imageSrc: '/img/placeholder-image.jpg',
    image: '',
    email: '',
    tarif: '',
    adresse: '',
    id_ville: 0,
    heurD: '',
    heurF: '',
    info: '',
    nom_ut: '',
    spe: 0
  })

  useEffect(() => {
    if (userData) {
      setData((prev: any) => ({
        ...prev,
        nom_ut: userData.nom,
        email: userData.email,
        tarif: userData.tarif,
        adresse: userData.adresse,
        id_ville: userData.id_ville,
        heurD: userData.heurD,
        heurF: userData.heurF,
        info: userData.info,
        spe: parseInt(userData.id_spe) || 0,
        imageSrc: userData.image ? `${window.location.origin}/${userData.image}` : '/img/placeholder-image.jpg'
      }))
    }
  }, [])

  const handleImageChange = (e: any) => {
    const file = e.target.files[0]

    if (file) {
      setData((prev: any) => ({
        ...prev,
        imageSrc: URL.createObjectURL(file)
      }))

      const reader = new FileReader()

      reader.readAsDataURL(file)
    }
  }

  const [controls, setControls] = useState<any>({
    email: false,
    emailValid: false,
    nom_ut: false
  })

  const [villeListe, setVilleListe] = useState<any[]>([])
  const [speListe, setSpeListe] = useState<any[]>([])

  async function getVilleList() {
    try {
      const url = `${window.location.origin}/api/ville/liste`

      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }

      const response = await fetch(url, requestOptions)

      if (!response.ok) throw new Error('Erreur lors de la requête')

      const responseData = await response.json()

      console.log('API Response:', responseData)

      if (responseData.erreur) {
        alert(responseData.message)
      } else {
        setVilleListe(responseData.data)
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue lors de la récupération des données.')
    }
  }

  useEffect(() => {
    getVilleList()
  }, [])

  async function getSpeList() {
    try {
      const url = `${window.location.origin}/api/specialite/liste`

      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }

      const response = await fetch(url, requestOptions)

      if (!response.ok) throw new Error('Erreur lors de la requête')

      const responseData = await response.json()

      console.log('API Response:', responseData)

      if (responseData.erreur) {
        alert(responseData.message)
      } else {
        setSpeListe(responseData.data)
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue lors de la récupération des données.')
    }
  }

  useEffect(() => {
    getSpeList()
  }, [])

  const handleSave = async () => {
    try {
      const url = `${window.location.origin}/api/medecin/modifier`

      const newControls = {
        email: data.email.trim() === '',
        emailValid: mailCheck(data.email.trim()),
        nom_ut: data.nom_ut.trim() === ''
      }

      setControls(newControls)

      if (Object.values(newControls).some(value => value)) {
        return
      }

      const formData = new FormData()

      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          if (data[key] instanceof File) {
            formData.append(key, data[key])
          } else {
            formData.append(key, data[key])
          }
        }
      }

      const requestOptions = {
        method: 'POST',
        body: formData
      }

      const response = await fetch(url, requestOptions)
      const responseData = await response.json()

      if (responseData.erreur) {
        toast.error('Erreur !')
      } else {
        toast.success('Le profil a été modifié avec succès')
      }
    } catch (error) {
      console.log('Erreur:', error)
    }
  }

  return (
    <Card className='w-3/4 m-auto'>
      <CardContent className='mbe-5'>
        <div className='flex max-sm:flex-col items-center gap-6'>
          <div className='flex flex-grow flex-col gap-4'>
            <div className='flex flex-col sm:flex-row gap-4'>
              <Input
                type='file'
                id='image'
                onChange={(e: any) => {
                  const file: any = e.target.files?.[0]

                  if (file) {
                    setData((prev: any) => ({
                      ...prev,
                      image: file,
                      imageSrc: URL.createObjectURL(file)
                    }))
                    handleImageChange(e)
                  }
                }}
                style={{ zoom: 0.8, display: 'none' }}
              />

              <InputLabel htmlFor='image'>
                <img
                  src={data.imageSrc ? data.imageSrc : '/img/placeholder-image.jpg'}
                  style={{ cursor: 'pointer', borderRadius: '8px' }}
                  alt='Preview'
                  width={100}
                  height={100}
                />
              </InputLabel>
              <Typography className='mt-8'>Allowed JPG, GIF or PNG. Max size of 800K</Typography>
            </div>
          </div>
        </div>
      </CardContent>
      <CardContent>
        <form noValidate autoComplete='off' className='w-full space-y-6'>
          <Grid container spacing={3}>
            <Grid item xs={6} md={6}>
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
              {controls?.nom_ut === true ? (
                <span className='errmsg'>Veuillez saisir le nom d'utilisateur !</span>
              ) : null}
            </Grid>
            <Grid item xs={6} md={6}>
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
                className={`${controls?.email === true || controls.emailValid === true ? 'isReq' : ''}`}
                onChange={(e: any) => {
                  if (e.target?.value.trim() === '') {
                    setControls({ ...controls, email: true })
                    setData((prev: any) => ({
                      ...prev,
                      email: e.target.value
                    }))
                  } else {
                    setControls({ ...controls, email: false })
                    setControls({ ...controls, emailValid: mailCheck(e.target.value.trim()) })
                    setData((prev: any) => ({
                      ...prev,
                      email: e.target.value
                    }))
                  }
                }}
              />
              {controls?.email === true ? (
                <span className='errmsg'>Veuillez saisir l'email !</span>
              ) : controls.emailValid === true ? (
                <span className='errmsg'>
                  Email invalide : il doit contenir "@" et se terminer par un domaine valide (ex: .com, .net)
                </span>
              ) : null}
            </Grid>

            <Grid item xs={6} md={6}>
              <FormControl fullWidth>
                <InputLabel>Spéciallité</InputLabel>
                <Select
                  label='Spéciallité'
                  value={data?.id_spe ?? ''}
                  onChange={(e: any) => {
                    if (e === null) {
                      setData({ ...data, id_spe: e.target.value })
                    } else {
                      setData({ ...data, id_spe: e.target.value })
                    }
                  }}
                >
                  {speListe.map(item => (
                    <MenuItem value={item.id} key={item.id}>
                      {item.spe}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6} md={6}>
              <FormControl fullWidth>
                <InputLabel>Ville</InputLabel>
                <Select
                  label='Ville'
                  value={data?.id_ville || null}
                  onChange={(e: any) => {
                    if (e === null) {
                      setData({ ...data, id_ville: e.target.value })
                    } else {
                      setData({ ...data, id_ville: e.target.value })
                    }
                  }}
                >
                  {villeListe.map(item => (
                    <MenuItem value={item.id} key={item.id}>
                      {item.ville}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
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
            <Grid item xs={6} md={6}>
              <TextField
                fullWidth
                label='Adresse'
                value={data?.adresse ?? ''}
                onChange={(e: any) => {
                  setData((prev: any) => ({
                    ...prev,
                    adresse: e.target.value
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
            <Grid item xs={6} md={6}>
              <TextField
                fullWidth
                type='time'
                value={data?.heurD ?? ''}
                onChange={(e: any) => {
                  setData((prev: any) => ({
                    ...prev,
                    heurD: e.target.value
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
            <Grid item xs={6} md={6}>
              <TextField
                fullWidth
                type='time'
                value={data?.heurF ?? ''}
                onChange={(e: any) => {
                  setData((prev: any) => ({
                    ...prev,
                    heurF: e.target.value
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
                maxRows={2}
                InputLabelProps={{
                  sx: { fontSize: '1rem' }
                }}
              />
            </Grid>
            <Grid item xs={12} className='flex gap-4 flex-wrap'>
              <Button variant='contained' type='submit' onClick={handleSave}>
                Enregistrer les modifications
              </Button>
              <Button variant='outlined' type='reset' color='secondary'>
                Réinitialiser
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default AccountDetails
