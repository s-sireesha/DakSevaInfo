import { createContext, useContext, useState, useEffect } from "react";

const ROLE_KEY = "postal_portal_role";

const RoleContext = createContext({
  role: "admin",
  setRole: () => {},
  isAdmin: true,
  isClient: false,
});

export function RoleProvider({ children }) {
  const [role, setRoleState] = useState(() => {
    return localStorage.getItem(ROLE_KEY) || "admin";
  });

  useEffect(() => {
    localStorage.setItem(ROLE_KEY, role);
  }, [role]);

  const setRole = (newRole) => {
    if (newRole === "admin" || newRole === "client") {
      setRoleState(newRole);
    }
  };

  const value = {
    role,
    setRole,
    isAdmin: role === "admin",
    isClient: role === "client",
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within RoleProvider");
  }
  return context;
}

export default RoleContext;
