// ** React Imports
import { Ref, useState, forwardRef, ReactElement } from 'react'
import { ReactMic } from 'react-mic'

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
  // ** States
  const [show, setShow] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>('detailsTab')
  const [record, setRecord] = useState(false)
  const [audioBlobUrl, setAudioBlobUrl] = useState('')
  const [feedback, setFeedback] = useState('')

  const startRecording = () => {
    setRecord(true)
  }

  const stopRecording = () => {
    setRecord(false)
  }

  const onData = async (recordedBlob: any) => {
    console.log('chunk of real-time data is: ', recordedBlob)
  }

  const onStop = async (recordedBlob: IRecordedBlob) => {
    console.log('recordedBlob is: ', recordedBlob)
    setAudioBlobUrl(recordedBlob.blobURL)

    let formData = new FormData()
    formData.append('file', recordedBlob.blob)

    const result = await fetch('http://0.0.0.0:5000/v2/generate_text', {
      method: 'POST',
      mode: 'cors', // set mode to 'cors'
      headers: {
        Accept: 'application/json'
      },
      body: formData
    })
    const data = await result.json()
    const completionMessage = data?.choices[0].message.content

    if (data) setFeedback(completionMessage)
  }

  // ** Hook
  const { settings } = useSettings()

  // ** Var
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
  interface IRecordedBlob {
    blob: Blob
    startTime: number
    stopTime: number
    option: {
      audioBitsPerSecond: number
      mimeType: string
    }
    blobURL: string
  }

  return (
    <Card>
      <CardContent sx={{ textAlign: 'center', '& svg': { mb: 2 } }}>
        <Icon icon='tabler:3d-cube-sphere' fontSize='2rem' />
        <Typography variant='h6' sx={{ mb: 4 }}>
          Assessment AI
        </Typography>
        <Typography sx={{ mb: 3 }}>
          Click on the button below to create a new assessment. You can also click on the <strong>show</strong> button
        </Typography>
        <Button variant='contained' onClick={() => setShow(true)}>
          Create Assessment
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
              Create Assessment
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
                  <ReactMic
                    record={record}
                    className='sound-wave'
                    onStop={onStop}
                    onData={onData}
                    strokeColor='#000000'
                    backgroundColor='#FF4081'
                  />
                </Box>
                <Button onClick={startRecording} type='button' variant='contained' color='primary'>
                  Record
                </Button>

                <Button
                  onClick={stopRecording}
                  type='button'
                  variant='contained'
                  color='error'
                  sx={{
                    ml: 2
                  }}
                >
                  Stop
                </Button>

                {renderTabFooter()}
              </TabPanel>
              <TabPanel value='frameworkTab' sx={{ flexGrow: 1, p: '0 !important', mt: [6, 0], minHeight: '500px' }}>
                <p>{feedback}</p>
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
