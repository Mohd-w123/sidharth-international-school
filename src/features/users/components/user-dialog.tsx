"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { createUser, updateUser } from "@/actions/user.actions";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import type { UserRow } from "./users-table";

interface RoleOption {
  _id: string;
  name: string;
  slug: string;
}

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserRow | null;
  roles: RoleOption[];
}

export function UserDialog({ open, onOpenChange, user, roles }: UserDialogProps) {
  const isEditing = !!user;
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Sync form state when dialog opens with a user
  const [prevUser, setPrevUser] = useState<UserRow | null>(null);
  if (user !== prevUser) {
    setPrevUser(user);
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPassword("");
      setRoleId(typeof user.role === "object" ? user.role._id : String(user.role));
      setIsActive(user.isActive);
    } else {
      setName("");
      setEmail("");
      setPassword("");
      setRoleId(roles[0]?._id ?? "");
      setIsActive(true);
    }
    setShowPassword(false);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const data = isEditing
        ? { id: user._id, name, email, password: password || undefined, role: roleId, isActive }
        : { name, email, password, role: roleId, isActive };

      const result = isEditing ? await updateUser(data) : await createUser(data);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success);
        onOpenChange(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit User" : "Create User"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update user details. Leave password blank to keep current."
              : "Add a new admin user to the system."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user-name">Name</Label>
            <Input
              id="user-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-email">Email</Label>
            <Input
              id="user-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-password">
              Password {isEditing && <span className="text-muted-foreground font-normal">(optional)</span>}
            </Label>
            <div className="relative">
              <Input
                id="user-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isEditing ? "Leave blank to keep current" : "Min 8 characters"}
                required={!isEditing}
                minLength={password ? 8 : undefined}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={roleId} onValueChange={(val) => setRoleId(val || "")} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role._id} value={role._id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label htmlFor="user-active" className="text-sm font-medium">Active</Label>
              <p className="text-xs text-muted-foreground">
                Inactive users cannot log in
              </p>
            </div>
            <Switch
              id="user-active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Saving..."
                : isEditing
                  ? "Update User"
                  : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
