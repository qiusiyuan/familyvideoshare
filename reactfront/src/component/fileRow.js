import React, { Component } from 'react';
import {Image, Button} from 'react-bootstrap';
var path = require('path');
var filePic = require('../pic/file.jpg');
var folderPic = require('../pic/folder.jpeg');

const hostIp = "http://192.168.0.18:10010"
class FileRow extends Component{
  render(){
    const fileMeta = this.props.fileMeta
    var newPath = path.join(this.props.currentDir, this.props.fileMeta.fileName);
    return(
      <tr key={this.props.ikey} height='50px'>      
        {fileMeta.isDirectory ?  
          <td name='filename' width='30px'> 
            <Button onClick={() => this.props.fetchFileList(newPath)} onTouchEndCapture={()=> this.props.fetchFileList(newPath)}>
              <Image src={folderPic} height='40' width='40' alt='folder'/> {this.props.fileMeta.fileName} 
            </Button>
          </td> :
          <td name='filename' width="40%" > 
            {fileMeta.fileName.toLowerCase().endsWith(".mp4") ? <Image src={`${hostIp}/icon`} height='70' width='60' alt='video'/>:<Image src={filePic} height='40' width='40' alt='file'/>} {this.props.fileMeta.fileName}
          </td>}
        <td name='size'> {fileMeta.size}</td>
        <td name='buttonscp' width='20px'>
            {fileMeta.fileName.toLowerCase().endsWith(".mp4") &&<Button bsSize="large"  bsStyle="info" onClick={()=> this.props.launchPlayer(newPath)}> view </Button>}
        </td>
      </tr>
    );
  }
}

export default FileRow;