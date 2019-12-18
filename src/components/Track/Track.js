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
  debugger;
  return (
    <div
      onMouseEnter={() => setIsHighlighted(true)}
      onMouseLeave={() => setIsHighlighted(false)}
      onClick={() => {
        if (!AppContainer.isTrackLoading())
          AppContainer.selectTrack(props.track.name);
      }}
      className="track">
      <span className="track-name">{props.track.metadata.title}</span>
      <span>{props.track.metadata.artist}</span>
      <span>
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
