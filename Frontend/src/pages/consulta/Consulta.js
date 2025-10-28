import React, { useState } from "react";
import Select from "react-select";
import Boca from "../../data/bocaSVG";
import { useConsulta } from "./useConsulta";

const consultasPasadasEjemplo = [
  {
    id: 1,
    fecha: "2025-10-01",
    procedimientos: [
      { diente: 12, tratamientos: ["Limpieza"] },
      { diente: 14, tratamientos: ["Relleno"] }
    ],
    observaciones: "Consulta anterior de ejemplo"
  }
];

const Consulta = () => {
  const [dienteSeleccionado, setDienteSeleccionado] = useState(null);
  const [tratamiento, setTratamiento] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [procedimientosTemp, setProcedimientosTemp] = useState([]);
  const [consultas, setConsultas] = useState(consultasPasadasEjemplo);
  const [consultaExpandida, setConsultaExpandida] = useState(null);
  const { dientes, tratamientos } = useConsulta();

  const handleSeleccionarDiente = (id) => {
    setDienteSeleccionado(id);
    setTratamiento("");
  };

  // ✅ Solución corregida
  const handleAgregarProcedimiento = () => {
    if (!dienteSeleccionado || !tratamiento) return;

    const nuevosProcedimientos = [...procedimientosTemp];

    // Buscar si ya existe un registro para este diente o "todos"
    const existente = nuevosProcedimientos.find(
      p => p.diente === dienteSeleccionado
    );

    if (existente) {
      // Si ya existe, solo agregar el tratamiento si no está
      if (!existente.tratamientos.includes(tratamiento)) {
        existente.tratamientos.push(tratamiento);
      }
    } else {
      // Si no existe, crear nuevo registro
      nuevosProcedimientos.push({
        diente: dienteSeleccionado,
        tratamientos: [tratamiento],
      });
    }

    setProcedimientosTemp(nuevosProcedimientos);
    setDienteSeleccionado(null);
    setTratamiento("");
  };

  const handleQuitarProcedimiento = (dienteId, tratamientoAEliminar) => {
    const nuevosProcedimientos = procedimientosTemp
      .map(p => {
        if (p.diente === dienteId) {
          const tratamientosFiltrados = p.tratamientos.filter(t => t !== tratamientoAEliminar);
          return tratamientosFiltrados.length > 0 ? { ...p, tratamientos: tratamientosFiltrados } : null;
        }
        return p;
      })
      .filter(Boolean);
    setProcedimientosTemp(nuevosProcedimientos);
  };

  const handleRegistrarConsulta = () => {
    if (procedimientosTemp.length === 0) return;

    const nuevaConsulta = {
      id: Date.now(),
      fecha: new Date().toISOString().split("T")[0],
      procedimientos: procedimientosTemp,
      observaciones: observaciones || "Sin observaciones"
    };

    setConsultas([nuevaConsulta, ...consultas]);
    setProcedimientosTemp([]);
    setObservaciones("");
  };

  const toggleExpandirConsulta = (id) => {
    setConsultaExpandida(consultaExpandida === id ? null : id);
  };


  const opcionesTratamientos = tratamientos.map(t => ({
    value: t.idTratamiento, // el id interno
    label: t.nombre          // lo que se muestra
  }));

  const opcionesDientes = [
    { value: "0", label: "Todos los dientes" },
    ...dientes.map(d => ({ value: d.idDiente, label: `Diente ${d.numero} - ${d.nombre} ` }))
  ];

  return (
    <div className="container-fluid py-0 bg-gray-50 min-vh-100">
      <div className="bg-white rounded-lg shadow-sm p-2 mb-3">
        <div className="row justify-content-center">
          {/* Bloque izquierdo: datos personales - 2 ELEMENTOS POR FILA */}
          <div className="col-12 col-md-6 mb-2 mb-md-0">
            <div className="row g-1 justify-content-center">
              {/* Fila 1: expediente y edad */}
              <div className="col-6 d-flex justify-content-center align-items-center mb-1">
                <strong className="me-1 text-nowrap fs-6">Expediente:</strong>
                <span className="fs-6">122-122</span>
              </div>
              <div className="col-6 d-flex justify-content-center align-items-center mb-1">
                <strong className="me-1 text-nowrap fs-6">Edad:</strong>
                <span className="fs-6">32 años</span>
              </div>

              {/* Fila 2: nombre y teléfono */}
              <div className="col-6 d-flex justify-content-center align-items-center">
                <strong className="me-1 text-nowrap fs-6">Nombre:</strong>
                <span className="fs-6">Juan Pérez García</span>
              </div>
              <div className="col-6 d-flex justify-content-center align-items-center">
                <strong className="me-1 text-nowrap fs-6">Teléfono:</strong>
                <span className="d-flex align-items-center fs-6">
                  <i className="fas fa-phone text-muted me-1"></i>
                  +503 1234-5678
                </span>
              </div>
            </div>
          </div>

          {/* Bloque derecho: combo de citas + botón - CENTRADO */}
          <div className="col-12 col-md-6 d-flex flex-column gap-1 align-items-center">
            <div className="d-flex flex-column flex-sm-row gap-1 w-100 justify-content-center">
              <Select
                options={[
                  { value: 1, label: "01/11 09:00 - Limpieza" },
                  { value: 2, label: "03/11 14:00 - Revisión" },
                  { value: 3, label: "05/11 11:00 - Extracción" }
                ]}
                placeholder="Citas..."
                isClearable
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: '40px',
                    fontSize: '0.9rem',
                    border: '1px solid #dee2e6'
                  }),
                  menu: (base) => ({
                    ...base,
                    fontSize: '0.85rem'
                  })
                }}
                className="flex-grow-1"
              />
              <button className="btn btn-primary d-flex align-items-center justify-content-center gap-1 px-2 py-1 flex-shrink-0">
                <i className="fas fa-eye fs-6"></i>
                <span className="d-none d-sm-inline fs-6">Ver</span>
              </button>
            </div>

            <div className="d-flex justify-content-center gap-2 mt-1">
              <small className="text-muted d-flex align-items-center fs-6">
                <i className="fas fa-clock me-1"></i>
                <span>3 pendientes</span>
              </small>
              <small className="text-warning d-flex align-items-center fs-6">
                <i className="fas fa-exclamation-triangle me-1"></i>
                <span>1 urgente</span>
              </small>
            </div>
          </div>
        </div>
      </div>


      <div className="row flex-column-reverse flex-lg-row g-4">

        {/* Formulario - IZQUIERDA en desktop, ABAJO en móviles */}
        <div className="col-lg-7">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-slate-700 mb-1 font-semibold d-none d-lg-block">Gestión de Pacientes</h2>
            <p className="text-slate-500 text-sm mb-4 d-none d-lg-block">Registro y seguimiento de tratamientos dentales</p>

            <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-100">
              <h5 className="text-slate-700 font-medium mb-3">Nueva Consulta</h5>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label text-slate-600 text-sm font-medium">Diente</label>

                  <Select
                    options={opcionesDientes}
                    value={opcionesDientes.find(o => o.value === dienteSeleccionado)}
                    onChange={(selected) => setDienteSeleccionado(selected ? selected.value : null)}
                    placeholder="Selecciona un diente"
                    isClearable
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderColor: "#ccc"
                      })
                    }}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-slate-600 text-sm font-medium">Tratamiento</label>

                  <Select
                    options={opcionesTratamientos}
                    value={opcionesTratamientos.find(o => o.value === tratamiento)}
                    onChange={(selected) => setTratamiento(selected ? selected.value : "")}
                    placeholder="Selecciona un tratamiento"
                    isClearable
                    isDisabled={!dienteSeleccionado}
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderColor: !dienteSeleccionado ? "#ccc" : base.borderColor
                      })
                    }}
                  />
                </div>

              </div>

              <div className="mb-4">
                <label className="form-label text-slate-600 text-sm font-medium">Observaciones</label>
                <textarea
                  className="form-control border-slate-300 focus:border-blue-400 focus:ring-blue-400"
                  rows="3"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Notas y observaciones sobre la consulta..."
                />
              </div>

              <div className="d-flex gap-2 mb-3">
                <button
                  className="btn btn-primary px-4 py-2"
                  onClick={handleAgregarProcedimiento}
                  disabled={!dienteSeleccionado || !tratamiento}
                >
                  Agregar Procedimiento
                </button>
                <button
                  className="btn btn-success px-4 py-2"
                  onClick={handleRegistrarConsulta}
                  disabled={procedimientosTemp.length === 0}
                >
                  Registrar Consulta
                </button>
              </div>

              {procedimientosTemp.length > 0 && (
                <div className="mt-3 p-3 bg-white rounded border">
                  <strong className="text-slate-700">Procedimientos en esta consulta:</strong>
                  <div className="mt-2">
                    {procedimientosTemp.map(p => (
                      <div key={p.diente} className="d-flex align-items-center justify-content-between bg-slate-50 px-3 py-2 rounded mb-2">
                        <span>
                          {p.diente === "0"
                            ? "Todos los dientes"
                            : `Diente ${p.diente}`}: {p.tratamientos.join(", ")}
                        </span>
                        <div>
                          {p.tratamientos.map(t => (
                            <button
                              key={t}
                              className="btn btn-sm btn-outline-danger ms-1"
                              onClick={() => handleQuitarProcedimiento(p.diente, t)}
                            >
                              ×
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Imagen de la boca - DERECHA en desktop, ARRIBA en móviles */}
        <div className="col-lg-5">
          <div className="text-center d-block d-lg-none">
            <h2 className="text-slate-700 mb-1 font-semibold">Gestión de Pacientes</h2>
            <p className="text-slate-500 text-sm mb-4">Registro y seguimiento de tratamientos dentales</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center h-100">
            <Boca
              dienteSeleccionado={dienteSeleccionado}
              dientesConProcedimientos={procedimientosTemp.map(p => p.diente)}
              onSeleccionarDiente={handleSeleccionarDiente}
            />
          </div>
        </div>

      </div>

      {/* Historial de consultas */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h5 className="text-slate-700 font-medium mb-3">Historial de Consultas</h5>

            {consultas.map((consulta) => (
              <div
                key={consulta.id}
                onClick={() => toggleExpandirConsulta(consulta.id)}
                style={{
                  backgroundColor:
                    consultaExpandida === consulta.id ? "#dbeafe" : "#eff6ff", // azul suave
                  border: "1px solid #cbd5e1",
                  borderRadius: "10px",
                  padding: "15px",
                  marginBottom: "12px",
                  transition: "background-color 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  if (consultaExpandida !== consulta.id)
                    e.currentTarget.style.backgroundColor = "#dbeafe";
                }}
                onMouseLeave={(e) => {
                  if (consultaExpandida !== consulta.id)
                    e.currentTarget.style.backgroundColor = "#eff6ff";
                }}
              >
                {/* Encabezado */}
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong className="text-slate-700">{consulta.fecha}</strong>
                    <span className="text-slate-600 ms-2">
                      {consulta.procedimientos
                        .map((p) =>
                          p.diente === "0"
                            ? `Todos: ${p.tratamientos.join(", ")}`
                            : `Diente ${p.diente}: ${p.tratamientos.join(", ")}`
                        )
                        .join(" | ")}
                    </span>
                  </div>
                  <span className="text-slate-400">
                    {consultaExpandida === consulta.id ? "▲" : "▼"}
                  </span>
                </div>

                {/* Detalles expandido */}
                {consultaExpandida === consulta.id && (
                  <div
                    className="mt-3 pt-3 border-top border-slate-200"
                    style={{
                      backgroundColor: "white",
                      borderRadius: "10px",
                      padding: "10px",
                    }}
                  >
                    <p className="text-slate-600 mb-0">{consulta.observaciones}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Consulta;
