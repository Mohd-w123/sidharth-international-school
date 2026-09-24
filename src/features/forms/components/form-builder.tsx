/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createForm, updateForm } from "@/actions/form.actions";
import { generateSlug } from "@/lib/cms/slug";
import { toast } from "sonner";
import { Plus, Trash2, MoveUp, MoveDown, Settings } from "lucide-react";

interface Props { initialData?: any; }

export function FormBuilder({ initialData }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [successMessage, setSuccessMessage] = useState(initialData?.successMessage ?? "Thank you for your submission! We will get back to you shortly.");
  const [status, setStatus] = useState(initialData?.status ?? "draft");
  const [fields, setFields] = useState<any[]>(initialData?.fields ?? [
    { label: "Full Name", name: "fullName", type: "text", required: true, order: 0 },
    { label: "Email Address", name: "email", type: "email", required: true, order: 1 },
    { label: "Phone Number", name: "phone", type: "phone", required: false, order: 2 },
    { label: "Message / Inquiry", name: "message", type: "textarea", required: false, order: 3 },
  ]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialData) setSlug(generateSlug(val));
  };

  const addField = () => {
    const newField = {
      label: "New Field",
      name: `field_${Date.now()}`,
      type: "text",
      required: false,
      placeholder: "",
      helpText: "",
      options: [],
      order: fields.length,
    };
    setFields([...fields, newField]);
  };

  const updateField = (index: number, updates: Partial<any>) => {
    const updated = [...fields];
    updated[index] = { ...updated[index], ...updates };
    setFields(updated);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const moveField = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === fields.length - 1) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...fields];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setFields(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const payload = {
        title,
        slug: slug || generateSlug(title),
        description,
        successMessage,
        status,
        fields: fields.map((f, idx) => ({ ...f, order: idx })),
      };

      const result = initialData?._id ? await updateForm({ id: initialData._id, ...payload }) : await createForm(payload);
      if (result.error) toast.error(result.error);
      else { toast.success(result.success); router.push("/admin/forms"); }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-8 space-y-6">
          {/* Form Info */}
          <Card>
            <CardHeader className="py-4"><CardTitle className="text-sm font-semibold">Form Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Form Title</Label><Input value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="e.g. Admission Inquiry Form" /></div>
                <div className="space-y-2"><Label>URL Slug</Label><Input value={slug} onChange={(e) => setSlug(generateSlug(e.target.value))} /></div>
              </div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Optional instructions for users..." /></div>
              <div className="space-y-2"><Label>Success Message</Label><Input value={successMessage} onChange={(e) => setSuccessMessage(e.target.value)} placeholder="Shown after successful form submission" /></div>
            </CardContent>
          </Card>

          {/* Form Fields Canvas */}
          <Card>
            <CardHeader className="py-4 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">Fields Builder ({fields.length})</CardTitle>
              <Button type="button" size="sm" onClick={addField}><Plus className="h-4 w-4 mr-1" /> Add Field</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.length === 0 ? (
                <div className="text-center py-8 border border-dashed rounded text-sm text-muted-foreground">Click &quot;Add Field&quot; to begin building your form.</div>
              ) : (
                fields.map((field, idx) => (
                  <div key={idx} className="p-4 border rounded-lg bg-muted/30 space-y-3 relative group">
                    <div className="flex items-center justify-between gap-2 border-b pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground">#{idx + 1}</span>
                        <Input
                          value={field.label}
                          onChange={(e) => updateField(idx, { label: e.target.value, name: field.name || generateSlug(e.target.value).replace(/-/g, "_") })}
                          className="h-8 text-sm font-medium max-w-[200px]"
                          placeholder="Field Label"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveField(idx, "up")} disabled={idx === 0}><MoveUp className="h-3.5 w-3.5" /></Button>
                        <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveField(idx, "down")} disabled={idx === fields.length - 1}><MoveDown className="h-3.5 w-3.5" /></Button>
                        <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeField(idx)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Field Type</Label>
                        <Select value={field.type} onValueChange={(v) => updateField(idx, { type: v })}>
                          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Single Line Text</SelectItem>
                            <SelectItem value="textarea">Multi Line Text</SelectItem>
                            <SelectItem value="email">Email Address</SelectItem>
                            <SelectItem value="phone">Phone Number</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="select">Dropdown Select</SelectItem>
                            <SelectItem value="radio">Radio Buttons</SelectItem>
                            <SelectItem value="checkbox">Checkbox</SelectItem>
                            <SelectItem value="date">Date Picker</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Field ID / Key</Label>
                        <Input
                          value={field.name}
                          onChange={(e) => updateField(idx, { name: e.target.value })}
                          className="h-8 text-xs font-mono"
                          placeholder="field_name"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Placeholder</Label>
                        <Input
                          value={field.placeholder || ""}
                          onChange={(e) => updateField(idx, { placeholder: e.target.value })}
                          className="h-8 text-xs"
                          placeholder="Sample text..."
                        />
                      </div>
                    </div>

                    {(field.type === "select" || field.type === "radio") && (
                      <div className="space-y-1 pt-1">
                        <Label className="text-xs">Options (comma separated)</Label>
                        <Input
                          value={Array.isArray(field.options) ? field.options.join(", ") : field.options || ""}
                          onChange={(e) => updateField(idx, { options: e.target.value.split(",").map((s) => s.trim()) })}
                          className="h-8 text-xs"
                          placeholder="Option 1, Option 2, Option 3"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <Checkbox
                        id={`req_${idx}`}
                        checked={field.required}
                        onCheckedChange={(c) => updateField(idx, { required: !!c })}
                      />
                      <Label htmlFor={`req_${idx}`} className="text-xs cursor-pointer">Required Field</Label>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-4 space-y-6">
          <Card>
            <CardHeader className="py-4"><CardTitle className="text-sm font-semibold">Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/forms")} disabled={isPending}>Cancel</Button>
        <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : initialData ? "Save Form Changes" : "Create Form"}</Button>
      </div>
    </form>
  );
}
