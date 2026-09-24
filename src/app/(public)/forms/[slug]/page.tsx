import { notFound } from "next/navigation";
import { formService } from "@/services/form.service";
import { Container } from "@/components/layout/container";
import { PublicFormRenderer } from "@/features/forms/components/public-form-renderer";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props { params: Promise<{ slug: string }>; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const form = await formService.findPublishedBySlug(slug);
  if (!form) return { title: "Form Not Found" };
  return { title: form.title, description: form.description };
}

export default async function PublicFormPage({ params }: Props) {
  const { slug } = await params;
  const form = await formService.findPublishedBySlug(slug);
  if (!form) notFound();

  return (
    <main className="py-12 bg-muted/20 min-h-screen">
      <Container>
        <PublicFormRenderer form={JSON.parse(JSON.stringify(form))} />
      </Container>
    </main>
  );
}
