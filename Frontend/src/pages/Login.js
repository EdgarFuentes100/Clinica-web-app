import React from "react";
import { useAuth } from "../auth/useAuth";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const { pin, setPin, isLoading, errorMsg, handleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await handleLogin();
    if (result.success) {
      navigate("/dashboard");
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center bg-light"
      style={{ background: "linear-gradient(135deg, #f8f9fa 0%, #e9f5ff 100%)" }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div
              className="card shadow-lg border-0 overflow-hidden"
              style={{ borderRadius: "20px" }}
            >
              <div className="row g-0">
                {/* Formulario */}
                <div className="col-md-6 p-4 p-md-5 d-flex flex-column bg-white">
                  <div className="text-center mb-4">
                    <div
                      className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3"
                      style={{ width: "80px", height: "80px" }}
                    >
                      <i className="bi bi-heart-pulse fs-3 text-primary"></i>
                    </div>
                    <h1
                      className="fw-bold fs-3 text-gradient"
                      style={{
                        background: "linear-gradient(90deg, #0077b6, #00b4d8)",
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                      }}
                    >
                      Clínica Vitalis
                    </h1>
                    <p className="text-muted small">Acceso seguro al sistema médico</p>
                  </div>

                  <form className="mb-4" onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="form-label fw-medium text-dark">
                        Código de acceso
                      </label>
                      <div className="input-group">
                        <input
                          type="password"
                          className={`form-control py-3 ${
                            errorMsg ? "is-invalid" : ""
                          }`}
                          placeholder="Ingrese su PIN de 4 dígitos"
                          value={pin}
                          onChange={(e) =>
                            setPin(e.target.value.replace(/\D/g, "").slice(0, 4))
                          }
                          maxLength={4}
                          style={{ borderRight: "none" }}
                        />
                        <span
                          className="input-group-text bg-white"
                          style={{ borderLeft: "none" }}
                        >
                          <i className="bi bi-lock-fill text-muted"></i>
                        </span>
                        {errorMsg && (
                          <div className="invalid-feedback d-block">
                            {errorMsg}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-3 fw-medium"
                      disabled={pin.length !== 4 || isLoading}
                      style={{
                        transition: "all 0.3s",
                        border: "none",
                        background: "linear-gradient(90deg, #0077b6, #00b4d8)",
                      }}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Verificando...
                        </>
                      ) : (
                        "Ingresar al sistema"
                      )}
                    </button>
                  </form>

                  <div className="mt-auto pt-4 d-flex justify-content-between align-items-center border-top border-light">
                    <a
                      href="#"
                      className="text-decoration-none small text-muted d-flex align-items-center"
                    >
                      <i className="bi bi-question-circle me-2"></i>
                      Soporte técnico
                    </a>
                    <span className="badge bg-light text-dark small fw-normal">
                      v4.2 • SecureMed Pro
                    </span>
                  </div>
                </div>

                {/* Imagen lateral */}
                <div className="col-md-6 d-none d-md-block position-relative bg-primary">
                  <div className="position-absolute w-100 h-100 bg-primary bg-opacity-10"></div>
                  <img
                    src="https://images.unsplash.com/photo-1581595219315-a187dd40c322?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                    className="w-100 h-100"
                    style={{ objectFit: "cover", filter: "brightness(0.9)" }}
                    alt="Equipo médico"
                  />
                  <div
                    className="position-absolute bottom-0 start-0 end-0 p-4 px-5 text-white"
                    style={{ background: "linear-gradient(transparent, rgba(0, 0, 0, 0.7))" }}
                  >
                    <h2 className="fs-5 fw-semibold mb-1">
                      <i className="bi bi-shield-check me-2"></i>
                      Plataforma médica segura
                    </h2>
                    <p className="small mb-0 opacity-75">
                      Diagnósticos avanzados y gestión de pacientes integrada
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
