'use client'

import { useEffect, useState } from 'react'
import { Modal } from '../ui/modal'
import { Button, Grid, TextField } from '@mui/material'
import { toast } from 'react-toastify'
import { CloudUpload, Upload } from 'lucide-react'

import { FormControl, Input, InputLabel, MenuItem, Select } from '@mui/material'

export default function OrdonnancesAnalysesModal({
  isOpen,
  onClose,
  OrdAnData
}: {
  isOpen: boolean
  onClose: () => void
  OrdAnData?: any
}) {
  const handleImageChange = (e: any) => {
    const file = e.target.files[0]
    if (file) {
      setData((prev: any) => ({
        ...prev,
        imageSrc: URL.createObjectURL(file),
        imageName: file.name
      }))

      const reader = new FileReader()
      reader.onloadend = () => {
        setData((prev: any) => ({
          ...prev,
          image: reader.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }
  const [data, setData] = useState<any>({
    imageSrc: '/img/placeholder-image.jpg',
    image: '',
    imageName: '',
    nom: '',
    prenom: '',
    ord: '',
    an: ''
  })
  useEffect(() => {
    if (OrdAnData) {
      setData(OrdAnData)
    } else {
      setData({ nom: '', prenom: '', ord: '', an: '' })
    }
  }, [OrdAnData])
  const [controls, setControls] = useState<any>({
    nom: false,
    prenom: false,
    ord: false,
    an: false
  })

  const clearForm = () => {
    setData({ imageSrc: '/img/placeholder-image.jpg', image: '', nom: '', prenom: '', ord: '', an: '' })
    setControls({ nom: false, prenom: false, ord: false, an: false })
  }
  const isAdd = !OrdAnData

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
      title={
        <span className='block w-full text-center'>
          {isAdd ? 'Ajouter Ordonnances & Analyses' : 'Modifier Ordonnances & Analyses'}
        </span>
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
            {' '}
            <FormControl fullWidth>
              <InputLabel>Nom</InputLabel>
              <Select
                label='Nom'
                className={`${controls?.nom === true ? 'isReq' : ''}`}
                value={data?.nom || null}
                onChange={(e: any) => {
                  if (e === null) {
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
              >
                {/* {options.map(item => (
                               <MenuItem value={item.value} key={item.value}>
                                 {item.label}
                               </MenuItem>
                             ))} */}
              </Select>
            </FormControl>
            {controls?.nom === true ? <span className='errmsg'>Veuillez saisir le nom !</span> : null}
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              fullWidth
              multiline
              value={data?.ord ?? ''}
              minRows={2}
              maxRows={3}
              label='Ordonnances'
              InputLabelProps={{
                sx: { fontSize: '1rem' }
              }}
              InputProps={{
                sx: {
                  fontSize: '1rem'
                }
              }}
            />
            {controls?.ord === true ? <span className='errmsg'>Veuillez saisir l'Ordonnance !</span> : null}
          </Grid>
          <Grid item xs={12} md={12}>
            <div className='mt-4 text-center space-y-4'>
              <Input
                type='file'
                id='image_prod'
                onChange={(e: any) => {
                  setData((prev: any) => ({
                    ...prev,
                    image: e.target.files[0],
                    imageName: e.target.files[0]?.name || ''
                  }))

                  handleImageChange(e)
                }}
                style={{ zoom: 0.8, display: 'none' }}
              />
              <InputLabel htmlFor='image_prod' className='primary-btn text-sm !mt-8'>
                <CloudUpload className='text-center' />
                Analyse
              </InputLabel>

              <p className='text-sm text-gray-700'>Fichier sélectionné :</p>
              <p className='text-sm font-medium'>{data.imageName || 'Aucun fichier'}</p>
            </div>
          </Grid>
          <Grid item xs={12} md={12}></Grid>
        </Grid>
      </form>
    </Modal>
  )
}
