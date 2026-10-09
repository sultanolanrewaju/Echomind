import { useEffect, useState } from "react";
import { connectSocket, socket } from "../socket/index";

export const SocketListener = () => {
  const [conn, setConn] = useState(null);
  useEffect(() => {
    connectSocket();

    // Single Listener Handler Setup
    const handleConnectionAck = (data) => {
      setConn(data);
      console.log("[+] Socket Server Connected ---- ", data);
    };

    // Attach event listeners
    socket.on("connection_ack", handleConnectionAck);

    // Clean up listeners on unmount
    return () => {
      socket.off("connection_ack", handleConnectionAck);
    };
  }, []);

  return <pre>{JSON?.stringify(conn)}</pre>;
};
