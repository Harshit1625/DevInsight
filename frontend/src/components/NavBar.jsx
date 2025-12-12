export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-semibold tracking-tight">DevInsight</h1>

      <div className="space-x-4">
        <a href="/" className="text-gray-600 hover:text-black">Dashboard</a>
        <a href="/logs" className="text-gray-600 hover:text-black">Logs</a>
        <a href="/groups" className="text-gray-600 hover:text-black">Groups</a>
      </div>
    </nav>
  );
}
