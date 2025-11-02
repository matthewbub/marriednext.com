"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InviteUserFormData, UserRole } from "./permissions.types";

interface InviteUserFormProps {
  onSubmit: (data: InviteUserFormData) => void;
  isSubmitting?: boolean;
}

export function InviteUserForm({
  onSubmit,
  isSubmitting,
}: InviteUserFormProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("family");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!email.trim()) {
      return;
    }
    onSubmit({ email: email.trim(), role, message: message.trim() });
  };

  const canSubmit = email.trim() !== "";

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email Address
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="collaborator@example.com"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium mb-1">
          Role
        </label>
        <Select
          value={role}
          onValueChange={(value: UserRole) => setRole(value)}
          disabled={isSubmitting}
        >
          <SelectTrigger id="role">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="spouse">Spouse</SelectItem>
            <SelectItem value="family">Family Member</SelectItem>
            <SelectItem value="planner">Wedding Planner</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1">
          Custom Message (Optional)
        </label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add a personal message to the invitation..."
          rows={3}
          disabled={isSubmitting}
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? "Sending..." : "Send Invitation"}
        </Button>
      </div>
    </div>
  );
}

