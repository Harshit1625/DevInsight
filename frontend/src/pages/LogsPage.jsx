import { useEffect, useState } from "react";
import { fetchLogs } from "../api";
import LogCard from "../components/LogCard";
import Skeleton from "../components/Skeleton";
import LogDetailsDrawer from "../components/LogDetailsDrawer";
import io from "socket.io-client";

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedLog, setSelectedLog] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await fetchLogs();
    setLogs(data);
    setLoading(false);
  };

  useEffect(() => {
    load();

    const socket = io(import.meta.env.VITE_SOCKET_BASE, {
      transports: ["websocket"],
    });

    socket.on("log_created", (log) => {
      setLogs((prev) => {
        if (prev.some((l) => l._id === log._id)) return prev;
        return [log, ...prev];
      });
    });

    socket.on("log_updated", (updatedLog) => {
      setLogs((prev) =>
        prev.map((l) => (l._id === updatedLog._id ? updatedLog : l))
      );
    });

    return () => socket.disconnect();
  }, []);

  const openDrawer = (log) => {
    setSelectedLog(log);
    setDrawerOpen(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">All Logs</h1>

      {loading && (
        <div className="space-y-4 mt-4">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      )}

      <div className="space-y-4 mt-6">
        {logs.map((log) => (
          <LogCard key={log._id} log={log} onClick={openDrawer} />
        ))}
      </div>

      {!loading && logs.length === 0 && (
        <p className="text-gray-500 mt-4">No logs found.</p>
      )}

      <LogDetailsDrawer
        open={drawerOpen}
        log={selectedLog}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
