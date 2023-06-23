// ** React Imports
import { useState, useEffect, Fragment } from 'react'
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Stepper from '@mui/material/Stepper'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import MuiStep, { StepProps } from '@mui/material/Step'
import CardContent, { CardContentProps } from '@mui/material/CardContent'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Icon from 'src/@core/components/icon'
import Accordion from '@mui/material/Accordion'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import StepperWrapper from 'src/@core/styles/mui/stepper'

const steps = [
  {
    icon: 'tabler:file-text',
    title: 'B1 level',
    subtitle: 'B1 level test'
  },
  {
    icon: 'tabler:file-text',
    subtitle: 'B1 level result',
    title: 'Evaluation'
  }
]

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
  const [currentIdiom, setCurrentIdiom] = useState<string>('')

  const addAudioElement = (blob: any) => {
    const url = URL.createObjectURL(blob)
    const audio = document.createElement('audio')
    audio.src = url
    audio.controls = true
    document.body.appendChild(audio)
  }

  const recorderControls = useAudioRecorder()

  const handleUpload = async (formData: FormData) => {
    const result = await fetch('http://0.0.0.0:5000/v2/generate_text', {
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

  useEffect(() => {
    if (!recorderControls.recordingBlob) return
    const formData = new FormData()
    formData.append('file', recorderControls.recordingBlob)
    handleUpload(formData)
  }, [recorderControls.recordingBlob])

  useEffect(() => {
    if (feedback) {
      speak(feedback)
    }
  }, [feedback])

  const handleStartRecording = () => {
    recorderControls.startRecording()
    setRecording(true)
  }

  const handleStopRecording = () => {
    recorderControls.stopRecording()
    setRecording(false)
  }

  const handleRecording = () => {
    recording ? handleStopRecording() : handleStartRecording()
  }

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            {[
              {
                id: 1,
                question: 'What you usually do in your free time?',
                description:
                  'Talk about your hobbies or what you like to do in your free time, for example: I like to play football, I like to watch movies, I like to read books, etc.'
              },
              {
                id: 2,
                question: 'Tell me about your family',
                description: 'Talk about your family, for example: I have a brother and a sister etc..'
              },
              {
                id: 3,
                question: 'What is your favorite food?',
                description: 'Talk about your favorite food, for example: I like pizza, I like pasta, etc.'
              }
            ].map(item => {
              return (
                <Box
                  sx={{
                    width: '100%'
                  }}
                >
                  <Accordion key={item.id}>
                    <AccordionSummary expandIcon={<Icon fontSize='1.25rem' icon='tabler:chevron-down' />}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%'
                        }}
                      >
                        <Typography sx={{ fontWeight: '500' }}>{item.question}</Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography sx={{ color: 'text.secondary' }}>{item.description}</Typography>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              )
            })}

            <Box
              sx={{
                padding: '1rem',

                '& > div': {
                  boxShadow: 'none !important',
                  backgroundColor: '#fff !important',
                  display: 'none !important'
                }
              }}
            >
              <Button
                onClick={handleRecording}
                type='button'
                variant='contained'
                color={recording ? 'error' : 'primary'}
              >
                {recording ? 'Stop Recording' : 'Start Recording'}
              </Button>
              <AudioRecorder onRecordingComplete={addAudioElement} recorderControls={recorderControls} />
            </Box>
          </>
        )
      case 1:
        return (
          <>
            <p>
              {feedback.split('\n').map((item, key) => {
                return (
                  <Fragment key={key}>
                    {item}
                    <br />
                  </Fragment>
                )
              })}
            </p>
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
        {renderContent()}
      </CardContent>
    </Card>
  )
}

export default PropertyListingWizard
