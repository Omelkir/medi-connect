'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

import { FaEnvelope } from 'react-icons/fa'

import { motion } from 'framer-motion'
import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Grid,
  Select,
  FormControl,
  InputLabel,
  MenuItem
} from '@mui/material'

const ConnectezNous = () => {
  const options = [
    { label: 'Un rendez-vous', value: 1 },
    { label: 'Un médecin', value: 2 },
    { label: 'Un laboratoire', value: 3 },
    { label: 'Un problème technique', value: 4 },
    { label: 'Autres', value: 5 }
  ]

  const router = useRouter()
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className='py-12 px-12 bg5 min-h-screen flex justify-start items-center'
    >
      <Card className='flex flex-col w-[600px] max-w-2xl'>
        <CardContent className='p-6 sm:!p-12'>
          <Typography variant='h3' className='mb-12 text-center'>
            Nous contacter
          </Typography>

          <div className='flex flex-col gap-5'>
            <form className='flex flex-col gap-5'>
              <Grid container spacing={6}>
                <Grid item xs={6} md={6}>
                  <TextField autoFocus fullWidth label='Prénom' />
                </Grid>
                <Grid item xs={6} md={6}>
                  <TextField fullWidth label='Nom' />
                </Grid>
                <Grid item xs={6} md={6}>
                  <TextField fullWidth label='Email' />
                </Grid>
                <Grid item xs={6} md={6}>
                  <TextField fullWidth label='Téléphone' />
                </Grid>
                <Grid item xs={12} md={12}>
                  <FormControl fullWidth>
                    <InputLabel>Votre message concerne...</InputLabel>
                    <Select label='Votre message concerne...'>
                      {options.map(item => (
                        <MenuItem value={item.value} key={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={12}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    maxRows={3}
                    label='Message'
                    InputLabelProps={{ sx: { fontSize: '1rem' } }}
                    InputProps={{ sx: { fontSize: '1rem' } }}
                  />
                </Grid>
              </Grid>

              <Button fullWidth variant='contained' type='submit'>
                Envoyer
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default ConnectezNous
