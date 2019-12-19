import React from "react";
import connect from "unstated-connect";
import moment from "moment";
import AppContainer from "../../containers/AppContainer";
import Icon from "@mdi/react";
import {
  mdiPlay,
  mdiPause,
  mdiStop,
  mdiLoading,
  mdiSkipNext,
  mdiSkipForward,
  mdiSkipBackward
} from "@mdi/js";

class MusicPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startedAt: null,
      pausedAt: null,
      playing: false,
      status: "stopped",
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
    if (!AppContainer.isTrackLoading()) {
      await AppContainer.clearTrackInformation();
      const response = await AppContainer.getAudioTrack();
      const { source, audioBuffer } = await AppContainer.createAudioSource(
        response.data
      );
      source.start(0, startTime);
      this.startTrackTimer();
      this.setState({
        startedAt: startTime ? Date.now() - startTime * 1000 : Date.now(),
        playing: true,
        status: "playing",
        duration: audioBuffer.duration
      });
    } else {
      console.log("A track is currently loading");
    }
  };

  startTrackTimer() {
    const trackTimerId = setInterval(() => {
      const currentTrackTime = (Date.now() - this.state.startedAt) / 1000;
      const percentageTrackComplete = parseInt(
        (currentTrackTime * 100) / this.state.duration,
        10
      );
      this.setState({ currentTrackTime, percentageTrackComplete });
    }, 1000);
    this.setState({
      trackTimerId
    });
  }

  stopTrackTimer() {
    clearInterval(this.state.trackTimerId);
  }

  /**
   * Stops the current track if one is playing,
   * starts a new track (from the app container)
   */
  playNewTrack = async () => {
    const [AppContainer] = this.props.containers;
    if (AppContainer.getAudioSource()) await this.stopTrack();
    await this.playTrack(0);
  };

  stopTrack = async () => {
    const [AppContainer] = this.props.containers;
    if (!AppContainer.isTrackLoading()) {
      AppContainer.getAudioSource().stop();
      this.stopTrackTimer();
      await AppContainer.clearTrackInformation();
      this.setState({
        playing: false,
        status: "stopped"
      });
    } else {
      console.warn("Track is currently loading");
    }
  };

  pauseTrack = async () => {
    const [AppContainer] = this.props.containers;
    AppContainer.getAudioSource().stop();
    this.stopTrackTimer();
    await AppContainer.clearTrackInformation();
    this.setState({
      pausedAt: Date.now() - this.state.startedAt,
      playing: false,
      status: "paused"
    });
  };

  resumeTrack = () => {
    this.playTrack(this.state.pausedAt / 1000);
  };

  skipToNextTrack = async () => {
    const [AppContainer] = this.props.containers;
    await this.stopTrack();
    await AppContainer.selectTrack(AppContainer.getNextTrack().metadata.title);
  };

  skipToPreviousTrack = async () => {
    const [AppContainer] = this.props.containers;
    await this.stopTrack();
    await AppContainer.selectTrack(
      AppContainer.getPreviousTrack().metadata.title
    );
  };

  handleProgressChange = e => {
    const elementWidth = e.target.offsetWidth;
    const clickPos = e.clientX - e.target.offsetLeft;
    const trackPercentage = (clickPos / elementWidth) * 100;
    const currentTrackTime = (this.state.duration * trackPercentage) / 100;
    this.stopTrack();
    this.playTrack(currentTrackTime);
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
        {!AppContainer.isTrackLoading() ? (
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
  renderStop() {
    switch (this.state.status) {
      case "playing":
      case "paused":
        return (
          <button className="button--icon" onClick={this.stopTrack}>
            <Icon path={mdiStop} title="Stop" size={1} color="white" />
          </button>
        );

      default:
        return null;
    }
  }
  renderSkipForward() {
    const [AppContainer] = this.props.containers;
    if (AppContainer.hasNextTrack()) {
      switch (this.state.status) {
        case "playing":
        case "paused":
          return (
            <button className="button--icon" onClick={this.skipToNextTrack}>
              <Icon path={mdiSkipForward} title="Next" size={1} color="white" />
            </button>
          );

        default:
          return null;
      }
    }
    return null;
  }
  renderSkipBackward() {
    const [AppContainer] = this.props.containers;
    if (AppContainer.hasPreviousTrack()) {
      switch (this.state.status) {
        case "playing":
        case "paused":
          return (
            <button className="button--icon" onClick={this.skipToPreviousTrack}>
              <Icon
                path={mdiSkipBackward}
                title="Previous"
                size={1}
                color="white"
              />
            </button>
          );

        default:
          return null;
      }
    }
    return null;
  }
  render() {
    const [AppContainer] = this.props.containers;
    const selectedTrack = AppContainer.getSelectedTrack();
    const m = moment.duration(this.state.currentTrackTime, "seconds");
    return (
      <section id="music-player">
        <div id="now-playing">
          {selectedTrack ? (
            <React.Fragment>
              <span>Now Playing: </span>
              <span>{selectedTrack}</span>
            </React.Fragment>
          ) : (
            <span>Select a Track</span>
          )}
        </div>
        {selectedTrack && (
          <section id="track-controls">
            <div id="track-progress">
              <span
                id="track-progress-bar-container"
                onClick={this.handleProgressChange}>
                <progress
                  style={{ height: "5px" }}
                  value={this.state.percentageTrackComplete}
                  max="100">
                  70%
                </progress>
              </span>

              <span id="track-time">
                {m.minutes() > 0 ? `${m.minutes()}:` : "00:"}
                {m.seconds() > 9 ? m.seconds() : `0${m.seconds()}`}
              </span>
            </div>
            <div id="track-control-buttons">
              {this.renderSkipBackward()}
              {this.renderPlayPause()}
              {this.renderStop()}
              {this.renderSkipForward()}
            </div>
          </section>
        )}
      </section>
    );
  }
}

export default connect([AppContainer])(MusicPlayer);
