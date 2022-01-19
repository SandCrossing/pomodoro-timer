// ADDENDUM: This component shouldn't be impure because it doesn't alter any of its props
function PercentageCalculator ( session, focusDuration, breakDuration ) {
    let timeRemaining = session.timeRemaining;
    let totalFocusTime = focusDuration * 60;
    let totalBreakTime = breakDuration * 60;
    if(session.label === "Focusing") {
      return ((1-(timeRemaining/totalFocusTime)) * 100);
    } else {
      return ((1-(timeRemaining/totalBreakTime)) * 100);
    }
  }
  
export default PercentageCalculator;