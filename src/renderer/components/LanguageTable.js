'use strict';
import React from 'react';
import shell from 'shell';
import {Table, Column} from 'fixed-data-table';
import update from 'react-addons-update';

export class LanguageTable extends React.Component {
  constructor () {
    super();
    this.addEventListener();
    this.state = {
      rows: [],
      cells:[]
    };
  }

  handleChange(event) {
    this[0].state.rows[this[4]][this[2]] = event.target.value;
    this[0].setState({rows: this[0].state.rows});
  }
  columnRender(value, index, row, indexData){
    return <textarea className="editArea" value={this.state.rows[indexData][index]} onChange={this.handleChange.bind([this, value, index, row, indexData])}></textarea>;
  }
  rowGetter(rowIndex) {
    return this.state.rows[rowIndex];
  }
  addEventListener(){
    var self = this;
    require('ipc').on('open-files', function(rows) {
      self.setState({ rows: rows[1], cells: rows[0] });
    });
  }
  logData(){
    console.log(this.state.rows);
  }
  render() {
    var self = this;
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
            label="key"
            width={100}
            dataKey = { 0}
            />
            { self.state.cells.map((result, index) => {
               return <Column
                cellRenderer={self.columnRender.bind(self)}
                label={result}
                width = { 100}
                flexGrow={4}
                dataKey={index+1}
              />
            }) }
          </Table>
      );
    }
    return(
      <div>Adden Sie zuerst ein Projekt Menu => Projekt => Open Files</div>
    );
  }
}
