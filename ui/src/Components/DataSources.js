import React, { useState, useContext, useMemo } from 'react';
import { MemberContext } from '../Components/MemberContext';
import {
  Stack,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Modal,
  Alert,
  Fade,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Papa from 'papaparse';

export const DataSources = () => {
  const { toggleAlert, setToggleAlert } = useContext(MemberContext);

  useMemo(() => {
    setTimeout(() => {
      setToggleAlert(false);
    }, 3000);
  }, [toggleAlert]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Stack
        sx={{
          width: '100vw',
          position: 'absolute',
          left: 0,
          top: '10vh',
        }}
      >
        <Fade in={toggleAlert}>
          <Alert severity='success' spacing={2} mb={2}>
            Your data source, has successfully been added.
          </Alert>
        </Fade>
      </Stack>

      <Typography
        variant='h3'
        ml={10}
        pb={4}
        sx={{ fontWeight: 'bold', width: 500 }}
      >
        Data Sources
      </Typography>
      <Card sx={{ boxShadow: 5, borderRadius: 3, width: 1000, p: 3 }}>
        <CardContent>
          <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
            Add Member(s)
          </Typography>
          <Divider />
          <p>Upload your .csv file to update member list</p>
        </CardContent>
        <CardActions>
          <Upload uploadType={'POST'} />
        </CardActions>
      </Card>

      <Card sx={{ boxShadow: 5, mt: 5, borderRadius: 3, width: 1000, p: 3 }}>
        <CardContent>
          <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
            Update Member(s) Certifications or Arming Status.
          </Typography>
          <Divider />
          <p>
            Upload your .csv file including airman name and corresponding
            certifications/qualifications/arming status.
          </p>
        </CardContent>
        <CardActions id='updateMember'>
          <Upload uploadType={'PATCH'} />
        </CardActions>
      </Card>

      {/* <Card sx={{ boxShadow: 5, mt: 5, borderRadius: 3, width: 1000, p: 3 }}>
        <CardContent>
          <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
            Weapon Qualifications
          </Typography>
          <p>
            Upload your .csv file including airman name and current weapons
            certifications.
          </p>
        </CardContent>
        <CardActions>
          <Upload />
        </CardActions>
      </Card> */}
    </Box>
  );
};

const Upload = props => {
  const { uploadType } = props;
  const { setToggleAlert, API } = useContext(MemberContext);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [flag, setFlag] = useState(false);
  const [selectedFile, setSelectedFile] = useState('');
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [parsed, setParsed] = useState([]);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    height: 530,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: 4,
  };

  const buttonSX = {
    borderRadius: '30px',
    marginRight: '10px',
  };

  const handleClick = () => {
    setFlag(!flag);
  };

  // const handleClickAdd = () => {
  //   setToggleAlert(true);
  //   handleClose();
  // };

  const changeHandler = event => {
    setFlag(!flag);
    setSelectedFile(event.target.files[0]);

    // setSelectedFile(event.target.files[0]);
    Papa.parse(event.target.files[0], {
      header: true,
      complete: function (results) {
        setParsed(results.data);
        JSON.stringify(parsed);
        setIsFilePicked(true);
      },
    });
    console.log('This is our selected file', parsed);
  };

  const handleSubmission = () => {
    setToggleAlert(true);
    handleClose();
    if (parsed.length === 0) return;
    console.log('This is our parsed file before fetch', parsed);

    if (uploadType === 'POST') {
      fetch(`${API}/postusers`, {
        method: 'POST',
        body: JSON.stringify(parsed),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(result => {
          console.log('Success:', result);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else {
      fetch(`${API}/updateusers`, {
        method: 'PATCH',
        body: JSON.stringify(parsed),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(result => {
          console.log('Success:', result);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        variant='outlined'
        color='secondary'
        sx={buttonSX}
      >
        UPLOAD .CSV
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Box sx={{ display: 'flex', justifyContent: 'right' }}>
            <CloseIcon onClick={handleClose} sx={{ cursor: 'pointer' }} />
          </Box>

          <Typography
            id='modal-modal-description'
            variant='h6'
            sx={{ mt: 1, textAlign: 'center' }}
          >
            ARMING STATUS
          </Typography>
          <Typography
            id='modal-modal-title'
            variant='h4'
            component='h2'
            sx={{ textAlign: 'center', fontWeight: 'bold' }}
          >
            Add Data Sources
          </Typography>

          <Stack
            direction='column'
            mt={3}
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            <p>
              To add a data source, download&nbsp;
              <a
                href='/assets/Template.csv'
                download='Template.csv'
                style={{ textDecoration: 'none' }}
              >
                this template
              </a>
              , copy and paste your data into the corresponding tabs, save,
              export as a .csv, and re-upload into this container
            </p>
          </Stack>

          {flag === false ? (
            <Stack
              mt={3}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                border: '1px dashed',
                p: 5,
                borderRadius: '15px',
              }}
            >
              <p style={{ textAlign: 'center' }}>Click to upload.</p>
              <Button
                variant='text'
                component='label'
                sx={{ fontWeight: 'bold', color: 'blue' }}
              >
                <input
                  style={{ display: 'none' }}
                  type='file'
                  id='input'
                  onChange={changeHandler}
                />
                Upload
              </Button>
            </Stack>
          ) : (
            <Stack
              mt={3}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                border: '1px solid',
                p: 5,
                borderRadius: '15px',
              }}
            >
              <p style={{ textAlign: 'center' }}>{selectedFile.name}</p>
              <Button
                variant='text'
                sx={{ fontWeight: 'bold', color: 'red' }}
                onClick={() => handleClick()}
              >
                Remove
              </Button>
            </Stack>
          )}

          <Box mt={3} sx={{ display: 'flex', justifyContent: 'end' }}>
            {flag === false ? (
              <Button
                variant='contained'
                color={flag ? 'secondary' : 'primary'}
                sx={{ borderRadius: '30px' }}
                disabled
              >
                ADD DATA
              </Button>
            ) : (
              <Button
                variant='contained'
                color={flag ? 'secondary' : 'primary'}
                sx={{ borderRadius: '30px' }}
                onClick={handleSubmission}
              >
                ADD DATA
              </Button>
            )}
          </Box>
        </Box>
      </Modal>
    </>
  );
};
