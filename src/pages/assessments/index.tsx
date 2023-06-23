// ** React Imports
import { Ref, useState, forwardRef, ReactElement, useEffect, Fragment } from 'react'
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder'
import CircularProgress from '@mui/material/CircularProgress'

// ** MUI Imports
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Avatar from '@mui/material/Avatar'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Hook Imports
import { useSettings } from 'src/@core/hooks/useSettings'

interface TabLabelProps {
  title: string
  active: boolean
  subtitle: string
  icon: ReactElement
}

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const TabLabel = (props: TabLabelProps) => {
  const { icon, title, subtitle, active } = props

  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          variant='rounded'
          sx={{
            mr: 3,
            ...(active
              ? { color: 'common.white', backgroundColor: 'primary.main' }
              : { backgroundColor: 'action.selected' })
          }}
        >
          {icon}
        </Avatar>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant='h6'>{title}</Typography>
          <Typography sx={{ textTransform: 'none', color: 'text.disabled', fontWeight: 500 }}>{subtitle}</Typography>
        </Box>
      </Box>
    </div>
  )
}

const tabsArr = ['detailsTab', 'frameworkTab', 'DatabaseTab', 'paymentTab', 'submitTab']

const DialogCreateApp = () => {
  const [feedback, setFeedback] = useState('Hello my friend, how are you?')
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>('detailsTab')
  const [evaluationDone, setEvaluationDone] = useState<boolean>(false)

  const addAudioElement = (blob: any) => {
    const url = URL.createObjectURL(blob)
    const audio = document.createElement('audio')
    audio.src = url
    audio.controls = true
    document.body.appendChild(audio)
  }

  const recorderControls = useAudioRecorder()

  useEffect(() => {
    if (!recorderControls.recordingBlob) return
    const formData = new FormData()
    formData.append('file', recorderControls.recordingBlob)
    if (evaluationDone === false) handleUpload(formData)
  }, [recorderControls.recordingBlob])

  const handleUpload = async (formData: FormData) => {
    const result = await fetch('http://0.0.0.0:5000/v2/generate_text', {
      method: 'POST',
      mode: 'cors',
      headers: {
        Accept: 'application/json'
      },
      body: formData
    })
    setLoading(true)
    const data = await result.json()
    const completionMessage = data?.choices[0].message.content

    if (completionMessage) {
      setFeedback(completionMessage)
      setLoading(false)
      setActiveTab('frameworkTab')
      setEvaluationDone(true)
    }
  }

  const { settings } = useSettings()
  const { direction } = settings

  const handleClose = () => {
    setShow(false)
    setActiveTab('detailsTab')
  }

  const nextArrow = direction === 'ltr' ? 'tabler:arrow-right' : 'tabler:arrow-left'
  const previousArrow = direction === 'ltr' ? 'tabler:arrow-left' : 'tabler:arrow-right'

  const CustomCloseButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
    top: 0,
    right: 0,
    color: 'grey.500',
    position: 'absolute',
    boxShadow: theme.shadows[2],
    transform: 'translate(10px, -10px)',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: `${theme.palette.background.paper} !important`,
    transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
    '&:hover': {
      transform: 'translate(7px, -5px)'
    }
  }))

  const renderTabFooter = () => {
    const prevTab = tabsArr[tabsArr.indexOf(activeTab) - 1]
    const nextTab = tabsArr[tabsArr.indexOf(activeTab) + 1]

    return (
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant='tonal'
          color='secondary'
          disabled={activeTab === 'detailsTab'}
          onClick={() => setActiveTab(prevTab)}
          startIcon={<Icon icon={previousArrow} />}
        >
          Previous
        </Button>
        <Button
          variant='contained'
          color={activeTab === 'submitTab' ? 'success' : 'primary'}
          endIcon={<Icon icon={activeTab === 'submitTab' ? 'tabler:check' : nextArrow} />}
          onClick={() => {
            if (activeTab !== 'submitTab') {
              setActiveTab(nextTab)
            } else {
              handleClose()
            }
          }}
        >
          {activeTab === 'submitTab' ? 'Submit' : 'Next'}
        </Button>
      </Box>
    )
  }

  const speak = (text: any) => {
    const utterance = new SpeechSynthesisUtterance(text)

    // Wait for voices to load
    speechSynthesis.onvoiceschanged = () => {
      // Get list of voices and select one
      const voices = window.speechSynthesis.getVoices()

      // Find the voice named 'Daniel'
      const danielVoice = voices.find(voice => voice.name === 'Daniel')

      if (danielVoice) {
        utterance.voice = danielVoice
      } else {
        console.error("Couldn't find the voice 'Daniel'")
      }

      utterance.volume = 1 // Full volume
      utterance.rate = 0.8 // Normal speed
      utterance.pitch = 1 // Normal pitch

      speechSynthesis.speak(utterance)
    }
  }

  return (
    <Card>
      <CardContent sx={{ textAlign: 'center', '& svg': { mb: 2 } }}>
        <Icon icon='tabler:3d-cube-sphere' fontSize='2rem' />
        <Typography variant='h6' sx={{ mb: 4 }}>
          POC - B1 Evaluation
        </Typography>
        <Typography sx={{ mb: 3 }}>
          This is a proof of concept for the B1 Evaluation. Click the button below to start.
        </Typography>
        <Button variant='contained' onClick={() => setShow(true)}>
          B1 Evaluation
        </Button>
      </CardContent>
      <Dialog
        fullWidth
        open={show}
        scroll='body'
        maxWidth='md'
        onClose={handleClose}
        onBackdropClick={handleClose}
        TransitionComponent={Transition}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogContent
          sx={{
            pr: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pl: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(11)} !important`],
            py: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <CustomCloseButton onClick={handleClose}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant='h3' sx={{ mb: 3 }}>
              B1 - Test
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
            <TabContext value={activeTab}>
              <TabList
                orientation='vertical'
                onChange={(e, newValue: string) => setActiveTab(newValue)}
                sx={{
                  border: 0,
                  minWidth: 200,
                  '& .MuiTabs-indicator': { display: 'none' },
                  '& .MuiTabs-flexContainer': {
                    alignItems: 'flex-start',
                    '& .MuiTab-root': {
                      width: '100%',
                      alignItems: 'flex-start'
                    }
                  }
                }}
              >
                <Tab
                  disableRipple
                  value='detailsTab'
                  label={
                    <TabLabel
                      title='Record'
                      subtitle='Record an audio'
                      active={activeTab === 'detailsTab'}
                      icon={<Icon icon='tabler:file-description' />}
                    />
                  }
                />
                <Tab
                  disableRipple
                  value='frameworkTab'
                  label={
                    <TabLabel
                      title='Feedback'
                      icon={<Icon icon='tabler:3d-cube-sphere' />}
                      subtitle='See Feedback'
                      active={activeTab === 'frameworkTab'}
                    />
                  }
                />
              </TabList>
              {loading === true && (
                <CircularProgress
                  sx={{
                    color: 'common.white',
                    width: '20px !important',
                    height: '20px !important',
                    mr: theme => theme.spacing(2)
                  }}
                />
              )}

              {loading === false && (
                <TabPanel value='detailsTab' sx={{ flexGrow: 1, p: '0 !important', mt: [1, 0], minHeight: '500px' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      minHeight: '200px',
                      width: '100%',
                      '& .sound-wave': {
                        width: '100%',
                        height: '50px',
                        backgroundColor: '#FF4081',
                        borderRadius: '5px'
                      }
                    }}
                  >
                    <AudioRecorder onRecordingComplete={addAudioElement} recorderControls={recorderControls} />
                  </Box>
                  <Button onClick={recorderControls.startRecording} type='button' variant='contained' color='primary'>
                    Record
                  </Button>

                  <Button onClick={recorderControls.stopRecording} type='button' variant='contained' color='secondary'>
                    Stop
                  </Button>
                </TabPanel>
              )}

              <TabPanel value='frameworkTab' sx={{ flexGrow: 1, p: '0 !important', mt: [6, 0], minHeight: '500px' }}>
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
                <Button onClick={() => speak(feedback)} type='button' variant='contained' color='secondary'>
                  Play Feedback
                </Button>
                {renderTabFooter()}
              </TabPanel>
            </TabContext>
          </Box>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default DialogCreateApp
