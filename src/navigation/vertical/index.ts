// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: 'tabler:smart-home'
    },
    {
      title: 'Students',
      path: '/students',
      icon: 'tabler:users'
    },
    {
      path: '/assessments',
      action: 'read',
      subject: 'acl-page',
      title: 'Assessments',
      icon: 'tabler:file-text'
    }
  ]
}

export default navigation
