import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";

function ProtectedRoute() {
    const { status } = useAuth();
    const location = useLocation();

    // Wait until authentication status is checked
    if (status === "loading") {
        return <LoadingSpinner message="Checking authentication..." />;
    }

    // Guest users are redirected to login
    if (status !== "authenticated") {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    // Authenticated users can access the protected route
    return <Outlet />;
}

export default ProtectedRoute;