// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
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
