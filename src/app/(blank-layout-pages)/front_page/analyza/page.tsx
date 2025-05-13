'use client'
import React, { useEffect, useState } from 'react'

import { motion } from 'framer-motion'
import { Grid, TextField } from '@mui/material'
import { Paperclip } from 'lucide-react'

// import pdf2text from 'pdf2text'

import { getStorageData } from '@/utils/helpersFront'

export const FadeUp = (delay: any) => {
  return {
    initial: {
      opacity: 0,
      y: 50
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        duration: 0.5,
        delay: delay,
        ease: 'easeInOut'
      }
    }
  }
}

const Analysa = () => {
  const [data, setData] = useState<any>({
    analyse: '',
    analyseSrc: '',
    question: '',
    result: '',
    loading: false
  })

  const handleFileChange = (e: any) => {
    const file = e.target.files[0]

    if (file) {
      setData((prev: any) => ({
        ...prev,
        analyseSrc: URL.createObjectURL(file)
      }))

      const reader = new FileReader()

      reader.readAsDataURL(file)
    }
  }

  const userData = getStorageData('user')
  const token: string = 'AIzaSyBZ9zq29OVYpcokmaR3nghpGSfbDC6WGd8'

  // const handleFileChangePDF = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0]

  //   if (!file) return

  //   setData((prev: any) => ({
  //     ...prev,
  //     loading: true,
  //     question: ''
  //   }))

  //   try {
  //     const reader = new FileReader()

  //     reader.onload = async () => {
  //       const arrayBuffer = reader.result as ArrayBuffer

  //       // Utilisation de pdf2text pour extraire le texte
  //       pdf2text.pdfToText(arrayBuffer, (err: any, text: string) => {
  //         if (err) {
  //           console.error('Erreur de lecture PDF:', err)
  //           setData((prev: any) => ({
  //             ...prev,
  //             loading: false,
  //             question: 'Erreur lors de la lecture du fichier PDF.'
  //           }))

  //           return
  //         }

  //         // Mettre le texte extrait dans l'état
  //         setData((prev: any) => ({
  //           ...prev,
  //           loading: false,
  //           question: text.trim() || 'Aucun texte trouvé dans le PDF.'
  //         }))
  //       })
  //     }

  //     reader.readAsArrayBuffer(file)
  //   } catch (err) {
  //     console.error('Erreur lors du traitement du fichier:', err)
  //     setData((prev: any) => ({
  //       ...prev,
  //       loading: false,
  //       question: 'Erreur inattendue.'
  //     }))
  //   }
  // }
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

    try {
      const response = await fetch(`${window.location.origin}/api/extract-text/extract`, {
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
    } catch (err) {
      console.error("Erreur lors de l'envoi du fichier:", err)
      setData((prev: any) => ({
        ...prev,
        loading: false,
        question: 'Erreur inattendue.'
      }))
    }
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

      // Mise à jour de l'état avec la réponse générée par Gemini
      setData((prev: any) => ({
        ...prev,
        loading: false,
        result: json.candidates?.[0]?.content?.parts?.[0]?.text || 'Aucune réponse'
      }))

      // Effacer la réponse après 10 secondes (optionnel)
      // setTimeout(() => {
      //   setData((prev: any) => ({ ...prev, result: '' }));
      // }, 10000);
    } catch (error) {
      console.error("Erreur lors de l'appel à l'API Gemini:", error)
      setData((prev: any) => ({ ...prev, loading: false, result: 'Erreur lors de la génération de la réponse.' }))
    }
  }

  // ... (le reste de ton composant, y compris le champ de texte et le bouton) ...

  return (
    <motion.div variants={FadeUp(0.8)} initial='initial' animate='animate' className='h-screen flex'>
      <div className='w-1/3 inline-block p-2 bg-gray-200'>
        <div className='text-center'>
          <img src='/Chatbot.svg' width={100} height={100} />
          <h2 className='mt-4 -translate-y-[40px] -translate-x-[18px]'>Analysa</h2>
        </div>
        <Grid item xs={12} md={12} className='translate-y-[380px]'>
          <TextField
            fullWidth
            multiline
            placeholder='Poser une question'
            minRows={2}
            maxRows={3}
            onChange={(e: any) => {
              setData((prev: any) => ({
                ...prev,
                question: e.target.value
              }))
            }}
            InputProps={{
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
                    <Paperclip className='mr-2 mx-2 cursor-pointer' />
                  </label>
                  <i
                    className='ri-send-plane-fill mr-3 cursor-pointer'
                    onClick={async () => {
                      await analyserWithGemini()
                    }}
                  ></i>
                </>
              )
            }}
          />
        </Grid>
      </div>
      <div className='w-2/3 inline-block p-2'>
        {data.loading ? <div>chargement ...</div> : <div>{data.result}</div>}
      </div>
    </motion.div>
  )
}

export default Analysa
