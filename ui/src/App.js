import React, { useState, useEffect, useMemo } from 'react';
import Home from './Components/Home.js';
import { MemberDetails } from './Components/MembersDetail.js';
import { Settings } from './Components/Settings.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MemberContext } from './Components/MemberContext.js';
import PersistentDrawerLeft from './Components/Navbar.jsx';
import { DataSources } from './Components/DataSources.js';
import IndividualMember from './Components/InvidualMember.js';
import SignIn from './Components/SignIn.jsx';
import SignUp from './Components/SignUp';
import { useCookies } from 'react-cookie';
import { Footer } from './Components/Footer.jsx';
// import { Training } from './Components/Training';
// import { Chat } from './Components/Chat';
// import { LeaveWeb } from './Components/LeaveWeb';
import { Weather } from './Components/Weather';
import { Calendar } from './Features/Calendar';
import { ThemeProvider, createTheme } from '@mui/material/';
import CssBaseline from '@mui/material/CssBaseline';

const App = () => {
  const [data, setData] = useState([]);
  const [member, setMember] = useState([]);
  const [usersArray, setUsersArray] = useState([]);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [toggleAlert, setToggleAlert] = useState(false); //for alerts
  const [allWeapons, setAllWeapons] = useState([]);
  const [allFlights, setAllFlights] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(['auth', 'user']);
  const [userAccount, setUserAccount] = useState(null);
  const [color, setColor] = useState('gray');
  const [page, setPage] = useState(0);
  const [darkMode, setDarkMode] = useState('light');

  const API = 'http://localhost:8080';
  // const API = 'https://api.cyberhelm.com';

  useMemo(() => {
    if (cookies.user) {
      setUserAccount(cookies.user);
    }
  }, [cookies]);

  useEffect(() => {
    fetch(`${API}/users`, {
      method: 'GET',
    })
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.log(err));
  }, [API, triggerFetch]);

  useEffect(() => {
    fetch(`${API}/allweapons`, {
      method: 'GET',
    })
      .then(res => res.json())
      .then(data => setAllWeapons(data))
      .catch(err => console.log(err));
  }, [API]);

  useEffect(() => {
    fetch(`${API}/flight`, {
      method: 'GET',
    })
      .then(res => res.json())
      .then(data => setAllFlights(data))
      .catch(err => console.log(err));
  }, [API]);

  const theme = createTheme({
    palette: {
      primary: {
        main: '#212121',
      },
      secondary: {
        main: '#BD5334',
      },
      info: {
        main: '#6D7AE5',
        light: '#8f95c3',
      },
      background: {
        default: darkMode === 'light' ? '#FAFAFF' : '#303030',
      },
      mode: darkMode,
    },
  });

  const obj = {
    data,
    setData,
    member,
    setMember,
    API,
    usersArray,
    setUsersArray,
    triggerFetch,
    setTriggerFetch,
    allWeapons,
    toggleAlert,
    setToggleAlert,
    cookies,
    setCookie,
    removeCookie,
    userAccount,
    setUserAccount,
    allFlights,
    color,
    setColor,
    page,
    setPage,
    darkMode,
    setDarkMode,
  };

  return (
    <MemberContext.Provider value={obj}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          {userAccount !== null ? (
            <>
              <PersistentDrawerLeft />
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/date/:urlDate' element={<Home />} />
                <Route path='/sfmembers' element={<MemberDetails />} />
                <Route
                  path='/sfmembers/:memberId'
                  element={<IndividualMember />}
                />
                <Route path='/calendar' element={<Calendar />} />
                <Route path='/weather' element={<Weather />} />
                <Route path='*' element={<Home />} />
                {userAccount.admin ? (
                  <>
                    <Route path='/data' element={<DataSources />} />
                    <Route path='/settings' element={<Settings />} />
                  </>
                ) : null}
              </Routes>
              <Footer />
            </>
          ) : (
            <Routes>
              <Route path='/login' element={<SignIn />} />
              <Route path='/signup' element={<SignUp />} />
              <Route path='*' element={<SignIn />} />
            </Routes>
          )}
        </Router>
      </ThemeProvider>
    </MemberContext.Provider>
  );
};

export default App;
