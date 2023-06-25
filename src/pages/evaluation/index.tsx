import { useState, useEffect, Fragment } from 'react'
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { ButtonGroup, Box, Card, Avatar, Button, Stepper, StepLabel, Typography, CircularProgress } from '@mui/material'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { styled } from '@mui/material/styles'
import MuiStep, { StepProps } from '@mui/material/Step'
import CardContent, { CardContentProps } from '@mui/material/CardContent'
import Icon from 'src/@core/components/icon'

import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import StepperWrapper from 'src/@core/styles/mui/stepper'

import { EvaluationsApi } from '../../resources'
import { VoiceAssistant } from '../../utils'

const STEPS = [
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
  const [activeStep, setActiveStep] = useState<number>(0)
  const [feedback, setFeedback] = useState('')
  const [recording, setRecording] = useState<boolean>(false)
  const [currentIdiom, setCurrentIdiom] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingQuestions, setLoadingQuestions] = useState<boolean>(false)
  const [data, setData] = useState([
    {
      name: 'Vocabulary',
      value: 5,
      color: '#00d4bd'
    }
  ])

  const [testQuestions, setTestQuestions] = useState('')

  const { get_metrics, create_evaluation, create_questions } = EvaluationsApi()
  const { speak } = VoiceAssistant()

  const recorderControls = useAudioRecorder()

  const addAudioElement = (blob: any) => {
    const url = URL.createObjectURL(blob)
    const audio = document.createElement('audio')
    audio.src = url
    audio.controls = true
  }
  const handleStartRecording = () => {
    recorderControls.startRecording()
    setRecording(true)
  }

  const handleStopRecording = async () => {
    recorderControls.stopRecording()
    setRecording(false)
    setLoading(true)
  }

  const handleRecording = () => {
    recording ? handleStopRecording() : handleStartRecording()
  }

  const HandleEvaluation = async () => {
    if (feedback) {
      setActiveStep(prevStep => prevStep + 1)
      speak(feedback, currentIdiom)
      const result = await get_metrics({
        data: `generate a JSON object with the metrics for this feedback: ${feedback} only return the json object with the metrics and not the feedback itself just the metrics in this format  [
          { name: 'Vocabulary', value: 5, color: '#00d4bd' },
          { name: 'Comprehension', value: 8, color: '#ff5c7c' },
          { name: 'Grammar', value: 10, color: '#ffa900' },
          { name: 'Fluency', value: 10, color: '#0abb87' }
        ]`
      })
      setData(result)
    }
  }

  const CreateEvaluation = async () => {
    if (recorderControls.recordingBlob) {
      const evaluation = await create_evaluation({ audio: recorderControls.recordingBlob, questions: testQuestions })
      if (evaluation) {
        setFeedback(evaluation?.feedback)
        setCurrentIdiom(evaluation?.language)
        setLoading(false)
      }
    }
  }

  const generateTestQuestions = async () => {
    if (currentIdiom) {
      const completionMessage = await create_questions({
        questions: `B1 level test questions for ${currentIdiom} within 3 questions. Focus on grammar and vocabulary, and consider the user can only respond via audio recordings so don't request edit tasks.`
      })
      if (completionMessage) {
        setTestQuestions(completionMessage)
        setLoadingQuestions(false)
      }
    }
  }

  useEffect(() => {
    HandleEvaluation()
  }, [feedback])

  useEffect(() => {
    CreateEvaluation()
  }, [recorderControls.recordingBlob])

  useEffect(() => {
    setLoadingQuestions(true)
    generateTestQuestions()
  }, [currentIdiom])

  const renderCustomizedLabel = (props: LabelProp) => {
    const RADIAN = Math.PI / 180
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
                {loadingQuestions && !currentIdiom && <p>Waiting for the user to select a language..</p>}
                {loadingQuestions && currentIdiom && <p>Generating test questions for {currentIdiom}...</p>}
                <img
                  src='https://i.pinimg.com/originals/11/25/70/112570d82b10188b1aaf2664c879e7b1.gif'
                  alt='loading'
                  width={70}
                  height={60}
                />
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
    <>
      <ButtonGroup variant='outlined'>
        <Button
          onClick={() => {
            setCurrentIdiom('english')
            setLoadingQuestions(true)
            generateTestQuestions()
          }}
          type='button'
          variant='contained'
          color={'error'}
        >
          English
        </Button>

        <Button
          sx={{
            marginLeft: '10px'
          }}
          type='button'
          variant='contained'
          color='warning'
          onClick={() => {
            setCurrentIdiom('spanish')
            setLoadingQuestions(true)
            generateTestQuestions()
          }}
        >
          Spanish
        </Button>

        <Button
          sx={{
            marginLeft: '10px'
          }}
          type='button'
          variant='contained'
          color='success'
          onClick={() => {
            setCurrentIdiom('french')
            setLoadingQuestions(true)
            generateTestQuestions()
          }}
        >
          French
        </Button>
      </ButtonGroup>

      <Card sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' } }}>
        <StepperHeaderContainer>
          <StepperWrapper sx={{ height: '100%' }}>
            <Stepper
              connector={<></>}
              orientation='vertical'
              activeStep={activeStep}
              sx={{ height: '100%', minWidth: '15rem' }}
            >
              {STEPS.map((step, index) => {
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
    </>
  )
}

export default PropertyListingWizard
