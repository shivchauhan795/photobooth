import { Navigate, Outlet } from "react-router-dom";
import { AuthToken } from "./utils/AuthToken";

export const SemiProtectedRoutes = ({ children }) => {
    const token = AuthToken();
    return !token ? <Outlet /> : <Navigate to="/" />;
};