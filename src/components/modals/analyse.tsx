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
    analyse: '',
    id_patient: patient,
    id_el: id_el
  })

  useEffect(() => {
    if (analyseData) {
      setData(analyseData)
    } else {
      setData({ titre: '', detail: '', analyse: '' })
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

  const [file, setFile] = useState<File | null>(null)

  const clearForm = () => {
    setData({ titre: '', detail: '', analyse: '' })
    setControls({ titre: false, detail: false, analyse: false })
  }

  const isAdd = !analyseData

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

      setData({ data })
      const requestBody = JSON.stringify(data)
      const requestOptions = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: requestBody }

      await fetch(url, requestOptions).then((responseData: any) => {
        setUpdate(new Date().getDate().toString())
        clearForm()

        if (responseData.erreur) {
          alert(responseData.message)
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
              <span className='text-gray-700'>{file ? file.name : 'Choisir un fichier PDF'}</span>
              <input
                type='file'
                accept='application/pdf'
                className='hidden'
                onChange={e => setFile(e.target.files?.[0] || null)}
              />
            </label>
          </Grid>
        </Grid>
      </form>
    </Modal>
  )
}
