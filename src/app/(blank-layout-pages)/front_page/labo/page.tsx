'use client'
import {
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material'

import React, { useEffect, useState } from 'react'
import { Mail, MapPin, DollarSign } from 'lucide-react'
import { FaRegClock } from 'react-icons/fa'
import RendezVousFormModal from '@/components/modals/rendezVousFormModal'
import { SimpleSlideshow } from '@/components/auto-images/images'
import { StarRating } from '@/components/ui/star-rating'

const Laboratoire = () => {
  const villes = [
    { label: 'Ariana', value: 1 },
    { label: 'Béja', value: 2 },
    { label: 'Ben Arous', value: 3 },
    { label: 'Bizerte', value: 4 },
    { label: 'Gabès', value: 5 },
    { label: 'Gafsa', value: 6 },
    { label: 'Jendouba', value: 7 },
    { label: 'Kairouan', value: 8 },
    { label: 'Kasserine', value: 9 },
    { label: 'Kébili', value: 10 },
    { label: 'Kef', value: 11 },
    { label: 'Mahdia', value: 12 },
    { label: 'Manouba', value: 13 },
    { label: 'Médenine', value: 14 },
    { label: 'Monastir', value: 15 },
    { label: 'Nabeul', value: 16 },
    { label: 'Sfax', value: 17 },
    { label: 'Sidi Bouzid', value: 18 },
    { label: 'Siliana', value: 19 },
    { label: 'Sousse', value: 20 },
    { label: 'Tataouine', value: 21 },
    { label: 'Tozeur', value: 22 },
    { label: 'Tunis', value: 23 },
    { label: 'Zaghouan', value: 24 }
  ]
  const images = [
    {
      src: '/img/banner_lab_img/banner1.jpg',
      alt: 'banner1'
    },
    {
      src: '/img/banner_lab_img/banner4.png',
      alt: 'banner4'
    },
    {
      src: '/img/banner_lab_img/banner2.jpg',
      alt: 'banner2'
    },

    {
      src: '/img/banner_lab_img/banner6.jpg',
      alt: 'banner6'
    }
  ]

  const services = [
    { label: 'Service1', value: 1 },
    { label: 'Service2', value: 2 },
    { label: 'Service3', value: 3 },
    { label: 'Service4', value: 4 },
    { label: 'Service5', value: 5 },
    { label: 'Service6', value: 6 },
    { label: 'Service7', value: 7 }
  ]
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [data, setData] = useState<any>({
    nom_ut: '',
    service: 0,
    ville: 0
  })
  const [laboratoires, setLaboratoires] = useState<any[]>([])
  const [selectedLaboId, setSelectedLaboId] = useState<number | null>(null)

  async function handleSave() {
    try {
      const url = `${window.location.origin}/api/liste-labo-ser/liste`
      const requestBody = JSON.stringify({ service: data.service, nom_ut: data.nom_ut, ville: data.ville })

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: requestBody
      }

      const response = await fetch(url, requestOptions)

      if (!response.ok) throw new Error('Erreur lors de la requête')

      const responseData = await response.json()
      console.log('API Response:', responseData)

      if (responseData.erreur) {
        alert(responseData.message)
      } else {
        setLaboratoires(responseData.data)
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue lors de la récupération des données.')
    }
  }
  useEffect(() => {
    handleSave()
  }, [])
  return (
    <div className='bg-white pl-3 pr-3'>
      <SimpleSlideshow interval={5000} images={images} />
      <div className='pt-6'>
        <h1 className='text-center text-4xl font-semibold mb-12 items-center separator'>Laboratoires</h1>
      </div>

      <div className='flex justify-center gap-6'>
        <TextField
          className='w-1/5'
          placeholder='Nom'
          autoFocus
          value={data?.nom_ut || ''}
          onChange={e => setData((prev: any) => ({ ...prev, nom_ut: e.target.value }))}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <i className='ri-user-3-line' />
              </InputAdornment>
            )
          }}
        />

        <FormControl className='w-1/5'>
          <InputLabel>Service</InputLabel>
          <Select
            label='Service'
            value={data?.service || ''}
            onChange={e => setData((prev: any) => ({ ...prev, service: Number(e.target.value) }))}
          >
            {services.map(item => (
              <MenuItem value={item.value} key={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className='w-1/5'>
          <InputLabel>Ville</InputLabel>
          <Select
            label='Ville'
            value={data?.ville || ''}
            onChange={e => setData((prev: any) => ({ ...prev, ville: Number(e.target.value) }))}
          >
            {villes.map(item => (
              <MenuItem value={item.value} key={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant='contained' onClick={handleSave}>
          Rechercher
        </Button>
      </div>

      <Grid container spacing={6} className='py-12 px-6'>
        {laboratoires?.length > 0
          ? laboratoires.map((laboratoire, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card className='shadow-lg rounded-2xl border border-gray-200 bg-white'>
                  <div className='flex items-center justify-between p-4'>
                    <div className='flex items-center space-x-4'>
                      <img
                        className='w-20 h-20 rounded-full object-cover border-2 border-blue-500'
                        src={laboratoire.image ? laboratoire.image : '/img/placeholder-image.jpg'}
                        alt={laboratoire.nom_ut}
                      />
                      <div>
                        <h2 className='text-lg font-semibold text-gray-800'>{laboratoire.nom_ut}</h2>
                        <p className='text-sm text-gray-500'>
                          {services.find(service => service.value === laboratoire.service)?.label ||
                            'Service non définie'}
                        </p>
                        <div className='mt-2'>
                          <StarRating size='sm' initialRating={3.5} readOnly />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Button
                        variant='contained'
                        color='primary'
                        size='small'
                        onClick={() => {
                          setSelectedLaboId(laboratoire.id)
                          setIsModalOpen(true)
                        }}
                      >
                        Rendez-vous
                      </Button>

                      <RendezVousFormModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        laboId={selectedLaboId}
                      />
                    </div>
                  </div>

                  <hr className='my-4 border-t border-gray-300' />
                  <CardContent>
                    <p className='mb-4'>{laboratoire.info}</p>
                    <div className='flex items-center text-gray-600 text-sm mt-4'>
                      <MapPin className='w-4 h-4 mr-2 text-blue-500' />
                      <span>
                        {villes.find(ville => ville.value === laboratoire.ville)?.label || 'Ville non définie'}
                      </span>

                      <Mail className='w-4 h-4 mr-2 text-blue-500 ml-8' />
                      <span>{laboratoire.email}</span>

                      <FaRegClock className='w-4 h-4 mr-2 text-blue-500  m-8' />
                      <span>{laboratoire.horaires}</span>
                    </div>
                    <div className='flex justify-end mt-4'>
                      <StarRating size='sm' />
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))
          : null}
      </Grid>
    </div>
  )
}

export default Laboratoire
