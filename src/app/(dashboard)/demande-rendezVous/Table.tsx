// MUI Imports
import { useEffect, useState } from 'react'
import React from 'react'

import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import { Grid } from '@mui/material'
import { Check } from 'lucide-react'
import { toast } from 'react-toastify'

import CustomAvatar from '@core/components/mui/Avatar'
import tableStyles from '@core/styles/table.module.css'
import Pagination from '@/components/ui/pagination'
import { getStorageData } from '@/utils/helpers'

const Table = ({ update }: { update: string }) => {
  const [rowsData, setRowsData] = useState<any[]>([])
  const [paginatorInfo, setPaginatorInfo] = useState<any>({ total: 6 })
  const userData = getStorageData('user')

  const onPagination = (e: any) => {
    getConsultationList(e)
  }

  async function getConsultationList(page = 1) {
    try {
      const url = `${window.location.origin}/api/consultation/liste?consultation.isApproved=0&consultation.id_el=${userData.id}&page=${page}`

      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }

      const response = await fetch(url, requestOptions)

      if (!response.ok) throw new Error('Erreur lors de la requête')

      const responseData = await response.json()

      if (responseData.erreur) {
        toast.error('Erreur !')
      } else {
        setRowsData(responseData.data)
        setPaginatorInfo(responseData?.paginatorInfo)
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue lors de la récupération des données.')
    }
  }

  useEffect(() => {
    getConsultationList()
  }, [update])

  const handleChange = async (id: number) => {
    try {
      const response = await fetch(`${window.location.origin}/api/approuve-consultation/modifier`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: id
        })
      })

      const result = await response.json()

      if (!response.ok || result.erreur) {
        toast.error('Erreur !')
      } else {
        toast.success('Le consultation a été approuvé avec succès')
      }
    } catch (err) {
      toast.error('Erreur !')
    }
  }

  return (
    <>
      <Card>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Nom</th>
                <th>date</th>
                <th>Heure</th>
                <th className='text-center'>Approuvé</th>
              </tr>
            </thead>
            <tbody>
              {rowsData.map((row, index) => (
                <tr key={index}>
                  <td className='!plb-1'>
                    <div className='flex items-center gap-3'>
                      <CustomAvatar src={row.image} size={34} />
                      <div className='flex flex-col'>
                        <Typography color='text.primary' className='font-medium'>
                          {row.nom + ' ' + row.prenom}
                        </Typography>
                      </div>
                    </div>
                  </td>
                  <td className='!plb-1'>{new Date(row.start).toLocaleDateString('fr-FR')}</td>
                  <td className='!plb-1'>
                    {new Date(row.start).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>

                  <td className='flex justify-center gap-2'>
                    <button
                      onClick={async () => {
                        await handleChange(row.id)
                      }}
                      className='flex justify-center items-center bg-green-600 text-white rounded-xl w-6 h-6 hover:bg-green-800 cursor-pointer'
                    >
                      <Check className='text-white w-5 h-5 font-bold' strokeWidth={3} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Grid item xs={12} className='mt-6 justify-items-end'>
        <Pagination
          total={paginatorInfo.total}
          current={paginatorInfo.currentPage}
          pageSize={paginatorInfo.perPage}
          onChange={onPagination}
        />
      </Grid>
    </>
  )
}

export default Table
