import { Navigate, Outlet } from "react-router-dom";
import { AuthToken } from "./utils/AuthToken";

export const ProtectedRoutes = ({ children }) => {
    const token = AuthToken();
    return token ? <Outlet /> : <Navigate to="/login" />;
};