import React, { useContext, useState } from "react"

import IconButton from "@mui/material/IconButton"
import MenuItem from "@mui/material/MenuItem"
import Menu from "@mui/material/Menu"
import AddIcon from "@mui/icons-material/Add"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material"
import { green, grey } from "@mui/material/colors"
import { styled } from "@mui/system"
import CircularProgress from "@mui/material/CircularProgress"
import { Box } from "@mui/system"
import classroomAxios from "../DataConnection/axiosConfig"
import { useForm } from "react-hook-form"
import { useLocation } from "react-router"

import CancelButton from "./CancelButton"
import { ClassroomContext } from "../../context/ClassroomContext"
import { BasicTextFields } from "../../Components/Form/FormEmail"
import { useHistory } from "react-router"

const AddIconButton = styled(IconButton)`
  &:hover {
    background-color: ${grey[800]};
  }
`

export default function CreateClassButton() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [openCreateClass, setOpenCreateClass] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)
  const { updateClassList } = useContext(ClassroomContext)
  const [openJoinClass,setOpenJoinClass] = React.useState(false);
  const [itemCode,setItemCode] = useState('')
  const { user } = useContext(ClassroomContext);
  const history = useHistory();
  //change user

  // let user = null
  // if (localStorage.isSocialLogin) {
  //   user = JSON.parse(localStorage.isSocialLogin)
  // } else if (localStorage.isLogin) {
  //   user = JSON.parse(localStorage.isLogin)
  // }

  let location = useLocation()
  const pathArr = location.pathname.split("/")

  const { register, handleSubmit, reset, formState } = useForm()

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClickOpenCreateClass = () => {
    setOpenCreateClass(true)
  }

  const handleCloseCreateClass = () => {
    setOpenCreateClass(false)
    if (error) {
      reset({
        className: "",
        section: "",
        subject: "",
        room: "",
      })
      setError(null)
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)

    try {
      const response = await classroomAxios.post(`classes`, {
        className: data.className,
        section: data.section,
        subject: data.subject,
        room: data.room,
      })

      updateClassList(response.data)
      setError(null)
      setLoading(false)
      handleCloseCreateClass()
    } catch (error) {
      console.error(error)
      setError(error)
      setLoading(false)
    }
  }

  const handleOpenJoinClass = async()=>{
    setOpenJoinClass(true);
  }

  const handleSubmitJoinClass = async()=>{
    try {
      const response = await classroomAxios.post(`join/join-class-by-code`, {
       code: itemCode,
       user: user
      })

      if(response)
      {
        alert("Join class thành công!")
        history.replace(`/classes/${response.data}`)
      }
    } catch (error) {
      console.error(error)
      alert("Join class không thành công!")
    }
  }

  React.useEffect(() => {
    if (!error && formState.isSubmitSuccessful) {
      reset({
        className: "",
        section: "",
        subject: "",
        room: "",
      })
    }
  }, [formState, reset, error])

  if (pathArr[1] !== "") {
    return null
  } else
    return (
      <>
        <AddIconButton
          size="large"
          aria-label="menu of create class"
          aria-controls="menu-create-class"
          aria-haspopup="true"
          onClick={handleClick}
          color="inherit"
        >
          <AddIcon />
        </AddIconButton>
        <Menu
          id="menu-create-class"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={()=>
            {
              handleClose()
              handleOpenJoinClass()
              }}>Join class</MenuItem>
          <MenuItem
            onClick={() => {
              handleClose()
              handleClickOpenCreateClass()
            }}
          >
            Create class
          </MenuItem>

          <Dialog
            maxWidth="sm"
            fullWidth
            open={openCreateClass}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Create class"}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
              <DialogContent
                sx={{
                  "& .MuiTextField-root": { mb: 2 },
                }}
              >
                <TextField
                  id="class-name"
                  label="Class name"
                  variant="filled"
                  fullWidth
                  required
                  {...register("className", {
                    required: true,
                    maxLength: 100,
                  })}
                />
                <TextField
                  id="section"
                  label="Section"
                  variant="filled"
                  fullWidth
                  {...register("section", {
                    maxLength: 100,
                  })}
                />
                <TextField
                  id="subject"
                  label="Subject"
                  variant="filled"
                  fullWidth
                  {...register("subject", {
                    maxLength: 100,
                  })}
                />
                <TextField
                  id="room"
                  label="Room"
                  variant="filled"
                  fullWidth
                  {...register("room", {
                    maxLength: 100,
                  })}
                />
                {error && (
                  <Typography color="error">
                    {error.message}. Please try again.
                  </Typography>
                )}
              </DialogContent>
              <DialogActions>
                <CancelButton
                  variant="text"
                  onClick={() => handleCloseCreateClass()}
                >
                  Cancel
                </CancelButton>
                <Box sx={{ m: 1, position: "relative" }}>
                  <Button
                    variant="contained"
                    autoFocus
                    type="submit"
                    disabled={loading}
                  >
                    CREATE
                  </Button>
                  {loading && (
                    <CircularProgress
                      size={24}
                      sx={{
                        color: green[500],
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        marginTop: "-12px",
                        marginLeft: "-12px",
                      }}
                    />
                  )}
                </Box>
              </DialogActions>
            </form>
          </Dialog>

         
        </Menu>
        <Dialog open={openJoinClass}>
          <DialogContent>
            <Typography>
              <b>Nhập Code để Join Class</b>
            </Typography>
            <form>
            <BasicTextFields
                itemInput={itemCode}
                setItemInput={setItemCode}
                type = {"Text"}
              />
              <Button type="cancel" onClick={()=>setOpenJoinClass(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitJoinClass}>
                Submit
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </>
    )
}
