// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): HorizontalNavItemsType => {
  return [
    {
      title: 'Analytics',
      icon: 'tabler:chart-pie',
      path: '/dashboards/analytics'
    },

    {
      title: 'Users',
      icon: 'tabler:user',
      path: '/apps/user/list'
    }
  ]
}

export default navigation
