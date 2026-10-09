import React from "react";
import { SocketListener } from "./socket/SocketListener";
import { initNotifications } from "./socket/handle-notification";

const App = () => {
  return (
    <div>
      <h3>Testing Socket Server</h3>
      <SocketListener />
      <br />
      <button onClick={initNotifications}>Enable Notification</button>
    </div>
  );
};

export default App;
