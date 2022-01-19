import React from "react";
import PercentageCalculator from "./PercentageCalculator.js";
import PauseNotif from "./PauseNotif.js";
import DurationText from "./DurationText.js";
import { secondsToDuration } from "../utils/duration";

/*
* NOTES: This function is used to conditionally render the timer: that is, this code only shows when the play button has been pressed.
*/
function ActiveSession ({ session, isTimerRunning, pausePressed, focusDuration, breakDuration }) {
    if(isTimerRunning || pausePressed) {
      return (
        <div>
          <div className="row mb-2">
            <div className="col">
              {/* TODO: Update message below to include current session (Focusing or On Break) total duration */}
              {/* NOTE: The const below will show the total duration and the current session */}
              <DurationText session={session} focusDuration={focusDuration} breakDuration={breakDuration} />
              {/* TODO: Update message below correctly format the time remaining in the current session */}
              {/* NOTE: The secondsToDuration function returns the formatted time */}
              <p className="lead" data-testid="session-sub-title">
                {secondsToDuration(session.timeRemaining)} remaining
              </p>
            </div>
          </div>
          <PauseNotif item={pausePressed} />
          <div className="row mb-2">
            <div className="col">
              <div className="progress" style={{ height: "20px" }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow={PercentageCalculator( session, focusDuration, breakDuration )}// TODO: Increase aria-valuenow as elapsed time increases
                  style={{ width: `${PercentageCalculator( session, focusDuration, breakDuration )}%` }} // TODO: Increase width % as elapsed time increases
                />
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

export default ActiveSession;