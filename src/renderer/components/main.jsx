'use strict';
import React from 'react';
import {LanguageTable} from './LanguageTable';
import { Router, Route, Link } from 'react-router';
import mui from 'material-ui';
export class Main extends React.Component {
  constructor () {
    super();
  }
  render () {
    return(
      <LanguageTable></LanguageTable>
    );
  }
}
