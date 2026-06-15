type Priority = "ALTA" | "MEDIA" | "BAJA";

type PriorityInput = {
  type?: string | null;
  reference?: string | null;
  description?: string | null;
  evidenceText?: string | null;
};

function hasText(value?: string | null): boolean {
  return Boolean(value && value.trim().length > 0);
}

export function calculatePriority(input: PriorityInput): Priority {
  const hasType = hasText(input.type);
  const hasReference = hasText(input.reference);
  const hasDescription = hasText(input.description);
  const hasEvidence = hasText(input.evidenceText);

  if (hasType && hasReference && hasDescription && hasEvidence) {
    return "ALTA";
  }

  if (hasType && hasReference && hasDescription) {
    return "MEDIA";
  }

  return "BAJA";
}