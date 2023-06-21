// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
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
      path: '/assessments',
      action: 'read',
      subject: 'acl-page',
      title: 'Assessments',
      icon: 'tabler:file-text'
    }
  ]
}

export default navigation
