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
import { Mail, MapPin, DollarSign, Coins, Banknote } from 'lucide-react'
import { FaMoneyBillAlt, FaRegClock } from 'react-icons/fa'
import RendezVousFormModal from '@/components/modals/rendezVousFormModal'
import { SimpleSlideshow } from '@/components/auto-images/images'
import { StarRating } from '@/components/ui/star-rating'

const Medecin = () => {
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
    // {
    //   src: '/img/banner_doctors_img/banner6.jpg',
    //   alt: 'Mountain landscape with a lake'
    // },
    {
      src: '/img/banner_doctors_img/banner8.jpg',
      alt: 'Sunset over mountains'
    },
    {
      src: '/img/banner_doctors_img/banner5.png',
      alt: 'Forest with sunlight'
    },
    {
      src: '/img/banner_doctors_img/banner4.webp',
      alt: 'Foggy mountains'
    }
  ]

  const specialites = [
    { label: 'Médecine dentaire', value: 1 },
    { label: 'Cardiologie', value: 2 },
    { label: 'Dermatologie', value: 3 },
    { label: 'Ophtalmologie', value: 4 },
    { label: 'Pneumologie', value: 5 },
    { label: 'Orthopédie - Traumatologie', value: 6 },
    { label: 'Médecine interne', value: 7 }
  ]
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMedecinId, setSelectedMedecinId] = useState<number | null>(null)
  const [data, setData] = useState<any>({
    nom_ut: '',
    spe: 0,
    ville: 0
  })
  const [medecins, setMedecins] = useState<any[]>([])

  async function handleSave() {
    try {
      const url = `${window.location.origin}/api/liste-med-spe/liste`
      const requestBody = JSON.stringify({ spe: data.spe, nom_ut: data.nom_ut, ville: data.ville })

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
        setMedecins(responseData.data)
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
        <h1 className='text-center text-4xl font-semibold mb-12 items-center separator'>Médecins</h1>
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
          <InputLabel>Spécialité</InputLabel>
          <Select
            label='Spécialité'
            value={data?.spe || ''}
            onChange={e => setData((prev: any) => ({ ...prev, spe: Number(e.target.value) }))}
          >
            {specialites.map(item => (
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
        {medecins?.length > 0
          ? medecins.map((medecin, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card className='shadow-lg rounded-2xl border border-gray-200 bg-white'>
                  <div className='flex items-center justify-between p-4'>
                    <div className='flex items-center space-x-4'>
                      <img
                        className='w-20 h-20 rounded-full object-cover border-2 border-blue-500'
                        src={medecin.image ? medecin.image : '/img/placeholder-image.jpg'} // Assurer une image par défaut
                        alt={medecin.nom_ut}
                      />
                      <div>
                        <h2 className='text-lg font-semibold text-gray-800'>{medecin.nom_ut}</h2>
                        <p className='text-sm text-gray-500'>
                          {specialites.find(spe => spe.value === medecin.spe)?.label || 'Spécialité non définie'}
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
                          setSelectedMedecinId(medecin.id)
                          setIsModalOpen(true)
                        }}
                      >
                        Rendez-vous
                      </Button>

                      <RendezVousFormModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        medecinId={selectedMedecinId}
                      />
                    </div>
                  </div>
                  <hr className='my-4 border-t border-gray-300' />
                  <CardContent>
                    <p className='mb-4'>{medecin.info}</p>
                    <div className='flex items-center text-gray-600 text-sm mt-4'>
                      <MapPin className='w-4 h-4 mr-2 text-blue-500' />
                      <span>{villes.find(ville => ville.value === medecin.ville)?.label || 'Ville non définie'}</span>

                      <Mail className='w-4 h-4 mr-2 text-blue-500 ml-12' />
                      <span>{medecin.email}</span>
                    </div>
                    <div className='flex items-center text-gray-600 text-sm mt-4'>
                      <FaRegClock className='w-4 h-4 mr-2 text-blue-500' />
                      <span>{medecin.horaires}</span>

                      <FaMoneyBillAlt className='w-4 h-4 mr-2 text-blue-500 ml-12' />
                      <span>{medecin.tarif} dt</span>
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

export default Medecin
