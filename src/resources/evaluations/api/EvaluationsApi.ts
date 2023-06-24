import { apiRequest } from '../../../utils'

const EvaluationsApi = () => {
  const { fetchEndpoint } = apiRequest()

  const get_metrics = async ({ data }: { data: string }) => {
    const formData = new FormData()
    formData.append('text', data)

    const result = await fetchEndpoint({
      endpoint: 'generate-text',
      method: 'POST',
      body: formData
    })

    const response = await result.json()
    const metrics = response?.choices[0].message.content

    if (metrics) {
      console.log(metrics)
      const contentLines = metrics.split('\n').filter((line: any) => line.includes('name'))
      const parsedData = contentLines.map((line: any) => {
        const name = line.match(/'([^']*)'/)[1]
        const value = parseInt(line.match(/value: (\d+)/)[1])
        const colors = ['#11009E', '#4942E4', '#8696FE', '#C4B0FF']

        const color = colors[Math.floor(Math.random() * colors.length)]

        return { name, value, color }
      })

      console.log(parsedData)

      return parsedData
    }
  }

  const create_evaluation = async ({ audio, questions }: { audio: Blob; questions: string }) => {
    const formData = new FormData()
    formData.append('file', audio)
    formData.append('questions', questions)

    const result = await fetchEndpoint({
      endpoint: 'evaluate-speech',
      method: 'POST',
      body: formData
    })

    const response = await result.json()
    const feedback = response?.text.choices[0].message.content

    return {
      language: response.text,
      feedback: feedback
    }
  }

  const create_questions = async ({ questions }: { questions: string }) => {
    const formData = new FormData()
    formData.append('text', questions)

    const result = await fetchEndpoint({
      endpoint: 'generate-text',
      method: 'POST',
      body: formData
    })

    const data = await result.json()
    const completionMessage = data?.choices[0].message.content

    return completionMessage
  }

  return {
    get_metrics,
    create_evaluation,
    create_questions
  }
}

export default EvaluationsApi
