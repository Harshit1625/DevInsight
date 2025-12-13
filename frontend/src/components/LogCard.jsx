import { useMemo } from "react";

export default function LogCard({ log, onClick }) {
  const summaryPending = !log.processed || !log.summary;

  // You don’t need state for this.
  const disabled = summaryPending;

  const handleClick = () => {
    if (disabled) return; // block click when summary isn't ready
    onClick(log);
  };

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

      {/* Summary Row */}
      <div className="mt-3 text-sm border-t pt-2 flex justify-between items-center">
        {summaryPending ? (
          <span className="animate-pulse text-gray-500">
            Generating summary…
          </span>
        ) : (
          <span className="text-gray-700 font-medium">Summary ready</span>
        )}

        {/* Open button */}

        <button
          className="text-white rounded px-3 py-1 text-sm bg-black"
          onClick={() => onClick(log)}
        >
          {summaryPending ? "" : "Click to Open"}
        </button>
      </div>
    </div>
  );
}
