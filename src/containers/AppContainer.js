import { Container } from "unstated";
import axios from "axios";
class AppContainer extends Container {
  state = {
    tracks: [],
    selectedTrack: undefined,
    audioBuffer: null,
    audioContext: null,
    source: null,
    isTrackLoading: false
  };

  getSelectedTrack = () => this.state.selectedTrack;

  getTracks = () => this.state.tracks;

  isTrackLoading = () => this.state.isTrackLoading;

  getAudioSource = () => this.state.source;

  hasPreviousTrack = () => {
    const trackIndex = this.state.tracks.findIndex(
      track => track.metadata.title === this.state.selectedTrack
    );
    return trackIndex > 0 ? true : false;
  };

  getPreviousTrack = () => {
    const trackIndex = this.state.tracks.findIndex(
      track => track.metadata.title === this.state.selectedTrack
    );
    return this.state.tracks[trackIndex - 1];
  };

  hasNextTrack = () => {
    const trackIndex = this.state.tracks.findIndex(
      track => track.metadata.title === this.state.selectedTrack
    );
    return trackIndex < this.state.tracks.length - 1 ? true : false;
  };

  getNextTrack = () => {
    const trackIndex = this.state.tracks.findIndex(
      track => track.metadata.title === this.state.selectedTrack
    );
    return this.state.tracks[trackIndex + 1];
  };

  async selectTrack(track) {
    await this.setState({
      selectedTrack: track
    });
  }

  async getAudioTracks() {
    const response = await axios.get("http://localhost:3001/api/v1/tracks");
    const { trackMetadata: trackData } = response.data;
    const tracks = trackData.map(track => ({
      name: track.title,
      isHovered: false,
      metadata: track
    }));
    await this.setState({ tracks });
    return tracks;
  }
  async getAudioTrack() {
    // ! The Track isn't done loading until the audio source has been connected
    await this.setState({ isTrackLoading: true });
    const response = await axios.get(
      `http://localhost:3001/api/v1/track?trackName=${this.state.selectedTrack}`,
      {
        responseType: "arraybuffer"
      }
    );

    return response;
  }

  getAudioContext() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContent = new AudioContext();
    return audioContent;
  }

  async createAudioSource(trackData) {
    const audioContext = this.getAudioContext();
    const audioBuffer = await audioContext.decodeAudioData(trackData);
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    await this.setState({
      audioBuffer,
      audioContext,
      source
    });
    this.setState({ isTrackLoading: false });
    return { source, audioBuffer, audioContext };
  }

  async clearTrackInformation() {
    await this.setState({
      audioBuffer: null,
      audioContext: null,
      source: null
    });
  }
}

export default AppContainer;
