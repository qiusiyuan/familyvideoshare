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
      modalStatus:'none', // 'none' -> 'set' -> 'sent' -> 'result'
      modalTitleMessage:'',
      scpUser:'root',
      scpPassword: 'Good4now!',
      scpIp:'',
      remotePath: '',
      scpFromPath:'',
      modalMessage:'',
    };
    this.fetchFileList = this.fetchFileList.bind(this);
    this.getHomeDir = this.getHomeDir.bind(this);
    this.scpFileTo = this.scpFileTo.bind(this);
    this.changeScpUser = this.changeScpUser.bind(this);
    this.changeScpPassword = this.changeScpPassword.bind(this);
    this.changeScpIp = this.changeScpIp.bind(this);
    this.changeRemotePath = this.changeRemotePath.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.openScpToModal = this.openScpToModal.bind(this);
    this.validateForm = this.validateForm.bind(this);
  }
  componentDidMount(){
    this.getHomeDir();
  }
  componentWillUnmount() {

  }
  getHomeDir(){
    axios.get(`${hostIp}/listPath/home`)
    .then(res => {
      console.log(res);
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
  scpFileTo(){
    this.setState({
      modalStatus: 'sent',
      modalTitleMessage: `Transporting ...`
    });
    const config = {
      "fromPath": this.state.scpFromPath,
      "toPath": this.state.remotePath,
      "user": this.state.scpUser,
      "password":this.state.scpPassword,
      "clusterIp": this.state.scpIp
    };
    axios.post(`${hostIp}/v1/scpTo`, config)
    .then(res =>{
      this.setState({
        modalStatus:'result',
      })
      if(res.data.success){
        this.setState({
          modalTitleMessage: "Succeed!",
          modalMessage: res.data.message,
        })
      }
      else{
        this.setState({
          modalTitleMessage: "Failed!",
          modalMessage: res.data.message,
        })
      }
    })
    .catch(error =>{
      console.log(error.message);
      this.setState({
        modalStatus:'result',
        modalTitleMessage: "Failed!",
        modalMessage: error.message,
      });
    });
  }
  openModal(){
    this.setState({
      modalStatus:'set',
    });
  }
  openScpToModal(options){
    this.openModal()
    this.setState({
      modalTitleMessage: `SCP ${options.fromPath} To:`,
      scpFromPath: options.fromPath
    });
  }
  changeScpUser(e){
    this.setState({ scpUser: e.target.value });
  }
  changeScpPassword(e){
    this.setState({ scpPassword: e.target.value });
  }
  changeScpIp(e){
    this.setState({ scpIp: e.target.value });
  }
  changeRemotePath(e){
    this.setState({ remotePath: e.target.value });
  }
  closeModal(){
    this.setState({
      scpUser: 'root',
      scpPassword: 'Good4now!',
      scpIp:'',
      remotePath: '',
      modalStatus: 'none',
      scpFromPath:'',
      modalMessage:'',
    })
  }
  validateForm(){
    return !(this.state.scpUser&&this.state.scpPassword&&
      this.state.scpIp&&this.state.remotePath&&this.state.scpFromPath);
  }
  render(){
    let that=this;
    return(
      <div>
        <Modal show={this.state.modalStatus!=='none'}>
          <Modal.Header>
            <Modal.Title>{this.state.modalTitleMessage}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {this.state.modalStatus==='sent'&& <div>
            <p> Transporting </p>
            <p> {this.state.scpFromPath}</p>
            <p> to </p>
            <p>{`${this.state.scpUser}@${this.state.scpIp}:${this.state.remotePath}`}</p>
            </div>}
            {this.state.modalStatus==='result'&&<div>
              <p>{this.state.modalMessage}</p>
            </div>}
          </Modal.Body>

          <Modal.Footer>
            {this.state.modalStatus==='set'&&<Button onClick={that.closeModal}>Cancel</Button>}
            {this.state.modalStatus==='set' &&<Button bsStyle="primary" onClick={that.scpFileTo} disabled={that.validateForm()}>Start</Button>}
            {['sent','result'].indexOf(this.state.modalStatus)>-1&& <Button bsStyle="primary" onClick={that.closeModal} disabled={this.state.modalStatus!=='result'}>Close</Button>}
          </Modal.Footer>
        </Modal>
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
                        openScpToModal={that.openScpToModal}
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
