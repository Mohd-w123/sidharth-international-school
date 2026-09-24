/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageForm } from "@/features/pages/components/page-form";
import { updatePage } from "@/actions/page.actions";
import { toast } from "sonner";

interface EditPageClientProps {
  pageData: any;
}

export function EditPageClient({ pageData }: EditPageClientProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      const res = await updatePage({
        ...data,
        id: pageData._id,
      });
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(res.success || "Page updated successfully!");
        router.push("/admin/pages");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return <PageForm initialData={pageData} onSubmit={onSubmit} isSubmitting={submitting} />;
}
