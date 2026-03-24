import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const menus = [
    { title: "Usuarios", path: "/admin/users", icon: "👤" },
    { title: "Tours", path: "/admin/tours", icon: "🏝️" },
    { title: "Reservas", path: "/admin/bookings", icon: "📅" },
    { title: "Configuración", path: "/admin/settings", icon: "⚙️" },
  ];

  return (
    <div className="w-full">

      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-700">
        Panel de Administración
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

        {menus.map((menu, index) => (
          <div
            key={index}
            onClick={() => navigate(menu.path)}
            className="cursor-pointer bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition hover:scale-105 flex flex-col items-center justify-center gap-3"
          >
            <span className="text-4xl">{menu.icon}</span>
            <h2 className="text-lg font-semibold">{menu.title}</h2>
          </div>
        ))}

      </div>

    </div>
  );
};

export default Dashboard;