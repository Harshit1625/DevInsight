export default function GroupList({ groups }) {
  if (!groups.length) return <p>No groups yet.</p>;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {groups.map((g) => (
        <div
          key={g._id}
          className="bg-white border rounded-lg p-4 shadow-sm hover:shadow transition-all"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            {g.fingerprint}
          </h2>
{/* 
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {g.fingerprint}
          </p> */}

          <div className="text-sm text-gray-700 flex justify-between">
            <span>Count: {g.count}</span>
            <span className="text-xs text-gray-500">
              {new Date(g.lastSeen).toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
