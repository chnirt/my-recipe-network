// import { create } from "zustand";

// export type InviteLink = {
//   recipeId: string;
//   inviteLink: string;
//   invitedUsers?: Array<{
//     userId: string; // Sử dụng userId thay vì email
//     invited: boolean;
//     accessRevoked: boolean;
//   }>;
// };

// type InviteLinkStore = {
//   inviteLinks: InviteLink[];
//   loading: boolean;
//   error: string | null;
//   addInviteLink: (inviteLink: InviteLink) => Promise<string>;
//   fetchInviteLinks: () => Promise<void>; // Optional: để fetch danh sách invite links từ server
//   setInviteLinks: (inviteLinks: InviteLink[]) => void;
//   setLoading: (loading: boolean) => void;
//   setError: (error: string | null) => void;
// };

// const useInviteLinkStore = create<InviteLinkStore>((set) => ({
//   inviteLinks: [],
//   loading: false,
//   error: null,

//   // Thêm một invite link mới
//   addInviteLink: async (inviteLink: InviteLink) => {
//     set({ loading: true, error: null });
//     try {
//       const response = await fetch("/api/inviteLinks", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(inviteLink),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to add invite link");
//       }

//       const data: string = await response.json();
//       console.log("🚀 ~ addInviteLink: ~ data:", data)
//       return data;
//     } catch (error: unknown) {
//       set({ error: (error as Error).message });
//     } finally {
//       set({ loading: false });
//     }
//   },

//   // Fetch danh sách invite links từ server
//   fetchInviteLinks: async () => {
//     set({ loading: true, error: null });
//     try {
//       const response = await fetch("/api/inviteLinks");
//       if (!response.ok) {
//         throw new Error("Failed to fetch invite links");
//       }

//       const data: InviteLink[] = await response.json();
//       set({ inviteLinks: data });
//     } catch (error: unknown) {
//       set({ error: (error as Error).message });
//     } finally {
//       set({ loading: false });
//     }
//   },

//   // Setters
//   setInviteLinks: (inviteLinks: InviteLink[]) => set({ inviteLinks }),
//   setLoading: (loading: boolean) => set({ loading }),
//   setError: (error: string | null) => set({ error }),
// }));

// export default useInviteLinkStore;
