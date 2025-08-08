import { API_URL, SOCKETS_URL, NODE_ENV } from "./shared";
import { io } from "socket.io-client";

const socket = io(SOCKETS_URL, {
  withCredentials: NODE_ENV === "production",
});

export default socket;