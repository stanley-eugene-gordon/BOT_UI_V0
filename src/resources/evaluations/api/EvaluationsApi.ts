import { apiRequest } from '../../../utils'

const EvaluationsApi = () => {
  const { fetchEndpoint } = apiRequest()

  const create_task = async ({
    url,
    title,
    description,
    status,
    type,
    file,
    steps
  }: {
    url: string
    title: string
    description: string
    status: string
    type: string
    file: string
    steps: string
  }) => {
    const formData = new FormData()

    if (url) formData.append('url', url)
    if (title) formData.append('title', title)
    if (description) formData.append('description', description)
    if (status) formData.append('status', status)
    if (type) formData.append('type', type)
    if (file) formData.append('file', file)
    if (steps) formData.append('steps', steps)

    console.log(url)
    console.log(title)
    console.log(description)
    console.log(status)
    console.log(type)
    console.log(file)
    console.log(steps)

    const result = await fetchEndpoint({
      endpoint: 'task',
      method: 'POST',
      body: formData
    })
    const data = await result.json()

    return data
  }

  const get_tasks = async () => {
    const result = await fetchEndpoint({
      endpoint: 'task',
      method: 'GET'
    })
    const data = await result.json()

    return data
  }

  const get_task = async (id: string) => {
    const result = await fetchEndpoint({
      endpoint: `task/${id}`,
      method: 'GET'
    })
    const data = await result.json()

    return data
  }

  const delete_task = async (id: string) => {
    const result = await fetchEndpoint({
      endpoint: `task/${id}`,
      method: 'DELETE'
    })
    const data = await result.json()

    return data
  }

  const execute_task = async (id: string) => {
    const result = await fetchEndpoint({
      endpoint: `task/execute/${id}`,
      method: 'POST'
    })
    const data = await result.json()

    return data
  }

  return {
    get_tasks,
    create_task,
    get_task,
    delete_task,
    execute_task
  }
}

export default EvaluationsApi
