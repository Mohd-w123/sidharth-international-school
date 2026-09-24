"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageSettingInput } from "./image-setting-input";
import { updateSetting, updateSettingsBatch, createSetting } from "@/actions/settings.actions";
import { toast } from "sonner";
import {
  Save,
  Plus,
  Settings2,
  Sparkles,
  Sliders,
  Phone,
  Share2,
  FileText,
  Layers,
  Loader2,
  Check,
} from "lucide-react";

interface SettingItem {
  _id?: string;
  key: string;
  value: unknown;
  group: string;
  label?: string;
  type: "text" | "textarea" | "image" | "boolean" | "json" | "color" | "url";
}

interface Props {
  settings: SettingItem[];
  groups: string[];
}

interface SettingFieldDef {
  key: string;
  label: string;
  description?: string;
  group: string;
  type: "text" | "textarea" | "image" | "boolean" | "url" | "color";
  placeholder?: string;
  defaultValue?: unknown;
}

const PREDEFINED_SECTIONS: {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  fields: SettingFieldDef[];
}[] = [
  {
    id: "branding",
    title: "Branding & Logos",
    description: "Manage school logos for the header, footer, favicon, and badges.",
    icon: Sparkles,
    fields: [
      {
        key: "header_logo",
        label: "Header Logo",
        description: "Primary school crest or logo shown in the main navigation bar. Supports direct file upload or URL.",
        group: "branding",
        type: "image",
        placeholder: "Upload or paste header logo URL",
      },
      {
        key: "logo",
        label: "Primary Logo (Fallback)",
        description: "Main school logo used across general components when specific logos are not provided.",
        group: "branding",
        type: "image",
        placeholder: "Upload or paste logo URL",
      },
      {
        key: "footer_logo",
        label: "Footer Logo",
        description: "Logo shown in the website footer. Leave empty to automatically use the Header/Primary logo.",
        group: "branding",
        type: "image",
        placeholder: "Upload or paste footer logo URL",
      },
      {
        key: "favicon",
        label: "Favicon / Browser Crest",
        description: "Small icon shown in browser tabs and bookmarks (PNG, ICO, SVG).",
        group: "branding",
        type: "image",
        placeholder: "Upload or paste favicon URL",
      },
      {
        key: "header_subtitle",
        label: "Header Affiliation Badge / Subtitle",
        description: "Small text displayed right under the school name in the header (e.g. CBSE Affiliated).",
        group: "branding",
        type: "text",
        placeholder: "CBSE Affiliated",
        defaultValue: "CBSE Affiliated",
      },
    ],
  },
  {
    id: "topbar",
    title: "Top Bar & CTA",
    description: "Configure the top notification bar, contact snippets, and admission action button.",
    icon: Sliders,
    fields: [
      {
        key: "topbar_show",
        label: "Enable Top Bar",
        description: "Show or hide the dark blue top information bar above the header.",
        group: "topbar",
        type: "boolean",
        defaultValue: true,
      },
      {
        key: "topbar_phone",
        label: "Topbar Phone Number",
        description: "Phone number displayed on the left side of the top bar (defaults to primary phone).",
        group: "topbar",
        type: "text",
        placeholder: "+91 98765 43210",
      },
      {
        key: "topbar_email",
        label: "Topbar Email Address",
        description: "Email address displayed in the top bar (defaults to primary email).",
        group: "topbar",
        type: "text",
        placeholder: "info@stlawrenceschool.edu.in",
      },
      {
        key: "topbar_announcement",
        label: "Topbar Announcement / Info Note",
        description: "Optional short text, CBSE affiliation number, or timings shown in top bar.",
        group: "topbar",
        type: "text",
        placeholder: "CBSE Affiliation No: 1730123 | School Code: 10456",
      },
      {
        key: "topbar_cta_show",
        label: "Show Admission CTA Button",
        description: "Display the highlight button (e.g. 'Apply Now') on the right side of the top bar.",
        group: "topbar",
        type: "boolean",
        defaultValue: true,
      },
      {
        key: "topbar_cta_text",
        label: "CTA Button Text",
        description: "Text label for the top bar button.",
        group: "topbar",
        type: "text",
        placeholder: "Apply Now",
        defaultValue: "Apply Now",
      },
      {
        key: "topbar_cta_link",
        label: "CTA Button Target Link",
        description: "Destination URL or page path for the CTA button.",
        group: "topbar",
        type: "text",
        placeholder: "/admissions",
        defaultValue: "/admissions",
      },
    ],
  },
  {
    id: "general",
    title: "General Information",
    description: "School name, motto, CBSE credentials, and overall site metadata.",
    icon: FileText,
    fields: [
      {
        key: "site_name",
        label: "School / Institution Name",
        description: "Official name of the school used across header, footer, and page titles.",
        group: "general",
        type: "text",
        placeholder: "Saint Lawrence Public School",
        defaultValue: "Saint Lawrence Public School",
      },
      {
        key: "tagline",
        label: "School Tagline / Motto",
        description: "School vision or motto shown below the title or in footer.",
        group: "general",
        type: "text",
        placeholder: "Nurturing Minds, Building Futures",
        defaultValue: "Nurturing Minds, Building Futures",
      },
      {
        key: "affiliation_number",
        label: "CBSE Affiliation Number",
        description: "Official CBSE affiliation number for compliance headers and disclosure.",
        group: "general",
        type: "text",
        placeholder: "1730123",
      },
      {
        key: "school_code",
        label: "CBSE School Code",
        description: "Official board school code.",
        group: "general",
        type: "text",
        placeholder: "10456",
      },
    ],
  },
  {
    id: "contact",
    title: "Contact & Location",
    description: "Campus address, telephone numbers, official email, and working hours.",
    icon: Phone,
    fields: [
      {
        key: "phone",
        label: "Primary Contact Phone",
        description: "Main phone number for inquiries and general calls.",
        group: "contact",
        type: "text",
        placeholder: "+91 1234567890",
      },
      {
        key: "email",
        label: "Primary Contact Email",
        description: "Main reception/admissions email address.",
        group: "contact",
        type: "text",
        placeholder: "info@school.edu.in",
      },
      {
        key: "address",
        label: "Campus Address",
        description: "Full postal address of the school campus.",
        group: "contact",
        type: "textarea",
        placeholder: "123 School Road, City, State - Pin",
      },
      {
        key: "office_hours",
        label: "Office / School Timings",
        description: "Working hours shown on contact page and disclosure.",
        group: "contact",
        type: "text",
        placeholder: "Mon–Fri: 8:00 AM – 3:30 PM | Sat: 8:00 AM – 12:00 PM",
      },
      {
        key: "google_map_embed",
        label: "Google Maps Embed URL",
        description: "Embed link from Google Maps (iframe src URL) for the Contact page map.",
        group: "contact",
        type: "url",
        placeholder: "https://www.google.com/maps/embed?pb=...",
      },
      {
        key: "website",
        label: "Official Website URL",
        description: "Full web address of the school.",
        group: "contact",
        type: "url",
        placeholder: "https://saintlawrence.edu.in",
      },
    ],
  },
  {
    id: "social",
    title: "Social Media Links",
    description: "Connect the school's social media channels displayed in the footer and contact sections.",
    icon: Share2,
    fields: [
      {
        key: "facebook",
        label: "Facebook Page URL",
        group: "social",
        type: "url",
        placeholder: "https://facebook.com/your-school",
      },
      {
        key: "instagram",
        label: "Instagram Profile URL",
        group: "social",
        type: "url",
        placeholder: "https://instagram.com/your-school",
      },
      {
        key: "twitter",
        label: "Twitter / X Profile URL",
        group: "social",
        type: "url",
        placeholder: "https://x.com/your-school",
      },
      {
        key: "youtube",
        label: "YouTube Channel URL",
        group: "social",
        type: "url",
        placeholder: "https://youtube.com/@your-school",
      },
      {
        key: "linkedin",
        label: "LinkedIn Page URL",
        group: "social",
        type: "url",
        placeholder: "https://linkedin.com/company/your-school",
      },
    ],
  },
  {
    id: "footer",
    title: "Footer & Copyright",
    description: "Customize footer description text, legal notices, and copyright statement.",
    icon: Layers,
    fields: [
      {
        key: "footer_text",
        label: "Footer Description / About Snippet",
        description: "Short paragraph displayed under the school logo in the footer.",
        group: "footer",
        type: "textarea",
        placeholder: "Saint Lawrence Public School is committed to holistic education and excellence...",
      },
      {
        key: "copyright_text",
        label: "Copyright Notice",
        description: "Bottom copyright statement. (Leave empty to use default auto-year format).",
        group: "footer",
        type: "text",
        placeholder: `© ${new Date().getFullYear()} Saint Lawrence Public School. All rights reserved.`,
      },
    ],
  },
];

export function SettingsManager({ settings }: Props) {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState("branding");

  // Map initial settings by key
  const getInitialValues = () => {
    const map: Record<string, unknown> = {};
    for (const s of settings) {
      map[s.key] = s.value;
    }
    return map;
  };

  const [formValues, setFormValues] = useState<Record<string, unknown>>(getInitialValues);
  const [dirtyKeys, setDirtyKeys] = useState<Set<string>>(new Set());

  // Custom Setting Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newGroup, setNewGroup] = useState("general");
  const [newLabel, setNewLabel] = useState("");
  const [newType, setNewType] = useState("text");

  const handleChange = (key: string, value: unknown) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
    setDirtyKeys((prev) => new Set(prev).add(key));
  };

  const handleSaveField = (key: string) => {
    const value = formValues[key];
    startTransition(async () => {
      const result = await updateSetting({ key, value });
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success || "Setting saved!");
        setDirtyKeys((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      }
    });
  };

  const handleSaveActiveSection = () => {
    const currentSection = PREDEFINED_SECTIONS.find((s) => s.id === activeTab);
    if (!currentSection) return;

    const keysToSave = currentSection.fields
      .map((f) => f.key)
      .filter((k) => dirtyKeys.has(k) || formValues[k] !== undefined);

    if (keysToSave.length === 0) {
      toast.info("No changes to save in this section.");
      return;
    }

    const payload = keysToSave.map((key) => ({
      key,
      value: formValues[key] !== undefined ? formValues[key] : "",
    }));

    startTransition(async () => {
      const result = await updateSettingsBatch({ settings: payload });
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${currentSection.title} settings saved successfully!`);
        setDirtyKeys((prev) => {
          const next = new Set(prev);
          keysToSave.forEach((k) => next.delete(k));
          return next;
        });
      }
    });
  };

  const handleCreateCustom = () => {
    if (!newKey.trim()) {
      toast.error("Please provide a setting key");
      return;
    }
    startTransition(async () => {
      const result = await createSetting({
        key: newKey.trim(),
        value: newValue,
        group: newGroup,
        label: newLabel || newKey,
        type: newType,
      });
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success || "Custom setting created!");
        setFormValues((prev) => ({ ...prev, [newKey.trim()]: newValue }));
        setDialogOpen(false);
        setNewKey("");
        setNewValue("");
        setNewLabel("");
      }
    });
  };

  const activeSection = PREDEFINED_SECTIONS.find((s) => s.id === activeTab);
  const isCustomTab = activeTab === "custom";

  // Identify any raw/custom settings that aren't part of predefined fields
  const allPredefinedKeys = new Set(
    PREDEFINED_SECTIONS.flatMap((s) => s.fields.map((f) => f.key))
  );
  const customSettings = settings.filter((s) => !allPredefinedKeys.has(s.key));

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex border-b overflow-x-auto gap-1 pb-px">
        {PREDEFINED_SECTIONS.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeTab === sec.id;
          const sectionDirtyCount = sec.fields.filter((f) => dirtyKeys.has(f.key)).length;

          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveTab(sec.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? "border-primary text-primary font-semibold bg-primary/5 rounded-t-lg"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-t-lg"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{sec.title}</span>
              {sectionDirtyCount > 0 && (
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setActiveTab("custom")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
            isCustomTab
              ? "border-primary text-primary font-semibold bg-primary/5 rounded-t-lg"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-t-lg"
          }`}
        >
          <Settings2 className="h-4 w-4" />
          <span>Advanced / Custom</span>
          {customSettings.length > 0 && (
            <span className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
              {customSettings.length}
            </span>
          )}
        </button>
      </div>

      {/* ACTIVE SECTION CONTENT */}
      {activeSection && (
        <Card className="shadow-xs">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b bg-muted/20 pb-4">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <activeSection.icon className="h-5 w-5 text-primary" />
                {activeSection.title}
              </CardTitle>
              <CardDescription className="mt-1">{activeSection.description}</CardDescription>
            </div>

            <Button
              onClick={handleSaveActiveSection}
              disabled={isPending}
              className="bg-[#003d78] hover:bg-[#002a54] text-white shrink-0 shadow-xs"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </CardHeader>

          <CardContent className="p-6 divide-y space-y-6">
            {activeSection.fields.map((field) => {
              const currentValue = formValues[field.key] ?? field.defaultValue ?? "";
              const isDirty = dirtyKeys.has(field.key);

              return (
                <div key={field.key} className="pt-6 first:pt-0">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="md:w-1/3 space-y-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={field.key} className="text-sm font-semibold text-foreground">
                          {field.label}
                        </Label>
                        {isDirty && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 px-1.5 py-0.5 rounded font-medium">
                            Unsaved
                          </span>
                        )}
                      </div>
                      <code className="text-[10px] text-muted-foreground font-mono bg-muted/60 px-1.5 py-0.5 rounded inline-block">
                        {field.key}
                      </code>
                      {field.description && (
                        <p className="text-xs text-muted-foreground pt-1 leading-relaxed">
                          {field.description}
                        </p>
                      )}
                    </div>

                    <div className="md:w-2/3 space-y-2">
                      {field.type === "image" ? (
                        <ImageSettingInput
                          value={String(currentValue || "")}
                          onChange={(val) => handleChange(field.key, val)}
                          placeholder={field.placeholder}
                          label={field.label}
                        />
                      ) : field.type === "boolean" ? (
                        <div className="flex items-center gap-3 py-2">
                          <Switch
                            id={field.key}
                            checked={!!currentValue}
                            onCheckedChange={(checked) => handleChange(field.key, checked)}
                          />
                          <span className="text-sm font-medium">
                            {currentValue ? "Enabled / Visible" : "Disabled / Hidden"}
                          </span>
                        </div>
                      ) : field.type === "textarea" ? (
                        <Textarea
                          id={field.key}
                          value={String(currentValue ?? "")}
                          onChange={(e) => handleChange(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          rows={3}
                          className="text-sm"
                        />
                      ) : (
                        <div className="flex gap-2">
                          <Input
                            id={field.key}
                            value={String(currentValue ?? "")}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            placeholder={field.placeholder}
                            type={field.type === "url" ? "url" : "text"}
                            className="text-sm"
                          />
                        </div>
                      )}

                      {/* Individual quick save indicator */}
                      {isDirty && (
                        <div className="flex justify-end pt-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSaveField(field.key)}
                            disabled={isPending}
                            className="text-xs text-primary hover:bg-primary/10 h-7"
                          >
                            <Save className="h-3 w-3 mr-1" />
                            Save this field
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* ADVANCED / CUSTOM TAB */}
      {isCustomTab && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-muted/30 p-4 rounded-xl border">
            <div>
              <h3 className="text-sm font-bold text-foreground">Custom Site Variables</h3>
              <p className="text-xs text-muted-foreground">
                Add custom key-value pairs accessible via the settings API and layout components.
              </p>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger>
                <Button size="sm" variant="outline" className="text-xs">
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Custom Setting
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Setting</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Key</Label>
                      <Input
                        value={newKey}
                        onChange={(e) => setNewKey(e.target.value)}
                        placeholder="e.g. admission_helpline"
                        className="font-mono text-xs"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Label</Label>
                      <Input
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        placeholder="Admission Helpline"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Group</Label>
                      <Input
                        value={newGroup}
                        onChange={(e) => setNewGroup(e.target.value)}
                        placeholder="general"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select value={newType} onValueChange={(v) => setNewType(v || "text")}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="textarea">Textarea</SelectItem>
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="boolean">Boolean</SelectItem>
                          <SelectItem value="url">URL</SelectItem>
                          <SelectItem value="json">JSON</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Initial Value</Label>
                    <Input
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      placeholder="Setting value..."
                    />
                  </div>

                  <Button
                    onClick={handleCreateCustom}
                    disabled={isPending || !newKey.trim()}
                    className="w-full bg-[#003d78] text-white"
                  >
                    {isPending ? "Creating..." : "Create Setting"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {customSettings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground text-sm">
                No custom settings defined yet. Use the predefined tabs above or click &quot;Add Custom Setting&quot;.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {customSettings.map((setting) => {
                const currentValue = formValues[setting.key] ?? setting.value ?? "";
                const isDirty = dirtyKeys.has(setting.key);

                return (
                  <Card key={setting._id || setting.key}>
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {setting.label || setting.key}
                          </span>
                          <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono text-muted-foreground">
                            {setting.key}
                          </code>
                          <span className="text-[10px] bg-muted/60 text-muted-foreground px-1 rounded">
                            {setting.group}
                          </span>
                        </div>

                        {setting.type === "image" ? (
                          <ImageSettingInput
                            value={String(currentValue)}
                            onChange={(val) => handleChange(setting.key, val)}
                          />
                        ) : setting.type === "boolean" ? (
                          <div className="flex items-center gap-3">
                            <Switch
                              checked={!!currentValue}
                              onCheckedChange={(v) => handleChange(setting.key, v)}
                            />
                            <span className="text-sm text-muted-foreground">
                              {currentValue ? "Enabled" : "Disabled"}
                            </span>
                          </div>
                        ) : setting.type === "textarea" ? (
                          <Textarea
                            value={String(currentValue)}
                            onChange={(e) => handleChange(setting.key, e.target.value)}
                            rows={3}
                          />
                        ) : (
                          <Input
                            value={String(currentValue)}
                            onChange={(e) => handleChange(setting.key, e.target.value)}
                          />
                        )}
                      </div>

                      {isDirty && (
                        <Button
                          size="sm"
                          onClick={() => handleSaveField(setting.key)}
                          disabled={isPending}
                          className="shrink-0 text-xs mt-6"
                        >
                          <Save className="h-3 w-3 mr-1" /> Save
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
