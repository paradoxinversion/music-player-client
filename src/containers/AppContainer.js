import { Container } from "unstated";
import axios from "axios";
class AppContainer extends Container {
  state = { tracks: [], selectedTrack: undefined };

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
    console.log(tracks);
    return tracks;
  }
}

export default AppContainer;
