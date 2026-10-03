import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [status, setStatus] = useState("loading");

    useEffect(() => {
        const checkAuth = async () => {
            if (!token) {
                setStatus("guest");
                return;
            }

            try {
                api.defaults.headers.common.Authorization = `Bearer ${token}`;

                const response = await api.get("/auth/me");

                setUser(response.data.user);
                setStatus("authenticated");
            } catch (error) {
                console.error("Authentication check failed:", error);

                localStorage.removeItem("token");
                setToken(null);
                setUser(null);
                delete api.defaults.headers.common.Authorization;

                setStatus("guest");
            }
        };

        checkAuth();
    }, [token]);

    const login = async (email, password) => {
        const response = await api.post("/auth/login", {
            email,
            password,
        });

        const newToken = response.data.token;

        localStorage.setItem("token", newToken);

        api.defaults.headers.common.Authorization = `Bearer ${newToken}`;

        setToken(newToken);
        setUser(response.data.user);
        setStatus("authenticated");

        return response.data;
    };

    const register = async (name, email, password) => {
        const response = await api.post("/auth/register", {
            name,
            email,
            password,
        });

        return response.data;
    };

    const logout = () => {
        localStorage.removeItem("token");

        delete api.defaults.headers.common.Authorization;

        setToken(null);
        setUser(null);
        setStatus("guest");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                status,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    return useContext(AuthContext);
};