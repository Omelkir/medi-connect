'use client'
import React from 'react'
import { FaInstagram, FaWhatsapp, FaYoutube } from 'react-icons/fa'
import { TbWorldWww } from 'react-icons/tb'
import { motion } from 'framer-motion'
import FooterContent from '@/components/layout/vertical/FooterContent'

const Footer = () => {
  return (
    <footer className='pt-6 bg-[#f7f7f7]'>
      <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} className='justify-items-center'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left'>
          {/* first section */}
          <div className='max-w-[300px] mx-auto'>
            <h1 className='text-xl md:text-2xl font-bold'>MediConnect</h1>
            <p className='text-dark2'>
              Une plateforme digitale centralisant les infos sur les médecins et laboratoires en Tunisie, avec avis,
              réservation en ligne et analyses médicales basées sur l’IA.
            </p>
          </div>

          {/* second section */}
          <div className='max-w-[300px] mx-auto'>
            <h1 className='text-xl md:text-2xl font-bold'>Contact</h1>
            <div className='text-dark2'>
              <ul className='text-lg list-none'>
                <li className='cursor-pointer hover:text-secondary duration-200'>Email: mediconnect048@gmail.com</li>
                <li className='cursor-pointer hover:text-secondary duration-200'>Tél: +216 99 559 992</li>
              </ul>
            </div>
          </div>

          {/* third section */}
          <div className='max-w-[300px] mx-auto mb-6'>
            <h1 className='text-xl md:text-2xl font-bold'>Suivez-nous</h1>
            {/* social icons */}
            <div className='flex justify-center md:justify-start space-x-6 py-3'>
              <a href='https://chat.whatsapp.com/FQSKgJ5f1eIAhlyF5sVym0'>
                <FaWhatsapp className='cursor-pointer hover:text-primary hover:scale-105 duration-200 text-3xl' />
              </a>
              <a href='https://www.instagram.com/the.coding.journey/'>
                <FaInstagram className='cursor-pointer hover:text-primary hover:scale-105 duration-200 text-3xl' />
              </a>
              <a href='https://thecodingjourney.com/'>
                <TbWorldWww className='cursor-pointer hover:text-primary hover:scale-105 duration-200 text-3xl' />
              </a>
              <a href='https://www.youtube.com/@TheCodingJourney'>
                <FaYoutube className='cursor-pointer hover:text-primary hover:scale-105 duration-200 text-3xl' />
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        className='justify-items-center md:justify-items-end md:mr-2'
      >
        <FooterContent />
      </motion.div>
    </footer>
  )
}

export default Footer
