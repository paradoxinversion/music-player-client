import React from "react";
import axios from "axios";
import connect from "unstated-connect";
import AppContainer from "./containers/AppContainer";
import Icon from "@mdi/react";

import { mdiPlay, mdiPause, mdiStop } from "@mdi/js";
class MusicPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      audioBuffer: null,
      audioContext: null,
      source: null,
      startedAt: null,
      pausedAt: null,
      playing: false,
      currentTrack: ""
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.track !== prevProps.track) {
      if (this.state.source) this.stopTrack();
      this.playTrack(0);
    }
  }

  getAudioContext() {
    AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContent = new AudioContext();
    return audioContent;
  }

  async getAudioTrack() {
    const [AppContainer] = this.props.containers;
    const response = await axios.get(
      `http://localhost:3001/api/v1/track?trackName=${AppContainer.state.selectedTrack}`,
      {
        responseType: "arraybuffer"
      }
    );
    return response;
  }

  async createAudioSource(trackData) {
    const audioContext = this.getAudioContext();
    const audioBuffer = await audioContext.decodeAudioData(trackData);
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    this.setState({
      audioBuffer,
      audioContext,
      source
    });
    return { source, audioBuffer, audioContext };
  }

  clearTrackInformation() {
    this.setState({
      audioBuffer: null,
      audioContext: null,
      source: null
    });
  }

  playTrack = async startTime => {
    this.clearTrackInformation();
    const response = await this.getAudioTrack();
    const { audioBuffer, audioContext, source } = await this.createAudioSource(
      response.data
    );
    source.start(0, startTime);
    this.setState({
      startedAt: Date.now(),
      playing: true
    });
  };

  stopTrack = () => {
    this.state.source.stop();
    this.clearTrackInformation();
    this.setState({
      playing: false
    });
  };

  pauseTrack = () => {
    this.state.source.stop();
    this.clearTrackInformation();
    this.setState({
      pausedAt: Date.now() - this.state.startedAt,
      playing: false
    });
  };

  resumeTrack = () => {
    this.playTrack(this.state.pausedAt / 1000);
  };

  render() {
    const [AppContainer] = this.props.containers;
    const { selectedTrack } = AppContainer.state;
    return (
      <section id="music-player">
        <div id="now-playing">
          {selectedTrack ? (
            <React.Fragment>
              <span>Now Playing: </span>
              <span>{AppContainer.state.selectedTrack}</span>
            </React.Fragment>
          ) : (
            <span>Select a Track</span>
          )}
        </div>
        {selectedTrack && (
          <section id="track-controls">
            {this.state.playing ? (
              <button className="button--icon" onClick={this.pauseTrack}>
                <Icon path={mdiPause} title="Pause" size={1} color="white" />
              </button>
            ) : (
              <button className="button--icon" onClick={this.resumeTrack}>
                {" "}
                <Icon path={mdiPlay} title="Resume" size={1} color="white" />
              </button>
            )}
            <button className="button--icon" onClick={this.stopTrack}>
              <Icon path={mdiStop} title="Resume" size={1} color="white" />
            </button>
          </section>
        )}
      </section>
    );
  }
}

export default connect([AppContainer])(MusicPlayer);
