// 'use client'
// import { Button, Card, CardContent, Grid, TextField } from '@mui/material'

// import { IconUserPlus } from '@tabler/icons-react'
// import Arrow from '@/views/dashboard/Arrow'
// import PatientModal from '@/components/modals/patient'
// import { useState } from 'react'
// import Table from './Table'

// const Patient = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   return (
//     <div>
//       <Card>
//         <CardContent>
//           <Arrow title='Dashboard' subTitle='Patient' />

//           <Button
//             fullWidth
//             variant='contained'
//             color='primary'
//             className='h-12 w-1/6 mb-12'
//             onClick={() => setIsModalOpen(true)}
//           >
//             Ajouter un patient
//           </Button>
//           <PatientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
//           <Grid item xs={12}>
//             <Table />
//           </Grid>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
// export default Patient
'use client'

import { Button, Card, CardContent, Grid } from '@mui/material'
import { IconUserPlus } from '@tabler/icons-react'
import Arrow from '@/views/dashboard/Arrow'
import PatientModal from '@/components/modals/patient'
import { useState } from 'react'
import Table from './Table'
import PatientDelete from '@/components/modals/deleteModal/patient'
import Pagination from '@/components/ui/pagination'

const Patient = ({ paginatorInfo }: any) => {
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)

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
          />

          <PatientDelete
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            patientData={selectedPatient}
          />

          <Grid item xs={12}>
            <Table onEditPatient={handleOpenPatientModal} onDeletePatient={handleOpenDeleteModal} />
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
