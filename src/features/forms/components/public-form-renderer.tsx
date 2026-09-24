/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface Props {
  form: {
    _id: string;
    title: string;
    description?: string;
    fields: any[];
    successMessage?: string;
  };
}

export function PublicFormRenderer({ form }: Props) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const res = await fetch("/api/forms/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ formId: form._id, data: formData }),
        });
        const json = await res.json();

        if (!res.ok || json.error) {
          toast.error(json.error || "Failed to submit form.");
        } else {
          setSubmitted(true);
          toast.success("Submitted successfully!");
        }
      } catch (err: any) {
        toast.error(err.message || "An error occurred while submitting.");
      }
    });
  };

  if (submitted) {
    return (
      <Card className="max-w-xl mx-auto border-emerald-500/30 bg-emerald-50/20 text-center p-8">
        <CardContent className="space-y-4">
          <CheckCircle className="h-16 w-16 text-emerald-600 mx-auto" />
          <h2 className="text-2xl font-bold text-[#003d78]">Submission Received</h2>
          <p className="text-muted-foreground">{form.successMessage || "Thank you for your response!"}</p>
          <Button variant="outline" onClick={() => { setSubmitted(false); setFormData({}); }}>
            Submit Another Response
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-md">
      <CardHeader className="bg-[#003d78] text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold">{form.title}</CardTitle>
        {form.description && <p className="text-sm text-white/80 mt-1">{form.description}</p>}
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {form.fields.map((field: any) => {
            const isReq = field.required;
            return (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name} className="text-sm font-medium">
                  {field.label} {isReq && <span className="text-red-500">*</span>}
                </Label>

                {field.type === "text" && (
                  <Input
                    id={field.name}
                    required={isReq}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                  />
                )}

                {field.type === "textarea" && (
                  <Textarea
                    id={field.name}
                    required={isReq}
                    placeholder={field.placeholder}
                    rows={4}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                  />
                )}

                {field.type === "email" && (
                  <Input
                    id={field.name}
                    type="email"
                    required={isReq}
                    placeholder={field.placeholder || "email@example.com"}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                  />
                )}

                {field.type === "phone" && (
                  <Input
                    id={field.name}
                    type="tel"
                    required={isReq}
                    placeholder={field.placeholder || "+91 98765 43210"}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                  />
                )}

                {field.type === "number" && (
                  <Input
                    id={field.name}
                    type="number"
                    required={isReq}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                  />
                )}

                {field.type === "date" && (
                  <Input
                    id={field.name}
                    type="date"
                    required={isReq}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                  />
                )}

                {field.type === "select" && (
                  <Select value={formData[field.name] || ""} onValueChange={(v) => handleChange(field.name, v)}>
                    <SelectTrigger><SelectValue placeholder={field.placeholder || "Select option..."} /></SelectTrigger>
                    <SelectContent>
                      {field.options?.map((opt: string) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {field.type === "radio" && (
                  <RadioGroup value={formData[field.name] || ""} onValueChange={(v) => handleChange(field.name, v)} className="space-y-1">
                    {field.options?.map((opt: string) => (
                      <div key={opt} className="flex items-center gap-2">
                        <RadioGroupItem value={opt} id={`${field.name}_${opt}`} />
                        <Label htmlFor={`${field.name}_${opt}`} className="font-normal cursor-pointer">{opt}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {field.type === "checkbox" && (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={field.name}
                      checked={!!formData[field.name]}
                      onCheckedChange={(c) => handleChange(field.name, !!c)}
                    />
                    <Label htmlFor={field.name} className="font-normal cursor-pointer text-sm">
                      {field.placeholder || "Yes / Agree"}
                    </Label>
                  </div>
                )}
              </div>
            );
          })}

          <Button type="submit" disabled={isPending} className="w-full bg-[#003d78] hover:bg-[#0b5699] py-6 text-base">
            <Send className="h-4 w-4 mr-2" /> {isPending ? "Submitting..." : "Submit Form"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
