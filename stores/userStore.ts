import { create } from "zustand";

export interface User {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
}

type UserStore = {
  user: User | null; // User information
  users: User[];
  loading: boolean; // Loading state
  error: string | null; // Error state
  saveUserData: () => Promise<void>; // Function to save user data
  fetchUsers: () => Promise<any[]>; // New fetchUsers function
  clearUser: () => void; // Function to clear user data
  setUser: (user: User) => void; // Function to set user data
  setLoading: (loading: boolean) => void; // Function to set loading state
  setError: (error: string | null) => void; // Function to set error state
};

const useUserStore = create<UserStore>((set) => ({
  user: null,
  users: [],
  loading: false,
  error: null,

  // Save user data after logging in
  saveUserData: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/users", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to save user data");
      }

      const data = await response.json();
      set({ user: data.user }); // Update the user data in the state
    } catch (error: unknown) {
      set({ error: (error as Error).message });
      console.error("Error saving user data:", error);
    } finally {
      set({ loading: false });
    }
  },

  // Fetch all users from the API
  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/users"); // Assuming you have an endpoint like /api/users

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const usersData = await response.json();
      set({ users: usersData }); // Assuming you have a state for users
      return usersData; // Return fetched users data
    } catch (error: unknown) {
      set({ error: (error as Error).message });
      return []; // Return empty array on error
    } finally {
      set({ loading: false }); // Always set loading to false
    }
  },

  // Clear user data
  clearUser: () => set({ user: null }),

  // Set user data manually (if needed)
  setUser: (user: User) => set({ user }),
  setUsers: (users: User[]) => set({ users }),

  // Setters for loading and error
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
}));

export default useUserStore;
