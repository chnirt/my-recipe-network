import { create } from "zustand";

export type InviteLink = {
  id: string;
  recipeId: string;
  inviteLink: string;
  invitedUsers?: Array<{
    userId: string;
    invited: boolean;
    accessRevoked: boolean;
  }>;
  createdAt?: string;
  createdBy?: string;
};

type InviteLinkStore = {
  inviteLinks: InviteLink[];
  loading: boolean;
  error: string | null;
  addInviteLink: (recipeId: string) => Promise<string | null>;
  fetchInviteLinks: () => Promise<void>;
  acceptInvite: (inviteLinkId: string) => Promise<void>;
  revokeAccess: (inviteLinkId: string, userId: string) => Promise<void>;
  setInviteLinks: (inviteLinks: InviteLink[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

const useInviteLinkStore = create<InviteLinkStore>((set) => ({
  inviteLinks: [],
  loading: false,
  error: null,

  // Add a new invite link
  addInviteLink: async (recipeId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/inviteLinks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipeId }),
      });

      if (!response.ok) {
        throw new Error("Failed to add invite link");
      }

      const data = await response.json();
      return data.inviteLinkId; // Ensure response includes inviteLinkId
    } catch (error: unknown) {
      set({ error: (error as Error).message });
      console.error("Error adding invite link:", error);
      return null;
    } finally {
      set({ loading: false });
    }
  },

  // Fetch all invite links
  fetchInviteLinks: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/inviteLinks");
      if (!response.ok) {
        throw new Error("Failed to fetch invite links");
      }

      const data: InviteLink[] = await response.json();
      set({ inviteLinks: data });
    } catch (error: unknown) {
      set({ error: (error as Error).message });
      console.error("Error fetching invite links:", error);
    } finally {
      set({ loading: false });
    }
  },

  // Accept an invite
  acceptInvite: async (inviteLinkId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/inviteLinks/${inviteLinkId}/accept`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error("Failed to accept invite");
      }

      const data = await response.json();
      console.log("Invite accepted: ", data.message);
    } catch (error: unknown) {
      set({ error: (error as Error).message });
      console.error("Error accepting invite:", error);
    } finally {
      set({ loading: false });
    }
  },

  // Revoke access for a specific invited user by their userId
  revokeAccess: async (inviteLinkId, userId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `/api/inviteLinks/${inviteLinkId}/revoke?userId=${userId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to revoke access");
      }

      // Refresh the invite links after revocation
      await useInviteLinkStore.getState().fetchInviteLinks();
    } catch (error: unknown) {
      set({ error: (error as Error).message });
      console.error("Error revoking access:", error);
    } finally {
      set({ loading: false });
    }
  },

  // Setters
  setInviteLinks: (inviteLinks: InviteLink[]) => set({ inviteLinks }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
}));

export default useInviteLinkStore;
