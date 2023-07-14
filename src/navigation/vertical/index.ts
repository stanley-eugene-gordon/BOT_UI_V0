// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      path: '/evaluation',
      action: 'read',
      subject: 'acl-page',
      title: 'Automatization',
      icon: 'tabler:file-text'
    }
  ]
}

export default navigation
