'use client'
import React from 'react'
import BannerPng from '../../assets/banner.png'
import { motion } from 'framer-motion'

const Banner2 = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      className='bg-white bg3 flex flex-col justify-center'
    >
      <div className='container py-14 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-8 space-y-6 md:space-y-0'>
        {/* Banner Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          className='flex flex-col justify-center'
        >
          <div className='text-center md:text-left space-y-4 lg:max-w-[450px]'>
            <h1 className='text-2xl md:text-4xl font-bold !leading-snug'>
              Pour toute question ou demande, n’hésitez pas à nous contacter.
            </h1>
            <p className='text-dark2'>Notre équipe est là pour vous aider !</p>
            {/* <a href='https://chat.whatsapp.com/FQSKgJ5f1eIAhlyF5sVym0' className='primary-btn !mt-8'>
              Contactez-nous
            </a> */}
            <a href='/front_page/contactez-nous' className='primary-btn !mt-8'>
              Contactez-nous
            </a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Banner2
