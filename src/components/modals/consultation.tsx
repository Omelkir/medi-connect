'use client'

import React, { useEffect, useRef, useState } from 'react'

import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { toast } from 'react-toastify'

import { Modal } from '../ui/modal'
import { getStorageData } from '@/utils/helpers'

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
  const [data, setData] = useState<any>({ patient: '', date: '', id_med: userData.id })
  const [controls, setControls] = useState<any>({ patient: false, date: false })

  const clearForm = () => {
    setData({ patient: '', date: '', id_med: userData.id })
    setControls({ patient: false, date: false })
  }

  async function getPatientListe() {
    try {
      const url = `${window.location.origin}/api/patient/liste?id_med=${userData.id}`
      const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })

      if (!response.ok) throw new Error('Erreur lors de la requête')

      const responseData = await response.json()

      if (responseData.erreur) {
        alert(responseData.message)
      } else {
        setPatientListe(responseData.data)
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des patients:', error)
    }
  }

  useEffect(() => {
    getPatientListe()
  }, [])

  const isAdd = !patientData

  const handleSave = async () => {
    try {
      const payload = { ...data, id_med: userData.id }
      const url = `${window.location.origin}/api/consultation/${isAdd ? 'ajouter' : 'modifier'}`

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }

      const response = await fetch(url, requestOptions)
      const responseData = await response.json()

      if (responseData.erreur) {
        alert(responseData.message)
      } else {
        toast.success('Action réussie !')
        setUpdate(new Date().getTime().toString())
        clearForm()
        onClose()
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  useEffect(() => {
    if (patientData) {
      setData((prev: any) => (JSON.stringify(prev) === JSON.stringify(patientData) ? prev : patientData))
    } else {
      setData((prev: any) =>
        JSON.stringify(prev) === JSON.stringify({ patient: '', date: '', id_med: userData.id })
          ? prev
          : { patient: '', date: '', id_med: userData.id }
      )
    }
  }, [patientData, userData.id])
  document.addEventListener('focusin', event => {
    if (event.target instanceof HTMLElement && event.target.closest('.modal-selector')) {
      event.stopPropagation()
    }
  })
  const myModalRef = useRef<HTMLDivElement | null>(null) // Création de myModalRef

  useEffect(() => {
    if (isOpen) {
      // Gérer le focus sur le modal au moment où il devient visible
      setTimeout(() => {
        if (myModalRef.current) {
          myModalRef.current.focus() // Met le focus sur le modal
        }
      }, 100)
    }
  }, [isOpen])

  return (
    <Modal
      // ref={myModalRef}
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
          <Button variant='contained' color='primary' size='small' onClick={handleSave}>
            {isAdd ? 'Ajouter' : 'Modifier'}
          </Button>
        </div>
      }
    >
      <form className='space-y-4'>
        <Grid container spacing={3}>
          {userData.role === 2 ? (
            <Grid item xs={12} md={12}>
              <FormControl fullWidth>
                <InputLabel>Patient</InputLabel>
                <Select
                  label='patient'
                  key={'test21'}
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
                  {patientListe.map(item => (
                    <MenuItem value={item.id} key={item.id}>
                      {item.nom}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {controls.patient && <span className='errmsg'>Veuillez sélectionner un patient !</span>}
            </Grid>
          ) : null}
          <Grid item xs={12} md={12}>
            <TextField
              fullWidth
              type='datetime-local'
              InputLabelProps={{ sx: { fontSize: '1rem' } }}
              className={controls.date ? 'isReq' : ''}
              value={data?.date || ''}
              onChange={e => {
                setControls({ ...controls, date: !e.target.value.trim() })
                setData((prev: any) => ({ ...prev, date: e.target.value }))
              }}
            />
            {controls.date && <span className='errmsg'>Veuillez saisir la date !</span>}
          </Grid>
        </Grid>
      </form>
    </Modal>
  )
}
