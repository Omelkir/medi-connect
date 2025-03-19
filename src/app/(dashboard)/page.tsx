// MUI Imports
import Grid from '@mui/material/Grid'

// Components Imports
import Award from '@views/dashboard/Award'
import Transactions from '@views/dashboard/Transactions'
import WeeklyOverview from '@views/dashboard/WeeklyOverview'
import TotalEarning from '@views/dashboard/TotalEarning'
import LineChart from '@views/dashboard/LineChart'
import DistributedColumnChart from '@views/dashboard/DistributedColumnChart'
import DepositWithdraw from '@views/dashboard/DepositWithdraw'
import SalesByCountries from '@views/dashboard/SalesByCountries'
import CardStatVertical from '@components/card-statistics/Vertical'
import Table from '@views/dashboard/Table'
import ConsultationChart from '@/views/dashboard/PatientChart'
import { BarChart } from 'recharts'
import PatientChart from '@/views/dashboard/PatientChart'
import AppointmentChart from '@/views/dashboard/AppointmentChart'
import PatientsTypeChart from '@/views/dashboard/PatientsType'

const DashboardAnalytics = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={8} lg={6} sx={{ height: '300px' }}>
        <Transactions />
      </Grid>
      <Grid item xs={12} md={2}>
        <Award icons='ri-user-line' number='3809' title='Patients' color='#0573b8' bg='#e3eefd' />
      </Grid>
      <Grid item xs={12} md={2}>
        <Award icons='ri-lungs-line' number='906' title='Surgeries' color='#ff5a39' bg='#ffefec' />
      </Grid>
      <Grid item xs={12} md={2}>
        <Award icons='ri-money-dollar-circle-line' number='$986K' title='Earnings' color='#0ebb13' bg='#e9fdea' />
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <PatientChart />
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <AppointmentChart />
      </Grid>
      {/* <Grid item xs={12} md={6} lg={4}>
        <PatientsTypeChart />
      </Grid> */}
      {/* <Grid item xs={12} md={6} lg={4}>
        <TotalEarning />
      </Grid> */}
      {/* <Grid item xs={12} md={6} lg={4}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <LineChart />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CardStatVertical
              title='Total Profit'
              stats='$25.6k'
              avatarIcon='ri-pie-chart-2-line'
              avatarColor='secondary'
              subtitle='Weekly Profit'
              trendNumber='42%'
              trend='positive'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CardStatVertical
              stats='862'
              trend='negative'
              trendNumber='18%'
              title='New Project'
              subtitle='Yearly Project'
              avatarColor='primary'
              avatarIcon='ri-file-word-2-line'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DistributedColumnChart />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <SalesByCountries />
      </Grid> */}
      {/* <Grid item xs={12} lg={8}>
        <DepositWithdraw />
      </Grid> */}
      <Grid item xs={12}>
        <Table />
      </Grid>
    </Grid>
  )
}

export default DashboardAnalytics
