import React, { useState } from "react";
import connect from "unstated-connect";
import Icon from "@mdi/react";
import moment from "moment";
import { mdiPlay } from "@mdi/js";
import AppContainer from "../../containers/AppContainer";

const Track = props => {
  const [AppContainer] = props.containers;
  const [isHighlighted, setIsHighlighted] = useState(false);
  const m = moment.duration(props.track.metadata.duration, "seconds");
  return (
    <div
      onMouseEnter={() => setIsHighlighted(true)}
      onMouseLeave={() => setIsHighlighted(false)}
      onClick={() => {
        if (!AppContainer.isTrackLoading())
          AppContainer.selectTrack(props.track.name);
      }}
      className="track">
      <span className="track-name track-data">
        {props.track.metadata.title}
      </span>
      <span className="track-data font-size--small">
        {props.track.metadata.artist}
      </span>
      <span className="track-data font-size--small">
        {props.track.metadata.album}
      </span>
      <span className="track-data font-size--small">
        {" "}
        {`${m.hours() ? m.hours() : ""} ${m.minutes()}:${m.seconds()}`}{" "}
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
