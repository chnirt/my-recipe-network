import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Function to ensure user is authenticated
export const authenticateUser = (): string => {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  return userId;
};

/**
 * Utility function to handle errors and return a structured response.
 * @param error - The error object
 * @returns A structured error response with a message and status code.
 */
export const handleErrorResponse = (
  error: unknown,
): { error: string; status: number } => {
  const errorMessage =
    error instanceof Error ? error.message : "An unexpected error occurred.";
  return { error: errorMessage, status: 400 };
};

/**
 * Utility function for creating a JSON response.
 * @param data - The data to return in the response
 * @param status - The HTTP status code
 * @returns A NextResponse object with the provided data and status
 */
export const createResponse = (data: unknown, status: number) => {
  return NextResponse.json(data, { status });
};

/**
 * Handle error and respond with a structured error message.
 * @param error - The error object
 * @returns A NextResponse object with a structured error message
 */
export const handleErrorAndRespond = (error: unknown) => {
  const { error: errorMessage, status } = handleErrorResponse(error);
  return NextResponse.json({ error: errorMessage }, { status });
};
