/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = (role: string) => {
  if (role === 'client') return '/analytics'
  else return '/analytics'
}

export default getHomeRoute
