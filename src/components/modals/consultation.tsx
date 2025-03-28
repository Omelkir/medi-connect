'use client'

import { useEffect, useState } from 'react'
import { Modal } from '../ui/modal'
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { toast } from 'react-toastify'
import { getStorageData } from '@/utils/helpers'
import React from 'react'

export default function ConsultationModal({
  isOpen,
  onClose,
  patientData,
  setUpdate
}: {
  isOpen: boolean
  onClose: () => void
  patientData?: any
  setUpdate: any
}) {
  const userData = getStorageData('user')
  const [patientListe, setPatientListe] = useState<any[]>([])
  const [data, setData] = useState<any>({
    patient: '',
    date: '',
    id_med: userData.id
  })
  useEffect(() => {
    if (patientData) {
      setData(patientData)
    } else {
      setData({ patient: '', date: '', id_med: userData.id })
    }
  }, [patientData])
  const [controls, setControls] = useState<any>({
    patient: false,
    date: false
  })

  const clearForm = () => {
    setData({ patient: '', date: '', id_med: userData.id })
    setControls({ patient: false, date: false })
  }
  const DocteurData = getStorageData('user')
  async function getPatientListe() {
    const url = `${window.location.origin}/api/patient/liste?id_med=${DocteurData.id}`

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
      setPatientListe(responseData.data)
    }
  }
  React.useEffect(() => {
    getPatientListe()
  }, [])

  const isAdd = !patientData

  const handleSave = async () => {
    try {
      const url = `${window.location.origin}/api/consultation/${isAdd ? 'ajouter' : 'modifier'}`
      setData({ ...data, id_med: userData.id })

      const requestBody = JSON.stringify(data)
      const requestOptions = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: requestBody }

      const response = await fetch(url, requestOptions).then((responseData: any) => {
        toast.success('Action réussie !')
        setUpdate(new Date().getDate().toString())

        if (responseData.erreur) {
          alert(responseData.message)
        } else {
          onClose()
        }
      })
    } catch (error) {
      console.log('Erreur:', error)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={<span className='block w-full text-center'>{isAdd ? 'Ajouter Rendez-vous' : 'Modifier Rendez-vous'}</span>}
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
            <FormControl fullWidth>
              <InputLabel>Patient</InputLabel>
              <Select
                label='Patient'
                className={`${controls?.patient === true ? 'isReq' : ''}`}
                value={data?.patient || null}
                onChange={(e: any) => {
                  if (e === null) {
                    setControls({ ...controls, patient: true })
                    setData((prev: any) => ({
                      ...prev,
                      patient: e.target.value
                    }))
                  } else {
                    setControls({ ...controls, patient: false })
                    setData((prev: any) => ({
                      ...prev,
                      patient: e.target.value
                    }))
                  }
                }}
              >
                {patientListe.map((item: any, i: number) => (
                  <MenuItem value={item.id} key={item.id}>
                    {item.nom + ' ' + item.prenom}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {controls?.patient === true ? <span className='errmsg'>Veuillez séléctionner un patient !</span> : null}
          </Grid>
          <Grid item xs={12} md={12}>
            {' '}
            <TextField
              fullWidth
              type='datetime-local'
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
        </Grid>
      </form>
    </Modal>
  )
}
