// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): HorizontalNavItemsType => [
  {
    path: '/evaluation',
    action: 'read',
    subject: 'acl-page',
    title: 'POC',
    icon: 'tabler:file-text'
  }
]

export default navigation
