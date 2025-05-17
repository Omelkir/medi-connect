'use client'

import React, { useState } from 'react'

import { useSearchParams } from 'next/navigation'

import { Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material'

import * as Tabs from '@radix-ui/react-tabs'

import { ChevronDown, FileText, Plus } from 'lucide-react'

import { toast } from 'react-toastify'

import Arrow from '@/views/dashboard/Arrow'

import { getStorageData } from '@/utils/helpers'

import AnalyseModal from '@/components/modals/analyse'
import DeleteModal from '@/components/modals/deleteModal/deleteModal'
import Pagination from '@/components/ui/pagination'
import OrdonnancesModal from '@/components/modals/ordonnance'

const Patient = () => {
  const searchParams = useSearchParams()
  const idFiche = searchParams.get('id')
  const [activeTab, setActiveTab] = useState('informations-generales')
  const [patientListe, setPatientListe] = useState<any[]>([])
  const [consultations, setConsultations] = useState<any[]>([])
  const [analyses, setAnalyses] = useState<any[]>([])
  const [ordonnances, setOrdonnances] = useState<any[]>([])
  const [selectedPatient, setSelectedPatient] = useState<any>(idFiche ? patientListe.find(p => p.id === idFiche) : null)
  const userData = getStorageData('user')
  const [selected, setSelected] = useState<any>(null)
  const [update, setUpdate] = useState<string>(new Date().toDateString())
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isAnalyseModalOpen, setIsAnalyseModalOpen] = useState(false)
  const [isOrdonnanceModalOpen, setIsOrdonnanceModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedConst, setselectedConst] = useState<string>('')
  const [paginatorInfo, setPaginatorInfo] = useState<any>({ total: 6 })

  const [data, setData] = useState<any>({
    patient: idFiche ?? '',
    id_med: userData.id
  })

  const Dropdown = ({
    onEdit,
    onDelete,
    id_consultation,
    date,
    ordonnances
  }: {
    onEdit: (med: any) => void
    onDelete: (med: any) => void
    id_consultation: any
    date: string
    ordonnances: any[]
  }) => {
    const [open, setOpen] = useState(false)
    const toggleDropdown = () => setOpen(prev => !prev)

    return (
      <div className='relative'>
        <div
          onClick={() => {
            toggleDropdown()
          }}
          className='inline-flex items-center py-2 px-3 cursor-pointer navigation select-none'
        >
          {date}
          <ChevronDown className={`ml-1 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} size={18} />
        </div>

        {open &&
          (ordonnances ? (
            <div className='overflow-x-auto'>
              <table className='min-w-full bg-white border border-gray-200 rounded-lg shadow-md'>
                <thead>
                  <tr>
                    <th className='px-4 py-2 text-left text-sm font-medium text-gray-600 border-b'>Médicament</th>
                    <th className='px-4 py-2 text-left text-sm font-medium text-gray-600 border-b'>Dosage</th>
                    <th className='px-4 py-2 text-left text-sm font-medium text-gray-600 border-b'>Durée/jour(s)</th>
                    <th className='px-4 py-2 text-left text-sm font-medium text-gray-600 border-b'>
                      Action
                      <Plus
                        className='text-blue-500 float-right'
                        onClick={() => {
                          handleOpenOrdModal()
                          setSelectedDate(date)
                          setselectedConst(id_consultation)
                        }}
                      />
                    </th>
                  </tr>
                </thead>
                {ordonnances?.length > 0 ? (
                  <tbody>
                    {ordonnances.map((ordonnance: any, index: any) => (
                      <tr key={index} className='bg-gray-100 hover:bg-gray-200'>
                        <td className='px-4 py-2 text-sm text-gray-700'>{ordonnance.medi}</td>
                        <td className='px-4 py-2 text-sm text-gray-700'>{ordonnance.dosage}</td>
                        <td className='px-4 py-2 text-sm text-gray-700'>{ordonnance.duree}</td>
                        <td className='px-4 py-2 text-sm text-gray-700  gap-2'>
                          <button
                            className='ri-edit-box-line text-yellow-500 text-xl hover:text-2xl mr-3'
                            onClick={() => {
                              onEdit(ordonnance)
                              setSelectedDate(date)
                            }}
                          ></button>
                          <button
                            onClick={() => {
                              onDelete(selectedDate)
                            }}
                            className='ri-delete-bin-line text-red-500 text-xl hover:text-2xl'
                          ></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                ) : (
                  <tbody>
                    <tr key={'n'} className='bg-gray-100 hover:bg-gray-200'>
                      <td colSpan={5}>vide</td>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>
          ) : (
            <p className='text-gray-500 text-center'>Aucune ordonnance trouvée.</p>
          ))}
      </div>
    )
  }

  async function getConsultations() {
    if (!selectedPatient) return
    const url = `${window.location.origin}/api/consultation/liste?id_patient=${selectedPatient.id}&consultation.id_el=${userData.id}&consultation.el=${userData.role}`

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

  const onPagination = (e: any) => {
    getAnalyse(e)
  }

  async function getAnalyse(page = 1) {
    try {
      if (!selectedPatient) return
      const url = `${window.location.origin}/api/analyse/liste?id_patient=${selectedPatient.id}&id_el=${userData.id}&el=${userData.role}&page=${page}`

      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }

      const response = await fetch(url, requestOptions)

      if (!response.ok) throw new Error('Erreur lors de la requête')

      const responseData = await response.json()

      console.log('API Response:', responseData)

      if (responseData.erreur) {
        toast.error(responseData.message)
      } else {
        setAnalyses(responseData.data)
        setPaginatorInfo(responseData?.paginatorInfo)
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Une erreur est survenue lors de la récupération des données.')
    }
  }

  // async function getAnalyse(page = 1) {
  //   if (!selectedPatient) return
  //   const url = `${window.location.origin}/api/analyse/liste?id_patient=${selectedPatient.id}&id_el=${userData.id}&el=${userData.role}&page=${page}`

  //   try {
  //     const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })

  //     if (!response.ok) throw new Error('Erreur lors de la requête')
  //     const responseData = await response.json()

  //     setAnalyses(responseData.data || [])
  //     setPaginatorInfo(responseData?.paginatorInfo)
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  React.useEffect(() => {
    getAnalyse()
  }, [selectedPatient, update])

  const handleOpenModal = (analyse: any = null) => {
    setSelected(analyse)
    setIsAnalyseModalOpen(true)
  }

  const ordonnancesByDate: Record<string, any[]> = {}

  consultations.forEach(cons => {
    const date = new Date(cons.start).toISOString().split('T')[0]

    if (!ordonnancesByDate[date]) {
      ordonnancesByDate[date] = []
    }

    ordonnances.forEach(ord => {
      const ordDate = new Date(ord.consultation_date).toISOString().split('T')[0]

      if (ordDate === date) {
        ordonnancesByDate[date].push(ord)
      }
    })
  })

  const sortedOrdonnancesByDate = Object.keys(ordonnancesByDate)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    .reduce(
      (acc, date) => {
        acc[date] = ordonnancesByDate[date]

        return acc
      },
      {} as Record<string, any[]>
    )

  const dates = Object.keys(sortedOrdonnancesByDate)

  console.log('ordonnancesByDate', ordonnancesByDate)

  async function getPatientListe() {
    const url = `${window.location.origin}/api/patient/liste?id_el=${userData.id}`

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

  async function getOrdonnance(page = 1) {
    if (!selectedPatient) return
    const url = `${window.location.origin}/api/ordonnance/liste?id_patient=${selectedPatient.id}&id_el=${userData?.id}&el=${userData?.role}&page=${page}`

    try {
      const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })

      if (!response.ok) throw new Error('Erreur lors de la requête')
      const responseData = await response.json()

      setOrdonnances(responseData.data || [])
      setPaginatorInfo(responseData?.paginatorInfo)
    } catch (error) {
      console.error(error)
    }
  }

  React.useEffect(() => {
    getOrdonnance()
  }, [selectedPatient, update])

  const handleOpenOrdModal = (ord: any = null) => {
    setSelected(ord)
    setIsOrdonnanceModalOpen(true)
  }

  const handleOpenDeleteModal = (analyse: any = null) => {
    setSelected(analyse)
    setIsDeleteModalOpen(true)
  }

  const handleDelete = async (analyse: any) => {
    const id = analyse?.id

    if (!id) return console.error('ID manquant pour la suppression')

    try {
      const url = `${window.location.origin}/api/analyse/supprimer?id=${id}`

      const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })

      const result = await response.json()

      if (result.erreur) {
        console.error('Erreur:', result.message)
      } else {
        setUpdate(Date.now().toString())

        toast.success("L'analyse a été supprimé avec succès")
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  const handleConfirmDelete = async () => {
    await handleDelete(selected)
    setIsDeleteModalOpen(false)
  }

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
              <Tabs.Content value='informations-generales' className='mt-4'>
                {selectedPatient ? (
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6'>
                    {[
                      { label: 'Nom', value: selectedPatient.nom, icon: 'user' },
                      { label: 'Prénom', value: selectedPatient.prenom, icon: 'user-circle' },
                      { label: 'Âge', value: selectedPatient.age, icon: 'calendar' },
                      { label: 'Ville', value: selectedPatient.ville, icon: 'map-pin' },
                      { label: 'Email', value: selectedPatient.email, icon: 'mail' },
                      { label: 'Téléphone', value: selectedPatient.tel, icon: 'phone' }
                    ].map((item, index) => (
                      <div key={index} className='flex items-center bg-white border rounded-xl p-6 shadow-sm space-x-4'>
                        <div className='text-blue-500'>
                          <i className={`ri-${item.icon}-line text-2xl`} />
                        </div>
                        <div>
                          <p className='text-sm text-gray-500'>{item.label}</p>
                          <p className='text-lg font-semibold text-gray-700'>{item.value}</p>
                        </div>
                      </div>
                    ))}
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
                            return (
                              <tr key={index} className='bg-gray-100'>
                                <td className='!plb-1'>{new Date(consultation.start).toLocaleDateString('fr-FR')}</td>
                                <td className='!plb-1'>
                                  {new Date(consultation.start).toLocaleTimeString('fr-FR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
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
                  <>
                    <div className='overflow-x-auto'>
                      <table className='min-w-full bg-white border border-gray-200 rounded-lg shadow-md'>
                        <colgroup>
                          <col className='w-1/4' />
                          <col className='w-1/4' />
                          <col className='w-1/4' />
                          <col className='w-1/4' />
                        </colgroup>
                        <thead>
                          <tr>
                            <th className='px-4 py-2 text-left text-sm font-medium text-gray-600 border-b'>Titre</th>
                            <th className='px-4 py-2 text-left text-sm font-medium text-gray-600 border-b'>Détail</th>
                            <th className='px-4 py-2 text-left text-sm font-medium text-gray-600 border-b'>Analyse</th>
                            <th className='px-4 py-2 text-left text-sm font-medium text-gray-600 border-b'>
                              Action <Plus className='text-blue-500 float-right' onClick={() => handleOpenModal()} />
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {analyses.length > 0 ? (
                            analyses.map((analyse, index) => (
                              <tr key={index} className='bg-gray-100 hover:bg-gray-200'>
                                <td className='px-4 py-2 text-sm text-gray-700'>{analyse.titre}</td>
                                <td className='px-4 py-2 text-sm text-gray-700'>{analyse.detail}</td>
                                <td className='px-4 py-2 text-sm text-gray-700'>
                                  <a href={analyse.analyse} target='_blank' rel='noopener noreferrer'>
                                    <FileText size={14} /> Voir le PDF
                                  </a>
                                </td>
                                <td className='px-4 py-2 text-sm text-gray-700 gap-2'>
                                  <button
                                    className='ri-edit-box-line text-yellow-500 text-xl hover:text-2xl mr-3'
                                    onClick={() => handleOpenModal(analyse)}
                                  ></button>
                                  <button
                                    onClick={() => handleOpenDeleteModal(analyse)}
                                    className='ri-delete-bin-line text-red-500 text-xl hover:text-2xl'
                                  ></button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className='px-4 py-4 text-center text-gray-500'>
                                Aucune analyse trouvée.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    <Grid item xs={12} className='mt-6 justify-items-end'>
                      <Pagination
                        total={paginatorInfo.total}
                        current={paginatorInfo.currentPage}
                        pageSize={paginatorInfo.perPage}
                        onChange={onPagination}
                      />
                    </Grid>
                  </>
                ) : (
                  <p className='text-gray-500'>Sélectionnez un patient pour afficher les analyses.</p>
                )}
              </Tabs.Content>
              <Tabs.Content value='ordonnance' className='mt-4'>
                {selectedPatient ? (
                  dates.map((date: any) => {
                    const ords = ordonnancesByDate[date]

                    const matchedConsultation = consultations.find(cons => {
                      const consDate = new Date(cons.start).toISOString().split('T')[0]

                      return consDate === date
                    })

                    const consultationId = matchedConsultation ? matchedConsultation.id : null

                    return (
                      <Dropdown
                        key={date}
                        date={date}
                        id_consultation={consultationId}
                        ordonnances={ords}
                        onEdit={handleOpenOrdModal}
                        onDelete={handleOpenDeleteModal}
                      />
                    )
                  })
                ) : (
                  <p className='text-gray-500 text-center'>Sélectionnez un patient pour afficher les ordonnances.</p>
                )}
              </Tabs.Content>
            </Tabs.Root>
          </div>
        </CardContent>
        <AnalyseModal
          isOpen={isAnalyseModalOpen}
          analyseData={selected}
          patient={selectedPatient}
          id_el={userData.id}
          onClose={() => setIsAnalyseModalOpen(false)}
          setUpdate={setUpdate}
        />
        <OrdonnancesModal
          isOpen={isOrdonnanceModalOpen}
          ordananceData={selected}
          id_cons={selectedConst}
          patient={selectedPatient}
          id_el={userData.id}
          onClose={() => setIsOrdonnanceModalOpen(false)}
          setUpdate={setUpdate}
        />

        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          label={`cette analyse`}
        />
      </Card>
    </div>
  )
}

export default Patient
