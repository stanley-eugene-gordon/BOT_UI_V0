import Grid from '@mui/material/Grid'

const ACLPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid item md={6} xs={12}></Grid>
    </Grid>
  )
}

ACLPage.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default ACLPage
