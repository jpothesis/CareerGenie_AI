import { useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/auth";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
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

  if (!token) return null; // show loading spinner

  return children;
};

export default ProtectedRoute;
