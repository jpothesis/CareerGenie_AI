import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import useAuthStore from "../store/auth"; // Zustand auth store

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { token, loadFromStorage } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  if (!token) return null; // You can replace this with a spinner if needed

  return <>{children}</>;
};

export default ProtectedRoute;
