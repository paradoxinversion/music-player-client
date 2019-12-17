import React from "react";
import connect from "unstated-connect";
import Icon from "@mdi/react";
import { mdiPlay } from "@mdi/js";
import AppContainer from "./containers/AppContainer";
class Track extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHighlighted: false
    };
  }

  render() {
    const [AppContainer] = this.props.containers;
    return (
      <div
        onMouseEnter={() => {
          this.setState({ isHighlighted: true });
        }}
        onMouseLeave={event => {
          this.setState({ isHighlighted: false });
        }}
        onClick={() => {
          AppContainer.selectTrack(this.props.track.name);
        }}
        className="track">
        {this.props.track.name.slice(0, this.props.track.name.length - 4)}
        {this.state.isHighlighted && (
          <React.Fragment>
            <Icon path={mdiPlay} title="Play" size={1} />
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default connect([AppContainer])(Track);
