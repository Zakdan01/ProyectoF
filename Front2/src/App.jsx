function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950 font-bold">R</div>
            <div>
              <p className="text-lg font-semibold tracking-tight text-slate-100">Restaurante Feliz</p>
              <p className="text-sm text-slate-400">Sistema administrativo</p>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <a href="#inicio" className="transition hover:text-white">Inicio</a>
            <a href="#menu" className="transition hover:text-white">Menú</a>
            <a href="#reservas" className="transition hover:text-white">Reservas</a>
            <a href="#contacto" className="transition hover:text-white">Contacto</a>
          </nav>

          <div className="flex items-center gap-3">
            <button className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-100 transition hover:border-emerald-400 hover:text-white">
              Iniciar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <section id="inicio" className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300 ring-1 ring-emerald-300/20">
              Bienvenido al sistema de administración
            </div>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Control total de tu restaurante en una sola plataforma
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                Gestiona mesas, pedidos y reservas, prepara el menú y consulta los reportes en una interfaz moderna pensada para administradores.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <a href="#funciones" className="inline-flex items-center justify-center rounded-2xl bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300">
                Ver funciones
              </a>
              <button className="inline-flex items-center justify-center rounded-2xl border border-slate-700 px-6 py-3 text-sm text-slate-100 transition hover:border-emerald-400">
                Login administrador
              </button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/40">
            <div className="space-y-6">
              <div className="rounded-3xl bg-slate-950/60 p-6 text-slate-100">
                <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">Administrador</p>
                <h2 className="mt-4 text-2xl font-semibold">Panel rápido</h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Aquí podrás ver los próximos pasos del sistema: control de pedidos, gestión de mesas y estadísticas de ventas.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                  <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Pedidos</p>
                  <p className="mt-3 text-3xl font-semibold text-white">48</p>
                  <p className="mt-2 text-sm text-slate-500">Pedidos en preparación</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                  <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Mesas</p>
                  <p className="mt-3 text-3xl font-semibold text-white">12</p>
                  <p className="mt-2 text-sm text-slate-500">Mesas ocupadas</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="funciones" className="mt-20 space-y-8">
          <div className="space-y-3 text-center">
            <p className="text-sm uppercase tracking-[0.32em] text-emerald-300">Funciones</p>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">Todo lo que necesitas para administrar tu restaurante</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <article className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 text-slate-100 shadow-xl shadow-slate-950/20">
              <h3 className="text-xl font-semibold text-white">Gestión de pedidos</h3>
              <p className="mt-4 text-sm leading-6 text-slate-400">
                Registra, actualiza y supervisa el estado de cada pedido en la cocina y servicio.
              </p>
            </article>
            <article className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 text-slate-100 shadow-xl shadow-slate-950/20">
              <h3 className="text-xl font-semibold text-white">Control de mesas</h3>
              <p className="mt-4 text-sm leading-6 text-slate-400">
                Administra la disponibilidad de mesas, turnos y asignaciones desde un único lugar.
              </p>
            </article>
            <article className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 text-slate-100 shadow-xl shadow-slate-950/20">
              <h3 className="text-xl font-semibold text-white">Reportes y métricas</h3>
              <p className="mt-4 text-sm leading-6 text-slate-400">
                Visualiza ventas, productos más solicitados y el rendimiento del restaurante.
              </p>
            </article>
          </div>
        </section>

        <section id="contacto" className="mt-20 rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 text-slate-100 shadow-2xl shadow-slate-950/20">
          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-emerald-300">Siguiente etapa</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">En marcha: tu sistema de administración completo</h2>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                Pronto agregaremos módulos para inventario, usuarios, facturación y una administración real de reservas. Describe lo que quieres y lo añadimos.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <p className="text-sm text-slate-400">El login de administrador aparecerá aquí cuando esté activo.</p>
              <button disabled className="mt-6 w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-500">
                Iniciar sesión (próximamente)
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
