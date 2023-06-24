// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): HorizontalNavItemsType => [
  {
    title: 'Analytics',
    path: '/analytics',
    icon: 'tabler:chart-pie'
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
    title: 'Evaluation',
    icon: 'tabler:file-text'
  }
]

export default navigation
