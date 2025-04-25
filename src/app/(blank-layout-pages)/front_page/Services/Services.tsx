'use client'
import React from 'react'
import { RiComputerLine } from 'react-icons/ri'
import { CiMobile3 } from 'react-icons/ci'
import { TbDental, TbWorldWww } from 'react-icons/tb'
import { IoMdHappy } from 'react-icons/io'
import { BiSupport } from 'react-icons/bi'
import { IoPulseOutline } from 'react-icons/io5'
import { motion } from 'framer-motion'
import { FaBone, FaGlasses, FaHandSparkles, FaHeart, FaLungs, FaSmile, FaStethoscope } from 'react-icons/fa'

const ServicesData = [
  {
    id: 1,
    title: 'Médecine dentaire',
    link: '#',
    icon: <TbDental color='#00234b' size={80} />,
    delay: 0.2
  },
  {
    id: 2,
    title: 'Cardiologie',
    link: '#',
    icon: <FaHeart color='#00234b' size={80} />,
    delay: 0.3
  },
  {
    id: 3,
    title: 'Dermatologie',
    link: '#',
    icon: <FaHandSparkles color='#00234b' size={80} />,
    delay: 0.4
  },
  {
    id: 4,
    title: 'Ophtalmologie',
    link: '#',
    icon: <FaGlasses color='#00234b' size={80} />,
    delay: 0.5
  },
  {
    id: 5,
    title: 'Pneumologie',
    link: '#',
    icon: <FaLungs color='#00234b' size={80} />,
    delay: 0.6
  },
  {
    id: 6,
    title: 'Orthopédie - Traumatologie',
    link: '#',
    icon: <FaBone color='#00234b' size={80} />,
    delay: 0.7
  },
  {
    id: 7,
    title: 'Médecine interne',
    link: '#',
    icon: <FaStethoscope color='#00234b' size={80} />,
    delay: 0.8
  }
]

const SlideLeft = (delay: any) => {
  return {
    initial: {
      opacity: 0,
      x: 50
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        delay: delay,
        ease: 'easeInOut'
      }
    }
  }
}
const Services = () => {
  return (
    <section className='bg-white'>
      <div className='container pb-14 pt-16'>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-6'>
          {ServicesData.map(service => (
            <motion.div
              variants={SlideLeft(service.delay)}
              initial='initial'
              whileInView={'animate'}
              viewport={{ once: true }}
              className='bg-[#f4f4f4] rounded-2xl flex flex-col gap-4 items-center justify-center p-4 py-7 hover:bg-white hover:scale-110 duration-300 hover:shadow-2xl'
            >
              <div className='text-4xl mb-2'> {service.icon}</div>
              <h1 className='text-lg font-semibold text-center px-3' style={{ color: '#00234b' }}>
                {service.title}
              </h1>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
