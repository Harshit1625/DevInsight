export default function LogCard({ log, onClick }) {
  const summaryPending = !log.processed || !log.summary;
  const disabled = summaryPending;

  const handleClick = () => {
    if (disabled) return;
    onClick(log);
  };

  const lastSeen = log.updatedAt || log.createdAt;

  return (
    <div
      onClick={handleClick}
      className={`bg-white border rounded-lg p-4 shadow-sm transition-all
        ${
          disabled
            ? "opacity-60 cursor-not-allowed"
            : "hover:shadow cursor-pointer"
        }
      `}
    >
      {/* Message */}
      <p className="text-gray-900 line-clamp-2">{log.message}</p>

      {/* Meta Row */}
      <div className="mt-2 text-xs text-gray-500">
        {lastSeen && (
          <span>Last seen: {new Date(lastSeen).toLocaleString()}</span>
        )}
      </div>

      {/* Summary Row */}
      <div className="mt-3 text-sm border-t pt-2 flex justify-between items-center">
        {summaryPending ? (
          <span className="animate-pulse text-gray-500">
            Generating summary…
          </span>
        ) : (
          <span className="text-gray-700 font-medium">Summary ready</span>
        )}

        <button
          className={`text-white rounded px-3 py-1 text-sm bg-black
            ${summaryPending ? "opacity-50 cursor-not-allowed" : ""}
          `}
          onClick={(e) => {
            e.stopPropagation(); // prevent card click duplication
            if (!summaryPending) onClick(log);
          }}
        >
          {summaryPending ? "Processing…" : "Open"}
        </button>
      </div>
    </div>
  );
}
