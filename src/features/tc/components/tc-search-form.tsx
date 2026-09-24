/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { verifyTC } from "@/actions/tc.actions";
import { Search, Download, CheckCircle, AlertCircle, FileText } from "lucide-react";
import { toast } from "sonner";

export function TCSearchForm() {
  const [isPending, startTransition] = useTransition();
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setResult(null);

    startTransition(async () => {
      const res = await verifyTC({ admissionNumber, dateOfBirth });
      if (res.error) {
        setErrorMsg(res.error);
      } else if (res.data) {
        setResult(res.data);
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card className="max-w-xl mx-auto shadow-md">
        <CardHeader className="bg-[#003d78]/5 border-b">
          <CardTitle className="text-lg font-semibold text-[#003d78]">TC Verification & Download Search</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adm-no">Admission Number</Label>
              <Input
                id="adm-no"
                value={admissionNumber}
                onChange={(e) => setAdmissionNumber(e.target.value)}
                placeholder="e.g. ADM-1024"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={isPending} className="w-full bg-[#003d78] hover:bg-[#0b5699]">
              <Search className="h-4 w-4 mr-2" /> {isPending ? "Verifying..." : "Search Certificate"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {errorMsg && (
        <div className="max-w-xl mx-auto p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {result && (
        <Card className="max-w-xl mx-auto border-emerald-500/30 bg-emerald-50/20">
          <CardHeader className="py-4 border-b bg-emerald-50/50">
            <div className="flex items-center gap-2 text-emerald-800 font-semibold text-base">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              Transfer Certificate Verified
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-xs">TC Number</p>
                <p className="font-semibold text-base">{result.tcNumber}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Admission Number</p>
                <p className="font-medium">{result.admissionNumber}</p>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Student Name</p>
              <p className="font-semibold text-[#003d78] text-base">{result.studentName}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-xs">Class Passed</p>
                <p className="font-medium">{result.class}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Session</p>
                <p className="font-medium">{result.session}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-xs">Issue Date</p>
                <p className="font-medium">{new Date(result.issueDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Status</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800">
                  {result.status}
                </span>
              </div>
            </div>

            {result.documentUrl ? (
              <div className="pt-4 border-t">
                <a
                  href={result.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#003d78] text-white hover:bg-[#0b5699] font-medium transition-colors"
                >
                  <Download className="h-4 w-4" /> Download Official TC (PDF)
                </a>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center pt-2">Digital copy pending upload by administration.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
