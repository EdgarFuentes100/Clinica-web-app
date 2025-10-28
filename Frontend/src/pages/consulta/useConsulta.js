import { useState, useEffect } from 'react';
import { useFetch } from '../../api/useFetch';

const useConsulta = () => {
    const [dientes, setDientes] = useState([]);
    const [tratamientos, setTratamientos] = useState([]);
    const { getFetch } = useFetch();

    // 🔹 useEffect para ejecutar getDientes al montar el componente
    useEffect(() => {
        getDientes();
    }, []); // [] significa que se ejecuta solo una vez al montar

    useEffect(() => {
        getTratamientos();
    }, []);

    const getDientes = () => {
        const urlParcial = 'diente/listar';
        getFetch(urlParcial)
            .then((data) => {
                const { datos, mensaje, ok } = data;
                if (ok) {
                    setDientes(datos);
                } else {
                    console.error(mensaje);
                }
            })
            .catch((error) => {
                console.error('Error al obtener dientes:', error);
            });
    };

    const getTratamientos = () => {
        const urlParcial = 'tratamiento/listar';
        getFetch(urlParcial)
            .then((data) => {
                const { datos, mensaje, ok } = data;
                if (ok) {
                    setTratamientos(datos);
                } else {
                    console.error(mensaje);
                }
            })
            .catch((error) => {
                console.error('Error al obtener dientes:', error);
            });
    };

    return {
        dientes,
        tratamientos
    };
};

export { useConsulta };
