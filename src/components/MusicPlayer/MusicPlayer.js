import React from "react";
import axios from "axios";
import connect from "unstated-connect";
import AppContainer from "../../containers/AppContainer";
import Icon from "@mdi/react";
import { mdiPlay, mdiPause, mdiStop, mdiLoading } from "@mdi/js";

class MusicPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startedAt: null,
      pausedAt: null,
      playing: false,
      currentTrack: ""
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.track !== prevProps.track) {
      this.playNewTrack();
    }
  }

  playTrack = async startTime => {
    const [AppContainer] = this.props.containers;
    if (!AppContainer.state.isTrackLoading) {
      AppContainer.clearTrackInformation();
      const response = await AppContainer.getAudioTrack();
      const { source } = await AppContainer.createAudioSource(response.data);
      source.start(0, startTime);
      this.setState({
        startedAt: Date.now(),
        playing: true
      });
    } else {
      console.log("A track is currently loading");
    }
  };

  /**
   * Stops the current track if one is playing,
   * starts a new track (from the app container)
   */
  playNewTrack = () => {
    const [AppContainer] = this.props.containers;
    if (AppContainer.state.source) this.stopTrack();
    this.playTrack(0);
  };

  stopTrack = () => {
    const [AppContainer] = this.props.containers;
    AppContainer.state.source.stop();
    AppContainer.clearTrackInformation();
    this.setState({
      playing: false
    });
  };

  pauseTrack = () => {
    const [AppContainer] = this.props.containers;
    AppContainer.state.source.stop();
    AppContainer.clearTrackInformation();
    this.setState({
      pausedAt: Date.now() - this.state.startedAt,
      playing: false
    });
  };

  resumeTrack = () => {
    this.playTrack(this.state.pausedAt / 1000);
  };

  /* Render Functions/Helpers */

  renderPlayPause() {
    const [AppContainer] = this.props.containers;

    if (this.state.playing) {
      return (
        <button className="button--icon" onClick={this.pauseTrack}>
          <Icon path={mdiPause} title="Pause" size={1} color="white" />
        </button>
      );
    }

    return (
      <button className="button--icon" onClick={this.resumeTrack}>
        {" "}
        {!AppContainer.state.isTrackLoading ? (
          <Icon path={mdiPlay} title="Play/Resume" size={1} color="white" />
        ) : (
          <Icon
            path={mdiLoading}
            title="Track Loading"
            size={1}
            color="white"
            spin
          />
        )}
      </button>
    );
  }

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
            {/* {this.state.playing ? (
              <button className="button--icon" onClick={this.pauseTrack}>
                <Icon path={mdiPause} title="Pause" size={1} color="white" />
              </button>
            ) : (
              <button className="button--icon" onClick={this.resumeTrack}>
                {" "}
                <Icon path={mdiPlay} title="Resume" size={1} color="white" />
              </button>
            )} */}
            {this.renderPlayPause()}
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
