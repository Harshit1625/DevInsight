import { useEffect, useState } from "react";
import { fetchGroups, fetchLogs, sendTestLog } from "../api";
import GroupList from "../components/GroupList";
import LogCard from "../components/LogCard";
import LogDetailsDrawer from "../components/LogDetailsDrawer";
import io from "socket.io-client";

export default function Dashboard() {
  const [groups, setGroups] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [disable, setDisabled] = useState(false);

  const openDrawer = (log) => {
    setSelectedLog(log);
    setDrawerOpen(true);
  };

  const load = async () => {
    const [g, l] = await Promise.all([fetchGroups(), fetchLogs()]);
    setGroups(g);
    setLogs(l);
  };

  useEffect(() => {
    // 1️⃣ Load once
    load();

    // 2️⃣ Setup WebSocket
    const socket = io(import.meta.env.VITE_SOCKET_BASE, {
      transports: ["websocket"],
    });

    console.log("🔌 Socket connecting...");

    socket.on("connect", () => {
      console.log("🟢 Connected:", socket.id);
    });

    // NEW LOG visible instantly
    socket.on("log_created", (log) => {
      console.log("Log Created");
      setLogs((prev) => {
        if (prev.some((l) => l._id === log._id)) return prev;
        return [log, ...prev];
      });
    });

    // SUMMARY + GROUP updated in realtime
    socket.on("log_updated", (updatedLog) => {
      setLogs((prev) =>
        prev.map((l) => (l._id === updatedLog._id ? updatedLog : l))
      );

      // Optional group realtime update
      setGroups((prev) =>
        prev.map((g) =>
          g._id === updatedLog.groupId
            ? {
                ...g,
                lastSeen: updatedLog.updatedAt || new Date().toISOString(),
                count: g.count + 1,
              }
            : g
        )
      );
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="p-6">
      <button
        className="px-4 py-2 bg-black text-white rounded"
        onClick={async () => {
          await sendTestLog();
          load();
        }}
      >
        Send Test Log
      </button>

      <h2 className="text-xl font-semibold mt-6">Error Groups</h2>
      <GroupList groups={groups} />

      <h2 className="text-xl font-semibold mt-8">Recent Logs</h2>
      <div className="space-y-4 mt-4">
        {logs.map((log) => (
          <LogCard key={log._id} log={log} onClick={openDrawer} />
        ))}
      </div>

      <LogDetailsDrawer
        open={drawerOpen}
        log={selectedLog}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedLog(null);
        }}
      />
    </div>
  );
}
