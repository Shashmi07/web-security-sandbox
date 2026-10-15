
export type LeadAccessUser = {
  id: string;
  role: string;
};

export type LeadAccessRecord = {
  ownerId: string;
};

export function canAccessLead(
  user: LeadAccessUser,
  lead: LeadAccessRecord
): boolean {
  return (
    user.role === "admin" ||
    user.id === lead.ownerId
  );
}
