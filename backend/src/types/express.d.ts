/**
 * Extends the existing Express request type.
 *
 * Without this declaration, TypeScript would report an error for:
 * `request.userId = tokenPayload.userId`
 *
 * This declaration allows TypeScript to recognize the custom field:
 * `request.userId`
 */
export {};

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}
