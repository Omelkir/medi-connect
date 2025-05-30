'use client'

import type { FormEvent } from 'react'
import React, { useEffect, useRef, useState } from 'react'

import { Paperclip } from 'lucide-react'

import ChatbotIcon from './ChatbotIcon'
import { getStorageData } from '@/utils/helpersFront'

// Component الرئيسي
const Chatbot: React.FC = () => {
  const [data, setData] = useState<any>({
    analyse: '',
    analyseSrc: '',
    question: '',
    result: '',
    loading: false
  })

  type ChatMessageType = {
    hideInChat?: boolean
    role: 'user' | 'model'
    text: string
    isError?: boolean
  }

  const ChatMessage: React.FC<{ chat: ChatMessageType }> = ({ chat }) => {
    if (chat.hideInChat) return null

    return (
      <div className={`message ${chat.role === 'model' ? 'bot' : 'user'}-message ${chat.isError ? 'error' : ''}`}>
        {chat.role === 'model' && <ChatbotIcon />}
        <p className='message-text'>{chat.text}</p>
      </div>
    )
  }

  const ChatForm: React.FC<{
    chatHistory: ChatMessageType[]
    setChatHistory: React.Dispatch<React.SetStateAction<ChatMessageType[]>>
    generateBotResponse: (history: ChatMessageType[]) => void
  }> = ({ chatHistory, setChatHistory, generateBotResponse }) => {
    const inputRef = useRef<HTMLInputElement>(null)

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
    }

    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const userMessage = inputRef.current?.value.trim()

      if (!userMessage) return
      if (inputRef.current) inputRef.current.value = ''

      setData((prev: any) => ({ ...prev, question: userMessage })) // تخزين السؤال

      setChatHistory(history => [...history, { role: 'user', text: userMessage }])
      setTimeout(() => {
        setChatHistory(history => [...history, { role: 'model', text: 'Thinking...' }])
        generateBotResponse([...chatHistory, { role: 'user', text: userMessage }])
      }, 600)
    }

    return (
      <form onSubmit={handleFormSubmit} className='chat-form'>
        <input ref={inputRef} placeholder='Message...' className='message-input' required />
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
          <Paperclip className='mx-4 cursor-pointer' />
        </label>
        <button type='submit' id='send-message' className='material-symbols-rounded'>
          arrow_upward
        </button>
      </form>
    )
  }

  const [update, setUpdate] = useState<string>('')
  const [showChatbot, setShowChatbot] = useState<boolean>(false)
  const chatBodyRef = useRef<HTMLDivElement>(null)
  const userData = getStorageData('user')
  const [rowsData, setRowsData] = useState<any[]>([])

  const [chatHistory, setChatHistory] = useState<ChatMessageType[]>([{ hideInChat: true, role: 'model', text: '' }])

  const token = 'AIzaSyBZ9zq29OVYpcokmaR3nghpGSfbDC6WGd8' 

  const getConversation = async () => {
    try {
      const response = await fetch(`${window.location.origin}/api/conversation/liste?id_patient=${userData?.id}`)
      const responseData = await response.json()

      if (!response.ok || responseData.erreur) return

      setRowsData(responseData.data)

      // نحول الداتا الى chatHistory
      const oldMessages: ChatMessageType[] = []

      responseData.data.forEach((conv: any) => {
        oldMessages.push({ role: 'user', text: conv.question })
        oldMessages.push({ role: 'model', text: conv.reponse })
      })
      setChatHistory((prev: any) => [...oldMessages, ...prev])
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  useEffect(() => {
    if (userData?.id) getConversation()
  }, [update])

  const handleSave = async (question: string, resultToSave: string) => {
    try {
      await fetch(`${window.location.origin}/api/conversation/ajouter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_patient: userData?.id || null,
          question,
          result: resultToSave
        })
      })
      setUpdate(Date.now().toString())
    } catch (error) {
      console.log('Erreur handleSave:', error)
    }
  }

  const generateBotResponse = async (history: ChatMessageType[]) => {
    const lastUserMessage = history[history.length - 1]?.text || ''

    const updateHistory = (text: string, isError = false) => {
      setChatHistory(prev => [...prev.filter(msg => msg.text !== 'Thinking...'), { role: 'model', text, isError }])
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${token}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: lastUserMessage }] }],
            generationConfig: {
              maxOutputTokens: 100,
              temperature: 0.7
            }
          })
        }
      )

      const data = await response.json()

      if (!response.ok) throw new Error(data?.error?.message || 'API erreur')

      const apiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Aucune réponse'

      updateHistory(apiResponseText)
      await handleSave(lastUserMessage, apiResponseText)
    } catch (error: any) {
      updateHistory(error.message || 'Error occurred', true)
    }
  }

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [chatHistory])

  useEffect(() => {
    const link = document.createElement('link')

    link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    return () => {
      document.head.removeChild(link)
    }
  }, [])

  return (
    <div className={`container ${showChatbot ? 'show-chatbot' : ''}`}>
      <button onClick={() => setShowChatbot(prev => !prev)} id='chatbot-toggler'>
        <span className='material-symbols-rounded'>mode_comment</span>
        <span className='material-symbols-rounded'>close</span>
      </button>

      {showChatbot && (
        <div className='chatbot-popup'>
          <div className='chat-header'>
            <div className='header-info'>
              <ChatbotIcon />
              <h2 className='logo-text'>Analyza</h2>
            </div>
            <button onClick={() => setShowChatbot(false)} className='material-symbols-rounded'>
              keyboard_arrow_down
            </button>
          </div>

          <div ref={chatBodyRef} className='chat-body'>
            <div className='message bot-message'>
              <ChatbotIcon />
              <p className='message-text'>
                Hey there <br /> How can I help you today?
              </p>
            </div>
            {chatHistory.map((chat, index) => (
              <ChatMessage key={index} chat={chat} />
            ))}
          </div>

          <div className='chat-footer'>
            <ChatForm
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
              generateBotResponse={generateBotResponse}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Chatbot
