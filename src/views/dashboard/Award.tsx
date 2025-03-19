// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Grid } from '@mui/material'
import { CardStatsProps } from '@/types/pages/widgetTypes'

const Award = (props: CardStatsProps) => {
  const { icons, number, title, color, bg } = props
  return (
    // <Card>
    //   <CardContent className='flex flex-col gap-2 relative items-start'>
    //     <div>
    //       <Typography variant='h5'>Congratulations John! 🎉</Typography>
    //       <Typography>Best seller of the month</Typography>
    //     </div>
    //     <div>
    //       <Typography variant='h4' color='primary'>
    //         $42.8k
    //       </Typography>
    //       <Typography>78% of target 🚀</Typography>
    //     </div>
    //     <Button size='small' variant='contained'>
    //       View Sales
    //     </Button>
    //     <img
    //       src='/images/pages/trophy.png'
    //       alt='trophy image'
    //       height={102}
    //       className='absolute inline-end-7 bottom-6'
    //     />
    //   </CardContent>
    // </Card>
    <Card>
      <CardContent sx={{ height: '280px', paddingTop: '40px' }}>
        <div className='icon-box' style={{ backgroundColor: bg }}>
          <i className={icons} style={{ color: color, fontSize: '60px' }} />
        </div>
        <div className='centerCard'>
          <Typography variant='h5' style={{ fontSize: 30, fontWeight: 'bold', color: color, marginTop: 10 }}>
            {number}
          </Typography>
        </div>
        <div className='centerCard'>
          <Typography variant='h5' style={{ fontWeight: 'bold', marginTop: 10 }}>
            {title}
          </Typography>
        </div>
      </CardContent>
    </Card>
  )
}

export default Award
