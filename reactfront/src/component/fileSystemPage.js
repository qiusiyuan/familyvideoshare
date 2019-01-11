import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import {Navbar, Nav, Button, NavItem, Table, Modal} from 'react-bootstrap';
import FileRow from './fileRow';

const hostIp = "http://192.168.0.18:10010"
class FileSystemPage extends Component {
  constructor(){
    super();
    this.state = {
      refreshInterval: 10*1000,
      currentDir: '',
      fileList : [],
      homeDir: '',
    };
    this.fetchFileList = this.fetchFileList.bind(this);
    this.getHomeDir = this.getHomeDir.bind(this);
    this.launchPlayer = this.launchPlayer.bind(this);
  }
  componentDidMount(){
    this.getHomeDir();
  }
  componentWillUnmount() {

  }
  getHomeDir(){
    axios.get(`${hostIp}/listPath/home`)
    .then(res => {
      const fileList = _.orderBy(res.data.files,['isDirectory'],['desc', 'asc']);
      this.setState({
        fileList: fileList, 
        homeDir: res.data.currentDirectory,
        currentDir: res.data.currentDirectory});
    })
    .catch(error =>{
      console.log("error in init")
    });
  }
  fetchFileList(fullPath){
    axios.get(`${hostIp}/listPath/${encodeURIComponent(fullPath)}`)
    .then(res => {
    const fileList = _.orderBy(res.data.files,['isDirectory'],['desc', 'asc']);
    this.setState({ fileList: fileList,
                    currentDir: res.data.currentDirectory});
    })
    .catch(error =>{
      console.log("error in init")
    });
  }
  launchPlayer(fullPath){
    var url = `#/video/${encodeURIComponent(fullPath)}`
    window.open(url);
  }
  render(){
    let that=this;
    return(
      <div>
        <div id='homeBar' style={{color:'blue', height:'20px', margin:'50px'}}>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <Button bsStyle="primary" onClick={this.getHomeDir}> Home </Button>  
            </Navbar.Brand>
          </Navbar.Header>
          <Nav>
            <NavItem> {this.state.currentDir} </NavItem>
          </Nav>
        </Navbar>  
        </div>
        <div id='fslist'>  
          <Table condensed hover>
          <thead>
            <tr>
              <th></th>
              <th>Size</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.currentDir!==this.state.homeDir&&<FileRow
                    fileMeta={{fileName:'..', isDirectory:true}}
                    ikey={0}
                    fetchFileList={that.fetchFileList}
                    currentDir={that.state.currentDir}
                  />
            }
            {this.state.fileList.map(function(file,i){
              return (<FileRow
                        fileMeta={file}
                        ikey={i}
                        fetchFileList={that.fetchFileList}
                        currentDir={that.state.currentDir}
                        launchPlayer={that.launchPlayer}
                      />);
            })}
          </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

export default FileSystemPage;
