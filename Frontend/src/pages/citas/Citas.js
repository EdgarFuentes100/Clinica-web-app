import React, { useState } from "react";
import CalendarioHoras from "../../Hooks/CalendarioHoras";

const Citas = () => {
  const [citas, setCitas] = useState([
    {
      id: 1,
      fecha: new Date(),
      horas: ['09:00', '09:30'],
      paciente: "María González",
      motivo: "Limpieza dental",
      telefono: "555-1234",
      email: "maria@email.com",
      estado: "pendiente",
      doctor: "1",
      doctorNombre: "Dr. Carlos Rodríguez",
      doctorEspecialidad: "Ortodoncia"
    },
    {
      id: 2,
      fecha: new Date(),
      horas: ['14:00', '14:30', '15:00'],
      paciente: "Juan Pérez",
      motivo: "Consulta general",
      telefono: "555-5678",
      email: "juan@email.com",
      estado: "confirmada",
      doctor: "2",
      doctorNombre: "Dra. María González",
      doctorEspecialidad: "Endodoncia"
    }
  ]);

  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [horasSeleccionadas, setHorasSeleccionadas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [paciente, setPaciente] = useState("");
  const [motivo, setMotivo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todas");
  const [busqueda, setBusqueda] = useState("");
  const [doctorSeleccionado, setDoctorSeleccionado] = useState("");
  const [filtroDoctor, setFiltroDoctor] = useState("todos");
  const [pestanaActiva, setPestanaActiva] = useState('hoy');

  // Estados para edición
  const [citaEditando, setCitaEditando] = useState(null);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [nuevasHoras, setNuevasHoras] = useState([]);
  const [datosEditados, setDatosEditados] = useState({
    paciente: "",
    motivo: "",
    telefono: "",
    email: ""
  });

  // Lista de doctores disponibles
  const doctores = [
    { id: "1", nombre: "Dr. Carlos Rodríguez", especialidad: "Ortodoncia" },
    { id: "2", nombre: "Dra. María González", especialidad: "Endodoncia" },
    { id: "3", nombre: "Dr. Javier López", especialidad: "Cirugía Oral" },
    { id: "4", nombre: "Dra. Ana Martínez", especialidad: "Periodoncia" },
    { id: "5", nombre: "Dr. Pedro Sánchez", especialidad: "Estética Dental" }
  ];

  // Genera todas las horas de 8:00 a 17:30
  const generarHorasDelDia = () => {
    const todasHoras = [];
    for (let h = 8; h <= 17; h++) {
      ["00", "30"].forEach((m) =>
        todasHoras.push(`${h.toString().padStart(2, "0")}:${m}`)
      );
    }
    return todasHoras;
  };

  // Horas disponibles (no ocupadas) para un doctor específico
  const horasDisponibles = (fecha, doctorId) => {
    const todasHoras = generarHorasDelDia();
    const fechaStr = fecha.toDateString();

    const ocupadas = citas
      .filter((c) =>
        new Date(c.fecha).toDateString() === fechaStr &&
        c.doctor === doctorId
      )
      .flatMap((c) => c.horas);

    return todasHoras.filter((h) => !ocupadas.includes(h));
  };

  // Seleccionar rango de horas
  const seleccionarRango = (hora) => {
    if (!doctorSeleccionado) {
      alert("Por favor, seleccione un doctor primero");
      return;
    }

    const horasDispo = horasDisponibles(fechaSeleccionada, doctorSeleccionado);

    if (horasSeleccionadas.length === 0) {
      setHorasSeleccionadas([hora]);
    } else if (horasSeleccionadas.length === 1) {
      const startIndex = horasDispo.indexOf(horasSeleccionadas[0]);
      const endIndex = horasDispo.indexOf(hora);

      if (startIndex === -1 || endIndex === -1) return;

      const start = Math.min(startIndex, endIndex);
      const end = Math.max(startIndex, endIndex);
      const rango = horasDispo.slice(start, end + 1);

      setHorasSeleccionadas(rango);
    } else {
      setHorasSeleccionadas([hora]);
    }
  };

  const abrirModal = () => {
    if (!doctorSeleccionado) {
      alert("Seleccione un doctor antes de agendar");
      return;
    }
    if (horasSeleccionadas.length === 0) {
      alert("Seleccione un rango de horas antes de agendar");
      return;
    }
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setPaciente("");
    setMotivo("");
    setTelefono("");
    setEmail("");
  };

  const agregarCita = () => {
    if (!paciente) {
      alert("Ingrese el nombre del paciente");
      return;
    }
    if (!doctorSeleccionado) {
      alert("Seleccione un doctor");
      return;
    }

    const horasDispo = horasDisponibles(fechaSeleccionada, doctorSeleccionado);
    const horasNoDisponibles = horasSeleccionadas.filter(h => !horasDispo.includes(h));

    if (horasNoDisponibles.length > 0) {
      alert(`Algunas horas ya no están disponibles: ${horasNoDisponibles.join(", ")}`);
      return;
    }

    const doctor = doctores.find(d => d.id === doctorSeleccionado);

    const nuevaCita = {
      id: Date.now(),
      fecha: new Date(fechaSeleccionada),
      horas: [...horasSeleccionadas],
      paciente,
      motivo: motivo || "Consulta general",
      telefono: telefono || "No especificado",
      email: email || "No especificado",
      estado: "pendiente",
      doctor: doctorSeleccionado,
      doctorNombre: doctor.nombre,
      doctorEspecialidad: doctor.especialidad
    };

    setCitas([...citas, nuevaCita]);
    setHorasSeleccionadas([]);
    cerrarModal();
    alert("Cita agendada exitosamente!");
  };

  const eliminarCita = (id) => {
    if (window.confirm("¿Está seguro de eliminar esta cita?")) {
      setCitas(citas.filter((c) => c.id !== id));
    }
  };

  const cambiarEstado = (id, nuevoEstado) => {
    setCitas(citas.map(c => c.id === id ? { ...c, estado: nuevoEstado } : c));
  };

  // Función para abrir modal de edición
  const abrirModalEditar = (cita) => {
    setCitaEditando(cita);
    setFechaSeleccionada(new Date(cita.fecha));
    setDoctorSeleccionado(cita.doctor);
    setNuevasHoras([...cita.horas]);
    setDatosEditados({
      paciente: cita.paciente,
      motivo: cita.motivo,
      telefono: cita.telefono,
      email: cita.email
    });
    setShowModalEditar(true);
  };

  // Función para cerrar modal de edición
  const cerrarModalEditar = () => {
    setShowModalEditar(false);
    setCitaEditando(null);
    setNuevasHoras([]);
    setDatosEditados({
      paciente: "",
      motivo: "",
      telefono: "",
      email: ""
    });
  };

  // Función para guardar los cambios de la cita
  const guardarCambiosCita = () => {
    if (!citaEditando) return;

    // Verificar que las nuevas horas estén disponibles
    const horasDispo = horasDisponibles(fechaSeleccionada, doctorSeleccionado);
    const horasOcupadas = citas
      .filter(c => c.id !== citaEditando.id &&
        new Date(c.fecha).toDateString() === fechaSeleccionada.toDateString() &&
        c.doctor === doctorSeleccionado)
      .flatMap(c => c.horas);

    const horasNoDisponibles = nuevasHoras.filter(h =>
      horasOcupadas.includes(h) && !citaEditando.horas.includes(h)
    );

    if (horasNoDisponibles.length > 0) {
      alert(`Algunas horas ya no están disponibles: ${horasNoDisponibles.join(", ")}`);
      return;
    }

    if (!datosEditados.paciente) {
      alert("El nombre del paciente es requerido");
      return;
    }

    setCitas(citas.map(c =>
      c.id === citaEditando.id
        ? {
          ...c,
          fecha: new Date(fechaSeleccionada),
          horas: [...nuevasHoras],
          doctor: doctorSeleccionado,
          doctorNombre: doctores.find(d => d.id === doctorSeleccionado)?.nombre || c.doctorNombre,
          paciente: datosEditados.paciente,
          motivo: datosEditados.motivo,
          telefono: datosEditados.telefono,
          email: datosEditados.email
        }
        : c
    ));

    cerrarModalEditar();
    alert("Cita actualizada exitosamente!");
  };

  const getBadgeColor = (estado) => {
    switch (estado) {
      case "pendiente":
        return "bg-amber-100 text-amber-800";
      case "confirmada":
        return "bg-emerald-100 text-emerald-800";
      case "completada":
        return "bg-sky-100 text-sky-800";
      case "cancelada":
        return "bg-rose-100 text-rose-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  // Filtrar citas
  const citasFiltradas = citas.filter(cita => {
    const coincideBusqueda = cita.paciente.toLowerCase().includes(busqueda.toLowerCase()) ||
      cita.motivo.toLowerCase().includes(busqueda.toLowerCase()) ||
      cita.doctorNombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideFiltro = filtroEstado === "todas" || cita.estado === filtroEstado;
    const coincideDoctor = filtroDoctor === "todos" || cita.doctor === filtroDoctor;
    return coincideBusqueda && coincideFiltro && coincideDoctor;
  });

  const citasDelDia = citas.filter(
    (c) => new Date(c.fecha).toDateString() === fechaSeleccionada.toDateString() &&
      (filtroDoctor === "todos" || c.doctor === filtroDoctor)
  );

  // Estadísticas por doctor
  const estadisticas = {
    total: citas.length,
    pendientes: citas.filter(c => c.estado === "pendiente").length,
    confirmadas: citas.filter(c => c.estado === "confirmada").length,
    completadas: citas.filter(c => c.estado === "completada").length,
    hoy: citasDelDia.length
  };

  return (
    <div className="container-fluid py-4 bg-slate-50 min-vh-100">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4 p-3 shadow-sm bg-light rounded">
            <h2 className="fw-bold text-slate-700 mb-0">
              <i className="fas fa-calendar-check me-2 text-violet-500"></i>
              Agenda de Citas Médicas
            </h2>
            <div className="d-flex gap-3 text-primary fw-semibold">
              <span>
                <i className="fas fa-calendar me-1"></i>
                {estadisticas.hoy} hoy
              </span>
              <span>
                <i className="fas fa-list me-1"></i>
                {estadisticas.total} total
              </span>
              <span>
                <i className="fas fa-user-md me-1"></i>
                {doctores.length} doctores
              </span>
            </div>
          </div>

          <div className="row">
            {/* Panel izquierdo - Calendario + Horas */}
            <div className="col-lg-5">
              <div className="card shadow-sm mb-4 border-0 rounded-xl overflow-hidden">
                <div className="card-header bg-gradient-to-r from-violet-500 to-purple-600 py-3">
                  <h5 className="mb-0">
                    <i className="fas fa-calendar-alt me-2"></i>
                    Seleccionar Doctor, Fecha y Hora
                  </h5>
                </div>
                <div className="card-body bg-white">
                  {/* Selector de Doctor */}
                  <div className="mb-4">
                    <h6 className="fw-semibold mb-3 text-slate-700">
                      <i className="fas fa-user-md me-2 text-blue-500"></i>
                      Seleccionar Doctor
                    </h6>
                    <select
                      className="form-select border-slate-300 focus:border-violet-500 focus:ring-violet-500"
                      value={doctorSeleccionado}
                      onChange={(e) => {
                        setDoctorSeleccionado(e.target.value);
                        setHorasSeleccionadas([]);
                      }}
                    >
                      <option value="">Seleccione un doctor</option>
                      {doctores.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.nombre} - {doctor.especialidad}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Componente reutilizable CalendarioHoras */}
                  <CalendarioHoras
                    fechaSeleccionada={fechaSeleccionada}
                    setFechaSeleccionada={setFechaSeleccionada}
                    doctorSeleccionado={doctorSeleccionado}
                    horasSeleccionadas={horasSeleccionadas}
                    setHorasSeleccionadas={setHorasSeleccionadas}
                    horasDisponibles={horasDisponibles}
                    generarHorasDelDia={generarHorasDelDia}
                    seleccionarRango={seleccionarRango}
                  />

                  {/* Botón para agendar */}
                  <div className="mt-3">
                    <button
                      className={`btn w-100 py-2 ${horasSeleccionadas.length === 0
                        ? 'btn-secondary disabled'
                        : 'btn-success'
                        }`}
                      onClick={abrirModal}
                      disabled={horasSeleccionadas.length === 0}
                    >
                      <i className="fas fa-calendar-plus me-2"></i>
                      Agendar Cita{' '}
                      {horasSeleccionadas.length > 0
                        ? `(${horasSeleccionadas[0]} - ${horasSeleccionadas[horasSeleccionadas.length - 1]})`
                        : ''}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel derecho - Lista completa de citas */}
            <div className="col-lg-7">
              {/* Filtros */}
              <div className="card shadow-sm mb-4 border-0 rounded-xl overflow-hidden">
                <div className="card-body bg-white">
                  <div className="row g-3 align-items-center">
                    <div className="col-md-4">
                      <div className="input-group">
                        <span className="input-group-text bg-white border-slate-300">
                          <i className="fas fa-search text-slate-400"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control border-slate-300 focus:border-violet-500 focus:ring-violet-500"
                          placeholder="Buscar por paciente, motivo o doctor..."
                          value={busqueda}
                          onChange={e => setBusqueda(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <select
                        className="form-select border-slate-300 focus:border-violet-500 focus:ring-violet-500"
                        value={filtroEstado}
                        onChange={e => setFiltroEstado(e.target.value)}
                      >
                        <option value="todas">Todas las citas</option>
                        <option value="pendiente">Pendientes</option>
                        <option value="confirmada">Confirmadas</option>
                        <option value="completada">Completadas</option>
                        <option value="cancelada">Canceladas</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <select
                        className="form-select border-slate-300 focus:border-violet-500 focus:ring-violet-500"
                        value={filtroDoctor}
                        onChange={e => setFiltroDoctor(e.target.value)}
                      >
                        <option value="todos">Todos los doctores</option>
                        {doctores.map((doctor) => (
                          <option key={doctor.id} value={doctor.id}>
                            {doctor.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* PESTAÑAS PARA CITAS */}
              <div className="card shadow-sm border-0 rounded-xl overflow-hidden">
                <div className="card-header bg-white border-b border-slate-200 p-0">
                  <div className="d-flex" role="tablist">
                    <button
                      className={`flex-fill text-center py-3 border-0 fw-semibold transition-colors ${pestanaActiva === 'hoy'
                        ? 'bg-sky-50 text-sky-700 border-b-2 border-sky-500'
                        : 'bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      onClick={() => setPestanaActiva('hoy')}
                    >
                      <i className="fas fa-calendar-day me-2"></i>
                      Citas de Hoy
                      <span className={`badge ms-2 ${pestanaActiva === 'hoy' ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                        {citasDelDia.length}
                      </span>
                    </button>
                    <button
                      className={`flex-fill text-center py-3 border-0 fw-semibold transition-colors ${pestanaActiva === 'historial'
                        ? 'bg-slate-100 text-slate-700 border-b-2 border-slate-500'
                        : 'bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      onClick={() => setPestanaActiva('historial')}
                    >
                      <i className="fas fa-history me-2"></i>
                      Historial
                      <span className={`badge ms-2 ${pestanaActiva === 'historial' ? 'bg-slate-500 text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                        {citasFiltradas.length}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="card-body p-0 bg-white">
                  {/* Contenido dinámico según pestaña activa */}
                  {pestanaActiva === 'hoy' ? (
                    <div>
                      {citasDelDia.length === 0 ? (
                        <div className="text-center py-5 text-slate-400">
                          <i className="fas fa-calendar-check fa-3x mb-3 text-sky-200"></i>
                          <p className="fs-5 mb-1">No hay citas para hoy</p>
                          <small className="text-slate-500">¡Día despejado!</small>
                        </div>
                      ) : (
                        <div className="row g-2 p-3">
                          {citasDelDia.map((cita) => (
                            <div key={cita.id} className="col-12">
                              <div className="d-flex justify-content-between align-items-center p-3 border border-sky-200 rounded-lg bg-sky-50 hover:bg-sky-100 transition-colors">
                                <div className="flex-grow-1">
                                  <div className="d-flex align-items-center gap-3 mb-1">
                                    <strong className="text-sky-800">{cita.paciente}</strong>
                                    <span className={`badge ${getBadgeColor(cita.estado)}`}>
                                      {cita.estado}
                                    </span>
                                  </div>
                                  <div className="text-sky-700 small">
                                    <span className="me-3">
                                      <i className="fas fa-clock me-1"></i>
                                      <strong>{cita.horas.join(" - ")}</strong>
                                    </span>
                                    <span className="me-3">
                                      <i className="fas fa-stethoscope me-1"></i>
                                      {cita.motivo}
                                    </span>
                                  </div>
                                  <div className="text-sky-600 small mt-1">
                                    <i className="fas fa-user-md me-1"></i>
                                    {cita.doctorNombre}
                                  </div>
                                </div>

                                <div className="d-flex flex-column gap-1">
                                  <button
                                    className="btn btn-sm bg-blue-50 text-blue-600 border border-blue-300 hover:bg-blue-100"
                                    onClick={() => abrirModalEditar(cita)}
                                    title="Editar cita"
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <select
                                    className="form-select form-select-sm border-sky-300 focus:border-sky-500 focus:ring-sky-500"
                                    value={cita.estado}
                                    onChange={(e) => cambiarEstado(cita.id, e.target.value)}
                                  >
                                    <option value="pendiente">Pendiente</option>
                                    <option value="confirmada">Confirmada</option>
                                    <option value="completada">Completada</option>
                                    <option value="cancelada">Cancelada</option>
                                  </select>
                                  <button
                                    className="btn btn-sm bg-rose-50 text-rose-600 border-0 hover:bg-rose-100"
                                    onClick={() => eliminarCita(cita.id)}
                                    title="Eliminar cita"
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      {citasFiltradas.length === 0 ? (
                        <div className="text-center py-5 text-slate-400">
                          <i className="fas fa-calendar-times fa-3x mb-3"></i>
                          <p className="fs-5 mb-1">No hay citas en el historial</p>
                        </div>
                      ) : (
                        <div className="row g-2 p-3">
                          {citasFiltradas.map((cita) => (
                            <div key={cita.id} className="col-12">
                              <div className="d-flex justify-content-between align-items-center p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                <div className="flex-grow-1">
                                  <div className="d-flex align-items-center gap-3 mb-1">
                                    <strong className="text-slate-800">{cita.paciente}</strong>
                                    <span className={`badge ${getBadgeColor(cita.estado)}`}>
                                      {cita.estado}
                                    </span>
                                  </div>
                                  <div className="text-slate-600 small">
                                    <span className="me-3">
                                      <i className="fas fa-calendar me-1"></i>
                                      {new Date(cita.fecha).toLocaleDateString('es-ES')}
                                    </span>
                                    <span className="me-3">
                                      <i className="fas fa-clock me-1"></i>
                                      {cita.horas.join(" - ")}
                                    </span>
                                    <span className="me-3">
                                      <i className="fas fa-stethoscope me-1"></i>
                                      {cita.motivo}
                                    </span>
                                    <span>
                                      <i className="fas fa-user-md me-1"></i>
                                      {cita.doctorNombre}
                                    </span>
                                  </div>
                                </div>

                                <div className="d-flex gap-2 ms-3">
                                  <button
                                    className="btn btn-sm bg-blue-50 text-blue-600 border border-blue-300 hover:bg-blue-100"
                                    onClick={() => abrirModalEditar(cita)}
                                    title="Editar cita"
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button
                                    className="btn btn-sm bg-rose-50 text-rose-600 border-0 hover:bg-rose-100"
                                    onClick={() => eliminarCita(cita.id)}
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para agendar nueva cita */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content rounded-xl overflow-hidden border-0 shadow-lg">
              <div className="modal-header bg-gradient-to-r from-violet-500 to-purple-600 text-white py-3">
                <h5 className="modal-title">
                  <i className="fas fa-calendar-plus me-2"></i>
                  Completar Información de la Cita
                </h5>
                <button className="btn-close btn-close-white" onClick={cerrarModal}></button>
              </div>
              <div className="modal-body bg-white">
                <div className="alert bg-violet-50 text-violet-800 border border-violet-200 rounded-lg">
                  <strong>Doctor:</strong> {doctores.find(d => d.id === doctorSeleccionado)?.nombre}
                  <br />
                  <strong>Fecha:</strong> {fechaSeleccionada.toLocaleDateString("es-ES")}
                  <br />
                  <strong>Horario:</strong> {horasSeleccionadas.join(" - ")}
                  <br />
                  <strong>Duración:</strong> {horasSeleccionadas.length * 30} minutos
                </div>

                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-semibold text-slate-700">Paciente *</label>
                    <input
                      className="form-control border-slate-300 focus:border-violet-500 focus:ring-violet-500"
                      placeholder="Nombre completo del paciente"
                      value={paciente}
                      onChange={(e) => setPaciente(e.target.value)}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold text-slate-700">Motivo</label>
                    <select
                      className="form-select border-slate-300 focus:border-violet-500 focus:ring-violet-500"
                      value={motivo}
                      onChange={e => setMotivo(e.target.value)}
                    >
                      <option value="">Seleccionar motivo</option>
                      <option value="Limpieza dental">Limpieza dental</option>
                      <option value="Consulta general">Consulta general</option>
                      <option value="Ortodoncia">Ortodoncia</option>
                      <option value="Extracción">Extracción</option>
                      <option value="Blanqueamiento">Blanqueamiento</option>
                      <option value="Urgencia">Urgencia</option>
                      <option value="Control">Control</option>
                    </select>
                  </div>

                  <div className="col-12 col-sm-6">
                    <label className="form-label fw-semibold text-slate-700">Teléfono</label>
                    <input
                      className="form-control border-slate-300 focus:border-violet-500 focus:ring-violet-500"
                      placeholder="Número de contacto"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                    />
                  </div>

                  <div className="col-12 col-sm-6">
                    <label className="form-label fw-semibold text-slate-700">Email</label>
                    <input
                      className="form-control border-slate-300 focus:border-violet-500 focus:ring-violet-500"
                      placeholder="Correo electrónico"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer bg-slate-50">
                <button className="btn bg-slate-200 text-slate-700 border-0 hover:bg-slate-300" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button
                  className="btn btn-primary text-white border-0"
                  onClick={agregarCita}
                  disabled={!paciente}
                >
                  <i className="fas fa-save me-2"></i>
                  Guardar Cita
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModalEditar && citaEditando && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content rounded-xl border-0 shadow-lg">
              <div className="modal-header bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-2">
                <h5 className="modal-title">
                  <i className="fas fa-edit me-2"></i>Editar Cita
                </h5>
                <button className="btn-close btn-close-white" onClick={cerrarModalEditar}></button>
              </div>

              <div className="modal-body">
                <div className="row g-2 mb-2">
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-slate-700">Paciente *</label>
                    <input
                      className="form-control"
                      placeholder="Nombre completo"
                      value={datosEditados.paciente}
                      onChange={(e) => setDatosEditados({ ...datosEditados, paciente: e.target.value })}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-slate-700">Motivo</label>
                    <select
                      className="form-select"
                      value={datosEditados.motivo}
                      onChange={(e) => setDatosEditados({ ...datosEditados, motivo: e.target.value })}
                    >
                      <option value="">Seleccionar motivo</option>
                      <option value="Limpieza dental">Limpieza dental</option>
                      <option value="Consulta general">Consulta general</option>
                      <option value="Ortodoncia">Ortodoncia</option>
                      <option value="Extracción">Extracción</option>
                      <option value="Blanqueamiento">Blanqueamiento</option>
                      <option value="Urgencia">Urgencia</option>
                      <option value="Control">Control</option>
                    </select>
                  </div>
                </div>

                <div className="row g-2 mb-2">
                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold text-slate-700">Teléfono</label>
                    <input
                      className="form-control"
                      placeholder="Número"
                      value={datosEditados.telefono}
                      onChange={(e) => setDatosEditados({ ...datosEditados, telefono: e.target.value })}
                    />
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold text-slate-700">Email</label>
                    <input
                      className="form-control"
                      placeholder="Correo"
                      value={datosEditados.email}
                      onChange={(e) => setDatosEditados({ ...datosEditados, email: e.target.value })}
                    />
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold text-slate-700">Doctor</label>
                    <select
                      className="form-select"
                      value={doctorSeleccionado}
                      onChange={(e) => setDoctorSeleccionado(e.target.value)}
                    >
                      {doctores.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.nombre} - {doctor.especialidad}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-2">
                  <CalendarioHoras
                    fechaSeleccionada={fechaSeleccionada}
                    setFechaSeleccionada={setFechaSeleccionada}
                    doctorSeleccionado={doctorSeleccionado}
                    horasSeleccionadas={horasSeleccionadas}
                    setHorasSeleccionadas={setHorasSeleccionadas}
                    horasDisponibles={horasDisponibles}
                    generarHorasDelDia={generarHorasDelDia}
                    seleccionarRango={seleccionarRango}
                    modoEdicion={true}
                    nuevasHoras={nuevasHoras}
                    setNuevasHoras={setNuevasHoras}
                    horasOriginales={citaEditando.horas}
                  />
                </div>
              </div>

              <div className="modal-footer bg-slate-50 py-2">
                <button className="btn bg-slate-200 text-slate-700" onClick={cerrarModalEditar}>
                  Cancelar
                </button>
                <button
                  className="btn btn-primary"
                  onClick={guardarCambiosCita}
                  disabled={nuevasHoras.length === 0 || !datosEditados.paciente}
                >
                  <i className="fas fa-save me-2"></i>Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default Citas;