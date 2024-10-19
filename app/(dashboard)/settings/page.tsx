"use client";

import useInviteLinkStore from "@/stores/inviteLinkStore";
import React, { useEffect } from "react";

export default function Page() {
  const { inviteLinks, loading, error, fetchInviteLinks, revokeAccess } =
    useInviteLinkStore();

  useEffect(() => {
    fetchInviteLinks(); // Fetch invite links on component mount
  }, [fetchInviteLinks]);

  const handleRevokeAccess = async (inviteLinkId: string, userId: string) => {
    await revokeAccess(inviteLinkId, userId);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Revoke User Access</h1>
      {inviteLinks.length === 0 ? (
        <p>No invite links found.</p>
      ) : (
        <ul>
          {inviteLinks.map((inviteLink) => (
            <li key={inviteLink.recipeId}>
              <h2>Invite Link for ID: {inviteLink.id}</h2>
              <h2>Invite Link for Recipe ID: {inviteLink.recipeId}</h2>
              <ul>
                {inviteLink.invitedUsers?.map((user) => (
                  <li key={user.userId}>
                    <span>User ID: {user.userId}</span>
                    <button
                      onClick={() =>
                        handleRevokeAccess(inviteLink.id, user.userId)
                      }
                    >
                      Revoke Access
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
