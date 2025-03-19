import { Button, Card, CardContent, Grid, TextField } from '@mui/material'

import Table from '@/app/(dashboard)/medecin/Table'
import { IconUserPlus } from '@tabler/icons-react'
import Arrow from '@/views/dashboard/Arrow'

const Medecin = () => {
  return (
    <div>
      <Card>
        <CardContent>
          <Arrow title='Dashboard' subTitle='Médecin' />

          <Button fullWidth variant='contained' color='primary' className='h-12 w-1/6 mb-12'>
            Ajouter un médecin
          </Button>
          <Grid item xs={12}>
            <Table />
          </Grid>
        </CardContent>
      </Card>
    </div>
  )
}
export default Medecin
