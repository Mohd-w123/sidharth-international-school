/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { StatusBadge } from "@/features/admin/components/status-badge";
import { MediaPicker } from "@/features/media/components/media-picker";
import { ImageSettingInput } from "@/features/settings/components/image-setting-input";
import { SECTION_TYPES, type HomepageSectionInput } from "@/lib/validations/homepage";
import { updateHomepageSections, publishHomepage, unpublishHomepage } from "@/actions/homepage.actions";
import {
  Plus,
  GripVertical,
  Trash2,
  Copy,
  Send,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  ImageIcon,
  Save,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

interface HomepageEditorProps {
  config: {
    sections: HomepageSectionInput[];
    status: string;
  };
}

export function HomepageEditor({ config }: HomepageEditorProps) {
  const [sections, setSections] = useState<HomepageSectionInput[]>(config.sections);
  const [status, setStatus] = useState(config.status);
  const [isPending, startTransition] = useTransition();
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [confirmPublish, setConfirmPublish] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [activeMediaTarget, setActiveMediaTarget] = useState<{ sectionIndex: number; field: string; subIndex?: number } | null>(null);

  const addSection = (type: string) => {
    const label = SECTION_TYPES.find((s) => s.value === type)?.label ?? type;
    const newSec: HomepageSectionInput = {
      type,
      title: label,
      content: getDefaultContentForType(type),
      isEnabled: true,
      order: sections.length,
    };
    setSections((prev) => [...prev, newSec]);
    setExpandedIndex(sections.length);
    setShowAddMenu(false);
  };

  const removeSection = (index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
    if (expandedIndex === index) setExpandedIndex(null);
  };

  const duplicateSection = (index: number) => {
    setSections((prev) => {
      const source = prev[index];
      if (!source) return prev;
      const copy = { ...source, _id: undefined, order: prev.length };
      return [...prev, copy];
    });
  };

  const toggleSection = (index: number) => {
    setSections((prev) =>
      prev.map((s, i) => (i === index ? { ...s, isEnabled: !s.isEnabled } : s))
    );
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    setSections((prev) => {
      const newSections = [...prev];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= newSections.length) return prev;
      const a = newSections[index]!;
      const b = newSections[target]!;
      newSections[index] = b;
      newSections[target] = a;
      return newSections.map((s, i) => ({ ...s, order: i }));
    });
  };

  const updateSectionField = (index: number, field: "title", value: string) => {
    setSections((prev) => {
      const next = [...prev];
      if (!next[index]) return prev;
      next[index] = { ...next[index]!, [field]: value };
      return next;
    });
  };

  const updateSectionContent = (index: number, contentField: string, value: any) => {
    setSections((prev) => {
      const next = [...prev];
      const sec = next[index];
      if (!sec) return prev;
      const content = { ...(sec.content || {}), [contentField]: value };
      next[index] = { ...sec, content };
      return next;
    });
  };

  const updateSectionAllContent = (index: number, newContent: Record<string, any>) => {
    setSections((prev) => {
      const next = [...prev];
      const sec = next[index];
      if (!sec) return prev;
      next[index] = { ...sec, content: newContent };
      return next;
    });
  };

  // Validation helper to ensure mandatory fields like hero banner image are filled
  const validateSections = (sectionsList: HomepageSectionInput[]): boolean => {
    for (let i = 0; i < sectionsList.length; i++) {
      const sec = sectionsList[i]!;
      if (sec.type === "hero" && sec.isEnabled) {
        const content = (sec.content || {}) as Record<string, any>;
        const rawBanners = Array.isArray(content.banners) ? content.banners : [];

        if (rawBanners.length === 0) {
          if (!content.backgroundImage || !String(content.backgroundImage).trim()) {
            toast.error(`Hero Banner Section: Banner image is mandatory. Please upload or select an image.`);
            setExpandedIndex(i);
            return false;
          }
        } else {
          for (let b = 0; b < rawBanners.length; b++) {
            const slide = rawBanners[b];
            if (!slide || !slide.image || !String(slide.image).trim()) {
              toast.error(`Hero Banner Slide ${b + 1}: Banner image is mandatory. Please upload or choose an image.`);
              setExpandedIndex(i);
              return false;
            }
          }
        }
      }
    }
    return true;
  };

  const handleSave = () => {
    if (!validateSections(sections)) return;

    startTransition(async () => {
      const result = await updateHomepageSections(sections);
      if (result.error) toast.error(result.error);
      else toast.success("Draft saved successfully");
    });
  };

  // Save single section as draft
  const handleSaveSection = (sectionIndex: number) => {
    if (!validateSections(sections)) return;

    const sec = sections[sectionIndex];
    const typeLabel = SECTION_TYPES.find((s) => s.value === sec?.type)?.label ?? sec?.title ?? "Section";

    startTransition(async () => {
      const result = await updateHomepageSections(sections);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`"${sec?.title || typeLabel}" saved as draft!`);
      }
    });
  };

  // Save single section and immediately publish live
  const handleSaveAndPublishSection = (sectionIndex: number) => {
    if (!validateSections(sections)) return;

    const sec = sections[sectionIndex];
    const typeLabel = SECTION_TYPES.find((s) => s.value === sec?.type)?.label ?? sec?.title ?? "Section";

    startTransition(async () => {
      const saveRes = await updateHomepageSections(sections);
      if (saveRes.error) {
        toast.error(saveRes.error);
        return;
      }
      const pubRes = await publishHomepage();
      if (pubRes.error) {
        toast.error(pubRes.error);
      } else {
        setStatus("published");
        toast.success(`"${sec?.title || typeLabel}" saved & published live to homepage!`);
      }
    });
  };

  const handlePublish = () => {
    if (status !== "published" && !validateSections(sections)) return;

    startTransition(async () => {
      if (status === "published") {
        const result = await unpublishHomepage();
        if (result.error) toast.error(result.error);
        else {
          toast.success(result.success);
          setStatus("draft");
        }
      } else {
        const saveRes = await updateHomepageSections(sections);
        if (saveRes.error) {
          toast.error(saveRes.error);
          return;
        }
        const result = await publishHomepage();
        if (result.error) toast.error(result.error);
        else {
          toast.success("Homepage saved and published live!");
          setStatus("published");
        }
      }
      setConfirmPublish(false);
    });
  };

  const handleMediaSelect = (url: string) => {
    if (!activeMediaTarget) return;
    const { sectionIndex, field, subIndex } = activeMediaTarget;
    if (subIndex !== undefined) {
      const sec = sections[sectionIndex];
      if (sec) {
        const content = (sec.content || {}) as Record<string, any>;
        const items = Array.isArray(content.items) ? [...content.items] : [];
        if (items[subIndex]) {
          items[subIndex] = { ...items[subIndex], [field]: url };
          updateSectionContent(sectionIndex, "items", items);
        }
      }
    } else {
      updateSectionContent(sectionIndex, field, url);
    }
    setActiveMediaTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Global Bar */}
      <div className="flex items-center gap-3 bg-card p-4 rounded-xl border shadow-xs">
        <StatusBadge status={status} />
        <span className="text-sm text-muted-foreground">({sections.length} sections configured)</span>
        <div className="flex-1" />
        <Button variant="outline" onClick={handleSave} disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save All Draft
        </Button>
        <Button
          variant={status === "published" ? "outline" : "default"}
          onClick={() => setConfirmPublish(true)}
          disabled={isPending}
          className={status !== "published" ? "bg-[#003d78] hover:bg-[#002a54] text-white" : ""}
        >
          <Send className="h-4 w-4 mr-2" />
          {status === "published" ? "Unpublish Homepage" : "Publish Live"}
        </Button>
      </div>

      {/* Sections List */}
      <div className="space-y-3">
        {sections.map((section, index) => {
          const isExpanded = expandedIndex === index;
          const typeLabel = SECTION_TYPES.find((s) => s.value === section.type)?.label ?? section.type;

          return (
            <Card key={section._id ?? index} className={`transition-all shadow-xs ${!section.isEnabled ? "opacity-50" : ""}`}>
              <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-3 flex-1">
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  <div className="flex items-center gap-2 flex-1">
                    <span className="font-semibold text-sm">{typeLabel}</span>
                    <Input
                      value={section.title || ""}
                      onChange={(e) => updateSectionField(index, "title", e.target.value)}
                      placeholder="Section Title"
                      className="h-8 max-w-[240px] text-sm"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => moveSection(index, "up")}
                    disabled={index === 0}
                    title="Move up"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => moveSection(index, "down")}
                    disabled={index === sections.length - 1}
                    title="Move down"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => toggleSection(index)} title={section.isEnabled ? "Disable section" : "Enable section"}>
                    {section.isEnabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => duplicateSection(index)} title="Duplicate section">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSection(index)}
                    className="text-destructive hover:text-destructive"
                    title="Delete section"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedIndex(isExpanded ? null : index)}
                  >
                    {isExpanded ? "Collapse" : "Edit Content"}
                  </Button>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="border-t pt-4">
                  <SectionContentEditor
                    section={section}
                    index={index}
                    onChange={(field, val) => updateSectionContent(index, field, val)}
                    onUpdateAll={(newContent) => updateSectionAllContent(index, newContent)}
                    onOpenMedia={(field, subIndex) => setActiveMediaTarget({ sectionIndex: index, field, subIndex })}
                  />

                  {/* Section-Specific Save & Publish Action Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 mt-6 border-t bg-muted/20 -mx-6 -mb-6 p-4 rounded-b-lg">
                    <div className="text-xs text-muted-foreground">
                      Finished editing <strong>{section.title || typeLabel}</strong>? Save this section draft or publish it live.
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleSaveSection(index)}
                        disabled={isPending}
                        className="text-xs h-8"
                      >
                        {isPending ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Save className="h-3.5 w-3.5 mr-1.5" />}
                        Save Section Draft
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleSaveAndPublishSection(index)}
                        disabled={isPending}
                        className="bg-[#003d78] hover:bg-[#002a54] text-white text-xs h-8 shadow-xs"
                      >
                        {isPending ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Send className="h-3.5 w-3.5 mr-1.5" />}
                        Save & Publish Live
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      <div className="relative">
        <Button
          type="button"
          variant="outline"
          className="w-full border-dashed"
          onClick={() => setShowAddMenu(!showAddMenu)}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Section
        </Button>

        {showAddMenu && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-popover text-popover-foreground border rounded-lg shadow-xl p-3 z-50 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {SECTION_TYPES.map((type) => (
              <Button
                key={type.value}
                type="button"
                variant="ghost"
                size="sm"
                className="justify-start text-xs h-auto py-2 px-3"
                onClick={() => addSection(type.value)}
              >
                {type.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      <MediaPicker
        open={!!activeMediaTarget}
        onOpenChange={(open) => !open && setActiveMediaTarget(null)}
        onSelect={handleMediaSelect}
      />

      <ConfirmDialog
        open={confirmPublish}
        onOpenChange={setConfirmPublish}
        title={status === "published" ? "Unpublish Homepage?" : "Save & Publish Homepage?"}
        description={
          status === "published"
            ? "The homepage will revert to draft state."
            : "Your latest section updates will be saved and published live to the homepage."
        }
        onConfirm={handlePublish}
        loading={isPending}
      />
    </div>
  );
}

function SectionContentEditor({
  section,
  index: _index,
  onChange,
  onUpdateAll,
  onOpenMedia,
}: {
  section: HomepageSectionInput;
  index: number;
  onChange: (field: string, val: any) => void;
  onUpdateAll: (newContent: Record<string, any>) => void;
  onOpenMedia: (field: string, subIndex?: number) => void;
}) {
  const content = (section.content || {}) as Record<string, any>;

  switch (section.type) {
    case "hero": {
      // Normalize banners list from content.banners or legacy root fields
      const rawBanners = Array.isArray(content.banners) ? content.banners : [];
      const banners: Array<{
        badge?: string;
        title: string;
        description?: string;
        image: string;
        primaryButtonText?: string;
        primaryButtonUrl?: string;
        secondaryButtonText?: string;
        secondaryButtonUrl?: string;
      }> =
        rawBanners.length > 0
          ? rawBanners.map((b: any, idx: number) => ({
              badge: b?.badge || (idx === 0 ? content.badge : "") || "BE THE LIGHT",
              title: b?.title || (idx === 0 ? content.title : "") || "Saint Lawrence Public School – One of the Best Schools in Jaipur",
              description:
                b?.description ||
                b?.subtitle ||
                (idx === 0 ? content.description || content.subtitle : "") ||
                "Where every child is known by name, nurtured by purpose, and inspired to lead with empathy, integrity, perseverance, and autonomy.",
              image: b?.image || (idx === 0 ? content.backgroundImage : "") || "",
              primaryButtonText: b?.primaryButtonText || b?.buttonText || (idx === 0 ? content.buttonText : "") || "Enquire Now",
              primaryButtonUrl: b?.primaryButtonUrl || b?.buttonUrl || (idx === 0 ? content.buttonUrl : "") || "/admissions",
              secondaryButtonText: b?.secondaryButtonText || (idx === 0 ? content.secondaryButtonText : "") || "Latest News",
              secondaryButtonUrl: b?.secondaryButtonUrl || (idx === 0 ? content.secondaryButtonUrl : "") || "/news",
            }))
          : [
              {
                badge: content.badge || "BE THE LIGHT",
                title: content.title || "Saint Lawrence Public School – One of the Best Schools in Jaipur",
                description:
                  content.subtitle ||
                  content.description ||
                  "Where every child is known by name, nurtured by purpose, and inspired to lead with empathy, integrity, perseverance, and autonomy.",
                image: content.backgroundImage || "",
                primaryButtonText: content.buttonText || content.primaryButtonText || "Enquire Now",
                primaryButtonUrl: content.buttonUrl || content.primaryButtonUrl || "/admissions",
                secondaryButtonText: "Latest News",
                secondaryButtonUrl: "/news",
              },
            ];

      const saveBanners = (updatedBanners: typeof banners) => {
        const first = updatedBanners[0];
        const newContent = {
          ...content,
          banners: updatedBanners,
          backgroundImage: first?.image || "",
          title: first?.title || "",
          subtitle: first?.description || "",
          description: first?.description || "",
          badge: first?.badge || "",
          buttonText: first?.primaryButtonText || "",
          buttonUrl: first?.primaryButtonUrl || "",
          secondaryButtonText: first?.secondaryButtonText || "",
          secondaryButtonUrl: first?.secondaryButtonUrl || "",
        };
        onUpdateAll(newContent);
      };

      const addBanner = () => {
        const newSlide = {
          badge: "BE THE LIGHT",
          title: "Saint Lawrence Public School",
          description: "Nurturing Minds, Building Futures.",
          image: "",
          primaryButtonText: "Enquire Now",
          primaryButtonUrl: "/admissions",
          secondaryButtonText: "Latest News",
          secondaryButtonUrl: "/news",
        };
        saveBanners([...banners, newSlide]);
      };

      const removeBanner = (i: number) => {
        if (banners.length <= 1) {
          toast.info("At least one banner slide is required.");
          return;
        }
        saveBanners(banners.filter((_, idx) => idx !== i));
      };

      const updateBanner = (i: number, field: string, value: any) => {
        const copy = banners.map((b, idx) => (idx === i ? { ...b, [field]: value } : b));
        saveBanners(copy);
      };

      return (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold text-foreground">
              Hero Banner Slides ({banners.length})
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addBanner}
              className="text-xs h-7"
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Banner Slide
            </Button>
          </div>

          <div className="space-y-4">
            {banners.map((slide, i) => {
              const isImageMissing = !slide.image || !String(slide.image).trim();

              return (
                <Card
                  key={`hero-slide-editor-${i}`}
                  className={`border transition-all ${
                    isImageMissing ? "border-destructive/60 bg-destructive/5" : "border-border bg-muted/20"
                  }`}
                >
                  <CardHeader className="py-2.5 px-4 flex flex-row items-center justify-between border-b bg-muted/40">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold">Slide {i + 1}</span>
                      {slide.title && (
                        <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                          - {slide.title}
                        </span>
                      )}
                      {isImageMissing && (
                        <span className="text-[10px] bg-destructive/20 text-destructive font-medium px-1.5 py-0.5 rounded">
                          Image Required *
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {banners.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeBanner(i)}
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive cursor-pointer"
                          title="Remove slide"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 space-y-3">
                    {/* MANDATORY Banner Image */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold flex items-center gap-1">
                          Banner Background Image <span className="text-destructive font-bold">* (Mandatory)</span>
                        </Label>
                      </div>
                      <ImageSettingInput
                        value={slide.image || ""}
                        onChange={(url) => updateBanner(i, "image", url)}
                        placeholder="Upload or paste banner image URL (Mandatory)"
                        label={`Banner Slide ${i + 1}`}
                        description="High quality school photo or campus building view (Recommended 1920x1080)."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="space-y-1">
                        <Label className="text-xs">Badge / Tagline (Above Title)</Label>
                        <Input
                          value={slide.badge || ""}
                          onChange={(e) => updateBanner(i, "badge", e.target.value)}
                          placeholder="BE THE LIGHT"
                          className="text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Main Title</Label>
                        <Input
                          value={slide.title || ""}
                          onChange={(e) => updateBanner(i, "title", e.target.value)}
                          placeholder="Saint Lawrence Public School – One of the Best Schools in Jaipur"
                          className="text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">Description / Subtext</Label>
                      <Textarea
                        value={slide.description || ""}
                        onChange={(e) => updateBanner(i, "description", e.target.value)}
                        placeholder="Where every child is known by name, nurtured by purpose..."
                        rows={2}
                        className="text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Primary Button */}
                      <div className="p-2.5 rounded-lg border bg-background/50 space-y-2">
                        <span className="text-[11px] font-semibold text-primary block">
                          Primary Button (Gold/Filled)
                        </span>
                        <div className="space-y-1">
                          <Label className="text-[10px]">Button Label</Label>
                          <Input
                            value={slide.primaryButtonText || ""}
                            onChange={(e) => updateBanner(i, "primaryButtonText", e.target.value)}
                            placeholder="Enquire Now"
                            className="text-xs h-7"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px]">Button URL</Label>
                          <Input
                            value={slide.primaryButtonUrl || ""}
                            onChange={(e) => updateBanner(i, "primaryButtonUrl", e.target.value)}
                            placeholder="/admissions"
                            className="text-xs h-7"
                          />
                        </div>
                      </div>

                      {/* Secondary Button */}
                      <div className="p-2.5 rounded-lg border bg-background/50 space-y-2">
                        <span className="text-[11px] font-semibold text-muted-foreground block">
                          Secondary Button (Outline)
                        </span>
                        <div className="space-y-1">
                          <Label className="text-[10px]">Button Label</Label>
                          <Input
                            value={slide.secondaryButtonText || ""}
                            onChange={(e) => updateBanner(i, "secondaryButtonText", e.target.value)}
                            placeholder="Latest News"
                            className="text-xs h-7"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px]">Button URL</Label>
                          <Input
                            value={slide.secondaryButtonUrl || ""}
                            onChange={(e) => updateBanner(i, "secondaryButtonUrl", e.target.value)}
                            placeholder="/news"
                            className="text-xs h-7"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      );
    }

    case "announcement":
      return (
        <div className="space-y-2 pt-2">
          <Label className="text-xs">Announcement Text</Label>
          <Input value={content.text || ""} onChange={(e) => onChange("text", e.target.value)} placeholder="Admissions open for Academic Session 2025–26!" />
        </div>
      );

    case "introduction":
      return (
        <div className="space-y-3 pt-2">
          <div className="space-y-1">
            <Label className="text-xs">Subtitle / Top Tagline (Optional)</Label>
            <Input
              value={content.subtitle || ""}
              onChange={(e) => onChange("subtitle", e.target.value)}
              placeholder="e.g. WELCOME TO SAINT LAWRENCE"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Description / Paragraph Text</Label>
            <Textarea
              value={content.description || ""}
              onChange={(e) => onChange("description", e.target.value)}
              rows={4}
              placeholder="At Saint Lawrence Public School, we believe every child learns differently..."
            />
          </div>
        </div>
      );

    case "director-message":
    case "chairman-message":
    case "principal-message": {
      const defaultDesignation =
        section.type === "director-message"
          ? "DIRECTOR"
          : section.type === "chairman-message"
            ? "CHAIRMAN"
            : "PRINCIPAL";

      return (
        <div className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label className="text-xs font-semibold">Top Subtitle / Vision Tagline</Label>
            <Input
              value={content.subtitle || ""}
              onChange={(e) => onChange("subtitle", e.target.value)}
              placeholder="At Saint Lawrence Public School, leadership is rooted in vision, dedication..."
              className="text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Leader Full Name</Label>
              <Input
                value={content.name || ""}
                onChange={(e) => onChange("name", e.target.value)}
                placeholder="Mr. Vikram Singh Rajawat"
                className="text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Designation Tag (Uppercase)</Label>
              <Input
                value={content.designation || ""}
                onChange={(e) => onChange("designation", e.target.value)}
                placeholder={defaultDesignation}
                className="text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Leader Portrait Photo</Label>
            <ImageSettingInput
              value={content.image || ""}
              onChange={(url) => onChange("image", url)}
              placeholder="Upload or paste portrait photo URL"
              label={content.name || defaultDesignation}
              description="High quality vertical portrait photo (Recommended aspect ratio 3:4 or 4:5)."
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold">Message Content (Separate paragraphs with an empty line)</Label>
            <Textarea
              value={content.description || ""}
              onChange={(e) => onChange("description", e.target.value)}
              rows={6}
              placeholder="Welcome to Saint Lawrence Public School...\n\nUnder our leadership, we strive..."
              className="text-xs"
            />
          </div>
        </div>
      );
    }

    case "statistics": {
      const items = (content.items || []) as { value: string; label: string }[];
      const addItem = () => onChange("items", [...items, { value: "100+", label: "New Metric" }]);
      const removeItem = (i: number) => onChange("items", items.filter((_, idx) => idx !== i));
      const updateItem = (i: number, f: "value" | "label", v: string) => {
        const copy = [...items];
        if (copy[i]) {
          copy[i] = { ...copy[i]!, [f]: v };
          onChange("items", copy);
        }
      };

      return (
        <div className="space-y-3 pt-2">
          <Label className="text-xs font-semibold">Stats Items</Label>
          <div className="grid grid-cols-2 gap-3">
            {items.map((item, i) => (
              <div key={i} className="p-3 border rounded-md space-y-2 bg-muted/20">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-muted-foreground">Stat #{i + 1}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(i)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                </div>
                <Input value={item.value} onChange={(e) => updateItem(i, "value", e.target.value)} placeholder="Value (e.g. 100%)" />
                <Input value={item.label} onChange={(e) => updateItem(i, "label", e.target.value)} placeholder="Label (e.g. Pass Rate)" />
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addItem}><Plus className="h-3.5 w-3.5 mr-1" /> Add Stat</Button>
        </div>
      );
    }

    case "news": {
      const items = (content.items || []) as {
        title: string;
        date?: string;
        category?: string;
        excerpt?: string;
        image?: string;
        url?: string;
      }[];

      const addItem = () =>
        onChange("items", [
          ...items,
          {
            title: "New School Activity / Event",
            date: "Recent Date",
            category: "CAMPUS EVENT",
            excerpt: "Write brief summary of the news...",
            image: "",
            url: "/news",
          },
        ]);

      const removeItem = (i: number) => onChange("items", items.filter((_, idx) => idx !== i));
      const updateItem = (i: number, f: string, v: string) => {
        const copy = [...items];
        if (copy[i]) {
          copy[i] = { ...copy[i]!, [f]: v };
          onChange("items", copy);
        }
      };

      return (
        <div className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label className="text-xs font-semibold">Section Subtitle / Description</Label>
            <Input
              value={content.subtitle || ""}
              onChange={(e) => onChange("subtitle", e.target.value)}
              placeholder="Stay up to date with events, activities, and updates..."
              className="text-xs"
            />
          </div>

          <div className="rounded-lg border bg-blue-50/50 p-3 text-xs text-blue-900 flex items-center justify-between">
            <span>
              ℹ️ By default, this section dynamically displays your latest published news from the <strong>News Manager</strong>. You can also specify custom items below.
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">Custom News Slides ({items.length})</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem} className="text-xs h-7">
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Custom Article Slide
              </Button>
            </div>

            {items.map((item, i) => (
              <div key={i} className="p-3.5 border rounded-lg space-y-3 bg-muted/20">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-foreground">Slide #{i + 1}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(i)} className="h-6 w-6 p-0 text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-[10px]">Article Title</Label>
                    <Input
                      value={item.title}
                      onChange={(e) => updateItem(i, "title", e.target.value)}
                      placeholder="Title"
                      className="text-xs h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px]">Category Badge (e.g. EDUCATION WORLD AWARD)</Label>
                    <Input
                      value={item.category || ""}
                      onChange={(e) => updateItem(i, "category", e.target.value)}
                      placeholder="EDUCATION WORLD AWARD"
                      className="text-xs h-8"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-[10px]">Date Tag (e.g. 8th - 10th July&apos;26)</Label>
                    <Input
                      value={item.date || ""}
                      onChange={(e) => updateItem(i, "date", e.target.value)}
                      placeholder="8th - 10th July'26"
                      className="text-xs h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px]">Redirect URL (e.g. /news/inter-house-sports)</Label>
                    <Input
                      value={item.url || ""}
                      onChange={(e) => updateItem(i, "url", e.target.value)}
                      placeholder="/news/article-slug"
                      className="text-xs h-8"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-[10px]">Excerpt / Summary</Label>
                  <Textarea
                    value={item.excerpt || ""}
                    onChange={(e) => updateItem(i, "excerpt", e.target.value)}
                    placeholder="Brief description..."
                    rows={2}
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-[10px]">Featured Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      value={item.image || ""}
                      onChange={(e) => updateItem(i, "image", e.target.value)}
                      placeholder="https://..."
                      className="text-xs h-8"
                    />
                    <Button type="button" variant="outline" size="sm" onClick={() => onOpenMedia("image", i)} className="text-xs h-8">
                      <ImageIcon className="h-3.5 w-3.5 mr-1" /> Select
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "vision": {
      const items = (content.items || []) as { title: string; tag?: string; description?: string }[];
      const addItem = () => onChange("items", [...items, { title: "Stage Name", tag: "GRADES I-II", description: "" }]);
      const removeItem = (i: number) => onChange("items", items.filter((_, idx) => idx !== i));
      const updateItem = (i: number, f: string, v: string) => {
        const copy = [...items];
        if (copy[i]) {
          copy[i] = { ...copy[i]!, [f]: v };
          onChange("items", copy);
        }
      };

      return (
        <div className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label className="text-xs font-semibold">Vision Statement / Description</Label>
            <Textarea
              value={content.description || ""}
              onChange={(e) => onChange("description", e.target.value)}
              placeholder="Recognised as one of Jaipur's most trusted schools..."
              rows={3}
              className="text-xs"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">Developmental Stages ({items.length})</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem} className="text-xs h-7">
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Stage Card
              </Button>
            </div>

            {items.map((item, i) => (
              <div key={i} className="p-3.5 border rounded-lg space-y-2.5 bg-muted/20">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-foreground">Stage #{i + 1}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(i)} className="h-6 w-6 p-0 text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-[10px]">Stage Title (e.g. Chetna, Ananda)</Label>
                    <Input
                      value={item.title}
                      onChange={(e) => updateItem(i, "title", e.target.value)}
                      placeholder="Title"
                      className="text-xs h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px]">Grades Tag (e.g. EARLY YEAR I, II, & III)</Label>
                    <Input
                      value={item.tag || ""}
                      onChange={(e) => updateItem(i, "tag", e.target.value)}
                      placeholder="GRADES I-II"
                      className="text-xs h-8"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-[10px]">Description</Label>
                  <Textarea
                    value={item.description || ""}
                    onChange={(e) => updateItem(i, "description", e.target.value)}
                    placeholder="Describe this learning stage..."
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

    case "manifesto": {
      const items = (content.items || []) as { title: string; description?: string }[];
      const addItem = () => onChange("items", [...items, { title: "New Principle", description: "" }]);
      const removeItem = (i: number) => onChange("items", items.filter((_, idx) => idx !== i));
      const updateItem = (i: number, f: string, v: string) => {
        const copy = [...items];
        if (copy[i]) {
          copy[i] = { ...copy[i]!, [f]: v };
          onChange("items", copy);
        }
      };

      return (
        <div className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label className="text-xs font-semibold">Manifesto Overview / Subtitle</Label>
            <Textarea
              value={content.description || ""}
              onChange={(e) => onChange("description", e.target.value)}
              placeholder="Equal Opportunity for Every Learner..."
              rows={2}
              className="text-xs"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold">Featured Photo</Label>
            <ImageSettingInput
              value={(content.image as string) || ""}
              onChange={(url) => onChange("image", url)}
              placeholder="Upload leader / manifesto photo"
              label="Manifesto Photo"
              description="High quality photo (Recommended 4:3 aspect ratio)."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Button Text</Label>
              <Input
                value={content.buttonText || ""}
                onChange={(e) => onChange("buttonText", e.target.value)}
                placeholder="Apply Now"
                className="text-xs h-8"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Button URL</Label>
              <Input
                value={content.buttonUrl || ""}
                onChange={(e) => onChange("buttonUrl", e.target.value)}
                placeholder="/admissions"
                className="text-xs h-8"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">Manifesto Points ({items.length})</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem} className="text-xs h-7">
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Principle
              </Button>
            </div>

            {items.map((item, i) => (
              <div key={i} className="p-3 border rounded-lg space-y-2 bg-muted/20">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-foreground">Point #{i + 1}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(i)} className="h-6 w-6 p-0 text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <Input
                  value={item.title}
                  onChange={(e) => updateItem(i, "title", e.target.value)}
                  placeholder="Principle Title (e.g. Personalized Learning)"
                  className="text-xs h-8"
                />
                <Textarea
                  value={item.description || ""}
                  onChange={(e) => updateItem(i, "description", e.target.value)}
                  placeholder="Principle description..."
                  rows={2}
                  className="text-xs"
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "student-development":
    case "why-choose-us":
    case "programs":
    case "facilities":
    case "achievements": {
      const items = (content.items || []) as { title: string; description?: string; image?: string }[];
      const addItem = () => onChange("items", [...items, { title: "New Item", description: "", image: "" }]);
      const removeItem = (i: number) => onChange("items", items.filter((_, idx) => idx !== i));
      const updateItem = (i: number, f: string, v: string) => {
        const copy = [...items];
        if (copy[i]) {
          copy[i] = { ...copy[i]!, [f]: v };
          onChange("items", copy);
        }
      };

      return (
        <div className="space-y-3 pt-2">
          <div className="space-y-1">
            <Label className="text-xs">Section Description</Label>
            <Input value={content.description || ""} onChange={(e) => onChange("description", e.target.value)} placeholder="Description..." />
          </div>
          <Label className="text-xs font-semibold">Cards / Items</Label>
          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className="p-3 border rounded-md space-y-2 bg-muted/20">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-muted-foreground">Item #{i + 1}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(i)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                </div>
                <Input value={item.title} onChange={(e) => updateItem(i, "title", e.target.value)} placeholder="Title" />
                <Textarea value={item.description || ""} onChange={(e) => updateItem(i, "description", e.target.value)} placeholder="Description" rows={2} />
                <div className="flex gap-2">
                  <Input value={item.image || ""} onChange={(e) => updateItem(i, "image", e.target.value)} placeholder="Image URL" />
                  <Button type="button" variant="outline" size="sm" onClick={() => onOpenMedia("image", i)}>
                    <ImageIcon className="h-4 w-4 mr-1" /> Select
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addItem}><Plus className="h-3.5 w-3.5 mr-1" /> Add Card</Button>
        </div>
      );
    }

    case "cta":
    case "contact-cta":
      return (
        <div className="space-y-3 pt-2">
          <div className="space-y-1">
            <Label className="text-xs font-semibold">Description / Subtitle</Label>
            <Textarea
              value={content.description || ""}
              onChange={(e) => onChange("description", e.target.value)}
              placeholder="Saint Lawrence Public School is recognised as a leading CBSE school..."
              rows={3}
              className="text-xs"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Button Text</Label>
              <Input
                value={content.buttonText || ""}
                onChange={(e) => onChange("buttonText", e.target.value)}
                placeholder="Apply Now"
                className="text-xs h-8"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Button URL</Label>
              <Input
                value={content.buttonUrl || ""}
                onChange={(e) => onChange("buttonUrl", e.target.value)}
                placeholder="/admissions"
                className="text-xs h-8"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Background Image (Optional)</Label>
            <ImageSettingInput
              value={(content.image as string) || (content.backgroundImage as string) || ""}
              onChange={(url) => {
                onChange("image", url);
                onChange("backgroundImage", url);
              }}
              placeholder="Upload or paste background image URL (Optional)"
              label="CTA Background"
              description="School campus / ground background image."
            />
          </div>
        </div>
      );

    case "video":
      return (
        <div className="space-y-2 pt-2">
          <Label className="text-xs">Embed Video URL</Label>
          <Input value={content.videoUrl || ""} onChange={(e) => onChange("videoUrl", e.target.value)} placeholder="https://www.youtube.com/embed/..." />
        </div>
      );

    case "faq": {
      const items = (content.items || []) as { question: string; answer: string }[];
      const addItem = () => onChange("items", [...items, { question: "New Question", answer: "" }]);
      const removeItem = (i: number) => onChange("items", items.filter((_, idx) => idx !== i));
      const updateItem = (i: number, f: "question" | "answer", v: string) => {
        const copy = [...items];
        if (copy[i]) {
          copy[i] = { ...copy[i]!, [f]: v };
          onChange("items", copy);
        }
      };

      return (
        <div className="space-y-3 pt-2">
          <Label className="text-xs font-semibold">FAQ Items</Label>
          {items.map((item, i) => (
            <div key={i} className="p-3 border rounded-md space-y-2 bg-muted/20">
              <div className="flex gap-2">
                <Input value={item.question} onChange={(e) => updateItem(i, "question", e.target.value)} placeholder="Question" className="flex-1" />
                <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(i)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
              </div>
              <Textarea value={item.answer} onChange={(e) => updateItem(i, "answer", e.target.value)} placeholder="Answer" rows={2} />
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addItem}><Plus className="h-3.5 w-3.5 mr-1" /> Add FAQ Item</Button>
        </div>
      );
    }

    case "testimonials": {
      const items = (content.items || []) as {
        name: string;
        role?: string;
        quote: string;
        avatar?: string;
      }[];

      const addItem = () =>
        onChange("items", [
          ...items,
          {
            name: "Dr. Anju Sharma",
            role: "Mother of Nyra Sharma (Grade I-Tulip)",
            quote:
              "As a doctor and mother, I value Saint Lawrence Public School's nurturing environment. The school combines academic excellence with holistic development, fostering empathy, confidence, and curiosity.",
            avatar: "",
          },
        ]);

      const removeItem = (i: number) => onChange("items", items.filter((_, idx) => idx !== i));
      const updateItem = (i: number, f: string, v: string) => {
        const copy = [...items];
        if (copy[i]) {
          copy[i] = { ...copy[i]!, [f]: v };
          onChange("items", copy);
        }
      };

      return (
        <div className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label className="text-xs font-semibold">Section Subtitle / Description (Optional)</Label>
            <Input
              value={content.subtitle || ""}
              onChange={(e) => onChange("subtitle", e.target.value)}
              placeholder="What parents say about our school..."
              className="text-xs"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">Testimonial Reviews ({items.length})</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem} className="text-xs h-7">
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Testimonial
              </Button>
            </div>

            {items.map((item, i) => (
              <div key={i} className="p-3.5 border rounded-lg space-y-3 bg-muted/20">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-foreground">Review #{i + 1}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(i)} className="h-6 w-6 p-0 text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-[10px]">Parent Name</Label>
                    <Input
                      value={item.name}
                      onChange={(e) => updateItem(i, "name", e.target.value)}
                      placeholder="Dr. Anju Sharma"
                      className="text-xs h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px]">Parent Role / Child Grade</Label>
                    <Input
                      value={item.role || ""}
                      onChange={(e) => updateItem(i, "role", e.target.value)}
                      placeholder="Mother of Nyra Sharma (Grade I-Tulip)"
                      className="text-xs h-8"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-[10px]">Parent Avatar Photo (Optional)</Label>
                  <ImageSettingInput
                    value={item.avatar || ""}
                    onChange={(url) => updateItem(i, "avatar", url)}
                    placeholder="Upload or paste parent photo URL (Optional)"
                    label={item.name || `Review ${i + 1}`}
                    description="Square parent portrait photo (Optional)."
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-[10px]">Testimonial Quote</Label>
                  <Textarea
                    value={item.quote || ""}
                    onChange={(e) => updateItem(i, "quote", e.target.value)}
                    placeholder="Write testimonial quote..."
                    rows={3}
                    className="text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    default:
      return (
        <div className="space-y-2 pt-2">
          <Label className="text-xs">Description / Content</Label>
          <Textarea value={content.description || ""} onChange={(e) => onChange("description", e.target.value)} rows={3} placeholder="Section text content..." />
        </div>
      );
  }
}

function getDefaultContentForType(type: string): Record<string, any> {
  switch (type) {
    case "hero":
      return {
        banners: [
          {
            badge: "BE THE LIGHT",
            title: "Saint Lawrence Public School – One of the Best Schools in Jaipur",
            description:
              "Where every child is known by name, nurtured by purpose, and inspired to lead with empathy, integrity, perseverance, and autonomy.",
            image: "",
            primaryButtonText: "Enquire Now",
            primaryButtonUrl: "/admissions",
            secondaryButtonText: "Latest News",
            secondaryButtonUrl: "/news",
          },
        ],
      };
    case "announcement":
      return { text: "Admissions open for the upcoming academic session." };
    case "introduction":
      return {
        subtitle: "",
        description:
          "At Saint Lawrence Public School, we believe every child learns differently — and thrives when their unique pace is respected. Our approach builds genuine curiosity, strong learning habits, and real confidence at every stage of growth. Students don't just follow a curriculum; they own their learning journey. That's what makes Saint Lawrence one of the most trusted English-medium CBSE schools in Jaipur.",
      };
    case "vision":
      return {
        description:
          "Recognised as one of Jaipur's most trusted schools, SLPS is dedicated to nurturing empathy, integrity, perseverance, and autonomy in every child — shaping young people who are confident, capable, and ready to serve the world with purpose and zeal.",
        items: [
          {
            title: "Chetna",
            tag: "EARLY YEAR I, II, & III",
            description:
              "The foundational preschool stage. Chetna embodies consciousness, awareness, perception, and insight, gently nurturing young minds to explore, understand, and grow.",
          },
          {
            title: "Ananda",
            tag: "GRADES I-II",
            description:
              "Joy, laughter, and glee open an impressionable mind to learning. We call this early phase of enchantment and bliss 'Ananda', where the love of school begins.",
          },
          {
            title: "Kalpana",
            tag: "GRADES III-V",
            description:
              "Children imagine boldly and explore inventive ideas. Flights of fancy fuel their thinking — we call this 'Kalpana', the innate creative power of the mind.",
          },
          {
            title: "Jigyasa",
            tag: "GRADES VI-VIII",
            description:
              "A wealth of experiences sparks genuine curiosity. This is the right moment to introduce scientific enquiry as a growing mind develops a deeper 'Jigyasa'.",
          },
          {
            title: "Sadhana",
            tag: "GRADES IX-XII",
            description:
              "The drive to express skill and talent takes hold. Through practice and perseverance, this phase of 'Sadhana' empowers the self in its totality.",
          },
        ],
      };
    case "student-development":
      return {
        subtitle:
          "At SLPS, holistic development isn't a buzzword — it's built into every school day. We nurture six dimensions of growth that prepare students not just for exams, but for life.",
        items: [
          {
            title: "Establishing Identity",
            description:
              "Understanding who they are and what they value is essential to building a sense of purpose and direction in life.",
            image:
              "https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=800&auto=format&fit=crop",
          },
          {
            title: "Clarifying Purpose",
            description:
              "A clear sense of purpose gives students motivation, direction, and focus for their education and career paths.",
            image:
              "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=800&auto=format&fit=crop",
          },
          {
            title: "Developing Integrity",
            description:
              "Integrity means becoming responsible, trustworthy individuals who make sound decisions and stand up for their beliefs.",
            image:
              "https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=800&auto=format&fit=crop",
          },
          {
            title: "Developing Competence",
            description:
              "Students gain the skills and knowledge they need to succeed in school, work, and life through problem-solving and critical thinking.",
            image:
              "https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=800&auto=format&fit=crop",
          },
          {
            title: "Managing Emotions",
            description:
              "Learning to regulate emotions, cope with stress, and make healthy decisions supports both personal and academic lives.",
            image:
              "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=800&auto=format&fit=crop",
          },
          {
            title: "Becoming Autonomous",
            description:
              "Autonomy is about independence and self-determination — taking ownership of one's learning and decisions.",
            image:
              "https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=800&auto=format&fit=crop",
          },
        ],
      };
    case "manifesto":
      return {
        description:
          "Equal Opportunity for Every Learner: We make sure every child, regardless of background or ability, gets the resources, support, and encouragement they need to succeed.",
        buttonText: "Apply Now",
        buttonUrl: "/admissions",
        image:
          "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1000&auto=format&fit=crop",
        items: [
          {
            title: "Personalized Learning",
            description:
              "Every child learns differently. We help each student find their own pace and path through personal attention, hands-on projects, and smart use of technology.",
          },
          {
            title: "Equal Opportunity for Every Learner",
            description:
              "We make sure every child — regardless of background or ability — gets the resources, support, and encouragement needed to succeed.",
          },
          {
            title: "Thinking and Problem-solving",
            description:
              "Our classrooms are places where questions are encouraged and ideas are explored. Students learn to think deeply and find real-world solutions.",
          },
          {
            title: "Creativity and Innovation",
            description:
              "Whether through art, science, or entrepreneurship, our students learn to create, experiment, and express their ideas with confidence.",
          },
          {
            title: "Teamwork and Communication",
            description:
              "Group projects, discussions, and presentations teach students how to share ideas, listen to others, and lead with empathy.",
          },
        ],
      };
    case "why-choose-us":
      return {
        subtitle: "",
        items: [
          {
            title: "Good Teachers and Staffs",
            description:
              "Our dedicated faculty brings expertise, warmth, and personal attention to every classroom, ensuring each child feels seen and supported.",
            image:
              "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop",
          },
          {
            title: "We Value Good Characters",
            description:
              "Character education is woven into daily life at Saint Lawrence — building integrity, empathy, and responsibility alongside academic achievement.",
            image:
              "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=800&auto=format&fit=crop",
          },
          {
            title: "Your Children are Safe",
            description:
              "A secure campus with trained staff gives parents peace of mind while students explore, learn, and grow with confidence.",
            image:
              "https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=800&auto=format&fit=crop",
          },
        ],
      };
    case "director-message":
      return {
        name: "Mr. Vikram Singh Rajawat",
        designation: "DIRECTOR",
        subtitle:
          "At Saint Lawrence Public School, leadership is rooted in vision, dedication, and a deep commitment to nurturing every child's potential.",
        description:
          "Welcome to Saint Lawrence Public School. Our institution stands as a beacon of quality education on Goner Road, Jaipur — committed to shaping confident, compassionate, and capable young leaders.\n\nUnder our leadership, we strive to provide a nurturing environment where academic excellence meets holistic development. Every child at Saint Lawrence is encouraged to discover their strengths, embrace curiosity, and grow with integrity.\n\nWe invite you to visit our campus, meet our dedicated faculty, and experience the spirit of learning that defines our school community.",
        image: "",
      };
    case "chairman-message":
      return {
        name: "Shri V. K. Gupta",
        designation: "CHAIRMAN",
        subtitle:
          "Guiding future leaders towards global success with wisdom, purpose, and foundational human values.",
        description:
          "Education is not merely the transmission of knowledge; it is the ignition of intellect and character. At Saint Lawrence Public School, we nurture young minds to lead with empathy, courage, and excellence.\n\nOur commitment is to foster an environment where students explore boundless horizons and realize their highest aspirations.",
        image: "",
      };
    case "principal-message":
      return {
        name: "Dr. R. K. Sharma",
        designation: "PRINCIPAL",
        subtitle:
          "Fostering a dynamic learning ecosystem dedicated to curiosity, character, and academic distinction.",
        description:
          "Welcome to Saint Lawrence Public School. We provide students with comprehensive academic and extracurricular avenues to excel in life and make a meaningful impact on society.",
        image: "",
      };
    case "news":
      return {
        subtitle:
          "Stay up to date with events, activities, and updates from one of the best CBSE schools in Jaipur.",
        items: [
          {
            title:
              "Inter-House Sports Competitions: Celebrating Talent, Skills & Sportsmanship.",
            date: "8th - 10th July'26",
            category: "EDUCATION WORLD AWARD",
            excerpt:
              "The Inter-House Sports Competitions for Grades I to XI were successfully organised, fostering teamwork, discipline, and sporting spirit among students.",
            image:
              "https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=1200&auto=format&fit=crop",
            url: "/news/inter-house-sports-competitions",
          },
          {
            title:
              "Investiture Ceremony 2026–27 | Saint Lawrence Public School. Empowering Young Minds Today, Inspiring Tomorrow's Leaders.",
            date: "18th July'26",
            category: "LEADERSHIP & CIVICS",
            excerpt:
              "A momentous day as the newly elected student council takes the pledge to uphold the values, integrity, and honor of Saint Lawrence Public School.",
            image:
              "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop",
            url: "/news/investiture-ceremony-2026-27",
          },
          {
            title:
              "Annual Science & Innovation Exhibition: Young Scientists Shaping the Future.",
            date: "25th August'26",
            category: "STEM & INNOVATION",
            excerpt:
              "Students showcased cutting-edge science models, robotics prototypes, and sustainable environmental solutions in our annual STEM exhibition.",
            image:
              "https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=1200&auto=format&fit=crop",
            url: "/news/annual-science-innovation-exhibition",
          },
        ],
      };
    case "statistics":
      return { items: [{ value: "100%", label: "CBSE Pass Result" }, { value: "50+", label: "Expert Faculty" }, { value: "2000+", label: "Active Students" }, { value: "15+", label: "Sports & Labs" }] };
    case "programs":
      return { description: "Explore our academic offerings from Primary to Senior Secondary levels.", items: [{ title: "Primary School", description: "Classes I to V", image: "" }, { title: "Middle School", description: "Classes VI to VIII", image: "" }, { title: "Senior Secondary", description: "Science, Commerce, Arts", image: "" }] };
    case "facilities":
      return { description: "World-class facilities supporting all-round development.", items: [{ title: "Science & Computer Labs", description: "State of the art practical labs", image: "" }, { title: "Library & E-Resources", description: "Over 10,000 books and digital archives", image: "" }, { title: "Sports Complex", description: "Playgrounds for indoor and outdoor sports", image: "" }] };
    case "cta":
    case "contact-cta":
      return {
        description:
          "Saint Lawrence Public School is recognised as a leading CBSE school on Goner Road, Jaipur, Rajasthan. Today's world values citizens who are creative, empathetic, self-motivated, and critical thinkers.",
        buttonText: "Apply Now",
        buttonUrl: "/admissions",
        image:
          "https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=1600&auto=format&fit=crop",
      };
    case "video":
      return { videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" };
    case "testimonials":
      return {
        subtitle: "",
        items: [
          {
            name: "Dr. Anju Sharma",
            role: "Mother of Nyra Sharma (Grade I-Tulip)",
            quote:
              "As a doctor and mother, I value Saint Lawrence Public School's nurturing environment. The school combines academic excellence with holistic development, fostering empathy, confidence, and curiosity.",
            avatar:
              "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
          },
          {
            name: "Mr. Rajesh Mathur",
            role: "Father of Aarav Mathur (Grade V-Lotus)",
            quote:
              "Choosing Saint Lawrence Public School for our son was the best decision. The faculty’s focus on conceptual learning, moral integrity, and modern sports facilities has truly transformed his confidence.",
            avatar:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
          },
          {
            name: "Mrs. Sunita Verma",
            role: "Mother of Riya Verma (Grade VIII-Rose)",
            quote:
              "The educators go above and beyond to ensure every student’s strengths are identified and nurtured. Saint Lawrence genuinely delivers a well-rounded foundation for future leaders.",
            avatar:
              "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop",
          },
        ],
      };
    case "faq":
      return {
        items: [
          {
            question: "Which board is Saint Lawrence Public School affiliated with?",
            answer:
              "Saint Lawrence Public School is fully affiliated with the Central Board of Secondary Education (CBSE), New Delhi, offering an English-medium curriculum from Kindergarten to Senior Secondary.",
          },
          {
            question:
              "What is the admission process at Saint Lawrence Public School for the 2026–27 session?",
            answer:
              "Parents can apply online through our website or visit the school admissions desk on Goner Road, Jaipur. The process includes form submission, interaction/assessment, and document verification.",
          },
          {
            question:
              "From what grade can my child take admission at Saint Lawrence Public School?",
            answer:
              "Admissions are open starting from Early Years (Playgroup, Nursery, LKG, UKG) through Grade XII across Science, Commerce, and Arts streams.",
          },
          {
            question: "Does Saint Lawrence offer English-medium education in Jaipur?",
            answer:
              "Yes, Saint Lawrence Public School is a premier English-medium CBSE institution emphasizing communicative proficiency, multilingual development, and global readiness.",
          },
          {
            question: "What facilities does Saint Lawrence Public School provide?",
            answer:
              "Our campus includes state-of-the-art Science and Computer laboratories, a digitized Library with 10,000+ volumes, modern sports complexes (indoor and outdoor), audio-visual smart classrooms, and 24/7 CCTV security.",
          },
          {
            question:
              "Where is Saint Lawrence Public School located, and is transport available?",
            answer:
              "The school is conveniently located on Goner Road, Jaipur. We provide secure, GPS-enabled, and staff-monitored bus transportation covering all major neighborhoods in Jaipur.",
          },
          {
            question: "What makes Saint Lawrence stand out among CBSE schools in Jaipur?",
            answer:
              "Our 6 dimensions of holistic student growth, value-based character building, experienced educators, small class ratios, and consistent 100% CBSE board examination results make SLPS a premier choice.",
          },
          {
            question: "Where can I find the fee structure and apply online?",
            answer:
              "You can view our transparent fee schedule and submit online admission queries directly under our website's Admissions tab or contact our admissions office at +91-XXXXXXXXXX.",
          },
        ],
      };
    default:
      return { description: "" };
  }
}
