// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      path: '/evaluation',
      action: 'read',
      subject: 'acl-page',
      title: 'POC',
      icon: 'tabler:file-text'
    }
  ]
}

export default navigation
