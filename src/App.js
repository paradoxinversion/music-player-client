import React from "react";
import axios from "axios";
import connect from "unstated-connect";
import MusicPlayer from "./components/MusicPlayer/MusicPlayer";
import Track from "./components/Track/Track";
import AppContainer from "./containers/AppContainer";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tracks: [], selectedTrack: "" };
  }

  async componentDidMount() {
    const [AppContainer] = this.props.containers;
    await AppContainer.getAudioTracks();
  }

  render() {
    const [AppContainer] = this.props.containers;

    return (
      <React.Fragment>
        <header>
          <h1 className="margin--bottom--small">Muse</h1>
          <p>Your simple music player</p>
        </header>
        <div>
          <MusicPlayer track={AppContainer.getSelectedTrack()} />
          <section id="track-container">
            {AppContainer.getTracks().map(track => (
              <Track key={`track-${track.metadata.title}`} track={track} />
            ))}
          </section>
        </div>
      </React.Fragment>
    );
  }
}

export default connect([AppContainer])(App);
