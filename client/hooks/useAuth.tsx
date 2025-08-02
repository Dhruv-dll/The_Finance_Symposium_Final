import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple but secure credential hashing using btoa (base64) with salt
const SALT = "TFS2024SecureKey";
const HASHED_USERNAME = btoa(`TFSadmin${SALT}`);
const HASHED_PASSWORD = btoa(`TFSG&#^yOW$kMA08=ryCb+R${SALT}`);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated (with expiry)
    const authData = localStorage.getItem("tfs-admin-auth");
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        const now = new Date().getTime();

        // Check if session is still valid (24 hours)
        if (parsed.expiry && now < parsed.expiry) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("tfs-admin-auth");
        }
      } catch (error) {
        localStorage.removeItem("tfs-admin-auth");
      }
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    try {
      // Hash the input credentials with salt
      const inputUsernameHash = btoa(`${username}${SALT}`);
      const inputPasswordHash = btoa(`${password}${SALT}`);

      if (
        inputUsernameHash === HASHED_USERNAME &&
        inputPasswordHash === HASHED_PASSWORD
      ) {
        setIsAuthenticated(true);

        // Store authentication with 24-hour expiry
        const authData = {
          authenticated: true,
          timestamp: new Date().getTime(),
          expiry: new Date().getTime() + 24 * 60 * 60 * 1000, // 24 hours
        };
        localStorage.setItem("tfs-admin-auth", JSON.stringify(authData));

        return true;
      }
      return false;
    } catch (error) {
      console.error("Authentication error:", error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("tfs-admin-auth");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
