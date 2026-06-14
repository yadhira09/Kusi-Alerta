import { Priority } from "@prisma/client";

export function calculatePriority(input: { type: string; reference?: string; description?: string; evidenceText?: string }): Priority {
  const hasClearType = Boolean(input.type && input.type.trim().length > 3);
  const hasReference = Boolean(input.reference && input.reference.trim().length >= 10);
  const descriptionLength = input.description?.trim().length ?? 0;
  const hasEvidence = Boolean(input.evidenceText && input.evidenceText.trim().length > 0);

  if (hasClearType && hasReference && descriptionLength >= 25) return Priority.ALTA;
  if (hasClearType && hasReference && (descriptionLength >= 8 || hasEvidence)) return Priority.MEDIA;
  return Priority.BAJA;
}
