import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      admin: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setAdmin: (admin) => set({ admin, isAuthenticated: !!admin }),

      setToken: (token) => set({ token }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      login: async (credentials) => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch("/api/admin/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
            credentials: "include",
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Login failed");
          }

          set({
            admin: data.admin,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return { success: true, data };
        } catch (error) {
          set({
            error: error.message,
            isLoading: false,
            isAuthenticated: false,
            admin: null,
            token: null,
          });
          return { success: false, error: error.message };
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch("/api/admin/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
            credentials: "include",
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Registration failed");
          }

          set({
            admin: data.admin,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return { success: true, data };
        } catch (error) {
          set({
            error: error.message,
            isLoading: false,
          });
          return { success: false, error: error.message };
        }
      },

      logout: async () => {
        set({ isLoading: true });

        try {
          await fetch("/api/admin/logout", {
            method: "GET",
            credentials: "include",
          });
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          set({
            admin: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      forgotPassword: async (formData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch("/api/admin/forgot-password", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: formData.email,
              dateOfBirth: formData.dateOfBirth,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Verification failed");
          }

          set({ isLoading: false, error: null });
          return { success: true, adminId: data.adminId, data };
        } catch (error) {
          set({
            error: error.message,
            isLoading: false,
          });
          return { success: false, error: error.message };
        }
      },

      resetPassword: async (adminId, newPassword, confirmPassword) => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch("/api/admin/reset-password", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              adminId,
              newPassword,
              confirmPassword,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Password reset failed");
          }

          set({ isLoading: false, error: null });
          return { success: true, data };
        } catch (error) {
          set({
            error: error.message,
            isLoading: false,
          });
          return { success: false, error: error.message };
        }
      },

      checkAuth: async () => {
        const { token } = get();
        if (!token) return;

        set({ isLoading: true });

        try {
          const response = await fetch("/api/admin/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          });

          if (response.ok) {
            const data = await response.json();
            set({
              admin: data.admin,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            // Token is invalid, clear auth state
            set({
              admin: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            admin: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "vesturo-auth",
      partialize: (state) => ({
        admin: state.admin,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
