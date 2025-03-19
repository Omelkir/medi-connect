'use client'

import { useState } from 'react'

import Register from '@views/Register'

const RegisterPage = () => {
  const [update, setUpdate] = useState<string>('')
  const [dataForm, setDataForm] = useState<any>({})

  return <Register />
}

export default RegisterPage
