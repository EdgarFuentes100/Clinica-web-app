// CalendarioHoras.js - VERSIÓN CON RANGOS Y ESTILOS ORIGINALES
import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CalendarioHoras = ({
    fechaSeleccionada,
    setFechaSeleccionada,
    doctorSeleccionado,
    horasSeleccionadas,
    setHorasSeleccionadas,
    horasDisponibles,
    generarHorasDelDia,
    seleccionarRango,
    modoEdicion = false,
    nuevasHoras = [],
    setNuevasHoras,
    horasOriginales = []
}) => {

    // Función para seleccionar rangos en modo edición
    const seleccionarRangoEdicion = (hora) => {
        if (!doctorSeleccionado) return;

        const horasDispo = horasDisponibles(fechaSeleccionada, doctorSeleccionado)
            .concat(horasOriginales); // Incluir horas originales disponibles

        if (nuevasHoras.length === 0) {
            // Primera selección
            setNuevasHoras([hora]);
        } else if (nuevasHoras.length === 1) {
            // Segunda selección - crear rango
            const todasHoras = generarHorasDelDia();
            const startIndex = todasHoras.indexOf(nuevasHoras[0]);
            const endIndex = todasHoras.indexOf(hora);

            if (startIndex === -1 || endIndex === -1) return;

            const start = Math.min(startIndex, endIndex);
            const end = Math.max(startIndex, endIndex);
            const rango = todasHoras.slice(start, end + 1);

            // Filtrar solo las horas disponibles (incluyendo las originales)
            const rangoDisponible = rango.filter(h =>
                horasDispo.includes(h) || horasOriginales.includes(h)
            );

            setNuevasHoras(rangoDisponible);
        } else {
            // Reiniciar selección
            setNuevasHoras([hora]);
        }
    };

    return (
        <>
            {/* Calendario */}
            <div className="mb-4">
                <h6 className="fw-semibold mb-3 text-slate-700">
                    <i className="fas fa-calendar me-2 text-violet-500"></i>
                    {modoEdicion ? "Cambiar Fecha" : "Seleccionar Día"}
                </h6>
                <Calendar
                    onChange={setFechaSeleccionada}
                    value={fechaSeleccionada}
                    minDate={new Date()}
                    className="w-100 border-0 rounded-lg overflow-hidden"
                />
            </div>

            {/* Selector de Horas */}
            <div className="mt-4">
                <h6 className="fw-semibold mb-3 text-slate-700">
                    <i className="fas fa-clock me-2 text-emerald-500"></i>
                    {modoEdicion ? "Seleccionar Rango de Horas" : "Seleccionar Rango de Horas"}
                </h6>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    {!doctorSeleccionado ? (
                        <div className="alert alert-warning text-center">
                            <i className="fas fa-exclamation-triangle me-2"></i>
                            Seleccione un doctor para ver las horas disponibles
                        </div>
                    ) : (
                        <>
                            <small className="text-slate-500 d-block mb-2">
                                Haga clic en la hora inicial y luego en la hora final para seleccionar un rango
                            </small>

                            <div className="horas-grid">
                                {generarHorasDelDia().map((hora) => {
                                    // En modo edición, las horas originales siempre están disponibles
                                    const isDisponible = modoEdicion
                                        ? horasDisponibles(fechaSeleccionada, doctorSeleccionado).includes(hora) ||
                                        horasOriginales.includes(hora)
                                        : horasDisponibles(fechaSeleccionada, doctorSeleccionado).includes(hora);

                                    const isSeleccionada = modoEdicion
                                        ? nuevasHoras.includes(hora)
                                        : horasSeleccionadas.includes(hora);

                                    return (
                                        <button
                                            key={hora}
                                            className={`btn btn-sm m-1 ${isSeleccionada
                                                ? 'btn-primary text-white border-0'
                                                : isDisponible
                                                    ? 'btn-outline-secondary'
                                                    : 'btn-secondary text-white opacity-50 border-0'
                                                }`}
                                            onClick={() => {
                                                if (isDisponible) {
                                                    if (modoEdicion) {
                                                        // MODO EDICIÓN: usar selección por rangos
                                                        seleccionarRangoEdicion(hora);
                                                    } else {
                                                        // MODO NORMAL: selección de rango
                                                        seleccionarRango(hora);
                                                    }
                                                }
                                            }}
                                            disabled={!isDisponible}
                                            title={isDisponible ? "Haga clic para seleccionar" : "Hora no disponible"}
                                        >
                                            {hora}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Información de selección */}
                            {(modoEdicion ? nuevasHoras.length > 0 : horasSeleccionadas.length > 0) && (
                                <div className={`mt-3 p-3 rounded-lg border ${modoEdicion ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-violet-50 text-violet-800 border-violet-200'
                                    }`}>
                                    <strong>Rango seleccionado:</strong> {modoEdicion
                                        ? `${nuevasHoras[0]} - ${nuevasHoras[nuevasHoras.length - 1]}`
                                        : `${horasSeleccionadas[0]} - ${horasSeleccionadas[horasSeleccionadas.length - 1]}`
                                    }
                                    <br />
                                    <small>Duración: {(modoEdicion ? nuevasHoras.length : horasSeleccionadas.length) * 30} minutos</small>
                                    {modoEdicion && horasOriginales.length > 0 && (
                                        <div className="mt-1 text-sm text-blue-600">
                                            <small>
                                                <strong>Horario original:</strong> {horasOriginales.join(" - ")}
                                            </small>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default CalendarioHoras;