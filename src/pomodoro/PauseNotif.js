import React from "react";

// NOTE: This function is responsible for the paused text appearing when the pause button has been hit
// ADDENDUM: This component shouldn't be impure because it doesn't alter any of its props
function PauseNotif ({ item }) {
    if(item) {
      return (
        <h2>PAUSED</h2>
      );
    } else {
      return null;
    }
}

export default PauseNotif;