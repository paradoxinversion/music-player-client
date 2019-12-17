import React, { useState } from "react";
import connect from "unstated-connect";
import Icon from "@mdi/react";
import { mdiPlay } from "@mdi/js";
import AppContainer from "../../containers/AppContainer";

const Track = props => {
  const [AppContainer] = props.containers;
  const [isHighlighted, setIsHighlighted] = useState(false);
  return (
    <div
      onMouseEnter={() => setIsHighlighted(true)}
      onMouseLeave={() => setIsHighlighted(false)}
      onClick={() => {
        if (!AppContainer.isTrackLoading())
          AppContainer.selectTrack(props.track.name);
      }}
      className="track">
      <span className="track-name">
        {props.track.name.slice(0, props.track.name.length - 4)}
      </span>
      {isHighlighted && (
        <React.Fragment>
          <Icon
            className="button--icon"
            path={mdiPlay}
            title="Play"
            size={1}
            color="white"
          />
        </React.Fragment>
      )}
    </div>
  );
};

export default connect([AppContainer])(Track);
