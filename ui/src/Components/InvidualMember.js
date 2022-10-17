import React, { useContext, useState, useEffect } from 'react';
import { MemberContext } from '../Components/MemberContext';
import '../styles/Card.css';
import {
  Box,
  Grid,
  LinearProgress,
  Avatar,
  Button,
  Typography,
  Modal,
  TextField,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  FormControl,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useParams } from 'react-router';
import OutlinedInput from '@mui/material/OutlinedInput';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';

const IndividualMember = () => {
  const { member, API, setMember, triggerFetch } = useContext(MemberContext);
  const { memberId } = useParams();
  //console.log(member);
  // console.log(typeof(member));
  // console.log("params: ", memberId)

  useEffect(() => {
    fetch(`${API}/users/${memberId}`)
      .then(res => res.json())
      .then(data => setMember(data[0]));
  }, [triggerFetch]);

  if (member === undefined || member.length === 0) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    );
  } else {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box>
          <Stack direction='row' spacing={2}>
            <a href='/sfmembers' style={{ textDecoration: 'none' }}>
              People&nbsp;
            </a>
            {'>'} {member.first_name} {member.last_name}
          </Stack>
        </Box>
        <Stack direction='row' alignItems='center' spacing={2} mt={6}>
          <Avatar />
          <h1>
            {member.first_name} {member.last_name}
          </h1>
        </Stack>

        <Box
          sx={{
            m: 10,
            height: 500,
            width: 500,
            boxShadow: 3,
            borderRadius: 3,
            p: 5,
            backgroundColor: 'white',
          }}
        >
          <Stack
            direction='row'
            spacing={2}
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
              User Profile
            </Typography>
            <EditMemberModal memberObject={member} />
          </Stack>

          <Grid container justifyContent='space-around' sx={{ mt: 5 }}>
            <Box display='flex' flexDirection='column'>
              <Typography sx={{ fontWeight: 'bold' }}>Name:</Typography>
              <Typography sx={{ mb: 5 }}>
                {member.first_name} {member.last_name}
              </Typography>

              <Typography sx={{ fontWeight: 'bold' }}>Rank:</Typography>
              <Typography sx={{ mb: 5 }}>
                {member.rank.toUpperCase()}
              </Typography>

              <Typography sx={{ fontWeight: 'bold' }}>
                Weapons Qualifications:
              </Typography>
              {member.weapons.length === 0 ? (
                <Typography sx={{ mb: 5 }}>No weapons</Typography>
              ) : (
                <Typography sx={{ mb: 5 }}>
                  {member.weapons
                    .map(item => item.weapon.toUpperCase())
                    .join(', ')}
                </Typography>
              )}

              <Typography sx={{ fontWeight: 'bold' }}>Notes:</Typography>
              {member.notes === null ? (
                <Typography sx={{ mb: 5 }}>N/A</Typography>
              ) : (
                <Typography sx={{ mb: 5 }}>{member.notes}</Typography>
              )}
            </Box>

            <Box display='flex' flexDirection='column'>
              <Typography sx={{ fontWeight: 'bold' }}>User Type:</Typography>
              <Typography sx={{ mb: 5 }}>
                {member.admin === true ? 'Admin' : 'User'}
              </Typography>

              <Typography sx={{ fontWeight: 'bold' }}>
                Certifications:
              </Typography>
              {member.certs.length === 0 ? (
                <Typography sx={{ mb: 5 }}>No certs</Typography>
              ) : (
                <Typography sx={{ mb: 5 }}>
                  {member.certs.map(item => item.cert)}
                </Typography>
              )}

              <Typography component='span' sx={{ fontWeight: 'bold' }}>
                Arm Status:
              </Typography>
              {member.weapon_arming === true ? (
                // <Typography sx={{mb:5, color:"green"}}>Arm</Typography>
                <Chip label='Arm' color='success' />
              ) : (
                // <Typography sx={{ mb: 5, color: "red" }}>Do Not Arm</Typography>
                <Chip label='Do Not Arm' color='secondary' />
              )}
            </Box>
          </Grid>
        </Box>
      </Box>
    );
  }
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 650,
  height: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 4,
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const EditMemberModal = props => {
  let memberObject = props;
  memberObject = memberObject.memberObject;
  console.log('member object, ', memberObject);

  const { API, member, setTriggerFetch, allWeapons } =
    useContext(MemberContext);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [firstName, setFirstName] = useState(memberObject.first_name);
  const [lastName, setLastName] = useState(memberObject.last_name);
  const [userType, setUserType] = useState(memberObject.admin);
  const [rank, setRank] = useState(memberObject.rank);
  const [cert, setCert] = useState(memberObject.cert_id);
  const [weapon, setWeapon] = useState('');
  const [weaponArr, setWeaponArr] = useState(memberObject.weapons);
  const [status, setStatus] = useState(memberObject.weapon_arming);
  const [notes, setNotes] = useState(memberObject.notes);
  const [weaponIdArray, setWeaponIdArray] = useState(
    memberObject.weapons.map(wep => wep.id)
  );

  //need to modify this so old data is persisted
  const handleEdit = () => {
    const updatedUser = {
      first_name: firstName,
      last_name: lastName,
      admin: userType,
      rank: rank,
      cert_id: cert,
      weapon_arming: status,
      notes: notes,
    };
    console.log('updated user, ', updatedUser);

    fetch(`${API}/updateuser/${member.id}`, {
      method: 'PATCH',
      body: JSON.stringify(updatedUser),
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    })
      // .then(window.location.reload(false))
      // .then(navigate(`/sfmembers/${member.id}`))
      .then(res => res.json())
      .then(() => {
        setTriggerFetch(curr => !curr);
        handleClose();
      })
      .catch(err => {
        console.log('Error: ', err);
      });
  };

  const handleChange = event => {
    const {
      target: { value, checked },
    } = event;
    console.log(event);
    console.log(
      'value: checked ',
      event.target.parentNode.parentNode.id,
      checked
    );
    let wepId = parseInt(event.target.parentNode.parentNode.id);
    if (checked) {
      setWeaponIdArray(curr => [...curr, wepId]);
      setWeapon(curr => [
        ...curr,
        allWeapons.filter(weapon => weapon.id === wepId)[0],
      ]);
    } else {
      setWeaponIdArray(curr => curr.filter(wep => wep !== wepId));
      setWeapon(curr => curr.filter(weapon => weapon.id !== wepId));
    }
  };

  useEffect(() => {
    // console.log('the weapons ', weapon);
    console.log('weapon id Array ', weaponIdArray);
  }, [weaponIdArray]);

  return (
    <>
      <Button
        onClick={handleOpen}
        variant='outlined'
        color='secondary'
        sx={{ borderRadius: '30px' }}
      >
        Edit Profile
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
            id='modal-modal-title'
            variant='h6'
            component='h2'
            sx={{ textAlign: 'center' }}
          >
            PROFILE
          </Typography>
          <Typography
            id='modal-modal-description'
            variant='h4'
            sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold' }}
          >
            Edit Profile
          </Typography>

          <Stack
            direction='row'
            pt={2}
            sx={{
              display: 'flex',

              justifyContent: 'space-between',
            }}
          >
            <FormControl sx={{ width: '40ch' }}>
              <TextField
                id='outlined-basic'
                label='First Name'
                value={firstName}
                inputProps={{
                  defaultValue: `${memberObject.first_name}`,
                }}
                variant='outlined'
                onChange={e => setFirstName(e.target.value)}
              />
            </FormControl>
            <FormControl sx={{ width: '40ch' }}>
              <TextField
                id='outlined-basic'
                label='Last Name'
                value={lastName}
                inputProps={{
                  defaultValue: `${memberObject.last_name}`,
                }}
                variant='outlined'
                onChange={e => setLastName(e.target.value)}
              />
            </FormControl>
          </Stack>

          <Stack
            direction='row'
            pt={2}
            sx={{
              display: 'flex',

              justifyContent: 'space-between',
            }}
          >
            <FormControl sx={{ width: '25ch' }}>
              <InputLabel id='demo-simple-select-label'>User Type</InputLabel>
              <Select
                htmlFor='weapon_arming'
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={userType}
                label='User Type'
                onChange={e => setUserType(e.target.value)}
              >
                <MenuItem value={true}>Admin</MenuItem>
                <MenuItem value={false}>User</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ width: '25ch' }}>
              <InputLabel id='demo-simple-select-label'>Rank</InputLabel>
              <Select
                htmlFor='rank'
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={rank}
                label='Rank'
                onChange={e => setRank(e.target.value)}
              >
                <MenuItem value={'e1'}>AB</MenuItem>
                <MenuItem value={'e2'}>AMN</MenuItem>
                <MenuItem value={'e3'}>A1C</MenuItem>
                <MenuItem value={'e4'}>SrA</MenuItem>
                <MenuItem value={'e5'}>SSgt</MenuItem>
                <MenuItem value={'e6'}>TSgt</MenuItem>
                <MenuItem value={'e7'}>MSgt</MenuItem>
                <MenuItem value={'e8'}>SMSgt</MenuItem>
                <MenuItem value={'e9'}>CMSgt</MenuItem>
                <MenuItem value={'o1'}>1LT</MenuItem>
                <MenuItem value={'o2'}>2LT</MenuItem>
                <MenuItem value={'o3'}>Capt</MenuItem>
                <MenuItem value={'o4'}>Major</MenuItem>
                <MenuItem value={'o5'}>Lt. Col</MenuItem>
                <MenuItem value={'o6'}>Colonel</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ width: '25ch' }}>
              <InputLabel id='demo-simple-select-label'>Arm Status</InputLabel>
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={status}
                label='Arm'
                sx={{ mb: 2 }}
                onChange={e => setStatus(e.target.value)}
              >
                <MenuItem value={true}>Arm 🟢</MenuItem>
                <MenuItem value={false}>Do Not Arm🔴</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <Stack
            direction='row'
            pt={2}
            sx={{
              display: 'flex',

              justifyContent: 'space-between',
            }}
          >
            <FormControl sx={{ width: '40ch' }}>
              <InputLabel id='demo-simple-select-label'>
                Certifications
              </InputLabel>
              <Select
                htmlFor='cert_id'
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={cert}
                label='Certifications'
                onChange={e => setCert(e.target.value)}
              >
                <MenuItem value={null}></MenuItem>
                <MenuItem value={1}>Entry Controller</MenuItem>
                <MenuItem value={2}>Patrol</MenuItem>
                <MenuItem value={3}>Desk Sergeant</MenuItem>
                <MenuItem value={4}>Flight Sergreant</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ width: '40ch' }}>
              <InputLabel id='demo-multiple-checkbox-label'>Tag</InputLabel>
              <Select
                labelId='demo-multiple-checkbox-label'
                id='demo-multiple-checkbox'
                multiple
                value={weaponArr.map(weap => weap.weapon)}
                // onChange={handleChange}
                // onClick={handleChange}
                input={<OutlinedInput label='Tag' />}
                renderValue={selected => selected.join(', ')}
                MenuProps={MenuProps}
              >
                {allWeapons.map((weaponObject, index) => (
                  <MenuItem
                    id={weaponObject.id}
                    key={index}
                    value={weaponObject.id}
                  >
                    <Checkbox
                      onChange={handleChange}
                      defaultChecked={weaponArr.some(
                        wep => wep.id === weaponObject.id
                      )}
                      // checked={weapon.some(
                      //   wep => wep.weapon_id === weaponObject.id
                      // )}

                      // make seperate component
                    />
                    <ListItemText primary={weaponObject.weapon} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Stack
            Stack
            direction='row'
            pt={2}
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            <TextField
              id='outlined-textarea'
              label='Notes'
              variant='outlined'
              fullWidth
              multiline
              rows={4}
              value={notes}
              sx={{ mb: 2 }}
              inputProps={{
                defaultValue: `${memberObject.notes}`,
              }}
              onChange={e => setNotes(e.target.value)}
            />
          </Stack>

          <Stack
            direction='row'
            mt={3}
            sx={{
              borderRadius: '30px',
              display: 'flex',
              justifyContent: 'right',
            }}
          >
            <Button
              onClick={() => handleEdit()}
              color='secondary'
              variant='contained'
              sx={{ borderRadius: '30px' }}
            >
              Save Profile
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default IndividualMember;
