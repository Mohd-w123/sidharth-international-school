import { disclosureCategoryService, disclosureSectionService } from "@/services/disclosure.service";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDownloadUrl } from "@/lib/utils/format";
import { FileText, ExternalLink, Download, ShieldCheck, CheckCircle2, Building2 } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Mandatory Public Disclosure (CBSE Appendix-IX) | Saint Lawrence Public School",
  description: "Official CBSE Mandatory Public Disclosure documents, certificates, and compliance details.",
};

export default async function PublicDisclosurePage() {
  const categories = await disclosureCategoryService.findPublished();
  const categoriesWithSections = await Promise.all(
    categories.data.map(async (cat) => {
      const sections = await disclosureSectionService.findPublishedByCategory(cat._id.toString());
      return { ...cat, sections };
    })
  );

  return (
    <main className="min-h-screen bg-slate-50/60 pb-20">
      {/* Top Banner Header */}
      <div className="bg-[#002a54] text-white py-14 md:py-18 relative overflow-hidden border-b border-[#ffb300]/20">
        <Container className="relative z-10">
          <div className="flex items-center gap-2.5 text-[#ffb300] font-bold text-xs uppercase tracking-widest mb-3">
            <ShieldCheck className="h-4 w-4" />
            <span>CBSE Statutory Compliance (Appendix-IX)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">
            Mandatory Public Disclosure
          </h1>
          <p className="text-white/80 text-sm sm:text-base md:text-lg max-w-3xl leading-relaxed">
            In compliance with the directives of the Central Board of Secondary Education (CBSE), New Delhi, all statutory documents, safety certificates, and institutional details are published below.
          </p>
        </Container>
      </div>

      <Container className="py-10 md:py-14">
        {categoriesWithSections.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border p-8 max-w-lg mx-auto shadow-xs">
            <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">Disclosure Details In Process</h3>
            <p className="text-slate-500 text-sm mt-1">Official disclosure documents are being uploaded by the school administration.</p>
          </div>
        ) : (
          <div className="space-y-10 max-w-5xl mx-auto">
            {categoriesWithSections.map((cat) => (
              <div key={cat._id.toString()} className="space-y-6">
                {cat.sections.map((sec) => (
                  <Card
                    key={sec._id.toString()}
                    className="overflow-hidden border border-slate-200 shadow-sm rounded-2xl bg-white"
                  >
                    <CardHeader className="bg-[#002a54]/5 border-b border-slate-200/80 px-6 py-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <CardTitle className="text-lg sm:text-xl font-bold text-[#002a54] flex items-center gap-2">
                          <span>{sec.title}</span>
                        </CardTitle>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-full w-fit">
                          {sec.fields?.length || 0} Records
                        </span>
                      </div>
                      {sec.description && (
                        <p className="text-xs sm:text-sm text-slate-600 font-normal mt-1 leading-relaxed">
                          {sec.description}
                        </p>
                      )}
                    </CardHeader>

                    <CardContent className="p-0">
                      {sec.fields && sec.fields.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50/80 text-slate-700 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                              <tr>
                                <th className="py-3 px-5 sm:px-6 w-12 text-center">#</th>
                                <th className="py-3 px-4 sm:px-6">Information / Document Required</th>
                                <th className="py-3 px-5 sm:px-6 text-right min-w-[200px]">Details / Document Link</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
                              {sec.fields.map((field: { label: string; type: string; value: unknown }, idx: number) => {
                                const isDoc = field.type === "document" || field.type === "url";
                                const docUrl = String(field.value || "");

                                return (
                                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="py-4 px-5 sm:px-6 text-center font-mono text-xs text-slate-600">
                                      {idx + 1}
                                    </td>
                                    <td className="py-4 px-4 sm:px-6 font-medium text-slate-900 leading-snug">
                                      {field.label}
                                    </td>
                                    <td className="py-4 px-5 sm:px-6 text-right">
                                      {isDoc && docUrl && docUrl !== "—" ? (
                                        <div className="flex items-center justify-end gap-2 flex-wrap">
                                          <a
                                            href={docUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#002a54] text-white text-xs font-semibold hover:bg-[#003d78] shadow-xs transition-all"
                                          >
                                            <ExternalLink className="h-3.5 w-3.5" />
                                            <span>View PDF</span>
                                          </a>
                                          <a
                                            href={getDownloadUrl(docUrl, field.label)}
                                            download
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#ffb300] text-[#002a54] text-xs font-bold hover:bg-[#ffa000] shadow-xs transition-all"
                                          >
                                            <Download className="h-3.5 w-3.5" />
                                            <span>Download</span>
                                          </a>
                                        </div>
                                      ) : field.type === "boolean" ? (
                                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                                          <CheckCircle2 className="h-3.5 w-3.5" />
                                          {field.value ? "Yes / Approved" : "No"}
                                        </span>
                                      ) : (
                                        <span className="font-medium text-slate-800 text-xs sm:text-sm">
                                          {String(field.value ?? "—")}
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="p-6 text-sm text-slate-600">No records available in this section.</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
