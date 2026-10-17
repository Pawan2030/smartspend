import { NavLink } from "react-router-dom";

function Navbar() {
  const links = [
    { to: "/",        label: "Dashboard", emoji: "📊" },
    { to: "/insights",label: "AI Insights", emoji: "🔮" },
    { to: "/history", label: "History",   emoji: "🧾" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <span className="text-xl">🧾</span>
        <span className="font-semibold text-gray-800 text-lg">SmartSpend</span>
        <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-medium ml-1">
          Slingshot AI
        </span>
      </div>

      <div className="flex items-center gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg transition font-medium ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <span>{link.emoji}</span>
            <span className="hidden sm:inline">{link.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;