"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useInviteLinkStore from "@/stores/inviteLinkStore";
// import useInviteLinkStore from "@/store/inviteLinkStore";

const AcceptInvitePage = ({ params }: { params: { inviteLinkId: string } }) => {
  const router = useRouter();
  const { inviteLinkId } = params; // Capture inviteLinkId from the URL params
  const { acceptInvite, error } = useInviteLinkStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (inviteLinkId) {
      acceptInvite(inviteLinkId)
        .then(() => {
          setLoading(false);
          router.push("/"); // Redirect to success page after accepting the invite
        })
        .catch(() => setLoading(false));
    }
  }, [inviteLinkId, acceptInvite, router]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>Invitation accepted successfully!</div>;
};

export default AcceptInvitePage;
