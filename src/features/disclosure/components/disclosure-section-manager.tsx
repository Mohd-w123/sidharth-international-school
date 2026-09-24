/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { StatusBadge } from "@/features/admin/components/status-badge";
import { MediaPicker } from "@/features/media/components/media-picker";
import { createDisclosureSection, updateDisclosureSection, deleteDisclosureSection } from "@/actions/disclosure.actions";
import { generateSlug } from "@/lib/cms/slug";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, FileText, ExternalLink, Upload, GripVertical } from "lucide-react";
import Link from "next/link";

interface FieldItem {
  label: string;
  type: "document" | "url" | "text" | "number" | "date" | "boolean" | "richtext" | "table";
  value: string;
  order: number;
}

interface Props {
  categoryId: string;
  categoryName: string;
  sections: any[];
}

export function DisclosureSectionManager({ categoryId, categoryName, sections: initialSections }: Props) {
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("draft");
  const [fields, setFields] = useState<FieldItem[]>([]);

  // MediaPicker state
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [activeFieldIndex, setActiveFieldIndex] = useState<number | null>(null);

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setDescription("");
    setStatus("draft");
    setFields([]);
    setEditItem(null);
  };

  const openEdit = (item: any) => {
    setEditItem(item);
    setTitle(item.title);
    setSlug(item.slug);
    setDescription(item.description || "");
    setStatus(item.status);
    setFields(
      (item.fields || []).map((f: any, idx: number) => ({
        label: f.label || "",
        type: f.type || "document",
        value: String(f.value ?? ""),
        order: f.order ?? idx,
      }))
    );
    setDialogOpen(true);
  };

  const addField = (defaultType: "document" | "text" = "document") => {
    setFields((prev) => [
      ...prev,
      {
        label: "",
        type: defaultType,
        value: "",
        order: prev.length,
      },
    ]);
  };

  const updateField = (index: number, key: keyof FieldItem, val: any) => {
    setFields((prev) => {
      const next = [...prev];
      if (next[index]) {
        next[index] = { ...next[index], [key]: val };
      }
      return next;
    });
  };

  const removeField = (index: number) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMediaSelect = (url: string) => {
    if (activeFieldIndex !== null && fields[activeFieldIndex]) {
      updateField(activeFieldIndex, "value", url);
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error("Please enter a section title");
      return;
    }

    startTransition(async () => {
      const sanitizedFields = fields
        .filter((f) => f.label.trim())
        .map((f, idx) => ({
          label: f.label.trim(),
          type: f.type,
          value: f.type === "boolean" ? (f.value === "true" || f.value === "1") : f.value,
          order: idx,
        }));

      const payload = {
        category: categoryId,
        title,
        slug: slug || generateSlug(title),
        description: description || undefined,
        status,
        fields: sanitizedFields,
      };

      const result = editItem
        ? await updateDisclosureSection({ id: editItem._id, ...payload })
        : await createDisclosureSection(payload);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success);
        setDialogOpen(false);
        resetForm();
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this section?")) return;
    startTransition(async () => {
      const r = await deleteDisclosureSection(id);
      if (r.error) toast.error(r.error);
      else toast.success(r.success);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/admin/disclosure" className="hover:text-foreground">Disclosure</Link>
        <span>/</span>
        <span className="text-foreground font-medium">{categoryName}</span>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Sections & Document Records</h2>
          <p className="text-xs text-muted-foreground">Manage compliance sections and upload required statutory documents (PDF/links).</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Section</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl sm:max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">
                {editItem ? `Edit Section: ${editItem.title}` : "Add New Disclosure Section"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 pt-2">
              {/* Basic Details */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Section Title <span className="text-destructive">*</span></Label>
                  <Input
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!editItem) setSlug(generateSlug(e.target.value));
                    }}
                    placeholder="e.g. Documents and Information (Appendix-IX)"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input value={slug} onChange={(e) => setSlug(generateSlug(e.target.value))} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description (Optional)</Label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Copies of Affiliation, Trust Certificate, NOC, Safety Certificates..."
                />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v || "draft")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Documents & Fields List */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-bold text-slate-800">Documents & Records</Label>
                    <p className="text-xs text-muted-foreground">Add document rows with PDF links or text information.</p>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" size="sm" variant="outline" onClick={() => addField("document")}>
                      <Plus className="h-3.5 w-3.5 mr-1" /> Add Document Row
                    </Button>
                    <Button type="button" size="sm" variant="ghost" onClick={() => addField("text")}>
                      <Plus className="h-3.5 w-3.5 mr-1" /> Add Text Row
                    </Button>
                  </div>
                </div>

                {fields.length === 0 ? (
                  <div className="border-2 border-dashed rounded-xl p-8 text-center bg-slate-50/50">
                    <FileText className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-600">No documents added to this section yet.</p>
                    <p className="text-xs text-muted-foreground mt-1 mb-3">Click &quot;Add Document Row&quot; to add certificates, affiliation letters, or details.</p>
                    <Button type="button" size="sm" onClick={() => addField("document")}>
                      <Plus className="h-3.5 w-3.5 mr-1" /> Add First Document
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {fields.map((field, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl border bg-slate-50/60 space-y-3 relative group">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                            <GripVertical className="h-3.5 w-3.5 text-slate-400" />
                            Record #{idx + 1}
                          </span>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => removeField(idx)}
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                          </Button>
                        </div>

                        <div className="grid sm:grid-cols-12 gap-3">
                          <div className="sm:col-span-6 space-y-1.5">
                            <Label className="text-xs">Document Name / Label <span className="text-destructive">*</span></Label>
                            <Input
                              value={field.label}
                              onChange={(e) => updateField(idx, "label", e.target.value)}
                              placeholder="e.g. Fire Safety Certificate"
                              className="bg-white"
                            />
                          </div>

                          <div className="sm:col-span-3 space-y-1.5">
                            <Label className="text-xs">Type</Label>
                            <Select value={field.type} onValueChange={(val: any) => updateField(idx, "type", val)}>
                              <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="document">PDF Document</SelectItem>
                                <SelectItem value="url">Web Link (URL)</SelectItem>
                                <SelectItem value="text">Text Info</SelectItem>
                                <SelectItem value="boolean">Yes / No</SelectItem>
                                <SelectItem value="number">Number</SelectItem>
                                <SelectItem value="date">Date</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="sm:col-span-3 space-y-1.5">
                            <Label className="text-xs">Action / Upload</Label>
                            {field.type === "document" || field.type === "url" ? (
                              <Button
                                type="button"
                                variant="outline"
                                className="w-full bg-white text-xs"
                                onClick={() => {
                                  setActiveFieldIndex(idx);
                                  setMediaPickerOpen(true);
                                }}
                              >
                                <Upload className="h-3.5 w-3.5 mr-1 text-primary" /> Upload / Select PDF
                              </Button>
                            ) : null}
                          </div>
                        </div>

                        {/* Value Input */}
                        <div className="space-y-1">
                          <Label className="text-xs">
                            {field.type === "document" || field.type === "url" ? "Document File URL / Link" : "Value / Text"}
                          </Label>
                          {field.type === "boolean" ? (
                            <Select value={field.value} onValueChange={(v) => updateField(idx, "value", v)}>
                              <SelectTrigger className="bg-white"><SelectValue placeholder="Select Yes / No" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="true">Yes / Approved</SelectItem>
                                <SelectItem value="false">No</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              value={field.value}
                              onChange={(e) => updateField(idx, "value", e.target.value)}
                              placeholder={
                                field.type === "document" || field.type === "url"
                                  ? "https://... or click 'Upload / Select PDF' above"
                                  : "Enter information..."
                              }
                              className="bg-white font-mono text-xs"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={isPending} className="bg-[#002a54] hover:bg-[#003d78] text-white">
                  {isPending ? "Saving..." : editItem ? "Save Changes" : "Create Section"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {initialSections.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <FileText className="h-10 w-10 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-700">No sections yet.</p>
            <p className="text-xs mt-1">Add sections like &quot;General Information&quot;, &quot;Documents and Information&quot;, &quot;Staff Details&quot;, etc.</p>
          </CardContent>
        </Card>
      ) : (
        <Accordion className="space-y-3">
          {initialSections.map((section: any) => (
            <AccordionItem key={section._id} value={section._id} className="border rounded-2xl bg-white overflow-hidden shadow-xs">
              <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-slate-50/50">
                <div className="flex items-center gap-3 text-left">
                  <span className="font-bold text-slate-800">{section.title}</span>
                  <StatusBadge status={section.status} />
                  <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-medium">
                    {section.fields?.length || 0} document/field records
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5 pt-2 border-t bg-slate-50/30">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-xs text-muted-foreground">
                    {section.description || "No description specified."}
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(section)}>
                      <Pencil className="h-3.5 w-3.5 mr-1" /> Edit Section & Documents
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(section._id)} disabled={isPending}>
                      <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                    </Button>
                  </div>
                </div>

                {section.fields && section.fields.length > 0 ? (
                  <div className="space-y-2">
                    {section.fields.map((field: any, idx: number) => {
                      const isDoc = field.type === "document" || field.type === "url";
                      const docUrl = String(field.value || "");

                      return (
                        <div key={idx} className="flex items-center justify-between gap-3 p-3 bg-white border border-slate-200/80 rounded-xl text-sm shadow-xs">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-xs font-mono text-slate-400 w-5 text-center">{idx + 1}.</span>
                            <span className="font-medium text-slate-800 truncate">{field.label}</span>
                            <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono uppercase">
                              {field.type}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {isDoc && docUrl && docUrl !== "—" ? (
                              <a
                                href={docUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline bg-primary/10 px-2.5 py-1 rounded-md"
                              >
                                <ExternalLink className="h-3 w-3" /> View / Download Document
                              </a>
                            ) : (
                              <span className="text-xs text-slate-500 font-medium">
                                {String(field.value ?? "—")}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    No document fields configured yet. Click &quot;Edit Section &amp; Documents&quot; to add CBSE records and upload PDF files.
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {/* Global Media Picker for PDF / Document Upload */}
      <MediaPicker
        open={mediaPickerOpen}
        onOpenChange={setMediaPickerOpen}
        onSelect={handleMediaSelect}
        mimeFilter="all"
      />
    </div>
  );
}
