const API_URL = 'https://botapiv0-production.up.railway.app/v0/'

interface IFetchEndpoint {
  endpoint: string
  method: string
  body?: any
  headers?: any
}

// lets see

function apiRequest() {
  const fetchEndpoint = async ({ endpoint, method, body, headers }: IFetchEndpoint) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        body,
        headers: { ...headers }
      })

      return response
    } catch (error) {
      throw new Error(`${error}`)
    }
  }

  return {
    fetchEndpoint
  }
}
export default apiRequest
