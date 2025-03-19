import type { ChildrenType } from '@core/types'

import Providers from '@components/Providers'
import HorizontalLayoutWrapper from '@/@layouts/HorizontalLayoutWrapper'
import HorizontalLayout from '@/@layouts/HoriLayout'
import Navbar from './nav_bar/navBar'
import Navigation from '@/components/layout/vertical/Navigation'
import Footer from './footer/Footer'

const Layout = async ({ children }: ChildrenType) => {
  // Vars
  const direction = 'ltr'

  return (
    <Providers direction={direction}>
      {/* <HorizontalLayoutWrapper horizentalLayout={<HorizontalLayout nav={<Navbar />}>{children}</HorizontalLayout>} /> */}
      <div>
        <Navbar />
      </div>
      <div>{children}</div>
      <div>
        {' '}
        <Footer />
      </div>
    </Providers>
  )
}

export default Layout
