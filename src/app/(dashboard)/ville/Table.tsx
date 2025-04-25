// MUI Imports
import { useEffect, useState } from 'react'

import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'

import tableStyles from '@core/styles/table.module.css'

const Table = ({
  onEdit,
  onDelete,
  update
}: {
  onEdit: (ville: any) => void
  onDelete: (ville: any) => void
  update: string
}) => {
  const [rowsData, setRowsData] = useState<any[]>([])

  async function handleSave() {
    try {
      const url = `${window.location.origin}/api/ville/liste`

      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }

      const response = await fetch(url, requestOptions)

      if (!response.ok) throw new Error('Erreur lors de la requête')

      const responseData = await response.json()

      console.log('API Response:', responseData)

      if (responseData.erreur) {
        alert(responseData.message)
      } else {
        setRowsData(responseData.data)
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue lors de la récupération des données.')
    }
  }

  useEffect(() => {
    handleSave()
  }, [update])

  return (
    <Card>
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th>Ville</th>

              <th className='text-center'>Action</th>
            </tr>
          </thead>
          <tbody>
            {rowsData.map((row, index) => (
              <tr key={index}>
                <td className='!plb-1'>
                  <Typography>{row.ville}</Typography>
                </td>

                <td className='flex justify-center gap-2'>
                  <button
                    className='ri-edit-box-line text-yellow-500 text-xl hover:text-2xl'
                    onClick={() => onEdit(row)}
                  ></button>
                  <button
                    onClick={() => onDelete(row)}
                    className='ri-delete-bin-line text-red-500 text-xl hover:text-2xl'
                  ></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default Table
