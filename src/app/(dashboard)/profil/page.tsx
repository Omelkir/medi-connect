'use client'

import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getStorageData } from '@/utils/helpers'

export default function ProfilMedecinPage() {
  //   const userData: any = getStorageData('user')

  return (
    <div className='max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-8'>
      <div className='flex items-center gap-6'>
        {/* <Image
          src={userData.image}
          alt={`Photo de ${userData.nom_ut}`}
          width={120}
          height={120}
          className='rounded-full object-cover'
        /> */}
        <div>
          <h1 className='text-2xl font-bold'>omelkir</h1>
          <p className='text-gray-600'>cc</p>
          {/* <p className='text-yellow-500 font-semibold'>⭐ {userData.note.toFixed(1)} / 5</p> */}
        </div>
      </div>

      <div className='mt-6 space-y-2'>
        <p>
          <strong>Adresse:</strong> cc
        </p>
        <p>
          <strong>Téléphone:</strong> cc
        </p>
        <p>
          <strong>À propos:</strong>cc
        </p>
      </div>
    </div>
  )
}
