'use client'

import { useState } from 'react'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Button, Card, CardContent } from '@mui/material'
import Arrow from '@/views/dashboard/Arrow'
import React from 'react'
import ConsultationModal from '@/components/modals/consultation'
import { CalendarCheck } from 'lucide-react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css' // Importer les styles

// Définition du type des événements
interface Evenement {
  title: string
  start: Date
  end: Date
}

const CalendrierRendezvous = () => {
  const localizer = momentLocalizer(moment)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [evenements, setEvenements] = useState<Evenement[]>([])
  const [update, setUpdate] = useState<string>(new Date().toDateString())

  console.log(evenements)
  const handleOpenModal = () => {
    setIsModalOpen(true)
  }
  async function refrech_envent() {
    try {
      const url = `${window.location.origin}/api/consultation/liste`

      const requestOptions = { method: 'GET', headers: { 'Content-Type': 'application/json' } }

      const response = await fetch(url, requestOptions)

      if (!response.ok) throw new Error('Erreur lors de la requête')

      const responseData = await response.json()
      console.log('API Response:', responseData)

      if (responseData.erreur) {
        alert(responseData.message)
      } else {
        setEvenements(responseData.data)
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue lors de la récupération des données.')
    }
  }
  React.useEffect(() => {
    refrech_envent()
  }, [])

  const handleSelectSlot = ({ start }: { start: Date }) => {
    const title = prompt('Entrez le nombre de rendez-vous :')
    if (title) {
      setEvenements([...evenements, { title: `${title} Rendez-vous`, start, end: start }])
    }
  }

  return (
    <Card>
      <CardContent>
        <Arrow title='Dashboard' subTitle='Rendez-vous' />
        <div className='p-4'>
          <div className='flex justify-end items-center mb-4'>
            <Button
              fullWidth
              variant='contained'
              color='primary'
              className='h-12 w-1/4 mb-12'
              onClick={() => handleOpenModal()}
            >
              <CalendarCheck className='mr-2' /> Ajouter rendez-vous
            </Button>
          </div>
          <Calendar
            localizer={localizer}
            events={evenements}
            startAccessor='start'
            endAccessor='end'
            selectable
            onSelectSlot={handleSelectSlot}
            style={{ height: 600 }}
          />
        </div>
        <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} setUpdate={setUpdate} />
      </CardContent>
    </Card>
  )
}

export default CalendrierRendezvous
