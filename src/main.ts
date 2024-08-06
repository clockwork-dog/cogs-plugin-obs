import { CogsConnection } from "@clockworkdog/cogs-client";
import * as manifest from "./cogs-plugin-manifest.js";
import OBSWebSocket from "obs-websocket-js";

const cogsConnection = new CogsConnection(manifest);

const obsConnection = new OBSWebSocket();
let obsConnectionTimeout: NodeJS.Timeout | null = null;

/**
 * Uses the latest config from `cogsConnection`
 */
async function connectToOBS() {
  obsConnectionTimeout && clearTimeout(obsConnectionTimeout);
  obsConnectionTimeout = null;

  const config = cogsConnection.config;
  try {
    await obsConnection.connect(
      `ws://${config.Host}:${config.Port}`,
      config.Password || undefined
    );
  } catch (error) {
    console.warn("Error connecting to OBS", error);
    reconnectToOBS();
  }
}

function reconnectToOBS() {
  if (obsConnectionTimeout) {
    clearTimeout(obsConnectionTimeout);
  }
  obsConnectionTimeout = setTimeout(connectToOBS, 5000);
}

// Tell COGS if we're connected to OBS
obsConnection.on("ConnectionOpened", () => {
  console.log("OBS connected");
  cogsConnection.setState({ "OBS Connected": true });
});
obsConnection.on("ConnectionClosed", () => {
  console.log("OBS disconnected");
  cogsConnection.setState({ "OBS Connected": false });
  reconnectToOBS();
});
obsConnection.on("ConnectionError", (error) => {
  console.log("OBS connection error", error);
  cogsConnection.setState({ "OBS Connected": false });
  reconnectToOBS();
});

// Re-connect to OBS when the config changes
cogsConnection.addEventListener("config", async () => {
  try {
    await obsConnection.disconnect();
  } catch (error) {
    console.warn("Error disconnecting from OBS", error);
  }
  connectToOBS();
});

cogsConnection.addEventListener("event", (event) => {
  switch (event.name) {
    case "Set Scene":
      obsConnection?.call("SetCurrentProgramScene", { sceneName: event.value });
      break;
  }
});
