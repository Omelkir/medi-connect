'use client'

import { useEffect, useState } from 'react'

import { Button, Grid, TextField } from '@mui/material'
import { toast } from 'react-toastify'

import { UploadCloud } from 'lucide-react'

import { Modal } from '../ui/modal'

export default function AnalyseModal({
  isOpen,
  onClose,
  analyseData,
  setUpdate,
  patient,
  id_el
}: {
  isOpen: boolean
  onClose: () => void
  analyseData?: any
  setUpdate: any
  patient: any
  id_el: any
}) {
  const [data, setData] = useState<any>({
    titre: '',
    detail: '',
    analyseSrc: '',
    analyse: '',
    id_patient: patient,
    id_el: id_el
  })

  useEffect(() => {
    if (analyseData) {
      setData({
        ...analyseData,
        analyse: analyseData.analyse,
        analyseSrc: analyseData.analyse
      })
    } else {
      setData({ titre: '', detail: '', analyseSrc: '', analyse: '' })
    }
  }, [analyseData])

  useEffect(() => {
    setData((prevData: any) => ({
      ...prevData,
      id_patient: patient?.id || null,
      id_el: id_el || null
    }))
  }, [patient, id_el])
  console.log('idpatient', patient?.id)

  const [controls, setControls] = useState<any>({
    titre: false,
    detail: false,
    analyse: false
  })

  const clearForm = () => {
    setData({ titre: '', detail: '', analyse: '' })
    setControls({ titre: false, detail: false, analyse: false })
  }

  const isAdd = !analyseData

  const handleFileChange = (e: any) => {
    const file = e.target.files[0]

    if (file) {
      setData((prev: any) => ({
        ...prev,
        analyseSrc: URL.createObjectURL(file)
      }))

      const reader = new FileReader()

      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    try {
      const url = `${window.location.origin}/api/analyse/${isAdd ? 'ajouter' : 'modifier'}`

      const newControls = {
        titre: data.titre.trim() === '',
        detail: data.detail.trim() === ''
      }

      setControls(newControls)

      if (Object.values(newControls).some(value => value)) {
        return
      }

      const formData = new FormData()

      clearForm()

      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          if (data[key] instanceof File) {
            formData.append(key, data[key])
          } else {
            formData.append(key, data[key])
          }
        }
      }

      const requestOptions = {
        method: 'POST',
        body: formData
      }

      await fetch(url, requestOptions).then((responseData: any) => {
        setUpdate(Date.now().toString())

        if (responseData.erreur) {
          toast.error('Erreur !')
        } else {
          if (isAdd) {
            toast.success("L'analyse a été ajouté avec succès")
          } else {
            toast.success("L'analyse a été modifié avec succès")
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
      title={<span className='block w-full text-center'>{isAdd ? 'Ajouter analyse' : 'Modifier analyse'}</span>}
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
              label='Titre'
              value={data?.titre ?? ''}
              className={`${controls?.titre === true ? 'isReq' : ''}`}
              onChange={(e: any) => {
                if (e.target?.value.trim() === '') {
                  setControls({ ...controls, titre: true })
                  setData((prev: any) => ({
                    ...prev,
                    titre: e.target.value
                  }))
                } else {
                  setControls({ ...controls, titre: false })
                  setData((prev: any) => ({
                    ...prev,
                    titre: e.target.value
                  }))
                }
              }}
              autoFocus
              InputLabelProps={{
                sx: { fontSize: '1rem' }
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
            {controls?.nom_ut === true ? <span className='errmsg'>Veuillez saisir le titre !</span> : null}
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              fullWidth
              label='Détail'
              multiline
              value={data?.detail ?? ''}
              className={`${controls?.detail === true}`}
              onChange={(e: any) => {
                if (e.target?.value.trim() === '') {
                  setControls({ ...controls, detail: true })
                  setData((prev: any) => ({
                    ...prev,
                    detail: e.target.value
                  }))
                } else {
                  setControls({ ...controls, detail: false })
                  setData((prev: any) => ({
                    ...prev,
                    detail: e.target.value
                  }))
                }
              }}
              minRows={2}
              maxRows={3}
              InputLabelProps={{
                sx: {
                  fontSize: '0.875rem',
                  '@media (min-width:768px)': {
                    fontSize: '1rem'
                  }
                }
              }}
            />
            {controls?.detail === true ? <span className='errmsg'>Veuillez saisir les détails !</span> : null}
          </Grid>
          <Grid item xs={12} md={12}>
            <label
              className='flex items-center gap-2
                                           cursor-pointer bg-gray-100 px-4 py-2 rounded-md border  border-gray-300 hover:bg-gray-200'
            >
              <UploadCloud className='text-blue-500' />
              <span className='text-gray-700'>{data.analyse.name ? data.analyse.name : 'Choisir un fichier PDF'}</span>
              <input
                type='file'
                accept='application/pdf'
                className='hidden'
                onChange={(e: any) => {
                  const file: any = e.target.files?.[0]

                  if (file) {
                    setData((prev: any) => ({
                      ...prev,
                      analyse: file,
                      analyseSrc: URL.createObjectURL(file)
                    }))
                    handleFileChange(e)
                  }
                }}
              />
            </label>
          </Grid>
        </Grid>
      </form>
    </Modal>
  )
}
