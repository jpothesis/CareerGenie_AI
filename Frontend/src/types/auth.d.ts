declare module '../store/auth.js' {
    interface User {
      id: string;
      name: string;
      email: string;
    }
  
    type AuthStore = {
      user: User | null;
      token: string | null;
      setUser: (user: User, token: string) => void;
      loginUser: (formData: { email: string; password: string }) => Promise<void>;
      signupUser: (formData: { name: string; email: string; password: string }) => Promise<void>;
      logout: () => void;
    };
  
    const useAuthStore: () => AuthStore;
    export default useAuthStore;
  }
  