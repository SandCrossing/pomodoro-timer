import React, { useState } from "react";
import classNames from "../utils/class-names";
import useInterval from "../utils/useInterval";
import { minutesToDuration } from "../utils/duration";
import ActiveSession from "./ActiveSession.js";


// These functions are defined outside of the component to ensure they do not have access to state
// and are, therefore, more likely to be pure.

/**
 * Update the session state with new state after each tick of the interval.
 * @param prevState
 *  the previous session state
 * @returns
 *  new session state with timing information updated.
 */
function nextTick(prevState) {
  const timeRemaining = Math.max(0, prevState.timeRemaining - 1);
  return {
    ...prevState,
    timeRemaining,
  };
}

/**
 * Higher-order function that returns a function to update the session state with the next session type upon timeout.
 * @param focusDuration
 *    the current focus duration
 * @param breakDuration
 *    the current break duration
 * @returns
 *  function to update the session state.
 */
function nextSession(focusDuration, breakDuration) {
  /**
   * State function to transition the current session type to the next session. e.g. On Break -> Focusing or Focusing -> On Break
   */
  return (currentSession) => {
    if (currentSession.label === "Focusing") {
      return {
        label: "On Break",
        timeRemaining: breakDuration * 60,
      };
    }
    return {
      label: "Focusing",
      timeRemaining: focusDuration * 60,
    };
  };
}

function Pomodoro() {
  // Timer starts out paused
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  // The current session - null where there is no session running
  const [session, setSession] = useState(null);
  // This variable is used to keep track of whenever the pause button is pressed
  const [pausePressed, setPausePressed] = useState(false);
  // This variable is used to keep track of whether or not the times may be edited - it should only work when there is no session.
  const [editTimes, setEditTimes] = useState(false);
  //This variable is used to keep track of whether or not the stop button may be pressed - it shouldn't work when a session hasn't started.
  const [canStop, setCanStop] = useState(false);

  // ToDo: Allow the user to adjust the focus and break duration.
  // Notes: Changing the constants to state variables should allow for the user to edit them
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);

  /**
   * Custom hook that invokes the callback function every second
   *
   * NOTE: You won't need to make changes to the callback function
   */
  useInterval(() => {
      if (session.timeRemaining === 0) {
        new Audio("https://bigsoundbank.com/UPLOAD/mp3/1482.mp3").play();
        return setSession(nextSession(focusDuration, breakDuration));
      }
      return setSession(nextTick);
    },
    isTimerRunning ? 1000 : null
  );

  /**
   * Called whenever the play/pause button is clicked.
   * NOTE:
   * When the page is loaded, both isTimerRunning and pressedPause should be false.
   * Then, when the user hits the play button, isTimerRunning is set to true.
   * This means that if isTimerRunning is false, the code should run.
   * When the button is called and isTimerRunning is true, however, it should be set to false and pressedPause should be true.
   */
  function playPause() {
    //Note: This is set to true whenever this button is pressed, otherwise the times would be able to be edited when the tests don't allow.
    setEditTimes(true);
    //Note: This is set to true whenever this button is pressed, otherwise the stop button would not be able to be pressed when the tests call for it.
    setCanStop(true);
    // This code only fires if the timer isn't running - so only when the play button is pressed.
    if(!isTimerRunning) {
      //Note: This is set to null whenever the play button is hit, otherwise the session would not be new each time as the tests require
      setSession(null);
      //Note: This is set to false whenever the play button is hit, otherwise the paused text would not go away as the tests require
      setPausePressed(false);
      setIsTimerRunning((prevState) => {
        const nextState = !prevState;
        if (nextState) {
          setSession((prevStateSession) => {
            // If the timer is starting and the previous session is null,
            // start a focusing session.
            if (prevStateSession === null) {
              return {
                label: "Focusing",
                timeRemaining: focusDuration * 60,
              };
            }
            return prevStateSession;
          });
        }
        return nextState;
      });
    } else {
      // This else statement is only reached if the timer isn't running - so the program is currently paused.
      // Here, we need to set isTimerRunning to false and isPaused to true;
      //Note: This is set to false whenever the pause button is pressed, otherwise the timer wouldn't stop as the tests require
      setIsTimerRunning(false);
      //Note: This is set to true whenever the pause button is pressed, otherwise the paused text wouldn't show up as the tests require
      setPausePressed(true);
    }
    
  }

  /**
   * Notes: This function will stop the timer, but is still able to be clicked while the timer isn't running.
   */

  function stopTimer() {
    /*Note: These four states all need to be set to false when this function is called. As none of these will be set to anything other than false
    * depending on their current status, this should not cause any race conditions.
    */
    setCanStop(false);
    setEditTimes(false);
    setIsTimerRunning(false);
    setPausePressed(false);
  }


  return (
    <div className="pomodoro">
      <div className="row">
        <div className="col">
          <div className="input-group input-group-lg mb-2">
            <span className="input-group-text" data-testid="duration-focus">
              {/* TODO: Update this text to display the current focus session duration */}
              {/* NOTES: Changed from a static 25:00 to the focusDuration constant, which should work */}
              Focus Duration: {minutesToDuration(focusDuration)}
            </span>
            <div className="input-group-append">
              {/* TODO: Implement decreasing focus duration and disable during a focus or break session */}
              {/* NOTES: The onClick function here decreases time to the focus duration, and will cap out at 5 minutes */}
              {/* NOTES: All 4 of these buttons will now be disabled whenever the timer is running, which means a session is active */}
              <button
                disabled={editTimes}
                type="button"
                className="btn btn-secondary"
                data-testid="decrease-focus"
                onClick={() => { setFocusDuration((focusDuration) => (focusDuration > 5 ? focusDuration - 5 : focusDuration = 5))}}
              >
                <span className="oi oi-minus" />
              </button>
              {/* TODO: Implement increasing focus duration and disable during a focus or break session */}
              {/* NOTES: The onClick function here adds time to the focus duration, and will cap out at 60 minutes */}
              {/* NOTES: All 4 of these buttons will now be disabled whenever the timer is running, which means a session is active */}
              <button
                disabled={editTimes}
                type="button"
                className="btn btn-secondary"
                data-testid="increase-focus"
                onClick={() => { setFocusDuration((focusDuration) => (focusDuration < 60 ? focusDuration + 5 : focusDuration = 60))}}
              >
                <span className="oi oi-plus" />
              </button>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="float-right">
            <div className="input-group input-group-lg mb-2">
              <span className="input-group-text" data-testid="duration-break">
                {/* TODO: Update this text to display the current break session duration */}
                {/* NOTES: Changed from a static 5:00 to the breakDuration constant, which should work */}
                Break Duration: {minutesToDuration(breakDuration)}
              </span>
              <div className="input-group-append">
                {/* TODO: Implement decreasing break duration and disable during a focus or break session*/}
                {/* NOTES: The onClick function here decreases time to the break duration, and will cap out at 1 minute */}
                {/* NOTES: All 4 of these buttons will now be disabled whenever the timer is running, which means a session is active */}
                <button
                  disabled={editTimes}
                  type="button"
                  className="btn btn-secondary"
                  data-testid="decrease-break"
                  onClick={() => { setBreakDuration((breakDuration) => (breakDuration > 1 ? breakDuration - 1 : breakDuration = 1))}}

                >
                  <span className="oi oi-minus" />
                </button>
                {/* TODO: Implement increasing break duration and disable during a focus or break session*/}
                {/* NOTES: The onClick function here adds time to the break duration, and will cap out at 15 minutes */}
                {/* NOTES: All 4 of these buttons will now be disabled whenever the timer is running, which means a session is active */}
                <button
                  disabled={editTimes}
                  type="button"
                  className="btn btn-secondary"
                  data-testid="increase-break"
                  onClick={() => { setBreakDuration((breakDuration) => (breakDuration < 15 ? breakDuration + 1 : breakDuration = 15))}}
                >
                  <span className="oi oi-plus" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div
            className="btn-group btn-group-lg mb-2"
            role="group"
            aria-label="Timer controls"
          >
            <button
              type="button"
              className="btn btn-primary"
              data-testid="play-pause"
              title="Start or pause timer"
              onClick={playPause}
            >
              <span
                className={classNames({
                  oi: true,
                  "oi-media-play": !isTimerRunning,
                  "oi-media-pause": isTimerRunning,
                })}
              />
            </button>
            {/* TODO: Implement stopping the current focus or break session. and disable the stop button when there is no active session */}
            {/* TODO: Disable the stop button when there is no active session */}
            {/* NOTES: The stopTimer function will sort of stop the current session.*/}
            {/* NOTES: The button will now be disabled whenever the timer is not running - as the timer is only running during an active session, this should work */}
            <button
              disabled={!canStop}
              type="button"
              className="btn btn-secondary"
              data-testid="stop"
              title="Stop the session"
              onClick={stopTimer}
            >
              <span className="oi oi-media-stop" />
            </button>
          </div>
        </div>
      </div>
      {/* TODO: This area should show only when there is an active focus or break - i.e. the session is running or is paused */}
      {/* NOTES: I've placed the entirety of the div being asked in the function activeSession, and it currently only 
        renders while the session is running, but no pause feature has been implemented yet */}
      <ActiveSession session={session} isTimerRunning={isTimerRunning} pausePressed={pausePressed} focusDuration={focusDuration} breakDuration={breakDuration} />
    </div>
  );
}

export default Pomodoro;

/**
 * FINAL NOTES:
 * 1. It makes very little sense that every time the play button runs, a new session starts. Why bother to implement a pause feature if it
 * functions almost exactly the same as the stop feature?
 * 
 */