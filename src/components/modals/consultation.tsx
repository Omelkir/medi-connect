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
  setUpdate,
  dataUp
}: {
  isOpen: boolean
  onClose: () => void
  patientData?: any
  setUpdate: any
  dataUp?: any
}) {
  function formatForInput(isoDate: string) {
    if (!isoDate) {
      return ''
    }

    const date = new Date(isoDate)
    const offset = date.getTimezoneOffset()
    const localDate = new Date(date.getTime() - offset * 60 * 1000)

    return localDate.toISOString().slice(0, 19)
  }

  const userData = getStorageData('user')

  const [patientListe, setPatientListe] = useState<any[]>([])
  const [data, setData] = useState<any>({ id_patient: 0, date: '', id_el: userData.id, el: userData.nom })
  const [controls, setControls] = useState<any>({ id_patient: false, date: false })

  const clearForm = () => {
    setData({ id_patient: 0, date: '', id_el: userData.id, el: userData.nom })
    setControls({ id_patient: false, date: false })
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

  const isAdd = !data?.id

  const handleSave = async () => {
    try {
      const payload = { ...data, id_el: userData.id, el: userData.nom }

      console.log('idmed:', userData.id)

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

  // useEffect(() => {
  //   if (patientData) {
  //     setData((prev: any) => (JSON.stringify(prev) === JSON.stringify(patientData) ? prev : patientData))
  //   } else {
  //     setData((prev: any) =>
  //       JSON.stringify(prev) === JSON.stringify({ id_patient: 0, date: '', id_el: userData.id, el: userData.nom})
  //         ? prev
  //         : { id_patient: 0, date: '', id_el: userData.id, el: userData.nom}
  //     )
  //   }
  // }, [patientData, userData.id])
  // document.addEventListener('focusin', event => {
  //   if (event.target instanceof HTMLElement && event.target.closest('.modal-selector')) {
  //     event.stopPropagation()
  //   }
  // })
  // const myModalRef = useRef<HTMLDivElement | null>(null)

  // useEffect(() => {
  //   if (isOpen) {
  //     // Gérer le focus sur le modal au moment où il devient visible
  //     setTimeout(() => {
  //       if (myModalRef.current) {
  //         myModalRef.current.focus() // Met le focus sur le modal
  //       }
  //     }, 100)
  //   }
  // }, [isOpen])

  useEffect(() => {
    if (dataUp) {
      setData({
        id_patient: Number(dataUp?.id_patient) || 0,
        date: formatForInput(dataUp?.start) ?? '',
        id_el: dataUp?.id_el ?? userData?.id,
        el: dataUp?.el ?? '',
        id: dataUp?.idd ?? null
      })
    }
  }, [dataUp])

  return (
    <Modal
      // ref={myModalRef}
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className='block w-full text-center'>{data?.id ? 'Modifier Rendez-vous' : 'Ajouter Rendez-vous'}</span>
      }
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
          {userData.role === '2' ? (
            <Grid item xs={12} md={12}>
              <FormControl fullWidth>
                <InputLabel>Patient</InputLabel>
                <Select
                  label='patient'
                  key={'test21'}
                  className={`${controls?.id_patient === true ? 'isReq' : ''}`}
                  value={data?.id_patient || ''}
                  onChange={(e: any) => {
                    if (e === null) {
                      setControls({ ...controls, id_patient: true })
                      setData((prev: any) => ({
                        ...prev,
                        id_patient: e.target.value
                      }))
                    } else {
                      setControls({ ...controls, id_patient: false })
                      setData((prev: any) => ({
                        ...prev,
                        id_patient: e.target.value
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
              {controls.id_patient && <span className='errmsg'>Veuillez sélectionner un patient !</span>}
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
