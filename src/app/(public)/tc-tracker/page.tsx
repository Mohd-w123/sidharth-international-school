import { Container } from "@/components/layout/container";
import { TCSearchForm } from "@/features/tc/components/tc-search-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "TC Verification & Tracker", description: "Verify and download student Transfer Certificates" };

export default async function PublicTCTrackerPage() {
  return (
    <main>
      <div className="bg-[#003d78] text-white py-16">
        <Container>
          <h1 className="text-4xl font-bold">Transfer Certificate Verification</h1>
          <p className="mt-2 text-white/80 text-lg">Verify authentic student Transfer Certificates online</p>
        </Container>
      </div>

      <Container className="py-12">
        <TCSearchForm />
      </Container>
    </main>
  );
}
