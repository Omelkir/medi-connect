'use client'
import React from 'react'
import { GrUserExpert } from 'react-icons/gr'
import { MdOutlineAccessTime } from 'react-icons/md'
import { FaBookReader } from 'react-icons/fa'
import { FadeUp } from '../Hero/Hero'
import { motion } from 'framer-motion'

const Banner = () => {
  return (
    <section>
      <div className='container md:py-8 grid grid-cols-1 md:grid-cols-2 gap-8 space-y-6 md:space-y-0'>
        {/* Banner Image */}
        <div className='flex justify-center md:justify-normal'>
          <motion.img
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            src='/img/doctors/doctor2.png'
            alt=''
            className='w-[300px] md:w-[450px] md:max-w-[550px] rounded-[100%] object-cover drop-shadow'
          />
        </div>
        {/* Banner Text */}
        <div className='flex flex-col justify-center md:justify-normal'>
          <div className='text-center md:text-left'>
            <motion.h1
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className='text-2xl md:text-4xl font-bold pb-12 !leading-snug'
            >
              Recherche des médecins et des laboratoires médicaux dans toutes les spécialités
            </motion.h1>
            <div className='flex flex-col gap-2 text-center pb-6'>
              <motion.div
                variants={FadeUp(0.2)}
                initial='initial'
                whileInView={'animate'}
                viewport={{ once: true }}
                className='flex md:justify-normal justify-center items-center gap-4 p-6 bg-[#f4f4f4] rounded-2xl hover:bg-white duration-300 hover:shadow-2xl'
              >
                <FaBookReader className='text-2xl' />
                <p className='text-lg text-center'>10,000+ Courses</p>
              </motion.div>
              <motion.div
                variants={FadeUp(0.4)}
                initial='initial'
                whileInView={'animate'}
                viewport={{ once: true }}
                className='flex md:justify-normal justify-center items-center gap-4 p-6 bg-[#f4f4f4] rounded-2xl hover:bg-white duration-300 hover:shadow-2xl'
              >
                <GrUserExpert className='text-2xl' />
                <p className='text-lg'>Expert Instruction</p>
              </motion.div>
              <motion.div
                variants={FadeUp(0.6)}
                initial='initial'
                whileInView={'animate'}
                viewport={{ once: true }}
                className='flex md:justify-normal justify-center items-center gap-4 p-6 bg-[#f4f4f4] rounded-2xl hover:bg-white duration-300 hover:shadow-2xl'
              >
                <MdOutlineAccessTime className='text-2xl' />
                <p className='text-lg'>Lifetime Access</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Banner
