export function extractWeddingId(
  sessionClaims: CustomJwtSessionClaims
): string | undefined {
  return (sessionClaims?.metadata as { weddingId?: string })?.weddingId;
}
