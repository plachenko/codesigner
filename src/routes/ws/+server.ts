import type { Socket } from "@sveltejs/kit";
import fs from "fs";
import * as pty from "node-pty";
import * as os from "node:os";

const USE_BINARY = os.platform() !== "win32";
const shell = os.platform() === "win32" ? "powershell.exe" : "bash";
const ptyProcess = pty.spawn(shell, [], {
    name: "xterm-256color",
    cols: 50,
    rows: 50,
    cwd: process.env.HOME,
    env: process.env,
    encoding: USE_BINARY ? null : "utf8",
});

const users = new Map();

let dataObj = null;

ptyProcess.onData((data) => {
    dataObj = {
        type: "terminal",
        content: data,
    };

    // users.keys().next().send(JSON.stringify(obj));

    //socket?.send(JSON.stringify(obj));
});

export const socket: Socket = {
    upgrade(req) {
        // console.log("setting an upgrade.");
    },

    open(peer) {
        users.set(peer, peer.id);
        // console.log(users);
    },

    message(peer, msg) {
        console.log(msg);
        // console.log(msg);
        // const data = JSON.parse(msg);
        peer.send(JSON.stringify({ type: "terminal", message: dataObj }));

        // console.log(data);
    },

    close(peer, evt) {
        peer.unsubscribe();
    },
};
