// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
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
}

export default navigation
