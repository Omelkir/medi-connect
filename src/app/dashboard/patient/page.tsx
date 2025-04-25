'use client'

import { useState } from 'react'

import { Button, Card, CardContent, Grid } from '@mui/material'
import { IconUserPlus } from '@tabler/icons-react'

import * as Tabs from '@radix-ui/react-tabs'

import Arrow from '@/views/dashboard/Arrow'
import PatientModal from '@/components/modals/patient'
import Table from './Table'
import PatientDelete from '@/components/modals/deleteModal/patient'

const Patient = ({}: any) => {
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [update, setUpdate] = useState<string>(new Date().toDateString())
  const [activeTab, setActiveTab] = useState('dashboard')

  const handleOpenPatientModal = (patient: any = null) => {
    setSelectedPatient(patient)
    setIsPatientModalOpen(true)
  }

  const handleOpenDeleteModal = (patient: any) => {
    setSelectedPatient(patient)
    setIsDeleteModalOpen(true)
  }

  return (
    <div>
      <Card>
        <CardContent>
          <Arrow title='Dashboard' subTitle='Patient' />

          <Button
            fullWidth
            variant='contained'
            color='primary'
            className='h-12 w-1/6 mb-12'
            onClick={() => handleOpenPatientModal()}
          >
            <IconUserPlus className='mr-2' /> Ajouter
          </Button>

          <PatientModal
            isOpen={isPatientModalOpen}
            onClose={() => setIsPatientModalOpen(false)}
            patientData={selectedPatient}
            setUpdate={setUpdate}
          />

          <PatientDelete
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            patientData={selectedPatient}
            setUpdate={setUpdate}
          />

          <Grid item xs={12}>
            <Table onEditPatient={handleOpenPatientModal} onDeletePatient={handleOpenDeleteModal} update={update} />
          </Grid>
        </CardContent>
      </Card>
    </div>
  )
}

export default Patient
