import { create } from "zustand";

export type Invitation = {
  id?: string;
  email?: string;
  recipeId: string;
  status?: "pending" | "accepted" | "declined";
};

export type FetchInvitationsResponse = Invitation[];

export type AddInvitationPayload = Omit<Invitation, "id">;

export type EditInvitationPayload = {
  invitationId: string;
  status: "accepted" | "declined";
};

type InvitationStore = {
  invitations: Invitation[];
  loading: boolean;
  error: string | null;
  fetchInvitations: () => Promise<FetchInvitationsResponse>;
  addInvitation: (invitation: AddInvitationPayload) => Promise<Invitation>;
  editInvitation: (payload: EditInvitationPayload) => Promise<void>;
  removeInvitation: (id: string) => Promise<void>;
  setInvitations: (invitations: Invitation[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

const useInvitationStore = create<InvitationStore>((set) => ({
  invitations: [],
  loading: false,
  error: null,

  // Fetch all invitations from the API
  fetchInvitations: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/invitations");
      const data: FetchInvitationsResponse = await response.json();

      set({ invitations: data });
      return data;
    } catch (error: unknown) {
      set({ error: (error as Error).message });
      return [];
    } finally {
      set({ loading: false });
    }
  },

  // Add a new invitation
  addInvitation: async (invitation: AddInvitationPayload) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/invitations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invitation),
      });

      if (!response.ok) {
        throw new Error("Failed to add invitation");
      }

      const invitationData = await response.json();
      return invitationData;
    } catch (error: unknown) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  // Edit an invitation (accept or decline)
  editInvitation: async ({ invitationId, status }: EditInvitationPayload) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/invitations/${invitationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to edit invitation");
      }
    } catch (error: unknown) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  // Remove an invitation
  removeInvitation: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/invitations/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove invitation");
      }
    } catch (error: unknown) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  setInvitations: (invitations: Invitation[]) => set({ invitations }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
}));

export default useInvitationStore;
