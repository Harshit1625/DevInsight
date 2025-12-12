import { useEffect, useState } from "react";
import { fetchGroups } from "../api";
import GroupList from "../components/GroupList";
import Skeleton from "../components/Skeleton";
import io from "socket.io-client";


export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await fetchGroups();
    setGroups(data);
    setLoading(false);
  };

  useEffect(() => {
    load();

    const socket = io(import.meta.env.VITE_SOCKET_BASE, {
      transports: ["websocket"],
    });

    // When a log updates, update the group list
    socket.on("log_updated", (updatedLog) => {
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

    return () => socket.disconnect();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Error Groups</h1>

      {loading && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      )}

      <div className="mt-4">
        <GroupList groups={groups} />
      </div>

      {!loading && groups.length === 0 && (
        <p className="text-gray-500 mt-4">No groups found.</p>
      )}
    </div>
  );
}
