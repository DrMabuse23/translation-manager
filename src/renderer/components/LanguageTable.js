'use strict';
import React from 'react';
import shell from 'shell';
import {Table, Column} from 'fixed-data-table';
import update from 'react-addons-update';
import mui from 'material-ui';
import ipc from 'ipc';
class EditableTextArea extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      value: this.props.value
    }
  }
  _handleChange(event) {
    console.log();
    this.setState({value: event.target.value});
  }
  _handleBlurred(){
    this.props.onBlur(this.state.value, this.props.index, this.props.indexData);
  }
  render(){
    return <textarea
      className="editArea"
      key={`area-${this.props.index}-${this.props.indexData}`}
      ref={`${this.props.index}-${this.props.indexData}`}
      value={this.state.value}
      onBlur={this._handleBlurred.bind(this)}
      onChange={this._handleChange.bind(this)}
    ></textarea>;
  }
}
export class LanguageTable extends React.Component {
  constructor(props) {
    super(props);
    this.addEventListener();
    this.rawRows = [];
    this.state = {
      rows: [],
      cells: [],
      dialogActions: [
        <mui.FlatButton
          label="Cancel"
          secondary={true}
          onClick={this._handleCustomDialogCancel.bind(this)} />,
        <mui.FlatButton
          label="Submit"
          primary={true}
          onClick={this._handleCustomDialogSubmit.bind(this)} />
      ]
    };

  }
  _handleCustomDialogCancel() {
    console.log('this.refs cancel', this.refs);
    this.refs.addKey.dismiss();
  }
  _handleCustomDialogSubmit() {
    let res = [];
    if (this.refs.fieldKey.getValue() !== '') {
      res.push(this.refs.fieldKey.getValue());
    }
    this.state.cells.forEach((cell) => {
      res.push(this.refs[`field${cell}`].getValue());
    });
    this.rawRows.unshift(res);
    this.setState({ rows: this.rawRows.sort() });
    this._handleCustomDialogCancel();
  }

  _handleChangeTextArea(value, index, indexData) {
    console.log(value, index, indexData);
    //this.state.rows[index][indexData] = value;
    //this.setState({rows: this.state.rows});
  }

  columnRender(value, index, row, indexData) {
    console.log(value, index, row, indexData);
    return <EditableTextArea value={value} index={index} indexData={indexData} onBlur={this._handleChangeTextArea.bind(this)} />;
  }

  rowGetter(rowIndex) {
    return this.state.rows[rowIndex];
  }

  addEventListener() {
    var self = this;
    ipc.on('open-files', function (rows) {
      self.rawRows = rows[1].sort();
      self.setState({rows: self.rawRows, cells: rows[0]});
    });
  }

  logData() {
    console.log(this.state.rows);
  }

  openFiles() {
    ipc.send('show-file-dialog');
  }

  openDialog() {
    console.log('this.refs', this.refs);
    this.refs.addKey.show();
  }

  render() {
    let controlledScrolling =
      this.state.left !== undefined || this.state.top !== undefined;
    let self = this;

    return (
      <section className="tile-grid">
        <article className="left">
          <mui.List>
            <mui.ListItem primaryText="Open Files" onClick={this.openFiles.bind(this)}/>
            <mui.ListItem
              primaryText="Add Key" style={{opacity: this.state.rows.length>0 ? 1: 0.6}}
              disabled={this.state.rows.length>0 ? false : true}
              onClick={ this.openDialog.bind(this) }
            />
            <mui.ListItem primaryText="Sent mail"/>
            <mui.ListItem primaryText="Drafts"/>
            <mui.ListItem primaryText="Inbox"/>
          </mui.List>
          <mui.ListDivider />
        </article>
        <article className="right">
          <Table
            rowHeight={50}
            rowGetter={this.rowGetter.bind(this)}
            rowsCount={this.state.rows.length}
            width={960}
            height={ 600}
            key={`table-${this.state.rows.length}`}
            headerHeight={ 50}
          >
            <Column
              cellRenderer={this.columnRender.bind(this)}
              fixed={true}
              label="key"
              width={300}
              dataKey={ 0}
            />
            { self.state.cells.map((result, index) => {
              var key = index + 1;
              return <Column
                cellRenderer={self.columnRender.bind(self)}
                label={result}
                width={ 100}
                minWidth={70}
                maxWidth={170}
                minHeight={ 200}
                maxHeight={400}
                flexGrow={4}
                dataKey={ key }
              />
            }) }
            </Table>
              <mui.Dialog
                title="Add a new Key"
                actionFocus="submit"
                ref="addKey"
                actions={self.state.dialogActions}
                modal={true}>
                <mui.List>
                  <mui.ListItem key={`item-key`}>
                    <mui.TextField
                      hintText="Key"
                      key="key"
                      ref="fieldKey"
                      style={{width: '100%'}}
                      required={true}
                      floatingLabelText="Add new Key *"/>
                  </mui.ListItem>
                  { self.state.cells.map((cell) => {
                    return (
                      <mui.ListItem key={`item-${cell}`}>
                        <mui.TextField
                          key={`field${cell}`}
                          multiline={true}
                          style={{width: '100%'}}
                          ref={`field${cell}`}
                          floatingLabelText={`Add Value for ${cell} (optional)`}
                        />
                      </mui.ListItem>
                    )
                  })}
                </mui.List>
              </mui.Dialog>
        </article>
      </section>
    );
  }
}
