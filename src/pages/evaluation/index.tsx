import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import CardHeader from '@mui/material/CardHeader'
import { useDropzone } from 'react-dropzone'

// ** Custom Component Import

import CustomChip from 'src/@core/components/mui/chip'
import { EvaluationsApi } from '../../resources'

interface FileProp {
  name: string
  type: string
  size: number
}

const TableColumns = () => {
  // ** States
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
  const [tasks, setTasks] = useState([])
  const [open, setOpen] = useState<boolean>(false)
  const [show, setShow] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<string>('')
  const handleClose = () => setOpen(false)
  const [task, setTask] = useState({
    title: '',
    description: '',
    status: 'todo',
    type: 'blob',
    url: '',
    file: '.',
    steps: '.'
  })
  const [files, setFiles] = useState<File[]>([])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setTask(prevState => ({ ...prevState, [name]: value }))
  }
  const handleTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTask(prevTask => ({ ...prevTask, type: event.target.value as string }))
  }

  const handleStatusChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTask(prevTask => ({ ...prevTask, status: event.target.value as string }))
  }

  const { get_tasks, delete_task, create_task } = EvaluationsApi()

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: async (acceptedFiles: File[]) => {
      setFiles(acceptedFiles)

      const file = acceptedFiles[0]
      const reader = new FileReader()
      reader.onload = async event => {
        if (event.target) {
          const content = event.target.result as string
          setTask(prevState => ({ ...prevState, steps: content }))
        }
      }
      reader.readAsText(file)
    }
  })

  const file = files.map((file: FileProp) => <Typography key={file.name}>Uploaded file: {file.name}</Typography>)

  const getTasks = async () => {
    get_tasks().then(res => {
      setTasks(res)
    })
  }

  const handleDelete = async (id: string) => {
    await delete_task(id).then(() => {
      setCurrentId('')
      handleClose()
      setOpen(false)
      getTasks()
    })
  }

  const handleCreate = async () => {
    await create_task(task).then(() => {
      console.log(task)
      setCurrentId('')
      handleClose()
      setOpen(false)
      getTasks()
    })
  }

  useEffect(() => {
    getTasks()
  }, [])

  const columns: GridColDef[] = [
    {
      flex: 0.25,
      minWidth: 290,
      field: 'title',
      headerName: 'Title',
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography>
                {row.title} | {row.description}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 140,
      field: 'status',
      headerName: 'Status',
      renderCell: () => {
        return (
          <CustomChip
            rounded
            size='small'
            skin='light'
            color={'warning'}
            label={'status'}
            sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
          />
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 140,
      field: 'type',
      headerName: 'Type',
      renderCell: () => {
        return (
          <CustomChip
            rounded
            size='small'
            skin='light'
            color={'warning'}
            label={'status'}
            sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
          />
        )
      }
    },
    {
      flex: 0.125,
      minWidth: 140,
      field: 'actions',
      headerName: 'Actions',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem'
            }}
          >
            <Button variant='outlined' color='primary' size='small'>
              Execute
            </Button>

            <Button
              variant='outlined'
              color='error'
              size='small'
              onClick={() => {
                setCurrentId(params.row.id)
                setOpen(true)
              }}
            >
              Delete
            </Button>
          </Box>
        )
      }
    }
  ]

  return (
    <Card>
      <CardHeader
        title='Column'
        action={
          <div>
            <Button size='medium' variant='contained' onClick={() => setShow(true)}>
              Add New Task
            </Button>
          </div>
        }
      />
      <DataGrid
        autoHeight
        rows={tasks}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={[7, 10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />

      <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            Are you sure you want to delete this task? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button
            onClick={() => {
              handleDelete(currentId)
            }}
          >
            Confirm
          </Button>
          <Button
            onClick={() => {
              handleClose()
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* POST TASK DIALOG*/}
      <Dialog fullWidth open={show} maxWidth='md' scroll='body' onClose={() => setShow(false)}>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button onClick={() => setShow(false)}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </Button>
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant='h3' sx={{ mb: 3 }}>
              Add New Task
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>Fill in the form below to add a new task.</Typography>
          </Box>
          <Grid container spacing={6}>
            <Grid item sm={6} xs={12}>
              <CustomTextField
                fullWidth
                label='Url'
                placeholder='https://www.some_website.com'
                onChange={handleChange}
                name='url'
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <CustomTextField
                fullWidth
                label='Title'
                placeholder='Write a title to your task'
                onChange={handleChange}
                name='title'
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label='Description'
                placeholder='Write a description to your task'
                onChange={handleChange}
                name='description'
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <CustomTextField
                select
                defaultValue='todo'
                fullWidth
                id='status-select'
                label='Status'
                onChange={handleStatusChange}
                name='status'
              >
                <MenuItem value='todo'>Todo</MenuItem>
              </CustomTextField>
            </Grid>
            <Grid item sm={6} xs={12}>
              <CustomTextField
                select
                defaultValue='blob'
                fullWidth
                id='status-select'
                label='Type'
                onChange={handleTypeChange}
                name='type'
              >
                <MenuItem value='blob'>Blob</MenuItem>
              </CustomTextField>
            </Grid>

            <Grid item xs={12}>
              <Box {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                {files.length ? (
                  <Box sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    {file}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      textAlign: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                      minHeight: 300,
                      flexWrap: 'wrap',
                      cursor: 'pointer',
                      position: 'relative',
                      justifyContent: 'center',
                      borderRadius: '0.5rem',
                      border: `2px dashed #ccc`
                    }}
                  >
                    <Typography variant='h4' sx={{ mb: 2.5 }}>
                      Drop your task JSON file here
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button
            variant='contained'
            sx={{ mr: 1 }}
            onClick={() => {
              handleCreate()
            }}
          >
            Submit
          </Button>

          <Button variant='tonal' color='secondary' onClick={() => setShow(false)}>
            Discard
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default TableColumns
