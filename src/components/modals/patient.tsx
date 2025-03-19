'use client'

import { useEffect, useState } from 'react'
import { Modal } from '../ui/modal'
import { Button, Grid, TextField } from '@mui/material'
import { toast } from 'react-toastify'

export default function PatientModal({
  isOpen,
  onClose,
  patientData
}: {
  isOpen: boolean
  onClose: () => void
  patientData?: any
}) {
  const [data, setData] = useState<any>({
    nom: '',
    prenom: '',
    email: '',
    tel: ''
  })
  useEffect(() => {
    if (patientData) {
      setData(patientData)
    } else {
      setData({ nom: '', prenom: '', email: '', tel: '' })
    }
  }, [patientData])
  const [controls, setControls] = useState<any>({
    nom: false,
    prenom: false,
    email: false,
    tel: false
  })

  const clearForm = () => {
    setData({ nom: '', prenom: '', email: '', tel: '' })
    setControls({ nom: false, prenom: false, email: false, tel: false })
  }
  const isAdd = !patientData

  const handleSave = async () => {
    try {
      const url = `${window.location.origin}/api/patient/${isAdd ? 'ajouter' : 'modifier'}`

      const requestBody = JSON.stringify(data)
      const requestOptions = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: requestBody }

      const response = await fetch(url, requestOptions)

      const responseData = await response.json()
      toast.success('Action réussie !')

      if (responseData.erreur) {
        alert(responseData.message)
      } else {
        onClose()
      }
    } catch (error) {
      console.log('Erreur:', error)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={<span className='block w-full text-center'>{isAdd ? 'Ajouter patient' : 'Modifier patient'}</span>}
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
            }}
          >
            {isAdd ? 'Ajouter' : 'Modifier'}
          </Button>
        </div>
      }
    >
      <form className='space-y-4'>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <TextField
              fullWidth
              label='Nom'
              value={data?.nom ?? ''}
              className={`${controls?.nom === true ? 'isReq' : ''}`}
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
            {controls?.nom === true ? <span className='errmsg'>Veuillez saisir le nom !</span> : null}
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              fullWidth
              label='Prenom'
              value={data?.prenom ?? ''}
              className={`${controls?.prenom === true ? 'isReq' : ''}`}
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
            {controls?.prenom === true ? <span className='errmsg'>Veuillez saisir le prenom !</span> : null}
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              fullWidth
              label='Email'
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
            {controls?.email === true ? <span className='errmsg'>Veuillez saisir l'email !</span> : null}
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              fullWidth
              label='Téléphone'
              value={data?.tel ?? ''}
              className={`${controls?.tel === true ? 'isReq' : ''}`}
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
            {controls?.tel === true ? <span className='errmsg'>Veuillez saisir le numéro de téléphone !</span> : null}
          </Grid>
        </Grid>
      </form>
    </Modal>
  )
}
