'use strict';
import React from 'react';
import shell from 'shell';
import {Table, Column} from 'fixed-data-table';
import update from 'react-addons-update';

export class LanguageTable extends React.Component {
  state = {
    message: 'Hello, Electron'
  }
  constructor () {
    super();
    this.addEventListener();
    this.state = {
      rows: []
    };
  }
  componentWillMount(){
    this.setState({'rows': [
      ['Hallo', 'Hallo', 'Hello'],
      ['a2', 'b2', 'c2'],
      ['a3', 'b3', 'c3']
    ]});
  }
  handleChange(event) {
    console.log(this);
    this[0].state.rows[this[4]][this[2]] = event.target.value;
    this[0].setState({rows: this[0].state.rows});
  }
  columnRender(value, index, row, indexData){
    //console.log(value, index, row, indexData);
    [value, index, row, indexData]
    return (<div>
    <button onClick={() => console.log(this.state.rows)}></button><textarea style={{width: 100%}}type="text" value={this.state.rows[indexData][index]} onChange={this.handleChange.bind([this, value, index, row, indexData])} ></textarea></div>);
  }
  rowGetter(rowIndex) {
    return this.state.rows[rowIndex];
  }

  addEventListener(){
    var self = this;
    require('ipc').on('open-files', function(rows) {
      console.log(rows);
      self.setState({ rows: rows[1] });
    });
  }
  logData(){
    console.log(this.state.rows);
  }
  render() {
    if (this.state.rows.length > 0) {
      return (

        <Table
          rowHeight={50}
          rowGetter={this.rowGetter.bind(this)}
          rowsCount={this.state.rows.length}
          width={960}
          height={550}
          headerHeight={50}>
          <Column
            cellRenderer={this.columnRender.bind(this)}
            fixed={true}
            label="Key"
            width={100}
            dataKey={0}
          />
          <Column
            cellRenderer={this.columnRender.bind(this)}
            label="EN"
            width={100}
            flexGrow={2}
            dataKey={1}
          />
          <Column
            cellRenderer={this.columnRender.bind(this)}
            label="DE"
            width={100}
            flexGrow={2}
            dataKey={2}
          />
            </Table>
      );
    }
    return(
      <div>Adden Sie zuerst ein Projekt Menu => Projekt => Open Files</div>
    );
  }
}
