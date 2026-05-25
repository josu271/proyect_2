import logo from "../../assets/img/logo.png";

export default function Header({
  title = "Panel del Docente",
  subtitle = "University",
  onLogout,
}) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">
      <div className="flex items-center gap-4">
        <img
          src={logo}
          alt="Logo"
          className="h-12 w-12 rounded-full object-contain"
        />

        <div>
          <h1 className="text-2xl font-bold leading-none text-slate-900">
            {title}
          </h1>
          <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onLogout}
        className="rounded-full bg-slate-100 px-5 py-3 text-sm font-bold text-slate-900 hover:bg-slate-200"
      >
        Salir
      </button>
    </header>
  );
}