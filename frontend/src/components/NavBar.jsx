import { CgInsights } from "react-icons/cg";
export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      <div className="flex flex-row justify-center items-center gap-1">
        <h1 className="text-xl font-semibold tracking-tight">DevInsight</h1>
        <CgInsights className="text-2xl"/>
      </div>

      <div className="space-x-4">
        <a href="/" className="text-gray-600 hover:text-black">
          Dashboard
        </a>
        <a href="/logs" className="text-gray-600 hover:text-black">
          Logs
        </a>
        <a href="/groups" className="text-gray-600 hover:text-black">
          Groups
        </a>
      </div>
    </nav>
  );
}
