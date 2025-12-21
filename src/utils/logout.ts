import { clearStorage } from "./storage";
import { NavigateFunction } from "react-router-dom";

// Handles user logout by clearing all stored data and redirecting to login
export const logout = (navigate: NavigateFunction) => {
    clearStorage();

    navigate("/login", { replace: true });
};