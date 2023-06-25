// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): HorizontalNavItemsType => [
  {
    title: 'Analytics',
    path: '/analytics',
    icon: 'tabler:chart-pie'
  },
  {
    title: 'Teachers',
    path: '/',
    icon: 'tabler:users'
  },
  {
    title: 'Students',
    path: '/students',
    icon: 'tabler:users'
  },

  {
    path: '/evaluation',
    action: 'read',
    subject: 'acl-page',
    title: 'Evaluations',
    icon: 'tabler:file-text'
  }
]

export default navigation
