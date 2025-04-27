'use client'

import { useState } from 'react'

import { Button, Card, CardContent, Grid } from '@mui/material'

import { Plus } from 'lucide-react'

import Arrow from '@/views/dashboard/Arrow'
import Table from './Table'
import PatientDelete from '@/components/modals/deleteModal/patient'

import SpecialiteModal from '@/components/modals/specialite'

const Specialite = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selected, setSelected] = useState<any>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [update, setUpdate] = useState<string>(new Date().toDateString())

  const handleOpenModal = (spe: any = null) => {
    setSelected(spe)
    setIsModalOpen(true)
  }

  const handleOpenDeleteModal = (spe: any = null) => {
    setSelected(spe)
    setIsDeleteModalOpen(true)
  }

  return (
    <div>
      <Card>
        <CardContent>
          <Arrow title='Dashboard' subTitle='Spécialité' />

          <Button
            fullWidth
            variant='contained'
            color='primary'
            className='h-12 w-1/6 mb-12'
            onClick={() => handleOpenModal()}
          >
            <Plus className='mr-2' /> Ajouter
          </Button>

          <SpecialiteModal
            isOpen={isModalOpen}
            speData={selected}
            onClose={() => setIsModalOpen(false)}
            setUpdate={setUpdate}
          />

          <PatientDelete isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} setUpdate={setUpdate} />

          <Grid item xs={12}>
            <Table onEdit={handleOpenModal} onDelete={handleOpenDeleteModal} update={update} />
          </Grid>
        </CardContent>
      </Card>
    </div>
  )
}

export default Specialite
