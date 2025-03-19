'use client'

import { Button, Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material'
import { IconUserPlus } from '@tabler/icons-react'
import Arrow from '@/views/dashboard/Arrow'
import PatientModal from '@/components/modals/patient'
import { useState } from 'react'
import PatientDelete from '@/components/modals/deleteModal/patient'
import Pagination from '@/components/ui/pagination'

const DossierMedicaux = ({ paginatorInfo }: any) => {
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)

  const handleOpenPatientModal = (patient: any = null) => {
    setSelectedPatient(patient)
    setIsPatientModalOpen(true)
  }
  const [tab, setTab] = useState('ordonnances')

  const patient = {
    nom: 'Ahmed Ben Ali',
    age: 45,
    groupeSanguin: 'O+',
    ordonnances: [{ date: '2025-03-12', medicaments: ['Lisinopril', 'Aspirine'] }],
    analyses: [{ date: '2025-03-05', type: 'Bilan sanguin', resultat: 'Normaux' }]
  }
  const options = [
    { label: 'Admin', value: 1 },
    { label: 'Médecin', value: 2 },
    { label: 'Laboratoire', value: 3 }
  ]

  return (
    <div>
      <Card className='min-h-screen h-scre'>
        <CardContent>
          <Arrow title='Dashboard' subTitle='Dossier Médical' />
          <div></div>
          <FormControl fullWidth>
            <InputLabel>Choisir patient</InputLabel>
            <Select label='Choisir patient' className='w-1/4 mb-6'>
              {options.map(item => (
                <MenuItem value={item.value} key={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div className='w-4/5'>
            <h2 className='text-2xl font-semibold text-blue-600'>
              {patient.nom}, {patient.age} ans ({patient.groupeSanguin})
            </h2>

            <div>
              {/* Onglets */}
              <div className='flex mt-4 border-b'>
                <button
                  onClick={() => setTab('ordonnances')}
                  className={`px-4 py-2 w-full ${tab === 'ordonnances' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                >
                  Ordonnance
                </button>
                <button
                  onClick={() => setTab('analyses')}
                  className={`px-4 py-2 w-full ${tab === 'analyses' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                >
                  Analyse
                </button>
              </div>

              {/* Contenu des onglets */}
              <div className='mt-4'>
                {tab === 'ordonnances' && (
                  <div>
                    {patient.ordonnances.map((o, index) => (
                      <div key={index} className='p-4 border rounded-lg shadow mb-2'>
                        <p>
                          <strong>Date:</strong> {o.date}
                        </p>
                        <p>
                          <strong>Médicaments:</strong> {o.medicaments.join(', ')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {tab === 'analyses' && (
                  <div>
                    {patient.analyses.map((a, index) => (
                      <div key={index} className='p-4 border rounded-lg shadow mb-2'>
                        <p>
                          <strong>Date:</strong> {a.date}
                        </p>
                        <p>
                          <strong>Type:</strong> {a.type}
                        </p>
                        <p>
                          <strong>Résultat:</strong> {a.resultat}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DossierMedicaux
