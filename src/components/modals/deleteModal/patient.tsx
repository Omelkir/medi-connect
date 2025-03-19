'use client'

import { useEffect, useState } from 'react'
import { Button, Grid, TextField } from '@mui/material'
import { Modal } from '@/components/ui/modal'
import { FaExclamationCircle, FaExclamationTriangle } from 'react-icons/fa'

export default function PatientDelete({ isOpen, onClose, patientData }: any) {
  const handleDelete = async () => {
    const patientId = patientData?.id

    if (!patientId) {
      console.log('Erreur: ID du patient manquant')
      return
    }

    try {
      const url = `${window.location.origin}/api/patient/supprimer?id=${patientId}`

      const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      }

      const response = await fetch(url, requestOptions)
      const responseData = await response.json()

      if (responseData.erreur) {
        console.log('Erreur:', responseData.message)
      } else {
        console.log('Patient supprimé avec succès')
      }
    } catch (error) {
      console.log('Erreur:', error)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <h1 className='block w-full text-center'>
          <FaExclamationTriangle className='text-5xl text-red-500 mr-2' />
        </h1>
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
          <Button
            variant='contained'
            color='error'
            size='small'
            onClick={() => {
              handleDelete()
              onClose()
            }}
          >
            Supprimer
          </Button>
        </div>
      }
    >
      <Grid container spacing={3}>
        <p className='mt-3 text-black text-xl block w-full text-center mb-6'>
          Êtes-vous sûr de vouloir supprimer ce patient ?
        </p>
      </Grid>
    </Modal>
  )
}
