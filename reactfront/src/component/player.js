import React, { Component } from 'react';

const hostIp = "http://192.168.0.18:10010";
class Player extends Component {
  render(){
    var videoPath = this.props.params.path
    return(
      <div>
        <video controls width="100%" height="100%">
          <source src={`${hostIp}/video/${encodeURIComponent(videoPath)}`} type="video/mp4"/>
        </video>
      </div>
    );
  }
}
export default Player;