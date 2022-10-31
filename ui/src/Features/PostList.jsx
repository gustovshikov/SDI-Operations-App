import React, { useState, useContext, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import {
  Button,
  Divider,
  Chip,
  Alert,
  Fade,
  TextField,
  Avatar,
} from '@mui/material/';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { MemberContext } from '../Components/MemberContext';
import PostMemberModal from './AddMember';
import EditSchedule from './EditSchedule';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import SecurityIcon from '@mui/icons-material/Security';
import { WeaponQuals } from './WeaponQuals';
import { useNavigate } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

export default function CollapsibleTable() {
  const { API, toggleAlert, setToggleAlert, userAccount } =
    useContext(MemberContext);
  const [positions, setPositions] = useState({});
  const [schedule, setSchedule] = useState([]);
  const [shift, setShift] = useState('Days');
  const [schedDate, setSchedDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [dateRange, setDateRange] = useState([]);
  const [postsAssigned, setPostsAssigned] = useState(0);
  const [finalizedIcon, setFinalizedIcon] = useState(<HighlightOffIcon />);
  // let currentDate = new Date().toISOString().split('T')[0];

  let dateEnd = new Date();
  dateEnd = new Date(dateEnd.setDate(dateEnd.getDate() + 7))
    .toISOString()
    .split('T')[0];

  // console.log('todays date, date end', currentDate, dateEnd);

  const fetchPosts = () => {
    //console.log('fetching positions');
    fetch(`${API}/position`, {
      method: 'GET',
      // credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
    })
      .then(res => {
        // console.log(res.status);
        return res.json();
      })
      .then(data => {
        // console.log(data);
        setPositions(data);
      })
      .catch(err => {
        console.log('error: ', err);
      });
  };

  const fetchSchedule = () => {
    //console.log('fetching schedule');
    let fetchDate = schedDate.toISOString().split('T')[0];
    fetch(`${API}/schedule/date`, {
      method: 'POST',
      // credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      body: JSON.stringify({ date: fetchDate, dateEnd: dateEnd }),
    })
      .then(res => {
        // console.log(res.status);
        return res.json();
      })
      .then(data => {
        // console.log(data);
        setSchedule(data);
      })
      .catch(err => {
        console.log('error: ', err);
      });
  };

  const delSchedule = id => {
    //console.log(`deleting schedule ${id}`);
    fetch(`${API}/schedule/${id}`, {
      method: 'DELETE',
      // credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
    })
      .then(res => {
        // console.log(res.status);
        return res.json();
      })
      .then(data => {
        // console.log(data);
        fetchSchedule();
      })
      .catch(err => {
        console.log('error: ', err);
      });
  };

  useEffect(() => {
    fetchSchedule();
    fetchPosts();
  }, [schedDate]);

  const PostList = (
    name,
    man_req,
    weapon_req,
    cert_req,
    users,
    post_id,
    fetchSchedule,
    delSchedule,
    currentDate,
    shift
  ) => {
    let weapons = weapon_req.map(weapon => weapon.weapon);
    weapons = weapons.join(' ');
    let cert = cert_req;

    return {
      name,
      man_req,
      weapons,
      cert,
      users,
      post_id,
      fetchSchedule,
      delSchedule,
      currentDate,
      shift,
    };
  };

  const rows = useMemo(() => {
    let numberOfAssigned = 0;
    let row = [];
    let shiftTime;
    if (shift === 'Days') shiftTime = '06:00:00';
    if (shift === 'Mids') shiftTime = '18:00:00';

    if (positions.length > 0) {
      row = positions.map(position => {
        // figure out personnel position and push to postlist generation
        // console.log('selectedDate', selectedDate)

        // if (schedule[0] !== undefined)  console.log('schedule date', schedule[0].date)
        let filUsers = schedule.filter(
          sched =>
            sched.position_id === position.id &&
            sched.date.split('T')[0] ===
              schedDate.toISOString().split('T')[0] &&
            sched.time === shiftTime
        );
        // console.log(position.name)
        while (filUsers.length < position.man_req) {
          filUsers.push({ noUser: true });
        }

        let missingPosition = filUsers.some(user => user.noUser);
        console.log(missingPosition);
        if (!filUsers.some(user => user.noUser === true)) {
          console.log('no user test ++');
          numberOfAssigned = numberOfAssigned + 1;
        }
        setPostsAssigned(numberOfAssigned);

        // console.log('fil schedule', filUsers)
        return PostList(
          position.name,
          position.man_req,
          position.weapon_req,
          position.cert_req,
          filUsers,
          position.id,
          fetchSchedule,
          delSchedule,
          schedDate,
          shift
          // missingPosition
        );
      });
    }
    return row;
  }, [positions, schedule, schedDate, shift]);

  useMemo(() => {
    let dateRange2 = [];
    for (let i = 0; i < 7; i++) {
      let workingDate = new Date(startDate);
      //console.log('working date, i:', workingDate, i);
      let newDate = new Date(workingDate.setDate(workingDate.getDate() + i));
      //console.log('created date', newDate.toISOString());
      dateRange2.push(newDate);
    }
    setDateRange(dateRange2);
  }, [startDate]);

  useMemo(() => {
    setTimeout(() => {
      setToggleAlert(false);
    }, 3000);
  }, [toggleAlert]);

  const handleFinalize = () => {
    //console.log(userAccount.id);
    fetch(`${API}/notifications/${userAccount.id}`, {
      method: 'POST',
      // credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      //redirect: 'follow',
      body: JSON.stringify({
        name: 'New schedule posted',
        notes: 'Schedule finalized',
      }),
    })
      .then(res => {
        // console.log(res.status);
        return res.json();
      })
      .then(data => {
        // console.log(data);
        data;
      })
      .then(() => setFinalizedIcon(<CheckCircleOutlineIcon />))
      .catch(err => {
        console.log('error: ', err);
      });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <Fade in={toggleAlert} timeout={1000}>
        <Box
          sx={{
            width: '100vw',
            position: 'absolute',
            left: 0,
            top: '10vh',
          }}
        >
          <Alert severity='success' spacing={2} mb={2}>
            Airman has been successfully assigned to the post position.
          </Alert>
        </Box>
      </Fade>
      <Typography
        variant='h1'
        component='span'
        sx={
          // fontFamily":"Roboto",
          shift === 'Days'
            ? {
                color: '#ffa726',
                textShadow: '1px 1px 2px #454545',
              }
            : {
                color: '#7A8AFF',
                textShadow: '1px 1px 2px #454545',
              }
        }
      >
        {schedDate.toDateString()}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <TextField
          id='date'
          label='Start Date'
          type='date'
          defaultValue={startDate.toISOString().split('T')[0]}
          sx={{ width: 220, backgroundColor: 'white', cursor: 'pointer' }}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={e => {
            // console.log('target value: ', e.target.value);
            // let dateArr = e.target.value.split('-');
            // console.log('settign start date: ', dateArr);
            if (e.target.value === '') {
              setStartDate(new Date());
              e.target.value = new Date().toISOString().split('T')[0];
              setSchedDate(new Date(`${e.target.value}T00:00:00`));
            } else {
              setStartDate(new Date(`${e.target.value}T00:00:00`));
              setSchedDate(new Date(`${e.target.value}T00:00:00`));
            }
          }}
        />
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Typography variant='h5'>
            {postsAssigned}/{rows.length} Post Assigned
          </Typography>

          {postsAssigned === rows.length ? (
            <Button
              onClick={() => handleFinalize()}
              color='secondary'
              variant='contained'
              sx={{ borderRadius: '30px', ml: 3 }}
            >
              Finalize
            </Button>
          ) : null}
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Typography variant='h5'>{`Panama 12's `}</Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
        }}
      >
        {dateRange.map((date, index) => (
          <Paper key={index} elevation={5}>
            <Box
              sx={
                schedDate.toDateString() === date.toDateString()
                  ? {
                      display: 'flex',
                      flexWrap: 'wrap',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 2,
                      borderColor: shift === 'Days' ? '#ffa726 ' : '#6D7AE5',
                      borderRadius: 1,
                    }
                  : {
                      display: 'flex',
                      flexWrap: 'wrap',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }
              }
            >
              <Typography sx={{ px: 3, py: 2 }}>
                {date.toDateString()}
              </Typography>
              <Divider flexItem={true}>SHIFT</Divider>

              <Button
                fullWidth={true}
                color='warning'
                sx={
                  shift === 'Days' &&
                  schedDate.toDateString() === date.toDateString()
                    ? {
                        backgroundColor: 'rgba(229, 115, 115, 0.2)',
                        borderRadius: 0,
                      }
                    : { borderRadius: 0 }
                }
                onClick={() => {
                  setSchedDate(date);
                  setShift('Days');
                  fetchSchedule();
                }}
                endIcon={finalizedIcon}
              >
                Days
              </Button>

              <Button
                fullWidth={true}
                color='info'
                sx={
                  shift === 'Mids' &&
                  schedDate.toDateString() === date.toDateString()
                    ? {
                        backgroundColor: 'rgba(66, 135, 245, 0.2)',

                        borderRadius: 0,
                      }
                    : { borderRadius: 0 }
                }
                onClick={() => {
                  setSchedDate(date);
                  setShift('Mids');
                  fetchSchedule();
                }}
                endIcon={finalizedIcon}
              >
                Mids
              </Button>
            </Box>
          </Paper>
        ))}
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: 5,
          borderColor: shift === 'Days' ? '#ffa726' : '#6D7AE5',
        }}
      >
        <Table aria-label='collapsible table'>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell sx={{ fontWeight: 'bold' }}>Post</TableCell>
              <TableCell align='right' sx={{ fontWeight: 'bold' }}>
                Manning Requirements
              </TableCell>
              <TableCell align='center' sx={{ fontWeight: 'bold' }}>
                Weapon Requirements
              </TableCell>
              <TableCell align='right' sx={{ fontWeight: 'bold' }}>
                Certification Required
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <Row key={index} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

const Row = props => {
  const { row } = props;
  const [open, setOpen] = useState(false);
  const splitArr = row.weapons.split(' ');
  const { color } = useContext(MemberContext);
  const navigate = useNavigate();

  // console.log('this is the row ', row);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label='expand row'
            size='small'
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell component='th' scope='row'>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {row.name.charAt(0).toUpperCase() + row.name.slice(1)}
            {row.users.filter(user => user.noUser === true).length > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#BD5334;',
                  borderRadius: 20,
                  px: 0.5,
                  py: 0.5,
                  color: 'white',
                }}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-6 h-6'
                  style={{ width: 25 }}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M12
                  9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73
                  0 2.813-1.874 1.948-3.374L13.949
                  3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12
                  15.75h.007v.008H12v-.008z'
                  />
                </svg>
              </Box>
            )}
          </Box>
        </TableCell>
        <TableCell align='right'>{row.man_req}</TableCell>

        <TableCell align='right'>
          {splitArr.length > 3 ? (
            <Box
              sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}
            >
              <WeaponQuals weapon={splitArr} />
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                justifyContent: 'center',
                width: '100%',
                gap: 1,
              }}
            >
              {splitArr.map((wep, index) => (
                <Box key={index}>
                  <Chip
                    icon={<SecurityIcon />}
                    label={wep.toUpperCase()}
                    color='secondary'
                  />
                </Box>
              ))}
            </Box>
          )}
        </TableCell>

        <TableCell align='right'>
          <Chip
            icon={<WorkspacePremiumIcon />}
            label={row.cert.length > 0 ? row.cert[0].cert : null}
            color='success'
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography
                variant='h6'
                gutterBottom
                component='div'
              ></Typography>
              <Table size='small' aria-label='purchases'>
                <TableHead>
                  <TableRow>
                    <TableCell align='left' sx={{ fontWeight: 'bold' }}>
                      Posted
                    </TableCell>
                    <TableCell align='left' sx={{ fontWeight: 'bold' }}>
                      Members
                    </TableCell>
                    <TableCell align='right'> </TableCell>
                    <TableCell align='right'> </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.users.map((userRow, index) => (
                    <TableRow key={index}>
                      <TableCell component='th' scope='row'>
                        {!userRow.noUser ? (
                          <span>
                            <EditSchedule
                              role={index}
                              post={row.name}
                              weapon_req={row.weapons}
                              cert_req={row.cert}
                              post_id={row.post_id}
                              fetchSchedule={row.fetchSchedule}
                              currentDate={row.currentDate}
                              userRow={userRow}
                              delSchedule={row.delSchedule}
                              shift={row.shift}
                            />
                            {`${userRow.role}`}
                          </span>
                        ) : (
                          <PostMemberModal
                            role={index}
                            post={row.name}
                            weapon_req={row.weapons}
                            cert_req={row.cert}
                            post_id={row.post_id}
                            fetchSchedule={row.fetchSchedule}
                            currentDate={row.currentDate}
                            shift={row.shift}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {!userRow.noUser ? (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'start',
                              gap: 1,
                            }}
                          >
                            <Avatar
                              sx={{ cursor: 'pointer', bgcolor: color }}
                              src={userRow.user_info[0].avatar}
                              alt='avatar'
                              size='small'
                              onClick={() =>
                                navigate(
                                  `/sfmembers/${userRow.user_info[0].id}`
                                )
                              }
                            >
                              {userRow.user_info[0].first_name
                                ? userRow.user_info[0].first_name
                                    .charAt(0)
                                    .toUpperCase()
                                : null}
                              {userRow.user_info[0].last_name
                                ? userRow.user_info[0].last_name
                                    .charAt(0)
                                    .toUpperCase()
                                : null}
                            </Avatar>
                            {`${
                              userRow.user_info[0].first_name
                                .charAt(0)
                                .toUpperCase() +
                              userRow.user_info[0].first_name.slice(1)
                            } ${
                              userRow.user_info[0].last_name
                                .charAt(0)
                                .toUpperCase() +
                              userRow.user_info[0].last_name.slice(1)
                            }
                            `}
                          </Box>
                        ) : (
                          `No One Posted`
                        )}
                      </TableCell>
                      <TableCell align='right'>
                        {!userRow.noUser &&
                          `${userRow.user_info[0].weapons
                            .map(wep => `${wep.weapon.toUpperCase()}`)
                            .join(', ')}`}
                      </TableCell>
                      <TableCell align='right'>
                        {!userRow.noUser &&
                          `${userRow.user_info[0].certs[0].cert}`}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};
