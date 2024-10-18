"use client";

import useInvitationStore from "@/stores/invitationStore";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface InvitationPageProps {
  params: {
    id: string;
  };
}

const InvitationPage: React.FC<InvitationPageProps> = ({ params }) => {
  const { editInvitation } = useInvitationStore();
  const router = useRouter();

  useEffect(() => {
    const acceptInvitation = async () => {
      if (!params.id) return; // Early return if no ID is provided

      try {
        await editInvitation({
          invitationId: params.id,
          status: "accepted",
        });

        // Optionally redirect to a success page or show a success message
        router.push("/");
      } catch (error) {
        console.error("Failed to accept invitation:", error);
        // Optionally display an error message to the user
      }
    };

    acceptInvitation(); // Call the function to respond to the invitation
  }, [params.id, editInvitation, router]);

  return <p>Accepting your invitation...</p>; // Optional loading message
};

export default InvitationPage;
