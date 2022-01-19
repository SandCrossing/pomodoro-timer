import React from "react";
import { minutesToDuration } from "../utils/duration";

// NOTE: This will conditionally render the duration portion of the timer - it will show the label and the total time in the correct format
// ADDENDUM: This component shouldn't be considered impure since it doesn't alter any of its props
function DurationText ({ session, focusDuration, breakDuration }) {
    let focusTime = focusDuration;
    let breakTime = breakDuration;
    if(session.label === "Focusing") {
      return (
        <h2 data-testid="session-title">
        {session.label} for {minutesToDuration(focusTime)} minutes
        </h2>
      )
    } else {
      return (
        <h2 data-testid="session-title">
        {session.label} for {minutesToDuration(breakTime)} minutes
        </h2>
      )
    }
  }

export default DurationText;