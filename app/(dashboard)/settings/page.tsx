"use client";

import useInvitationStore, { Invitation } from "@/stores/invitationStore";
import React, { useEffect, useState } from "react";

export default function Page() {
  const {
    invitations,
    fetchInvitations,
    addInvitation,
    editInvitation,
    removeInvitation,
    loading,
    error,
  } = useInvitationStore();

  const [selectedInvitationId, setSelectedInvitationId] = useState<
    string | null
  >(null);

  useEffect(() => {
    // Fetch invitations when the component mounts
    fetchInvitations();
  }, [fetchInvitations]);

  const handleAddInvitation = async () => {
    // Replace with actual recipe ID as needed
    const recipeId = "sample-recipe-id";
    await addInvitation({ recipeId, status: "pending" });
  };

  const handleEditInvitation = async (status: "accepted" | "declined") => {
    if (selectedInvitationId) {
      await editInvitation({ invitationId: selectedInvitationId, status });
      setSelectedInvitationId(null); // Clear the selected invitation after responding
    }
  };

  const handleRemoveInvitation = async (id: string) => {
    await removeInvitation(id);
  };

  return (
    <div className="px-4 pb-8 pt-4">
      <h1>Invitations</h1>
      <button onClick={handleAddInvitation} disabled={loading}>
        Send Invitation
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Current Invitations</h2>
      {loading && <p>Loading...</p>}
      {invitations.length === 0 ? (
        <p>No current invitations.</p>
      ) : (
        <ul>
          {invitations.map((invitation: Invitation) => (
            <li key={invitation.id}>
              {invitation.id} - Status: {invitation.status}
              {invitation.status === "pending" && (
                <>
                  <button
                    onClick={() => {
                      if (invitation.id) {
                        setSelectedInvitationId(invitation.id);
                        handleEditInvitation("accepted");
                      }
                    }}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => {
                      if (invitation.id) {
                        setSelectedInvitationId(invitation.id);
                        handleEditInvitation("declined");
                      }
                    }}
                  >
                    Decline
                  </button>
                </>
              )}
              <button onClick={() => handleRemoveInvitation(invitation.id!)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
