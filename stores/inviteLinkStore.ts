import { create } from "zustand";
import useUserStore, { User } from "./userStore";

export type Creator = {
  name: string;
  email: string;
  avatar: string;
  firstName: string;
  lastName: string;
};

export type InviteLink = {
  id: string;
  recipeId: string;
  inviteLink: string;
  invitedUsers?: Array<{
    userId: string;
    invited: boolean;
    accessRevoked: boolean;
    inviterDetails?: Creator;
  }>;
  createdAt?: string;
  createdBy?: string;
  creatorDetails?: Creator;
};

type InviteLinkStore = {
  inviteLinks: InviteLink[];
  inviteLinksByUserId: InviteLink[];
  inviteLink: InviteLink | null;
  loading: boolean;
  error: string | null;
  addInviteLink: (recipeId: string) => Promise<string | null>;
  fetchInviteLinks: () => Promise<void>;
  fetchInviteLinksByUserId: (userId: string) => Promise<void>;
  fetchInviteLink: (inviteLinkId: string) => Promise<InviteLink | null>; // New function
  acceptInvite: (inviteLinkId: string) => Promise<void>;
  revokeAccess: (inviteLinkId: string, userId: string) => Promise<void>;
  restoreAccess: (inviteLinkId: string, userId: string) => Promise<void>;
  setInviteLinks: (inviteLinks: InviteLink[]) => void;
  setInviteLinksByUserId: (inviteLinks: InviteLink[]) => void;
  setInviteLink: (inviteLink: InviteLink | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

const useInviteLinkStore = create<InviteLinkStore>((set) => ({
  inviteLinks: [],
  inviteLinksByUserId: [],
  inviteLink: null,
  loading: true,
  error: null,

  // Other methods remain the same...
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
      return data.inviteLinkId;
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

  // Fetch invite links by userId from invitedUsers and map with users
  fetchInviteLinksByUserId: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const fetchInviteLinksPromise = fetch(
        `/api/inviteLinks/invited?userId=${userId}`,
      );

      const fetchUsersPromise = useUserStore.getState().fetchUsers();

      const [inviteLinksResponse] = await Promise.all([
        fetchInviteLinksPromise,
        fetchUsersPromise,
      ]);

      const inviteLinks: InviteLink[] = await inviteLinksResponse.json();
      const users: User[] = useUserStore.getState().users;

      const mappedInviteLinks = inviteLinks.map((inviteLink) => {
        const invitedUsersWithDetails = inviteLink.invitedUsers?.map(
          (invitedUser) => ({
            userId: invitedUser.userId,
            invited: invitedUser.invited,
            accessRevoked: invitedUser.accessRevoked,
          }),
        );

        const creatorData = users.find(
          (user) => user.userId === inviteLink.createdBy,
        );

        return {
          ...inviteLink,
          invitedUsers: invitedUsersWithDetails,
          creatorDetails: creatorData
            ? {
                name: `${creatorData.firstName} ${creatorData.lastName}`,
                email: creatorData.email,
                avatar: creatorData.avatar,
                firstName: creatorData.firstName,
                lastName: creatorData.lastName,
              }
            : undefined,
        };
      });

      set({ inviteLinksByUserId: mappedInviteLinks });
    } catch (error: unknown) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  // Fetch a specific invite link by inviteLinkId
  fetchInviteLink: async (inviteLinkId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/inviteLinks/${inviteLinkId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch invite link");
      }

      const data: InviteLink = await response.json();

      // Fetch all users to map the invitedUsers
      const users = await useUserStore.getState().fetchUsers();

      // Map the invited users with their corresponding details
      const mappedInvitedUsers =
        data.invitedUsers?.map((invitedUser) => {
          const user = users.find((u) => u.userId === invitedUser.userId);
          return {
            ...invitedUser,
            inviterDetails: user
              ? {
                  name: `${user.firstName} ${user.lastName}`,
                  email: user.email,
                  avatar: user.avatar,
                  firstName: user.firstName,
                  lastName: user.lastName,
                }
              : undefined, // If no user found, keep it as null
          };
        }) ?? [];

      // Update the invite link with mapped user details
      const inviteLinkWithMappedUsers = {
        ...data,
        invitedUsers: mappedInvitedUsers,
      };

      set({ inviteLink: inviteLinkWithMappedUsers }); // Update state with the fetched invite link
      return inviteLinkWithMappedUsers;
    } catch (error: unknown) {
      set({ error: (error as Error).message });
      console.error("Error fetching invite link:", error);
      return null;
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

  // Revoke access for a specific invited user by marking their accessRevoked as true
  revokeAccess: async (inviteLinkId, userId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `/api/inviteLinks/${inviteLinkId}/revoke?userId=${userId}`,
        {
          method: "PUT", // Use PUT to update the user's accessRevoked field
        },
      );

      if (!response.ok) {
        throw new Error("Failed to revoke access");
      }

      // Refresh the invite link after revocation
      await useInviteLinkStore.getState().fetchInviteLink(inviteLinkId);
    } catch (error: unknown) {
      set({ error: (error as Error).message });
      console.error("Error revoking access:", error);
    } finally {
      set({ loading: false });
    }
  },

  // Restore access for a specific invited user by marking their accessRevoked as false
  restoreAccess: async (inviteLinkId: string, userId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `/api/inviteLinks/${inviteLinkId}/restore?userId=${userId}`,
        {
          method: "PUT", // Use PUT to update the user's accessRevoked field
        },
      );

      if (!response.ok) {
        throw new Error("Failed to restore access");
      }

      // Refresh the invite link after restoration
      await useInviteLinkStore.getState().fetchInviteLink(inviteLinkId);
    } catch (error: unknown) {
      set({ error: (error as Error).message });
      console.error("Error restoring access:", error);
    } finally {
      set({ loading: false });
    }
  },

  // Setters
  setInviteLinks: (inviteLinks: InviteLink[]) => set({ inviteLinks }),
  setInviteLinksByUserId: (inviteLinks: InviteLink[]) =>
    set({ inviteLinksByUserId: inviteLinks }),
  setInviteLink: (inviteLink: InviteLink | null) => set({ inviteLink }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
}));

export default useInviteLinkStore;
