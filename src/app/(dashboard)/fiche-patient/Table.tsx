// MUI Imports
import { useEffect, useState } from 'react'

import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'

import { FileText, Plus } from 'lucide-react'

import tableStyles from '@core/styles/table.module.css'

const Table = ({
  onEditPatient,
  onAddPatient,
  onDeletePatient,
  analyseData
}: {
  onEditPatient: (patient: any) => void
  onDeletePatient: (patient: any) => void
  onAddPatient: () => void
  analyseData: any
}) => {
  return (
    <Card>
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th className='px-4 py-2 text-left text-sm font-medium text-gray-600 border-b'>Titre</th>
              <th className='px-4 py-2 text-left text-sm font-medium text-gray-600 border-b'>Détail</th>
              <th className='px-4 py-2 text-left text-sm font-medium text-gray-600 border-b'>Analyse</th>
              <th className='px-4 py-2 text-left text-sm font-medium text-gray-600 border-b'>
                Action <Plus className='text-blue-500 float-right' onClick={() => onAddPatient()} />
              </th>
            </tr>
          </thead>
          <tbody>
            {analyseData.length > 0 ? (
              analyseData.map((analyse: any, index: any) => (
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
                      onClick={() => onEditPatient(analyse)}
                    ></button>
                    <button
                      onClick={() => onDeletePatient(analyse)}
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
    </Card>
  )
}

export default Table
