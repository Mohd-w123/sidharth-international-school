/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPageSchema, type CreatePageInput } from "@/lib/validations/page";
import { generateSlug } from "@/lib/cms/slug";
import { deletePage } from "@/actions/page.actions";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MediaPicker } from "@/features/media/components/media-picker";
import { isDocumentUrl } from "@/lib/utils/format";
import {
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Image as ImageIcon,
  Link2,
  FileText,
  Video,
  FileDown,
  Grid,
  Sparkles,
  Pencil,
  Eye,
  Check,
  Users,
  Plus,
  ExternalLink,
} from "lucide-react";

interface PageFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting?: boolean;
}

const BLOCK_TYPES = [
  { value: "rich-text", label: "Rich Text Content", icon: FileText },
  { value: "team-grid", label: "Management / Team Grid", icon: Users },
  { value: "image", label: "Single Image Banner", icon: ImageIcon },
  { value: "video", label: "Video Embed", icon: Video },
  { value: "button", label: "Call to Action Button", icon: Link2 },
  { value: "attachment", label: "Document Attachment", icon: FileDown },
  { value: "content-block", label: "Structured Content Card", icon: Grid },
] as const;

export function PageForm({ initialData, onSubmit, isSubmitting }: PageFormProps) {
  const router = useRouter();
  const [isDeleting, startDeleteTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"content" | "seo" | "preview">("content");
  const [expandedBlocks, setExpandedBlocks] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {};
    if (initialData?.blocks && Array.isArray(initialData.blocks)) {
      initialData.blocks.forEach((_: any, idx: number) => {
        initial[idx] = true;
      });
    }
    return initial;
  });
  const [previewKey, setPreviewKey] = useState(0);

  const handleDelete = () => {
    if (!initialData?._id) return;
    if (confirm(`Are you sure you want to permanently delete "${initialData.title || 'this page'}"? This action cannot be undone.`)) {
      startDeleteTransition(async () => {
        const res = await deletePage(initialData._id);
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success(res.success || "Page deleted successfully");
          router.push("/admin/pages");
        }
      });
    }
  };

  const handleTabChange = async (tab: "content" | "seo" | "preview") => {
    if (tab === "preview") {
      let isValid = false;
      await handleSubmit(async (data) => {
        isValid = true;
        const formattedBlocks = data.blocks.map((block: any, idx: number) => ({
          ...block,
          order: idx,
        }));
        await onSubmit({ ...data, blocks: formattedBlocks });
      })();
      if (!isValid) {
        toast.error("Please fix form errors before previewing.");
        return;
      }
      setPreviewKey((k) => k + 1);
    }
    setActiveTab(tab);
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<CreatePageInput>({
    resolver: zodResolver(createPageSchema) as any,
    defaultValues: {
      title: initialData?.title ?? "",
      slug: initialData?.slug ?? "",
      description: initialData?.description ?? "",
      banner: initialData?.banner ?? "",
      status: initialData?.status ?? "draft",
      template: initialData?.template ?? "default",
      seoTitle: initialData?.seoTitle ?? "",
      seoDescription: initialData?.seoDescription ?? "",
      seoKeywords: initialData?.seoKeywords ?? [],
      blocks: initialData?.blocks ?? [],
    },
  });

  const { fields, append, remove, move, insert } = useFieldArray({
    control,
    name: "blocks",
  });

  const watchTitle = watch("title");
  const watchBanner = watch("banner");

  // Auto-generate slug from title for new pages
  useEffect(() => {
    if (!initialData && watchTitle) {
      const generated = generateSlug(watchTitle);
      setValue("slug", generated, { shouldValidate: true });
    }
  }, [watchTitle, setValue, initialData]);

  const toggleExpand = (idx: number) => {
    setExpandedBlocks((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleFormSubmit = async (data: any) => {
    // Make sure order matches array index
    const formattedBlocks = data.blocks.map((block: any, idx: number) => ({
      ...block,
      order: idx,
    }));
    await onSubmit({ ...data, blocks: formattedBlocks });
  };

  const addBlock = (type: string) => {
    let content: any = {};
    if (type === "rich-text") content = { html: "<p>Write text here...</p>" };
    else if (type === "image") content = { url: "", alt: "", caption: "" };
    else if (type === "video") content = { url: "" };
    else if (type === "button") content = { text: "Learn More", url: "" };
    else if (type === "attachment") content = { url: "", label: "Download Attachment" };
    else if (type === "content-block") content = { title: "Block Title", subtitle: "", body: "" };

    append({ type, content, order: fields.length });
    setExpandedBlocks((prev) => ({ ...prev, [fields.length]: true }));
  };

  const duplicateBlock = (idx: number) => {
    const source = fields[idx];
    if (!source) return;
    insert(idx + 1, {
      type: source.type,
      content: JSON.parse(JSON.stringify(source.content)),
      order: idx + 1,
    });
    setExpandedBlocks((prev) => ({ ...prev, [idx + 1]: true }));
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Tab controls */}
      <div className="flex border-b gap-4">
        <Button
          type="button"
          variant="ghost"
          className={`h-9 px-4 rounded-none border-b-2 transition-all ${
            activeTab === "content"
              ? "border-primary font-semibold text-primary"
              : "border-transparent text-muted-foreground"
          }`}
          onClick={() => handleTabChange("content")}
        >
          Page Content
        </Button>
        <Button
          type="button"
          variant="ghost"
          className={`h-9 px-4 rounded-none border-b-2 transition-all ${
            activeTab === "seo"
              ? "border-primary font-semibold text-primary"
              : "border-transparent text-muted-foreground"
          }`}
          onClick={() => handleTabChange("seo")}
        >
          SEO & Meta Settings
        </Button>
        {initialData?._id && (
          <Button
            type="button"
            variant="ghost"
            className={`h-9 px-4 rounded-none border-b-2 transition-all ${
              activeTab === "preview"
                ? "border-primary font-semibold text-primary"
                : "border-transparent text-muted-foreground"
            }`}
            onClick={() => handleTabChange("preview")}
          >
            Live Preview
          </Button>
        )}
      </div>

      {activeTab === "content" ? (
        <div className="grid md:grid-cols-12 gap-6">
          {/* Main Content Area */}
          <div className="md:col-span-8 space-y-6">
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-semibold">Basic Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="page-title">Page Title</Label>
                    <Input
                      id="page-title"
                      {...register("title")}
                      placeholder="e.g. About Our School"
                    />
                    {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="page-slug">Slug URL</Label>
                    <Input
                      id="page-slug"
                      {...register("slug")}
                      placeholder="e.g. about-our-school"
                      onChange={(e) => setValue("slug", generateSlug(e.target.value))}
                    />
                    {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="page-description">Brief Description / Excerpt</Label>
                  <Textarea
                    id="page-description"
                    {...register("description")}
                    placeholder="Short description to summarize this page..."
                    rows={2}
                  />
                  {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Blocks List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Content Blocks
                  </h3>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded font-mono text-muted-foreground">
                    {fields.length} block{fields.length === 1 ? "" : "s"}
                  </span>
                </div>
                {fields.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        const allExpanded = fields.every((_, i) => expandedBlocks[i]);
                        const next: Record<number, boolean> = {};
                        fields.forEach((_, i) => {
                          next[i] = !allExpanded;
                        });
                        setExpandedBlocks(next);
                      }}
                    >
                      {fields.every((_, i) => expandedBlocks[i]) ? "Collapse All" : "Expand All"}
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {fields.map((field, idx) => {
                  const isExpanded = expandedBlocks[idx] ?? false;
                  const blockTypeInfo = BLOCK_TYPES.find((b) => b.value === field.type);
                  const Icon = blockTypeInfo?.icon ?? FileText;

                  return (
                    <Card
                      key={field.id}
                      className={`border transition-all ${
                        isExpanded ? "ring-1 ring-primary shadow-sm" : "hover:border-primary/50"
                      }`}
                    >
                      <CardHeader className="flex flex-row items-center gap-2 py-3 px-4 select-none">
                        <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-xs font-mono text-muted-foreground font-semibold">#{idx + 1}</span>
                        <div
                          className="flex-1 font-medium text-xs cursor-pointer truncate"
                          onClick={() => toggleExpand(idx)}
                        >
                          <span className="font-semibold text-foreground">{blockTypeInfo?.label || field.type}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Explicit Edit / Toggle Button */}
                          <Button
                            type="button"
                            size="sm"
                            variant={isExpanded ? "secondary" : "outline"}
                            className="h-7 px-2.5 text-xs font-medium gap-1"
                            onClick={() => toggleExpand(idx)}
                          >
                            <Pencil className="h-3 w-3" />
                            <span>{isExpanded ? "Close" : "Edit"}</span>
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => move(idx, idx - 1)}
                            disabled={idx === 0}
                            title="Move Up"
                          >
                            <ChevronUp className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => move(idx, idx + 1)}
                            disabled={idx === fields.length - 1}
                            title="Move Down"
                          >
                            <ChevronDown className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => duplicateBlock(idx)}
                            title="Duplicate Block"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-destructive hover:bg-destructive/10"
                            onClick={() => remove(idx)}
                            title="Delete Block"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </CardHeader>

                      {isExpanded && (
                        <CardContent className="py-4 px-4 border-t bg-muted/10 space-y-4">
                          <BlockInputs
                            type={field.type}
                            control={control}
                            blockIdx={idx}
                            setValue={setValue}
                            watch={watch}
                          />
                        </CardContent>
                      )}
                    </Card>
                  );
                })}

                {fields.length === 0 && (
                  <div className="border border-dashed rounded-lg p-12 text-center text-xs text-muted-foreground">
                    No blocks added yet. Use the buttons below to build your custom layout!
                  </div>
                )}
              </div>

              {/* Add Block Toolbar */}
              <Card className="bg-muted/40 border">
                <CardContent className="p-3">
                  <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                    Click to add block type:
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1.5">
                    {BLOCK_TYPES.map((bt) => (
                      <Button
                        key={bt.value}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs justify-start h-8 px-2 py-1 gap-1"
                        onClick={() => addBlock(bt.value)}
                      >
                        <bt.icon className="h-3.5 w-3.5" />
                        <span>{bt.value.replace("-", " ")}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="md:col-span-4 space-y-6">
            {/* Banner selector */}
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-semibold">Page Banner</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ImageField
                  label="Banner image URL"
                  value={watchBanner}
                  onChange={(url) => setValue("banner", url)}
                />
              </CardContent>
            </Card>

            {/* Publishing & Template */}
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-semibold">Status & Layout</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="page-status">Publish Status</Label>
                  <Select
                    defaultValue={initialData?.status ?? "draft"}
                    onValueChange={(val) => setValue("status", val as any)}
                  >
                    <SelectTrigger id="page-status">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="page-template">Page Template</Label>
                  <Select
                    defaultValue={initialData?.template ?? "default"}
                    onValueChange={(val) => setValue("template", val)}
                  >
                    <SelectTrigger id="page-template">
                      <SelectValue placeholder="Select Layout template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default Page Layout</SelectItem>
                      <SelectItem value="wide">Full Width Layout</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : activeTab === "seo" ? (
        /* SEO Settings tab */
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Search Engine Optimization (SEO)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="seo-title">SEO Title (Tag)</Label>
              <Input
                id="seo-title"
                {...register("seoTitle")}
                placeholder="Target search-friendly title (Max 70 chars)"
              />
              {errors.seoTitle && <p className="text-xs text-destructive">{errors.seoTitle.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="seo-desc">SEO Description (Meta Tag)</Label>
              <Textarea
                id="seo-desc"
                {...register("seoDescription")}
                placeholder="Google snippet meta summary text (Max 160 chars)"
                rows={3}
              />
              {errors.seoDescription && <p className="text-xs text-destructive">{errors.seoDescription.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="seo-keywords">SEO Keywords (Comma Separated)</Label>
              <Input
                id="seo-keywords"
                placeholder="e.g. school, admission, cbse academy, primary education"
                onChange={(e) => {
                  const arr = e.target.value
                    .split(",")
                    .map((k) => k.trim())
                    .filter(Boolean);
                  setValue("seoKeywords", arr);
                }}
                defaultValue={initialData?.seoKeywords?.join(", ") ?? ""}
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Live Preview tab */
        <div className="border rounded-lg bg-background overflow-hidden shadow-inner flex flex-col min-h-[600px] relative">
          <div className="bg-muted px-4 py-2 border-b text-xs text-muted-foreground flex items-center justify-between shrink-0">
            <span>Live Interactive Preview (Draft State)</span>
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-mono">
              /admin-preview/page/{initialData?._id}
            </span>
          </div>
          <iframe
            key={previewKey}
            src={`/admin-preview/page/${initialData?._id}?k=${previewKey}`}
            className="flex-1 w-full h-full border-0 min-h-[550px]"
            title="Page Preview"
          />
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between gap-3 pt-6 border-t">
        <div>
          {initialData?._id && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting || isDeleting}
              className="gap-1.5"
            >
              <Trash2 className="h-4 w-4" />
              {isDeleting ? "Deleting..." : "Delete Page"}
            </Button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
            disabled={isSubmitting || isDeleting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || isDeleting}>
            {isSubmitting ? "Saving..." : initialData ? "Save Page Changes" : "Create Page"}
          </Button>
        </div>
      </div>
    </form>
  );
}

function ImageField({
  value,
  onChange,
  label,
}: {
  value: string | undefined;
  onChange: (url: string) => void;
  label: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <Label className="text-xs">{label}</Label>
      <div className="flex flex-col gap-2">
        {value && (
          isDocumentUrl(value) ? (
            <div className="flex items-center justify-between p-3 rounded border bg-muted/40 text-xs">
              <div className="flex items-center gap-2 overflow-hidden mr-2">
                <FileText className="h-5 w-5 text-primary shrink-0" />
                <span className="truncate font-medium text-foreground">{value}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  title="Open file in new tab"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  title="Remove file"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="relative aspect-[3/1] w-full rounded border overflow-hidden bg-muted group">
              <img src={value} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onChange("")}
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4 text-white" />
              </button>
            </div>
          )
        )}
        <div className="flex gap-2">
          <Input
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Image URL..."
            className="text-xs"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOpen(true)}
            className="shrink-0 text-xs"
          >
            Select
          </Button>
        </div>
      </div>
      <MediaPicker open={open} onOpenChange={setOpen} onSelect={onChange} />
    </div>
  );
}

interface BlockInputsProps {
  type: string;
  control: any;
  blockIdx: number;
  setValue: any;
  watch: any;
}

function BlockInputs({ type, blockIdx, setValue, watch }: BlockInputsProps) {
  const content = watch(`blocks.${blockIdx}.content`) || {};

  const updateContentField = (key: string, val: any) => {
    setValue(`blocks.${blockIdx}.content`, {
      ...content,
      [key]: val,
    });
  };

  switch (type) {
    case "team-grid": {
      const members = (Array.isArray(content.members) ? content.members : []) as {
        name: string;
        designation: string;
        image?: string;
        bio?: string;
      }[];

      const addMember = () => {
        updateContentField("members", [
          ...members,
          { name: "New Leader", designation: "Trustee / Board Member", image: "", bio: "" },
        ]);
      };

      const removeMember = (mIdx: number) => {
        updateContentField("members", members.filter((_, i) => i !== mIdx));
      };

      const updateMemberField = (mIdx: number, field: string, value: string) => {
        const copy = [...members];
        if (copy[mIdx]) {
          copy[mIdx] = { ...copy[mIdx]!, [field]: value };
          updateContentField("members", copy);
        }
      };

      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[11px]">Grid Section Title</Label>
              <Input
                value={content.title ?? ""}
                onChange={(e) => updateContentField("title", e.target.value)}
                placeholder="e.g. Board of Management & Trustees"
                className="text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px]">Subtitle</Label>
              <Input
                value={content.subtitle ?? ""}
                onChange={(e) => updateContentField("subtitle", e.target.value)}
                placeholder="e.g. Visionary leadership guiding SLPS"
                className="text-xs"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">Leadership Members ({members.length})</Label>
              <Button type="button" variant="outline" size="sm" onClick={addMember} className="h-7 text-xs gap-1">
                <Plus className="h-3 w-3" /> Add Leader
              </Button>
            </div>

            {members.map((m, mIdx) => (
              <div key={mIdx} className="p-3.5 border rounded-xl space-y-2.5 bg-muted/20">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-foreground">Member #{mIdx + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMember(mIdx)}
                    className="h-6 w-6 p-0 text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-[10px]">Full Name</Label>
                    <Input
                      value={m.name}
                      onChange={(e) => updateMemberField(mIdx, "name", e.target.value)}
                      placeholder="e.g. Shri V. K. Gupta"
                      className="text-xs h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px]">Designation / Role</Label>
                    <Input
                      value={m.designation}
                      onChange={(e) => updateMemberField(mIdx, "designation", e.target.value)}
                      placeholder="e.g. Chairman & Founder"
                      className="text-xs h-8"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <ImageField
                    label="Member Photo URL"
                    value={m.image ?? ""}
                    onChange={(url) => updateMemberField(mIdx, "image", url)}
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-[10px]">Brief Bio / Responsibilities</Label>
                  <Textarea
                    value={m.bio ?? ""}
                    onChange={(e) => updateMemberField(mIdx, "bio", e.target.value)}
                    placeholder="Describe their contribution and educational vision..."
                    rows={2}
                    className="text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "rich-text":
      return (
        <div className="space-y-2">
          <Label className="text-xs">Rich Text Content Editor</Label>
          <RichTextEditor
            value={content.html ?? ""}
            onChange={(val) => updateContentField("html", val)}
            placeholder="Write block text here..."
          />
        </div>
      );

    case "image":
      return (
        <div className="space-y-3">
          <ImageField
            label="Block Image URL"
            value={content.url ?? ""}
            onChange={(url) => updateContentField("url", url)}
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[11px]">Alt Text</Label>
              <Input
                value={content.alt ?? ""}
                onChange={(e) => updateContentField("alt", e.target.value)}
                placeholder="e.g. School library"
                className="text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px]">Caption Text</Label>
              <Input
                value={content.caption ?? ""}
                onChange={(e) => updateContentField("caption", e.target.value)}
                placeholder="e.g. Reading room for grades 5-10"
                className="text-xs"
              />
            </div>
          </div>
        </div>
      );

    case "video":
      return (
        <div className="space-y-2">
          <Label className="text-xs">Video Embed URL (YouTube/Vimeo/Direct Link)</Label>
          <Input
            value={content.url ?? ""}
            onChange={(e) => updateContentField("url", e.target.value)}
            placeholder="e.g. https://www.youtube.com/embed/xyz123"
            className="text-xs font-mono"
          />
        </div>
      );

    case "button":
      return (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Button Label</Label>
            <Input
              value={content.text ?? "Learn More"}
              onChange={(e) => updateContentField("text", e.target.value)}
              placeholder="e.g. Download Syllabus"
              className="text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Button Link URL</Label>
            <Input
              value={content.url ?? ""}
              onChange={(e) => updateContentField("url", e.target.value)}
              placeholder="e.g. /admissions/fees"
              className="text-xs font-mono"
            />
          </div>
        </div>
      );

    case "attachment":
      return (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">Attachment File Label</Label>
            <Input
              value={content.label ?? ""}
              onChange={(e) => updateContentField("label", e.target.value)}
              placeholder="e.g. Download CBSE Disclosure Form"
              className="text-xs"
            />
          </div>
          <ImageField
            label="Document / Media Link URL"
            value={content.url ?? ""}
            onChange={(url) => updateContentField("url", url)}
          />
        </div>
      );

    case "content-block":
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[11px]">Title</Label>
              <Input
                value={content.title ?? ""}
                onChange={(e) => updateContentField("title", e.target.value)}
                placeholder="e.g. Highlights"
                className="text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px]">Subtitle</Label>
              <Input
                value={content.subtitle ?? ""}
                onChange={(e) => updateContentField("subtitle", e.target.value)}
                placeholder="e.g. Academics 2026"
                className="text-xs"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-[11px]">Body Text / Markdown</Label>
            <Textarea
              value={content.body ?? ""}
              onChange={(e) => updateContentField("body", e.target.value)}
              placeholder="Describe core highlights here..."
              rows={4}
              className="text-xs"
            />
          </div>
        </div>
      );

    default:
      return null;
  }
}
