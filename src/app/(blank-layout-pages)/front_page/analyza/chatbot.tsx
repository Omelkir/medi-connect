import type { FormEvent } from 'react'
import React, { useEffect, useRef, useState } from 'react'

import { Paperclip } from 'lucide-react'

import ChatbotIcon from './ChatbotIcon'

// نوع الرسالة
type ChatMessageType = {
  hideInChat?: boolean
  role: 'user' | 'model'
  text: string
  isError?: boolean
}

// Component لرسالة وحدة في الشات
const ChatMessage: React.FC<{ chat: ChatMessageType }> = ({ chat }) => {
  if (chat.hideInChat) return null

  return (
    <div className={`message ${chat.role === 'model' ? 'bot' : 'user'}-message ${chat.isError ? 'error' : ''}`}>
      {chat.role === 'model' && <ChatbotIcon />}
      <p className='message-text'>{chat.text}</p>
    </div>
  )
}

// الفورم باش المستخدم يبعث رسالة
const ChatForm: React.FC<{
  chatHistory: ChatMessageType[]
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessageType[]>>
  generateBotResponse: (history: ChatMessageType[]) => void
}> = ({ chatHistory, setChatHistory, generateBotResponse }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const [data, setData] = useState<any>({
    analyse: '',
    analyseSrc: '',
    question: '',
    result: '',
    loading: false
  })

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

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const userMessage = inputRef.current?.value.trim()

    if (!userMessage) return
    if (inputRef.current) inputRef.current.value = ''

    // نضيف رسالة المستخدم
    setChatHistory(history => [...history, { role: 'user', text: userMessage }])

    setTimeout(() => {
      // نضيف رسالة "Thinking..." مؤقتة
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

// الcomponent الرئيسي Chatbot
const Chatbot: React.FC = () => {
  useEffect(() => {
    const link = document.createElement('link')

    link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    return () => {
      document.head.removeChild(link)
    }
  }, [])

  const chatBodyRef = useRef<HTMLDivElement>(null)
  const [showChatbot, setShowChatbot] = useState<boolean>(false)

  const [chatHistory, setChatHistory] = useState<ChatMessageType[]>([
    {
      hideInChat: true,
      role: 'model',
      text: ''
    }
  ])

  // مفتاح API Gemini خاصتك
  const token = 'AIzaSyBZ9zq29OVYpcokmaR3nghpGSfbDC6WGd8'

  // فنكشن باش تجيب الرد من Gemini API
  const generateBotResponse = async (history: ChatMessageType[]) => {
    const updateHistory = (text: string, isError = false) => {
      setChatHistory(prev => [...prev.filter(msg => msg.text !== 'Thinking...'), { role: 'model', text, isError }])
    }

    // نجيب آخر رسالة من المستخدم باش نبعتها للـ API
    const lastUserMessage = history[history.length - 1]?.text || ''

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

      if (!response.ok) throw new Error(data?.error?.message || 'API error')

      const apiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response'

      updateHistory(apiResponseText)
    } catch (error: any) {
      updateHistory(error.message || 'Error occurred', true)
    }
  }

  // كل ما تتغير الرسائل، نعمل scroll لتحت
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [chatHistory])

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
              <h2 className='logo-text'>Chatbot</h2>
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
