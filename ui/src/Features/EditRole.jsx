import React, { useContext, useState } from 'react';
import { MemberContext } from '../Components/MemberContext';
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  InputLabel,
  MenuItem,
  Stack,
  FormControl,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import OutlinedInput from '@mui/material/OutlinedInput';
import ListItemText from '@mui/material/ListItemText';

export const EditRole = () => {
  return (
    <>
      <Button
        color={'secondary'}
        variant='outlined'
        sx={{ borderRadius: '50px', width: 250, mt: 4 }}
        onClick={''}
      >
        Add Role
      </Button>
    </>
  );
};
