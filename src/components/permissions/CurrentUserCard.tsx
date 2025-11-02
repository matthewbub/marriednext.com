"use client";

import { UserRole } from "./permissions.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CurrentUserCardProps {
  email: string;
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const roleLabels = {
  spouse: "Spouse",
  family: "Family Member",
  planner: "Wedding Planner",
};

export function CurrentUserCard({
  email,
  role,
  onRoleChange,
}: CurrentUserCardProps) {
  return (
    <div className="rounded-xl bg-white border-2 border-blue-300 p-4 shadow-sm">
      <div className="flex items-start justify-between mb-3 gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {email}
            </h3>
            <span className="text-xs font-bold px-2 py-1 rounded bg-blue-600 text-white">
              YOU
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{roleLabels[role]}</span>
          </div>
        </div>
        <div className="shrink-0">
          <Select
            value={role}
            onValueChange={(value: UserRole) => onRoleChange(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="spouse">Spouse</SelectItem>
              <SelectItem value="family">Family Member</SelectItem>
              <SelectItem value="planner">Wedding Planner</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <p className="text-xs text-gray-600">
        This is your account. Change your role to reflect your involvement in
        the wedding planning.
      </p>
    </div>
  );
}
