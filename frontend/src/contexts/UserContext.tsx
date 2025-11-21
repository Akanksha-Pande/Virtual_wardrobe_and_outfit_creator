import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface User {
  id: string;
  username: string;
  email: string;
  role?: string;
  avatarUrl?: string;
}

interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  signup: (username: string, email: string, password: string) => Promise<User | null>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    const response = await fetch("http://localhost:8080/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    setUser(data);

    localStorage.setItem("user", JSON.stringify(data));
    localStorage.setItem("userId", data.id);

    return data;
  };

  const signup = async (username: string, email: string, password: string): Promise<User | null> => {
    const response = await fetch("http://localhost:8080/api/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    setUser(data);

    localStorage.setItem("user", JSON.stringify(data));
    localStorage.setItem("userId", data.id);

    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
  };

  return (
    <UserContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
