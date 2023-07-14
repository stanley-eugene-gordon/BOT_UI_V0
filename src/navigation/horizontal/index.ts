import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): HorizontalNavItemsType => [
  {
    path: '/evaluation',
    action: 'read',
    subject: 'acl-page',
    title: 'Automatization',
    icon: 'tabler:file-text'
  }
]

export default navigation
