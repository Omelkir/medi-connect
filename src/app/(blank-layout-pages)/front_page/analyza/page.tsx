'use client'
import React, { useEffect, useRef, useState } from 'react'

import { motion } from 'framer-motion'
import { Paperclip } from 'lucide-react'
import { Avatar, Badge, TextField } from '@mui/material'

import { getStorageData } from '@/utils/helpersFront'
import Logo from '@/components/layout/shared/Logo'

const Analysa = () => {
  const [data, setData] = useState<any>({
    analyse: '',
    analyseSrc: '',
    question: '',
    result: '',
    loading: false
  })

  const [update, setUpdate] = useState<string>('')
  const [rowsData, setRowsData] = useState<any[]>([])
  const userData = getStorageData('user')
  const token: string = 'AIzaSyBZ9zq29OVYpcokmaR3nghpGSfbDC6WGd8'
  const chatRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    setTimeout(() => {
      chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' })
    }, 100)
  }

  useEffect(() => {
    getConversation()
  }, [update])

  const handleFileChangePDF = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    setData((prev: any) => ({
      ...prev,
      loading: true,
      question: ''
    }))

    const formData = new FormData()

    formData.append('data', file)

    // try {
    const response = await fetch(`${window.location.origin}/api/extract`, {
      method: 'POST',
      body: formData
    })

    const result = await response.json()

    if (response.ok) {
      setData((prev: any) => ({
        ...prev,
        loading: false,
        question: result.text || 'Aucun texte trouvé dans le PDF.'
      }))
    } else {
      setData((prev: any) => ({
        ...prev,
        loading: false,
        question: "Erreur lors de l'extraction du texte."
      }))
    }

    // } catch (err) {
    //   console.error("Erreur lors de l'envoi du fichier:", err)
    //   setData((prev: any) => ({
    //     ...prev,
    //     loading: false,
    //     question: 'Erreur inattendue.'
    //   }))
    // }
  }

  const analyserWithGemini = async () => {
    setData((prev: any) => ({ ...prev, loading: true, result: '' }))

    try {
      // Envoi de la requête à l'API Gemini
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${token}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: data.question }]
              }
            ],
            generationConfig: {
              maxOutputTokens: 100,
              temperature: 0.7
            }
          })
        }
      )

      const json = await response.json()

      setData((prev: any) => ({
        ...prev,
        loading: false,
        result: json.candidates?.[0]?.content?.parts?.[0]?.text || 'Aucune réponse'
      }))

      await handleSave(json.candidates?.[0]?.content?.parts?.[0]?.text || 'Aucune réponse')

      // Effacer la réponse après 10 secondes (optionnel)
      // setTimeout(() => {
      //   setData((prev: any) => ({ ...prev, result: '' }));
      // }, 10000);
    } catch (error) {
      console.error("Erreur lors de l'appel à l'API Gemini:", error)
      setData((prev: any) => ({ ...prev, loading: false, result: 'Erreur lors de la génération de la réponse.' }))
    }
  }

  const handleSave = async (resultToSave: string) => {
    try {
      await fetch(`${window.location.origin}/api/conversation/ajouter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_patient: userData?.id || null,
          question: data.question,
          result: resultToSave
        })
      })
      setUpdate(Date.now().toString())
    } catch (error) {
      console.log('Erreur handleSave:', error)
    }
  }

  const getConversation = async () => {
    try {
      const response = await fetch(`${window.location.origin}/api/conversation/liste?id_patient=${userData?.id}`)

      const responseData = await response.json()

      if (!response.ok || responseData.erreur) return
      setRowsData(responseData.data)
      scrollToBottom()
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  return (
    <motion.div initial='initial' animate='animate' className='h-screen flex flex-col bg-gray-100'>
      <span className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px] mt-8'>
        <img src='/Chatbot.svg' width={64} height={64} alt='Logo' />
        <h2 className='text-2xl font-bold text-gray-800'>Analysa</h2>
      </span>
      <div className='flex-1 overflow-y-auto px-6 py-4 max-w-3xl w-full mx-auto' ref={chatRef}>
        {data.loading && <p className='text-center text-gray-500'>Chargement...</p>}
        {rowsData.map((row, index) => (
          <div key={index} className='mb-6 flex flex-col space-y-2'>
            {/* Bot (Analysa) */}
            <div className='flex items-start space-x-3'>
              <Badge overlap='circular'>
                <Avatar
                  alt='John Doe'
                  src={userData?.image ?? '/images/avatars/1.png'}
                  sx={{
                    width: 39,
                    height: 39,
                    border: '2px solid white'
                  }}
                />
              </Badge>
              <div className='bg-blue-100 p-3 rounded-xl max-w-[80%] text-sm'>
                <p className='whitespace-pre-wrap'>{row.question}</p>
              </div>
            </div>

            {/* Réponse */}
            <div className='flex items-start justify-end space-x-3'>
              <div className='bg-gray-200 p-3 rounded-xl max-w-[80%] text-sm ml-auto'>
                <p className='whitespace-pre-wrap'>{row.reponse}</p>
              </div>
              <img src='/Chatbot.svg' width={39} height={39} alt='Bot' />
            </div>
          </div>
        ))}
      </div>

      <div className='bg-white px-6 pb-2 rounded-4xl pt-6 shadow-md w-3/5 mx-auto'>
        <div className='max-w-4xl mx-auto flex items-center space-x-2'>
          <TextField
            fullWidth
            variant='standard'
            sx={{
              '& .MuiInputBase-root': {
                border: 'none',
                backgroundColor: 'transparent',
                boxShadow: 'none'
              }
            }}
            multiline
            minRows={2}
            maxRows={4}
            placeholder='Écrire une question...'
            value={data.question}
            onChange={e =>
              setData((prev: any) => ({
                ...prev,
                question: e.target.value
              }))
            }
            InputProps={{
              disableUnderline: true,
              endAdornment: (
                <>
                  <label>
                    <input
                      type='file'
                      accept='application/pdf'
                      className='hidden'
                      onChange={(e: any) => {
                        const file: any = e.target.files?.[0]

                        if (file) {
                          setData((prev: any) => ({
                            ...prev,
                            analyse: file,
                            analyseSrc: URL.createObjectURL(file)
                          }))
                          handleFileChangePDF(e)
                        }
                      }}
                    />
                    <Paperclip className='mx-2 cursor-pointer' />
                  </label>
                  <i
                    className='ri-send-plane-fill text-xl text-blue-500 cursor-pointer'
                    onClick={analyserWithGemini}
                  ></i>
                </>
              )
            }}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default Analysa
