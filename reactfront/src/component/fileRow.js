import React, { Component } from 'react';
import {Image, Button} from 'react-bootstrap';
var path = require('path');
var filePic = require('../pic/file.jpg');
var folderPic = require('../pic/folder.jpeg');

class FileRow extends Component{
  render(){
    const fileMeta = this.props.fileMeta
    var newPath = path.join(this.props.currentDir, this.props.fileMeta.fileName);
    var scpToOptions = {fromPath: newPath}
    var downloadURL='http://9.30.97.77:10010/v1/download'+ newPath;
    return(
      <tr key={this.props.ikey} height='50px'>      
        {fileMeta.isDirectory ?  
          <td name='filename' width='30px'> 
            <Button onClick={() => this.props.fetchFileList(newPath)} onTouchEndCapture={()=> this.props.fetchFileList(newPath)}>
              <Image src={folderPic} height='40' width='40' alt='folder'/> {this.props.fileMeta.fileName} 
            </Button>
          </td> :
          <td name='filename' width='100px'> 
            <Image src={filePic} height='40' width='40' alt='file'/> {this.props.fileMeta.fileName}
          </td>}
        <td name='size' width='60px'> {fileMeta.size}</td>
        <td name='buttonscp' width='20px'>
            {fileMeta.fileName!=='..'&&<Button bsSize="large"  bsStyle="info" onClick={() => this.props.openScpToModal(scpToOptions)}> SCP </Button>}
        </td>
        <td name='buttondownload' width='20px'>
            {fileMeta.fileName!=='..'&& <Button bsSize="large" bsStyle="info" href={downloadURL} disabled={fileMeta.isDirectory}> Download </Button>}
        </td>
      </tr>
    );
  }
}

export default FileRow;