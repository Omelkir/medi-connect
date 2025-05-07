'use client'
import React, { useEffect, useState } from 'react'

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
import { Mail, MapPin } from 'lucide-react'
import { FaMoneyBillAlt, FaRegClock } from 'react-icons/fa'

import Pagination from '@/components/ui/pagination'
import { SimpleSlideshow } from '@/components/auto-images/images'
import { StarRating } from '@/components/ui/star-rating'
import ConsultationModal from '@/components/modals/consultation'
import { getStorageData } from '@/utils/helpers'
import RendezVousModal from '@/components/modals/rendezVousFormModal'

const Medecin = () => {
  const userData = getStorageData('user')
  const [paginatorInfo, setPaginatorInfo] = useState<any>({ total: 6 })
  const [update, setUpdate] = useState<string>(new Date().toDateString())

  const onPagination = (e: any) => {
    getMedecinList(e)
  }

  const [villeListe, setVilleListe] = useState<any[]>([])
  const [speListe, setSpeListe] = useState<any[]>([])

  async function getVilleList() {
    try {
      const url = `${window.location.origin}/api/ville/liste`

      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }

      const response = await fetch(url, requestOptions)

      if (!response.ok) throw new Error('Erreur lors de la requête')

      const responseData = await response.json()

      if (responseData.erreur) {
        alert(responseData.message)
      } else {
        setVilleListe(responseData.data)
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue lors de la récupération des données.')
    }
  }

  useEffect(() => {
    getVilleList()
  }, [])

  async function getSpeList() {
    try {
      const url = `${window.location.origin}/api/specialite/liste`

      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }

      const response = await fetch(url, requestOptions)

      if (!response.ok) throw new Error('Erreur lors de la requête')

      const responseData = await response.json()

      if (responseData.erreur) {
        alert(responseData.message)
      } else {
        setSpeListe(responseData.data)
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue lors de la récupération des données.')
    }
  }

  useEffect(() => {
    getSpeList()
  }, [])

  const images = [{ src: '/img/banner_doctors_img/banner8.jpg', alt: 'Sunset over mountains' }]

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMedecinId, setSelectedMedecinId] = useState<any>(null)
  const [data, setData] = useState<any>({ nom_ut: '', id_spe: '', id_ville: '' })
  const [medecins, setMedecins] = useState<any[]>([])

  async function getMedecinList(page = 1) {
    try {
      const url = `${window.location.origin}/api/liste-med-spe/liste?nom_ut=${data.nom_ut}&id_spe=${data.id_spe}&id_ville=${data.id_ville}&page=${page}`

      const requestOptions = { method: 'GET' }

      const response = await fetch(url, requestOptions)

      if (!response.ok) throw new Error('Erreur lors de la requête')

      const responseData = await response.json()

      if (responseData.erreur) {
        alert(responseData.message)
      } else {
        setMedecins(responseData.data)
        setPaginatorInfo(responseData?.paginatorInfo)
      }
    } catch (err) {
      console.error('Erreur dans API:', err)

      return { erreur: true, message: 'Erreur interne' }
    }
  }

  useEffect(() => {
    getMedecinList()
  }, [update])

  async function upValue(e: any, id: any, user: any) {
    try {
      const url = `${window.location.origin}/api/score/ajouter`
      const requestBody = JSON.stringify({ pr: e * 20, id_el: id, el: 2, user })

      const requestOptions = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: requestBody }

      await fetch(url, requestOptions)
    } catch (error) {}
  }

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
            value={data?.id_spe || ''}
            onChange={e => setData((prev: any) => ({ ...prev, id_spe: Number(e.target.value) }))}
          >
            {speListe.map((item: any) => (
              <MenuItem value={item.id} key={item.id}>
                {item.spe}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className='w-1/5'>
          <InputLabel>Ville</InputLabel>
          <Select
            label='Ville'
            value={data?.id_ville || ''}
            onChange={e => setData((prev: any) => ({ ...prev, id_ville: Number(e.target.value) }))}
          >
            {villeListe.map((item: any) => (
              <MenuItem value={item.id} key={item.id}>
                {item.ville}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant='contained'
          onClick={() => {
            getMedecinList()
          }}
        >
          Rechercher
        </Button>
      </div>

      <Grid container spacing={6} className='py-12 px-6'>
        {medecins?.length > 0
          ? medecins.map((medecin, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card className='shadow-lg rounded-2xl border border-gray-200 bg-white h-[350px]'>
                  <div className='flex items-center justify-between p-4'>
                    <div className='flex items-center space-x-4'>
                      <img
                        className='w-20 h-20 rounded-full object-cover border-2 border-blue-500'
                        src={medecin.image ? medecin.image : '/img/placeholder-image.jpg'}
                        alt={medecin.nom_ut}
                      />
                      <div>
                        <h2 className='text-lg font-semibold text-gray-800'>{medecin.nom_ut}</h2>
                        <p className='text-sm text-gray-500'>
                          <span>{medecin.spe?.trim() ? medecin.spe : 'Spécialité non définie'}</span>
                        </p>
                        <div className='mt-2'>
                          <StarRating size='sm' initialRating={medecin?.sc ?? 0} readOnly />
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
                    </div>
                  </div>
                  <hr className='my-4 border-t border-gray-300' />
                  <CardContent>
                    <p className='mb-4'>{medecin.info}</p>
                    <div className='flex items-center text-gray-600 text-sm mt-4'>
                      <MapPin className='w-4 h-4 mr-2 text-blue-500' />
                      <span>{medecin.ville?.trim() ? medecin.ville : 'Ville non définie'}</span>

                      <Mail className='w-4 h-4 mr-2 text-blue-500 ml-12' />
                      <span>{medecin.email}</span>
                    </div>
                    <div className='flex items-center text-gray-600 text-sm mt-4'>
                      <FaRegClock className='w-4 h-4 mr-2 text-blue-500' />
                      <span>{`${medecin.heurD?.slice(0, 5)} - ${medecin.heurF?.slice(0, 5)}`}</span>

                      <FaMoneyBillAlt className='w-4 h-4 mr-2 text-blue-500 ml-12' />
                      <span>{medecin.tarif} dt</span>
                    </div>
                    <div className='flex justify-end mt-4'>
                      <StarRating
                        size='sm'
                        onChange={async (e: any) => {
                          await upValue(e, medecin.id, 1)
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))
          : null}

        <RendezVousModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          medecinId={selectedMedecinId}
          laboId={null}
        />
      </Grid>
      <Grid item xs={12} className='mt-6 justify-items-end'>
        <Pagination
          total={paginatorInfo.total}
          current={paginatorInfo.currentPage}
          pageSize={paginatorInfo.perPage}
          onChange={onPagination}
        />
      </Grid>
    </div>
  )
}

export default Medecin
