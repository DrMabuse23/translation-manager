'use strict';
import React from 'react';
import {LanguageTable} from './LanguageTable';
import { Router, Route, Link } from 'react-router'
import {OSX} from 'react-desktop';
import {
  TitleBar,
  PushButton,
  TextField,
  Toolbar,
  Box,
  SegmentedControl,
  IndeterminateCircularProgressIndicator,
  Form,
  Label,
  Window
} from 'react-desktop';
export class Main extends React.Component {
  constructor () {
    super();
  }
  render () {
    return(
    <Window
        chrome
        style={{width: '1000px', height: '600px'}}
      >
         <Box className="box">
          <LanguageTable></LanguageTable>
          </Box>
      </Window>
    );
  }
}
