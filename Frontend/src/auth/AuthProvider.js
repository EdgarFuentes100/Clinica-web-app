import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import { useFetch } from "../api/useFetch";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const { getFetch, postFetch } = useFetch();
    const [user, setUser] = useState(null);
    const [checking, setChecking] = useState(true);

    // Verifica sesión en el inicio
    const checkAuth = useCallback(async () => {
        setChecking(true);
        const resp = await getFetch("auth/check");
        if (resp.ok && resp.datos) setUser(resp.datos);
        else setUser(null);
        setChecking(false);
    }, [getFetch]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Login
    const login = async (pin) => {
        const resp = await postFetch("auth/login", { pin });
        if (resp.ok && resp.datos) {
            setUser(resp.datos);
            return { success: true };
        }
        setUser(null);
        return { success: false, message: resp.mensaje || "PIN incorrecto" };
    };

    // Logout
    const logout = async () => {
        await postFetch("auth/logout", {});
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, checkAuth, checking }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);
