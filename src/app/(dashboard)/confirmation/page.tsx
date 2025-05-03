'use client'

import { useState } from 'react'

import { Card, CardContent, Grid } from '@mui/material'

import Arrow from '@/views/dashboard/Arrow'

import Table from './Table'

const Reclamation = () => {
  const [update, setUpdate] = useState<string>(new Date().toDateString())

  return (
    <div>
      <Card>
        <CardContent>
          <Arrow title='Dashboard' subTitle='Réclamation' />

          <Grid item xs={12}>
            <Table update={update} />
          </Grid>
        </CardContent>
      </Card>
    </div>
  )
}

export default Reclamation
