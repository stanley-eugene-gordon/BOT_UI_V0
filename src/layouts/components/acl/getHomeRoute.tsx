/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = (role: string) => {
  if (role === 'client') return '/evaluation'
  else return '/evaluation'
}

export default getHomeRoute
