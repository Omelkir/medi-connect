'use client'

import { useEffect, useState } from 'react'

import { Modal } from '../ui/modal'

import { Button, Grid, TextField } from '@mui/material'
export default function RendezVousFormModal({ isOpen, onClose, medecinId, laboId }: any) {
  const [data, setData] = useState<any>({
    nom: '',
    prenom: '',
    email: '',
    tel: '',
    date: '',
    heure: '',
    message: '',
    medecinId: medecinId,
    laboId: laboId
  })
  useEffect(() => {
    setData((prev: any) => ({ ...prev, medecinId, laboId }))
  }, [medecinId, laboId])

  const [controls, setControls] = useState<any>({
    nom: false,
    prenom: false,
    email: false,
    tel: false,
    date: false,
    heure: false
  })
  const clearForm = () => {
    setData({ nom: '', prenom: '', email: '', tel: '', date: '', heure: '', message: '' })
    setControls({
      nom: false,
      prenom: false,
      email: false,
      tel: false,
      date: false,
      heure: false
    })
  }
  const handleSave = async () => {
    try {
      const url = `${window.location.origin}/api/rendez-vous/ajouter`
      const newControls = {
        email: data.email.trim() === '',
        nom: data.nom.trim() === '',
        prenom: data.prenom.trim() === '',
        tel: data.tel.trim() === '',
        date: data.date.trim() === '',
        heure: data.heure.trim() === ''
      }

      setControls(newControls)

      if (Object.values(newControls).some(value => value)) {
        return
      }

      const requestBody = JSON.stringify({
        ...data,
        idMed: data.medecinId,
        idLabo: data.laboId
      })
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
      }
    } catch (error) {
      console.log('Erreur:', error)
    }
  }
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='Rendez-vous'
      description='Remplissez le formulaire ci-dessous'
      footer={
        <div className='flex justify-end gap-2'>
          <Button
            variant='contained'
            style={{ backgroundColor: 'white', color: 'black' }}
            size='small'
            onClick={onClose}
          >
            Annuler
          </Button>
          <Button
            variant='contained'
            color='primary'
            size='small'
            onClick={() => {
              handleSave(), onClose()
            }}
          >
            Envoyer
          </Button>
        </div>
      }
    >
      <form className='space-y-4'>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            {' '}
            <TextField
              fullWidth
              label='Nom'
              InputLabelProps={{
                sx: { fontSize: '1rem' }
              }}
              InputProps={{
                sx: {
                  height: 50,
                  fontSize: '1rem'
                }
              }}
              className={`${controls?.nom === true ? 'isReq' : ''}`}
              value={data?.nom || null}
              onChange={(e: any) => {
                if (e.target?.value.trim() === '') {
                  setControls({ ...controls, nom: true })
                  setData((prev: any) => ({
                    ...prev,
                    nom: e.target.value
                  }))
                } else {
                  setControls({ ...controls, nom: false })
                  setData((prev: any) => ({
                    ...prev,
                    nom: e.target.value
                  }))
                }
              }}
            />
            {controls?.nom === true ? <span className='errmsg'>Veuillez saisir le nom !</span> : null}
          </Grid>

          <Grid item xs={12} md={6}>
            {' '}
            <TextField
              fullWidth
              label='Prenom'
              InputLabelProps={{
                sx: { fontSize: '1rem' }
              }}
              InputProps={{
                sx: {
                  height: 50,
                  fontSize: '1rem'
                }
              }}
              className={`${controls?.prenom === true ? 'isReq' : ''}`}
              value={data?.prenom || null}
              onChange={(e: any) => {
                if (e.target?.value.trim() === '') {
                  setControls({ ...controls, prenom: true })
                  setData((prev: any) => ({
                    ...prev,
                    prenom: e.target.value
                  }))
                } else {
                  setControls({ ...controls, prenom: false })
                  setData((prev: any) => ({
                    ...prev,
                    prenom: e.target.value
                  }))
                }
              }}
            />
            {controls?.prenom === true ? <span className='errmsg'>Veuillez saisir le prenom !</span> : null}
          </Grid>
          <Grid item xs={12} md={6}>
            {' '}
            <TextField
              fullWidth
              label='Email'
              InputLabelProps={{
                sx: { fontSize: '1rem' }
              }}
              InputProps={{
                sx: {
                  height: 50,
                  fontSize: '1rem'
                }
              }}
              className={`${controls?.email === true ? 'isReq' : ''}`}
              value={data?.email || null}
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
            {controls?.email === true ? <span className='errmsg'>Veuillez saisir l'email !</span> : null}
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Téléphone'
              InputLabelProps={{
                sx: { fontSize: '1rem' }
              }}
              InputProps={{
                sx: {
                  height: 50,
                  fontSize: '1rem'
                }
              }}
              className={`${controls?.tel === true ? 'isReq' : ''}`}
              value={data?.tel || null}
              onChange={(e: any) => {
                if (e.target?.value.trim() === '') {
                  setControls({ ...controls, tel: true })
                  setData((prev: any) => ({
                    ...prev,
                    tel: e.target.value
                  }))
                } else {
                  setControls({ ...controls, tel: false })
                  setData((prev: any) => ({
                    ...prev,
                    tel: e.target.value
                  }))
                }
              }}
            />
            {controls?.tel === true ? <span className='errmsg'>Veuillez saisir le numéro de Téléphone !</span> : null}
          </Grid>
          <Grid item xs={12} md={6}>
            {' '}
            <TextField
              fullWidth
              type='date'
              InputLabelProps={{
                sx: { fontSize: '1rem' }
              }}
              InputProps={{
                sx: {
                  height: 50,
                  fontSize: '1rem'
                }
              }}
              className={`${controls?.date === true ? 'isReq' : ''}`}
              value={data?.date || null}
              onChange={(e: any) => {
                if (e.target?.value.trim() === '') {
                  setControls({ ...controls, date: true })
                  setData((prev: any) => ({
                    ...prev,
                    date: e.target.value
                  }))
                } else {
                  setControls({ ...controls, date: false })
                  setData((prev: any) => ({
                    ...prev,
                    date: e.target.value
                  }))
                }
              }}
            />
            {controls?.date === true ? <span className='errmsg'>Veuillez saisir la date !</span> : null}
          </Grid>

          <Grid item xs={12} md={6}>
            {' '}
            <TextField
              fullWidth
              type='time'
              InputLabelProps={{
                sx: { fontSize: '1rem' }
              }}
              InputProps={{
                sx: {
                  height: 50,
                  fontSize: '1rem'
                }
              }}
              className={`${controls?.heure === true ? 'isReq' : ''}`}
              value={data?.heure || null}
              onChange={(e: any) => {
                if (e.target?.value.trim() === '') {
                  setControls({ ...controls, heure: true })
                  setData((prev: any) => ({
                    ...prev,
                    heure: e.target.value
                  }))
                } else {
                  setControls({ ...controls, heure: false })
                  setData((prev: any) => ({
                    ...prev,
                    heure: e.target.value
                  }))
                }
              }}
            />
            {controls?.heure === true ? <span className='errmsg'>Veuillez saisir l'heure !</span> : null}
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              maxRows={3}
              label='Message'
              InputLabelProps={{
                sx: { fontSize: '1rem' }
              }}
              InputProps={{
                sx: {
                  fontSize: '1rem'
                }
              }}
            />
          </Grid>
        </Grid>
      </form>
    </Modal>
  )
}
