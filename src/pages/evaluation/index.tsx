// ** React Imports
import { useState, useEffect, Fragment } from 'react'
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

// ** MUI Imports
import ButtonGroup from '@mui/material/ButtonGroup'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Stepper from '@mui/material/Stepper'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import MuiStep, { StepProps } from '@mui/material/Step'
import CardContent, { CardContentProps } from '@mui/material/CardContent'
import Icon from 'src/@core/components/icon'
import CircularProgress from '@mui/material/CircularProgress'
// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import StepperWrapper from 'src/@core/styles/mui/stepper'

const steps = [
  {
    icon: 'tabler:file-text',
    title: 'Questions',
    subtitle: 'A1 level questions'
  },
  {
    icon: 'tabler:file-text',
    subtitle: 'A1 level evaluation',
    title: 'Evaluation'
  }
]

interface LabelProp {
  cx: number
  cy: number
  percent: number
  midAngle: number
  innerRadius: number
  outerRadius: number
}

const StepperHeaderContainer = styled(CardContent)<CardContentProps>(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('lg')]: {
    borderRight: 0,
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}))

const Step = styled(MuiStep)<StepProps>(({ theme }) => ({
  '& .MuiStepLabel-root': {
    paddingTop: 0
  },
  '&:not(:last-of-type) .MuiStepLabel-root': {
    paddingBottom: theme.spacing(5)
  },
  '&:last-of-type .MuiStepLabel-root': {
    paddingBottom: 0
  },
  '& .MuiStepLabel-iconContainer': {
    display: 'none'
  },
  '& .step-subtitle': {
    color: `${theme.palette.text.disabled} !important`
  },
  '& + svg': {
    color: theme.palette.text.disabled
  },
  '&.Mui-completed .step-title': {
    color: theme.palette.text.disabled
  },
  '& .MuiStepLabel-label': {
    cursor: 'pointer'
  }
}))

const PropertyListingWizard = () => {
  // ** States
  const [activeStep, setActiveStep] = useState<number>(0)
  const [feedback, setFeedback] = useState('')
  const [evaluationDone, setEvaluationDone] = useState<boolean>(false)
  const [recording, setRecording] = useState<boolean>(false)
  const [currentIdiom, setCurrentIdiom] = useState<string>('french')
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingQuestions, setLoadingQuestions] = useState<boolean>(false)
  const [metrics, setMetrics] = useState('')
  const [data, setData] = useState([
    {
      name: 'Vocabulary',
      value: 5,
      color: '#00d4bd'
    }
  ])

  const [testQuestions, setTestQuestions] = useState('')

  const addAudioElement = (blob: any) => {
    const url = URL.createObjectURL(blob)
    const audio = document.createElement('audio')
    audio.src = url
    audio.controls = true
  }

  const recorderControls = useAudioRecorder()

  const handleUpload = async (formData: FormData) => {
    const result = await fetch('http://0.0.0.0:5000/v2/evaluate-speech', {
      method: 'POST',
      mode: 'cors',
      headers: {
        Accept: 'application/json'
      },
      body: formData
    })
    const data = await result.json()
    const completionMessage = data?.text.choices[0].message.content

    if (completionMessage) {
      setFeedback(completionMessage)
      setCurrentIdiom(data?.language)
      setEvaluationDone(true)
      setLoading(false)
    }
  }

  const speak = (text: any) => {
    const utterance = new SpeechSynthesisUtterance(text)
    speechSynthesis.onvoiceschanged = () => {
      const voices = window.speechSynthesis.getVoices()

      var idiom = ''

      if (currentIdiom === 'english') {
        idiom = 'Eddy (English (US))'
      }

      if (currentIdiom === 'spanish') {
        idiom = 'Grandma (Spanish (Mexico))'
      }

      if (currentIdiom === 'french') {
        idiom = 'Grandpa (French (Canada))'
      }

      console.log(voices)

      const matchedVoice = voices.find(voice => voice.name === idiom)

      if (matchedVoice) {
        utterance.voice = matchedVoice
      }

      utterance.volume = 1 // Full volume
      utterance.rate = 0.8 // Normal speed
      utterance.pitch = 1 // Normal pitch

      speechSynthesis.speak(utterance)
    }
  }

  const GenerateMetrics = async () => {
    const formData = new FormData()
    formData.append(
      'text',
      `generate a JSON object with the metrics for this feedback: ${feedback} only return the json object with the metrics and not the feedback itself just the metrics in this format  [
        { name: 'Vocabulary', value: 5, color: '#00d4bd' },
        { name: 'Comprehension', value: 8, color: '#ff5c7c' },
        { name: 'Grammar', value: 10, color: '#ffa900' },
        { name: 'Fluency', value: 10, color: '#0abb87' }
      ]`
    )

    const result = await fetch('http://0.0.0.0:5000/v2/generate-text', {
      method: 'POST',
      mode: 'cors',
      headers: {
        Accept: 'application/json'
      },
      body: formData
    })

    const data = await result.json()
    const metrics = data?.choices[0].message.content

    if (metrics) {
      const contentLines = metrics.split('\n').filter((line: any) => line.includes('name'))

      const parsedData = contentLines.map((line: any) => {
        const name = line.match(/'([^']*)'/)[1]
        const value = parseInt(line.match(/value: (\d+)/)[1])
        const colors = ['#11009E', '#4942E4', '#8696FE', '#C4B0FF']

        const color = colors[Math.floor(Math.random() * colors.length)] // Assign random color

        return { name, value, color }
      })

      setData(parsedData)
    }
  }

  useEffect(() => {
    if (feedback) {
      setActiveStep(prevStep => prevStep + 1) // Auto-advance to the next step
      speak(feedback)
      GenerateMetrics()
    }
  }, [feedback])

  useEffect(() => {
    if (recorderControls.recordingBlob) {
      const formData = new FormData()
      formData.append('file', recorderControls.recordingBlob)
      formData.append('questions', testQuestions)
      handleUpload(formData)
    }
  }, [recorderControls.recordingBlob])

  const handleStartRecording = () => {
    recorderControls.startRecording()
    setRecording(true)
  }

  const generateTestQuestions = async () => {
    const formData = new FormData()
    formData.append(
      'text',
      `B1 level test questions for ${currentIdiom} within 3 questions. Focus on grammar and vocabulary, and consider the user can only respond via audio recordings so don't request edit tasks.`
    )

    const result = await fetch('http://0.0.0.0:5000/v2/generate-text', {
      method: 'POST',
      mode: 'cors',
      headers: {
        Accept: 'application/json'
      },
      body: formData
    })
    const data = await result.json()
    const completionMessage = data?.choices[0].message.content

    if (completionMessage) {
      setTestQuestions(completionMessage)
      setLoadingQuestions(false)
    }
  }

  useEffect(() => {
    setLoadingQuestions(true)
    generateTestQuestions()
  }, [])

  const handleStopRecording = async () => {
    recorderControls.stopRecording()
    setRecording(false)
    setLoading(true)
  }

  const handleRecording = () => {
    recording ? handleStopRecording() : handleStartRecording()
  }

  const RADIAN = Math.PI / 180

  const renderCustomizedLabel = (props: LabelProp) => {
    // ** Props
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text x={x} y={y} fill='#fff' textAnchor='middle' dominantBaseline='central'>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box
            sx={{
              width: '100%'
            }}
          >
            {!loadingQuestions && (
              <>
                <p>
                  {testQuestions.split('\n').map((item, key) => {
                    return (
                      <Fragment key={key}>
                        {item}
                        <br />
                      </Fragment>
                    )
                  })}
                </p>

                <ButtonGroup variant='outlined'>
                  <Button
                    onClick={handleRecording}
                    type='button'
                    variant='contained'
                    color={recording ? 'error' : 'primary'}
                  >
                    {recording ? 'Stop Recording' : 'Start Recording'}
                  </Button>

                  <Button
                    sx={{
                      marginLeft: '10px'
                    }}
                    onClick={() => {}}
                    type='button'
                    variant='contained'
                    color='success'
                  >
                    Upload Recording
                  </Button>
                </ButtonGroup>
              </>
            )}

            {loadingQuestions && (
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <p>Generating test questions...</p>
                <CircularProgress size={25} />
              </Box>
            )}

            <Box
              sx={{
                '& > div': {
                  boxShadow: 'none !important',
                  backgroundColor: '#fff !important',
                  display: 'none !important'
                }
              }}
            >
              <AudioRecorder onRecordingComplete={addAudioElement} recorderControls={recorderControls} />
            </Box>
          </Box>
        )
      case 1:
        return (
          <>
            {feedback && (
              <>
                <p>
                  {feedback.split('\n').map((item, key) => {
                    return (
                      <>
                        <Fragment key={key}>
                          {item}
                          <br />
                        </Fragment>
                      </>
                    )
                  })}
                </p>

                <Box sx={{ height: 350 }}>
                  <ResponsiveContainer>
                    <PieChart height={350} style={{ direction: 'ltr' }}>
                      <Pie data={data} innerRadius={80} dataKey='value' label={renderCustomizedLabel} labelLine={false}>
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </>
            )}

            {!feedback && <p>Record and audio resolving the questions to process/show your evaluation 😄 📖</p>}
          </>
        )
      default:
        return null
    }
  }

  const renderContent = () => {
    return getStepContent(activeStep)
  }

  return (
    <Card sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' } }}>
      <StepperHeaderContainer>
        <StepperWrapper sx={{ height: '100%' }}>
          <Stepper
            connector={<></>}
            orientation='vertical'
            activeStep={activeStep}
            sx={{ height: '100%', minWidth: '15rem' }}
          >
            {steps.map((step, index) => {
              const RenderAvatar = activeStep >= index ? CustomAvatar : Avatar

              return (
                <Step
                  key={index}
                  onClick={() => setActiveStep(index)}
                  sx={{ '&.Mui-completed + svg': { color: 'primary.main' } }}
                >
                  <StepLabel>
                    <div className='step-label'>
                      <RenderAvatar
                        variant='rounded'
                        {...(activeStep >= index && { skin: 'light' })}
                        {...(activeStep === index && { skin: 'filled' })}
                        {...(activeStep >= index && { color: 'primary' })}
                        sx={{
                          ...(activeStep === index && { boxShadow: theme => theme.shadows[3] }),
                          ...(activeStep > index && { color: theme => hexToRGBA(theme.palette.primary.main, 0.4) })
                        }}
                      >
                        <Icon icon={step.icon} fontSize='1.5rem' />
                      </RenderAvatar>
                      <div>
                        <Typography className='step-title'>{step.title}</Typography>
                        <Typography className='step-subtitle'>{step.subtitle}</Typography>
                      </div>
                    </div>
                  </StepLabel>
                </Step>
              )
            })}
          </Stepper>
        </StepperWrapper>
      </StepperHeaderContainer>
      <CardContent
        sx={{
          width: '100%',
          pt: theme => `${theme.spacing(6)} !important`
        }}
      >
        {loading ? (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <p>Processing Evaluation...</p>
            <CircularProgress size={25} />
          </Box>
        ) : (
          renderContent()
        )}
      </CardContent>
    </Card>
  )
}

export default PropertyListingWizard
