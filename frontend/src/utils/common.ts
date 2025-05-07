import crypto from "crypto";

/**
 * Generate a unique ID using Node's crypto module
 * This is an alternative to using the uuid package
 */
export function generateUniqueId(): string {
  return crypto.randomBytes(16).toString("hex");
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
