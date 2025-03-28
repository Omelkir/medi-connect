'use client'

import { Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import Arrow from '@/views/dashboard/Arrow'
import { useState } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import { getStorageData } from '@/utils/helpers'
import tableStyles from '@core/styles/table.module.css'
import React from 'react'

import { useSearchParams } from 'next/navigation'

const Patient = () => {
  const searchParams = useSearchParams()
  const idFiche = searchParams.get('id') // Récupérer la valeur de "id"

  const [activeTab, setActiveTab] = useState('informations-generales')
  const [patientListe, setPatientListe] = useState<any[]>([])
  const [selectedPatient, setSelectedPatient] = useState<any>(idFiche ? patientListe.find(p => p.id === idFiche) : null)
  const userData = getStorageData('user')
  const [data, setData] = useState<any>({
    patient: idFiche ?? '',
    id_med: userData.id
  })

  const DocteurData = getStorageData('user')
  async function getPatientListe() {
    const url = `${window.location.origin}/api/patient/liste?id_med=${DocteurData.id}`

    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }
    const response = await fetch(url, requestOptions)

    if (!response.ok) throw new Error('Erreur lors de la requête')

    const responseData = await response.json()
    if (idFiche !== null) {
      setSelectedPatient(responseData?.data?.find((p: any) => p.id == idFiche))
    }

    console.log('API Response:', responseData)

    if (responseData.erreur) {
      alert(responseData.message)
    } else {
      setPatientListe(responseData.data)
    }
  }
  React.useEffect(() => {
    getPatientListe()
  }, [])

  return (
    <div>
      <Card className='min-h-screen'>
        <CardContent>
          <Arrow title='Dashboard' subTitle='Fiche Patient ' />

          {idFiche === null && (
            <Grid item xs={12} md={12} className='mt-12'>
              <FormControl fullWidth>
                <InputLabel>Patient</InputLabel>
                <Select
                  label='Patient'
                  className='w-1/3'
                  value={data?.patient || null}
                  onChange={(e: any) => {
                    setData((prev: any) => ({
                      ...prev,
                      patient: e.target.value
                    }))
                    const patient = patientListe.find(p => p.id === e.target.value)
                    setSelectedPatient(patient || null)
                  }}
                >
                  {patientListe.map((item: any, i: number) => (
                    <MenuItem value={item.id} key={item.id}>
                      {item.nom + ' ' + item.prenom}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          <div className='w-full rounded-lg mt-12'>
            {/* Onglets */}
            <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
              <Tabs.List className='flex border-b'>
                <Tabs.Trigger
                  value='informations-generales'
                  className={`px-4 py-2 w-1/3 text-sm font-medium ${
                    activeTab === 'informations-generales'
                      ? 'border-b-2 border-blue-500 text-blue-500'
                      : 'text-gray-600'
                  }`}
                >
                  Informations générales
                </Tabs.Trigger>
                <Tabs.Trigger
                  value='consultation'
                  className={`px-4 py-2 w-1/3 text-sm font-medium ${
                    activeTab === 'consultation' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'
                  }`}
                >
                  Consultation
                </Tabs.Trigger>
                <Tabs.Trigger
                  value='analyse'
                  className={`px-4 py-2 w-1/3 text-sm font-medium ${
                    activeTab === 'analyse' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'
                  }`}
                >
                  Liste des analyses
                </Tabs.Trigger>
                <Tabs.Trigger
                  value='ordaonnance'
                  className={`px-4 py-2 text-sm w-1/3 font-medium ${
                    activeTab === 'ordaonnance' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'
                  }`}
                >
                  Ordonnances
                </Tabs.Trigger>
              </Tabs.List>

              {/* Contenu des onglets */}
              <Tabs.Content value='informations-generales' className='mt-4'>
                {selectedPatient ? (
                  <div className='p-3'>
                    <table className={tableStyles.table}>
                      <thead>
                        <tr>
                          <th className='bg-blue-400 text-white'>Nom</th>
                          <th className='bg-blue-400 text-white'>Prenom</th>
                          <th className='bg-blue-400 text-white'>Âge</th>
                          <th className='bg-blue-400 text-white'>Ville</th>
                          <th className='bg-blue-400 text-white'>Email</th>
                          <th className='bg-blue-400 text-white'>Téléphone</th>
                        </tr>
                      </thead>{' '}
                      <tbody>
                        <tr>
                          <td className='!plb-1 bg-blue-100'>
                            <Typography>{selectedPatient.nom}</Typography>
                          </td>
                          <td className='!plb-1  bg-blue-100'>
                            <Typography>{selectedPatient.prenom}</Typography>
                          </td>
                          <td className='!plb-1  bg-blue-100'>
                            <Typography>{selectedPatient.age}</Typography>
                          </td>
                          <td className='!plb-1  bg-blue-100'>
                            <Typography>{selectedPatient.ville}</Typography>
                          </td>
                          <td className='!plb-1  bg-blue-100'>
                            <Typography>{selectedPatient.email}</Typography>
                          </td>
                          <td className='!plb-1  bg-blue-100'>
                            <Typography>{selectedPatient.tel}</Typography>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {/* <p className='m-1'>
                      <strong>Nom:</strong> {selectedPatient.nom}
                    </p>
                    <p className='m-1'>
                      <strong>Prénom:</strong> {selectedPatient.prenom}
                    </p>
                    <p className='m-1'>
                      <strong>Âge:</strong> {selectedPatient.age}
                    </p>
                    <p className='m-1'>
                      <strong>Ville:</strong> {selectedPatient.ville}
                    </p>
                    <p className='m-1'>
                      <strong>Email:</strong> {selectedPatient.email}
                    </p>
                    <p className='m-1'>
                      <strong>Téléphone:</strong> {selectedPatient.tel}
                    </p> */}
                  </div>
                ) : (
                  <p className='m-1 text-gray-500'>Sélectionnez un patient pour afficher les informations.</p>
                )}
              </Tabs.Content>

              <Tabs.Content value='consultation' className='mt-4'>
                <h2 className='text-xl font-semibold'>Utilisateurs</h2>
                <p>Liste des utilisateurs...</p>
              </Tabs.Content>

              <Tabs.Content value='analyse' className='mt-4'>
                <h2 className='text-xl font-semibold'>Paramètres</h2>
                <p>Modifier les paramètres ici...</p>
              </Tabs.Content>
              <Tabs.Content value='ordaonnance' className='mt-4'>
                <h2 className='text-xl font-semibold'>Paramètres</h2>
                <p>Modifier les paramètres ici...</p>
              </Tabs.Content>
            </Tabs.Root>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Patient
