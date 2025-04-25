/* eslint-disable import/no-unresolved */
'use client'

import React, { useRef, useState } from 'react'

import interactionPlugin from '@fullcalendar/interaction'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import frLocale from '@fullcalendar/core/locales/fr'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Button, Card, CardContent } from '@mui/material'

import { CalendarCheck } from 'lucide-react'
import { momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

import Arrow from '@/views/dashboard/Arrow'
import ConsultationModal from '@/components/modals/consultation'

// Définition du type des événements
interface Evenement {
  title: string
  start: Date
  end: Date
}

const CalendrierRendezvous = () => {
  const calendarRef = useRef<FullCalendar | null>(null)

  const localizer = momentLocalizer(moment)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [evenements, setEvenements] = useState<Evenement[]>([])
  const [update, setUpdate] = useState<string>(new Date().toDateString())

  const [dataUp, setDataUp] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)

  console.log(evenements)

  const handleOpenModal = () => {
    setDataUp({})
    setIsModalOpen(true)
  }

  async function refrech_envent() {
    try {
      setIsLoading(true)
      const url = `${window.location.origin}/api/consultation/liste`

      const requestOptions = { method: 'GET', headers: { 'Content-Type': 'application/json' } }

      const response = await fetch(url, requestOptions)

      if (!response.ok) {
        setIsLoading(false)

        throw new Error('Erreur lors de la requête')
      }

      const responseData = await response.json()

      console.log('API Response:', responseData)

      if (responseData.erreur) {
        setIsLoading(false)

        alert(responseData.message)
      } else {
        setIsLoading(false)

        setEvenements(responseData.data)
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue lors de la récupération des données.')
    }
  }

  React.useEffect(() => {
    refrech_envent()
  }, [update])

  const handleSelectSlot = ({ start }: { start: Date }) => {
    const title = prompt('Entrez le nombre de rendez-vous :')

    if (title) {
      setEvenements([...evenements, { title: `${title} Rendez-vous`, start, end: start }])
    }
  }

  return (
    <Card>
      <CardContent>
        <Arrow title='Dashboard' subTitle={`Rendez-vous (${evenements?.length ?? '--'})`} />
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
          {isLoading ? (
            <div> Chargement ....</div>
          ) : (
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
              initialView='dayGridMonth'
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
              }}
              locale={frLocale}
              // events={[
              //   { title: 'Event 1', date: '2025-04-20' },
              //   { title: 'Event 2', date: '2025-04-21' }
              // ]}
              events={evenements}
              eventClick={info => {
                setIsModalOpen(true)
                setDataUp({
                  el: 2,
                  end: info.event.end?.toISOString(),
                  start: info.event.start?.toISOString(),
                  ...info.event._def.extendedProps
                })
              }}
              dateClick={(info: any) => {
                setIsModalOpen(true)
                const isoDateTime = info.date.toISOString() // ✅ ex: 2025-04-22T10:00:00.000Z

                setDataUp({
                  start: isoDateTime,
                  end: isoDateTime,
                  el: 2
                })
              }}
              height='auto'
            />
          )}
        </div>
        <ConsultationModal
          dataUp={dataUp}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          setUpdate={setUpdate}
        />
      </CardContent>
    </Card>
  )
}

export default CalendrierRendezvous
