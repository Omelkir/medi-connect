'use client'

import React, { useEffect, useState } from 'react'

import { Button, Grid, TextField } from '@mui/material'
import { toast } from 'react-toastify'

import { Modal } from '../ui/modal'
import { getStorageData as getStorageDataFront } from '@/utils/helpersFront'

export default function RendezVousModal({
  isOpen,
  onClose,
  medecinId,
  laboId
}: {
  isOpen: boolean
  onClose: () => void
  medecinId: any
  laboId: any
}) {
  const userDataFront = getStorageDataFront('user')

  const [data, setData] = useState<any>({
    id_patient: userDataFront?.id,
    date: '',
    id_el: medecinId ?? laboId ?? null,
    el: medecinId ? 2 : laboId ? 3 : null,
    duree: 30,
    isApproved: 0
  })

  useEffect(() => {
    if (medecinId) {
      setData((prev: any) => ({ ...prev, id_el: medecinId, el: 2 }))
    } else if (laboId) {
      setData((prev: any) => ({ ...prev, id_el: laboId, el: 3 }))
    }
  }, [medecinId, laboId])
  const [controls, setControls] = useState<any>({ id_patient: false, date: false, duree: false })

  const clearForm = () => {
    setData({ id_patient: userDataFront.id, date: '', id_el: '', el: '', duree: 30, isApproved: 0 })
    setControls({ id_patient: false, date: false, duree: false })
  }

  const handleSave = async () => {
    try {
      const url = `${window.location.origin}/api/consultation/ajouter`

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }

      const response = await fetch(url, requestOptions)
      const responseData = await response.json()

      if (responseData.erreur) {
        alert(responseData.message)
      } else {
        toast.success('Action réussie !')
        clearForm()
        onClose()
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={<span className='block w-full text-center'>Prendre rendez-vous</span>}
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
            Envoyer
          </Button>
        </div>
      }
    >
      <form className='space-y-4'>
        <Grid container spacing={3}>
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
