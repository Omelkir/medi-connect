'use client'

import { useEffect, useState } from 'react'

import { Button, Grid, TextField, FormControl, Input, InputLabel, MenuItem, Select } from '@mui/material'
import { toast } from 'react-toastify'
import { CloudUpload, Upload } from 'lucide-react'

import { Modal } from '../ui/modal'

export default function OrdonnancesModal({
  isOpen,
  onClose,
  ordananceData,
  setUpdate,
  patient,
  id_el
}: {
  isOpen: boolean
  onClose: () => void
  ordananceData?: any
  setUpdate: any
  patient: any
  id_el: any
}) {
  const [data, setData] = useState<any>({
    medi: '',
    duree: '',
    dosage: '',
    id_cons: '',
    id_patient: patient,
    id_el: id_el
  })

  useEffect(() => {
    if (ordananceData) {
      setData({
        ordananceData
      })
    } else {
      setData({ medi: '', duree: '', dosage: '', id_cons: '' })
    }
  }, [ordananceData])
  useEffect(() => {
    setData((prevData: any) => ({
      ...prevData,
      id_patient: patient?.id || null,
      id_el: id_el || null
    }))
  }, [patient, id_el])
  const isAdd = !ordananceData

  const handleSave = async () => {
    try {
      const url = `${window.location.origin}/api/ordonance/${isAdd ? 'ajouter' : 'modifier'}`

      setData({ data })
      const requestBody = JSON.stringify(data)
      const requestOptions = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: requestBody }

      await fetch(url, requestOptions).then((responseData: any) => {
        setUpdate(Date.now().toString())

        if (responseData.erreur) {
          alert(responseData.message)
          toast.error('Erreur !')
        } else {
          if (isAdd) {
            toast.success("L'ordonance a été ajouté avec succès")
          } else {
            toast.success("L'ordonance a été modifié avec succès")
          }

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
      title={<span className='block w-full text-center'>{isAdd ? 'Ajouter ordonnance' : 'Modifier ordonnance'}</span>}
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
        <Grid container spacing={3}></Grid>
      </form>
    </Modal>
  )
}
