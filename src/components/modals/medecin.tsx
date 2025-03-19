'use client'

import { useEffect, useState } from 'react'
import { Modal } from '../ui/modal'
import { Button, Grid, TextField } from '@mui/material'

export default function Medecin({ isOpen, onClose }: any) {
  const [data, setData] = useState<any>({
    nom: '',
    prenom: '',
    email: '',
    tel: '',
    date: '',
    heure: '',
    message: ''
  })

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
    setControls({ nom: false, prenom: false, email: false, tel: false, date: false, heure: false })
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
              handleSave()
              onClose()
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
            <TextField
              fullWidth
              label='Nom'
              value={data?.nom || ''}
              onChange={e => setData({ ...data, nom: e.target.value })}
            />
          </Grid>
        </Grid>
      </form>
    </Modal>
  )
}
