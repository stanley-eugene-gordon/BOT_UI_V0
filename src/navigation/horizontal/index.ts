// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): HorizontalNavItemsType => [
  {
    title: 'Home',
    path: '/home',
    icon: 'tabler:smart-home'
  },
  {
    title: 'Students',
    path: '/second-page',
    icon: 'tabler:users'
  },
  {
    path: '/acl',
    action: 'read',
    subject: 'acl-page',
    title: 'Assessments',
    icon: 'tabler:file-text'
  }
]

export default navigation
