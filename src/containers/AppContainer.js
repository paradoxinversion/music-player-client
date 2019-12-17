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
  selectTrack(track) {
    this.setState({
      selectedTrack: track.slice(0, track.length - 4)
    });
  }

  async getAudioTracks() {
    const response = await axios.get("http://localhost:3001/api/v1/tracks");
    const { tracks: trackData } = response.data;
    const tracks = trackData.map(track => ({ name: track, isHovered: false }));
    this.setState({ tracks });
    return tracks;
  }
  async getAudioTrack() {
    // ! The Track isn't done loading until the audio source has been connected
    this.setState({ isTrackLoading: true });
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
    this.setState({
      audioBuffer,
      audioContext,
      source
    });
    this.setState({ isTrackLoading: false });
    return { source, audioBuffer, audioContext };
  }

  clearTrackInformation() {
    this.setState({
      audioBuffer: null,
      audioContext: null,
      source: null
    });
  }
}

export default AppContainer;
