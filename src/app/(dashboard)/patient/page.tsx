'use client'

import { Button, Card, CardContent, Grid } from '@mui/material'
import { IconUserPlus } from '@tabler/icons-react'
import Arrow from '@/views/dashboard/Arrow'
import PatientModal from '@/components/modals/patient'
import { useState } from 'react'
import Table from './Table'
import PatientDelete from '@/components/modals/deleteModal/patient'
import Pagination from '@/components/ui/pagination'
import * as Tabs from '@radix-ui/react-tabs'

const Patient = ({ paginatorInfo }: any) => {
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
          <Grid item xs={12} className='mt-6 justify-items-end'>
            <Pagination
            // total={paginatorInfo.total}
            // current={paginatorInfo.currentPage}
            // pageSize={paginatorInfo.perPage}
            // onChange={onPagination}
            />
          </Grid>
        </CardContent>
      </Card>
    </div>
  )
}

export default Patient
