import { NavLink } from "react-router-dom";

export default function Sidebar({
  collapsed,
  onToggle,
  roleTitle = "TEACHER",
  menuItems = [],
}) {
  return (
    <aside
      className={[
        "fixed left-0 top-0 z-40 h-screen border-r border-slate-200 bg-white transition-all duration-300",
        collapsed ? "w-20" : "w-64",
      ].join(" ")}
    >
      <div className="flex h-20 items-center justify-center border-b border-slate-100">
        <button
          type="button"
          onClick={onToggle}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-xl text-slate-700 hover:bg-slate-100"
        >
          ☰
        </button>
      </div>

      <div className="px-4 py-6">
        {!collapsed && (
          <p className="mb-8 px-2 text-xs font-semibold tracking-[0.35em] text-slate-500">
            {roleTitle}
          </p>
        )}

        <nav>
          <ul className="space-y-3">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-semibold transition",
                      collapsed ? "justify-center" : "justify-start",
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-950",
                    ].join(" ")
                  }
                >
                  <span className="text-lg">{item.icon}</span>

                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}