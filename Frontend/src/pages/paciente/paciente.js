import React, { useState } from "react";
import Boca from "./boca";

const tratamientos = ["Limpieza", "Relleno", "Extracción", "Endodoncia", "Corona"];

const Pacientes = () => {
  const [dienteSeleccionado, setDienteSeleccionado] = useState(null);
  const [tratamiento, setTratamiento] = useState("");

  const handleSeleccionarDiente = (id) => {
    setDienteSeleccionado(id);
    setTratamiento(""); // resetear tratamiento
  };

  const handleCambiarTratamiento = (e) => {
    setTratamiento(e.target.value);
  };

  return (
    <div className="container-fluid py-4 bg-light">
      {/* Contenedor grande */}
      <div className="row border rounded p-4 mt-4 mx-2 align-items-center">
        {/* Sección de texto */}
        <div className="col-md-6 d-flex flex-column justify-content-center">
          <h3>Información del paciente</h3>
          <p>
            Aquí puedes agregar detalles del paciente, historial médico,
            tratamientos o cualquier otra información relevante.
          </p>

          {/* Mostrar combo solo si se selecciona un diente */}
          {dienteSeleccionado && (
            <div className="mt-3">
              <label htmlFor="tratamiento" className="form-label">
                Tratamiento para el diente {dienteSeleccionado}:
              </label>
              <select
                id="tratamiento"
                className="form-select"
                value={tratamiento}
                onChange={handleCambiarTratamiento}
              >
                <option value="">Selecciona un tratamiento</option>
                {tratamientos.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Sección de la boca */}
        <div className="col-md-6 d-flex justify-content-center">
          <Boca
            onSeleccionarDiente={handleSeleccionarDiente}
            className="w-75" // ocupa 75% del ancho de la columna
          />
        </div>
      </div>
    </div>
  );
};

export default Pacientes;
