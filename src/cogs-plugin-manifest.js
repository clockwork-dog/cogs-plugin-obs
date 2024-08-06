module.exports =
  /**
   * @type {const}
   * @satisfies {import("@clockworkdog/cogs-client").CogsPluginManifest}
   */
  ({
    name: "OBS",
    description: "Switch between scenes in OBS Studio",
    version: "1.0.0",
    icon: "./obs.png",
    config: [
      { name: "Host", value: { type: "string", default: "127.0.0.1" } },
      { name: "Port", value: { type: "number", default: 4455 } },
      { name: "Password", value: { type: "string", default: "" } },
    ],
    events: {
      fromCogs: [{ name: "Set Scene", value: { type: "string" } }],
    },
    state: [
      {
        name: "OBS Connected",
        value: { type: "boolean", default: false },
        writableFromClient: true,
      },
    ],
  });
