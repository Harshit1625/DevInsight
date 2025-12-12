import ReactMarkdown from "react-markdown";
export default function LogDetailsDrawer({ open, log, onClose }) {
  if (!open || !log) return null;
  const summaryPending = !log.processed || !log.summary;

  const stop = (e) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-end z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-xl h-full p-6 overflow-y-auto shadow-lg"
        onClick={stop}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold invisible mb-1">Summary</h3>
          <button
            className="border rounded bg-black text-white px-3 py-1 text-sm"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        {/* Summary */}
        <div className="mb-4">
          {summaryPending ? (
            <p className="text-gray-500 italic">Generating summary…</p>
          ) : (
            <div className="prose prose-sm">
              <ReactMarkdown>{log.summary}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Raw message */}
        <div className="mb-4">
          <h3 className="font-semibold mb-1">Message</h3>
          <pre className="text-xs bg-gray-100 p-3 rounded whitespace-pre-wrap">
            {log.message}
          </pre>
        </div>

        {/* Metadata */}
        {log.meta && (
          <div className="mb-4">
            <h3 className="font-semibold mb-1">Meta</h3>
            <pre className="text-xs bg-gray-100 p-3 rounded whitespace-pre-wrap">
              {JSON.stringify(log.meta, null, 2)}
            </pre>
          </div>
        )}

        {/* Timestamp */}
        <div className="text-xs text-gray-500">
          Logged at: {new Date(log.timestamp).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
