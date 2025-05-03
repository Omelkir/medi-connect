'use client'

import React, { useState } from 'react'

import { useSearchParams } from 'next/navigation'

import { Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material'

import * as Tabs from '@radix-ui/react-tabs'

import Arrow from '@/views/dashboard/Arrow'

import { getStorageData } from '@/utils/helpers'
import tableStyles from '@core/styles/table.module.css'

const Patient = () => {
  const searchParams = useSearchParams()
  const idFiche = searchParams.get('id') // Récupérer la valeur de "id"

  const [activeTab, setActiveTab] = useState('informations-generales')
  const [patientListe, setPatientListe] = useState<any[]>([])
  const [consultations, setConsultations] = useState<any[]>([])
  const [analyses, setAnalyses] = useState<any[]>([])
  const [ordonnances, setOrdonnances] = useState<any[]>([])
  const [selectedPatient, setSelectedPatient] = useState<any>(idFiche ? patientListe.find(p => p.id === idFiche) : null)
  const userData = getStorageData('user')

  const [data, setData] = useState<any>({
    patient: idFiche ?? '',
    id_med: userData.id
  })

  const DocteurData = getStorageData('user')

  async function getPatientListe() {
    const url = `${window.location.origin}/api/patient/liste?id_el=${DocteurData.id}`

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

  async function getConsultations() {
    if (!selectedPatient) return
    const url = `${window.location.origin}/api/consultation/liste?id_patient=${selectedPatient.id}`

    try {
      const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })

      if (!response.ok) throw new Error('Erreur lors de la requête')
      const responseData = await response.json()

      setConsultations(responseData.data || [])
    } catch (error) {
      console.error(error)
    }
  }

  React.useEffect(() => {
    getConsultations()
  }, [selectedPatient])

  async function getAnalyse() {
    if (!selectedPatient) return
    const url = `${window.location.origin}/api/analyse/liste?id_patient=${selectedPatient.id}`

    try {
      const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })

      if (!response.ok) throw new Error('Erreur lors de la requête')
      const responseData = await response.json()

      setAnalyses(responseData.data || [])
    } catch (error) {
      console.error(error)
    }
  }

  React.useEffect(() => {
    getAnalyse()
  }, [selectedPatient])

  async function getOrdonnance() {
    if (!selectedPatient) return
    const url = `${window.location.origin}/api/ordonnance/liste?id_patient=${selectedPatient.id}`

    try {
      const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })

      if (!response.ok) throw new Error('Erreur lors de la requête')
      const responseData = await response.json()

      setOrdonnances(responseData.data || [])
    } catch (error) {
      console.error(error)
    }
  }

  React.useEffect(() => {
    getOrdonnance()
  }, [selectedPatient])

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
              <Tabs.List className='flex border-b-2 border-gray-200 mb-4'>
                <Tabs.Trigger
                  value='informations-generales'
                  className={`px-6 py-3 w-1/4 text-base font-semibold text-center transition duration-300 ease-in-out transform hover:scale-105 ${
                    activeTab === 'informations-generales'
                      ? 'border-b-4 border-blue-500 text-blue-500'
                      : 'text-gray-600 hover:text-blue-500'
                  }`}
                >
                  Informations générales
                </Tabs.Trigger>
                <Tabs.Trigger
                  value='consultation'
                  className={`px-6 py-3 w-1/4 text-base font-semibold text-center transition duration-300 ease-in-out transform hover:scale-105 ${
                    activeTab === 'consultation'
                      ? 'border-b-4 border-blue-500 text-blue-500'
                      : 'text-gray-600 hover:text-blue-500'
                  }`}
                >
                  Consultation
                </Tabs.Trigger>
                <Tabs.Trigger
                  value='analyse'
                  className={`px-6 py-3 w-1/4 text-base font-semibold text-center transition duration-300 ease-in-out transform hover:scale-105 ${
                    activeTab === 'analyse'
                      ? 'border-b-4 border-blue-500 text-blue-500'
                      : 'text-gray-600 hover:text-blue-500'
                  }`}
                >
                  Liste des analyses
                </Tabs.Trigger>
                <Tabs.Trigger
                  value='ordonnance'
                  className={`px-6 py-3 w-1/4 text-base font-semibold text-center transition duration-300 ease-in-out transform hover:scale-105 ${
                    activeTab === 'ordonnance'
                      ? 'border-b-4 border-blue-500 text-blue-500'
                      : 'text-gray-600 hover:text-blue-500'
                  }`}
                >
                  Ordonnances
                </Tabs.Trigger>
              </Tabs.List>

              {/* Contenu des onglets */}
              {/* <Tabs.Content value='informations-generales' className='mt-4'>
                {selectedPatient ? (
                  <div className='p-6 bg-white rounded-lg shadow-lg max-w-3xl mx-auto'>
                    <p className='text-xl font-semibold text-gray-700 mb-3'>
                      <strong>Nom:</strong> <span className='text-gray-500'>{selectedPatient.nom}</span>
                    </p>
                    <p className='text-xl font-semibold text-gray-700 mb-3'>
                      <strong>Prénom:</strong> <span className='text-gray-500'>{selectedPatient.prenom}</span>
                    </p>
                    <p className='text-xl font-semibold text-gray-700 mb-3'>
                      <strong>Âge:</strong> <span className='text-gray-500'>{selectedPatient.age}</span>
                    </p>
                    <p className='text-xl font-semibold text-gray-700 mb-3'>
                      <strong>Ville:</strong> <span className='text-gray-500'>{selectedPatient.ville}</span>
                    </p>
                    <p className='text-xl font-semibold text-gray-700 mb-3'>
                      <strong>Email:</strong> <span className='text-gray-500'>{selectedPatient.email}</span>
                    </p>
                    <p className='text-xl font-semibold text-gray-700 mb-3'>
                      <strong>Téléphone:</strong> <span className='text-gray-500'>{selectedPatient.tel}</span>
                    </p>
                  </div>
                ) : (
                  <p className='text-gray-500'>Sélectionnez un patient pour afficher les informations.</p>
                )}
              </Tabs.Content> */}
              <Tabs.Content value='informations-generales' className='mt-4'>
                {selectedPatient ? (
                  <div className='overflow-x-auto'>
                    <table className='min-w-full bg-white border border-gray-200 rounded-lg shadow-md'>
                      <thead>
                        <tr>
                          <th className='px-4 py-2 text-left text-sm font-medium text-gray-600 border-b'>Nom</th>
                          <th className='px-4 py-2 text-left text-sm font-medium text-gray-600 border-b'>Prénom</th>
                          <th className='px-4 py-2 text-left text-sm font-medium text-gray-600 border-b'>Âge</th>
                          <th className='px-4 py-2 text-left text-sm font-medium text-gray-600 border-b'>Ville</th>
                          <th className='px-4 py-2 text-left text-sm font-medium text-gray-600 border-b'>Email</th>
                          <th className='px-4 py-2 text-left text-sm font-medium text-gray-600 border-b'>Téléphone</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className='bg-gray-100'>
                          <td className='px-4 py-2 text-sm text-gray-700'>{selectedPatient.nom}</td>
                          <td className='px-4 py-2 text-sm text-gray-700'>{selectedPatient.prenom}</td>
                          <td className='px-4 py-2 text-sm text-gray-700'>{selectedPatient.age}</td>
                          <td className='px-4 py-2 text-sm text-gray-700'>{selectedPatient.ville}</td>
                          <td className='px-4 py-2 text-sm text-gray-700'>{selectedPatient.email}</td>
                          <td className='px-4 py-2 text-sm text-gray-700'>{selectedPatient.tel}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className='text-gray-500 text-center'>Sélectionnez un patient pour afficher les informations.</p>
                )}
              </Tabs.Content>

              <Tabs.Content value='consultation' className='mt-4'>
                {selectedPatient ? (
                  consultations.length > 0 ? (
                    <div className='overflow-x-auto'>
                      <table className='min-w-full bg-white border border-gray-200 rounded-lg shadow-md'>
                        <thead>
                          <tr>
                            <th className='px-4 py-2 text-left text-sm font-medium text-gray-600 border-b'>Date</th>
                            <th className='px-4 py-2 text-left text-sm font-medium text-gray-600 border-b'>Heure</th>
                            <th className='px-4 py-2 text-left text-sm font-medium text-gray-600 border-b'>Durée</th>
                          </tr>
                        </thead>
                        <tbody>
                          {consultations.map((consultation, index) => {
                            const dateObj = new Date(consultation.date)

                            return (
                              <tr key={index} className='bg-gray-100'>
                                <td className='px-4 py-2 text-sm text-gray-700'>{dateObj.toLocaleDateString()}</td>
                                <td className='px-4 py-2 text-sm text-gray-700'>
                                  {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </td>
                                <td className='px-4 py-2 text-sm text-gray-700'>{consultation.duree}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className='text-gray-500 text-center'>Aucune consultation trouvée.</p>
                  )
                ) : (
                  <p className='text-gray-500 text-center'>Sélectionnez un patient pour afficher les consultations.</p>
                )}
              </Tabs.Content>

              <Tabs.Content value='analyse' className='mt-4'>
                {selectedPatient ? (
                  analyses.length > 0 ? (
                    <div className='overflow-x-auto'>
                      <table className='min-w-full bg-white border border-gray-200 rounded-lg shadow-md'>
                        <thead>
                          <tr>
                            <th className='px-4 py-2 text-left text-sm font-medium text-gray-600 border-b'>Titre</th>
                            <th className='px-4 py-2 text-left text-sm font-medium text-gray-600 border-b'>Détail</th>
                            <th className='px-4 py-2 text-left text-sm font-medium text-gray-600 border-b'>Analyse</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analyses.map((analyse, index) => (
                            <tr key={index} className='bg-gray-100 hover:bg-gray-200'>
                              <td className='px-4 py-2 text-sm text-gray-700'>{analyse.titre}</td>
                              <td className='px-4 py-2 text-sm text-gray-700'>{analyse.detail}</td>
                              <td className='px-4 py-2 text-sm text-gray-700'></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className='text-gray-500 text-center'>Aucune analyse trouvée.</p>
                  )
                ) : (
                  <p className='text-gray-500 text-center'>Sélectionnez un patient pour afficher les analyses.</p>
                )}
              </Tabs.Content>
              <Tabs.Content value='ordonnance' className='mt-4'>
                {selectedPatient ? (
                  ordonnances.length > 0 ? (
                    <div className='overflow-x-auto'>
                      <table className='min-w-full bg-white border border-gray-200 rounded-lg shadow-md'>
                        <thead>
                          <tr>
                            <th className='px-4 py-2 text-left text-sm font-medium text-gray-600 border-b'>
                              Médicament
                            </th>
                            <th className='px-4 py-2 text-left text-sm font-medium text-gray-600 border-b'>Dosage</th>
                            <th className='px-4 py-2 text-left text-sm font-medium text-gray-600 border-b'>Durée</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ordonnances.map((ordonnance, index) => (
                            <tr key={index} className='bg-gray-100 hover:bg-gray-200'>
                              <td className='px-4 py-2 text-sm text-gray-700'>{ordonnance.medi}</td>
                              <td className='px-4 py-2 text-sm text-gray-700'>{ordonnance.dosage}</td>
                              <td className='px-4 py-2 text-sm text-gray-700'>{ordonnance.duree} jours</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className='text-gray-500 text-center'>Aucune ordonnance trouvée.</p>
                  )
                ) : (
                  <p className='text-gray-500 text-center'>Sélectionnez un patient pour afficher les ordonnances.</p>
                )}
              </Tabs.Content>
            </Tabs.Root>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Patient
