/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { StatusBadge } from "@/features/admin/components/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Plus } from "lucide-react";
import { createProgram, updateProgram, deleteProgram, createClass, updateClass, deleteClass, createSubject, updateSubject, deleteSubject, createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from "@/actions/academics.actions";
import { generateSlug } from "@/lib/cms/slug";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils/format";
import type { PaginatedResult } from "@/lib/cms";

interface AcademicsManagerProps {
  programs: PaginatedResult<any>;
  classes: PaginatedResult<any>;
  subjects: PaginatedResult<any>;
  calendarEvents: PaginatedResult<any>;
}

export function AcademicsManager({ programs, classes, subjects, calendarEvents }: AcademicsManagerProps) {
  const [activeTab, setActiveTab] = useState<"programs" | "classes" | "subjects" | "calendar">("programs");

  const tabs = [
    { key: "programs" as const, label: "Programs", count: programs.total },
    { key: "classes" as const, label: "Classes", count: classes.total },
    { key: "subjects" as const, label: "Subjects", count: subjects.total },
    { key: "calendar" as const, label: "Calendar", count: calendarEvents.total },
  ];

  return (
    <div className="space-y-6">
      <div className="flex border-b gap-4">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            variant="ghost"
            className={`h-9 px-4 rounded-none border-b-2 transition-all ${
              activeTab === tab.key
                ? "border-primary font-semibold text-primary"
                : "border-transparent text-muted-foreground"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            <span className="ml-1.5 text-xs bg-muted px-1.5 py-0.5 rounded">{tab.count}</span>
          </Button>
        ))}
      </div>

      {activeTab === "programs" && <ProgramsTab data={programs} />}
      {activeTab === "classes" && <ClassesTab data={classes} />}
      {activeTab === "subjects" && <SubjectsTab data={subjects} />}
      {activeTab === "calendar" && <CalendarTab data={calendarEvents} />}
    </div>
  );
}

function ProgramsTab({ data }: { data: PaginatedResult<any> }) {
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("draft");

  const resetForm = () => { setName(""); setSlug(""); setDescription(""); setStatus("draft"); setEditItem(null); };
  const openEdit = (item: any) => { setEditItem(item); setName(item.name); setSlug(item.slug); setDescription(item.description || ""); setStatus(item.status); setDialogOpen(true); };

  const handleSubmit = () => {
    startTransition(async () => {
      const payload = { name, slug: slug || generateSlug(name), description, status };
      const result = editItem ? await updateProgram({ id: editItem._id, ...payload }) : await createProgram(payload);
      if (result.error) toast.error(result.error);
      else { toast.success(result.success); setDialogOpen(false); resetForm(); }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Program</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editItem ? "Edit" : "Add"} Program</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={(e) => { setName(e.target.value); if (!editItem) setSlug(generateSlug(e.target.value)); }} placeholder="e.g. Primary School" /></div>
              <div className="space-y-2"><Label>Slug</Label><Input value={slug} onChange={(e) => setSlug(generateSlug(e.target.value))} /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} /></div>
              <div className="space-y-2"><Label>Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v || "draft")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="published">Published</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select>
              </div>
              <Button onClick={handleSubmit} disabled={isPending} className="w-full">{isPending ? "Saving..." : editItem ? "Update" : "Create"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardContent className="p-0">
          {data.data.length === 0 ? (
            <EmptyState title="No programs" description="Add your first academic program." />
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Status</TableHead><TableHead className="w-10" /></TableRow></TableHeader>
              <TableBody>
                {data.data.map((item: any) => (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell><StatusBadge status={item.status} /></TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-1 rounded hover:bg-muted"><MoreHorizontal className="h-4 w-4" /></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(item)}><Pencil className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
                          <DropdownMenuItem variant="destructive" onClick={() => startTransition(async () => { const r = await deleteProgram(item._id); if (r.error) toast.error(r.error); else toast.success(r.success); })} disabled={isPending}><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ClassesTab({ data }: { data: PaginatedResult<any> }) {
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [section, setSection] = useState("");
  const [status, setStatus] = useState("draft");

  const resetForm = () => { setName(""); setSlug(""); setSection(""); setStatus("draft"); setEditItem(null); };
  const openEdit = (item: any) => { setEditItem(item); setName(item.name); setSlug(item.slug); setSection(item.section || ""); setStatus(item.status); setDialogOpen(true); };

  const handleSubmit = () => {
    startTransition(async () => {
      const payload = { name, slug: slug || generateSlug(name), section, status };
      const result = editItem ? await updateClass({ id: editItem._id, ...payload }) : await createClass(payload);
      if (result.error) toast.error(result.error);
      else { toast.success(result.success); setDialogOpen(false); resetForm(); }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Class</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editItem ? "Edit" : "Add"} Class</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={(e) => { setName(e.target.value); if (!editItem) setSlug(generateSlug(e.target.value)); }} placeholder="e.g. Grade 5" /></div>
              <div className="space-y-2"><Label>Slug</Label><Input value={slug} onChange={(e) => setSlug(generateSlug(e.target.value))} /></div>
              <div className="space-y-2"><Label>Section</Label><Input value={section} onChange={(e) => setSection(e.target.value)} placeholder="e.g. A, B" /></div>
              <div className="space-y-2"><Label>Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v || "draft")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="published">Published</SelectItem></SelectContent></Select>
              </div>
              <Button onClick={handleSubmit} disabled={isPending} className="w-full">{isPending ? "Saving..." : editItem ? "Update" : "Create"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardContent className="p-0">
          {data.data.length === 0 ? <EmptyState title="No classes" description="Add your first class." /> : (
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Section</TableHead><TableHead>Status</TableHead><TableHead className="w-10" /></TableRow></TableHeader>
              <TableBody>
                {data.data.map((item: any) => (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-muted-foreground">{item.section || "—"}</TableCell>
                    <TableCell><StatusBadge status={item.status} /></TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-1 rounded hover:bg-muted"><MoreHorizontal className="h-4 w-4" /></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(item)}><Pencil className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
                          <DropdownMenuItem variant="destructive" onClick={() => startTransition(async () => { const r = await deleteClass(item._id); if (r.error) toast.error(r.error); else toast.success(r.success); })} disabled={isPending}><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SubjectsTab({ data }: { data: PaginatedResult<any> }) {
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [code, setCode] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("draft");

  const resetForm = () => { setName(""); setSlug(""); setCode(""); setDepartment(""); setStatus("draft"); setEditItem(null); };
  const openEdit = (item: any) => { setEditItem(item); setName(item.name); setSlug(item.slug); setCode(item.code || ""); setDepartment(item.department || ""); setStatus(item.status); setDialogOpen(true); };

  const handleSubmit = () => {
    startTransition(async () => {
      const payload = { name, slug: slug || generateSlug(name), code, department, status };
      const result = editItem ? await updateSubject({ id: editItem._id, ...payload }) : await createSubject(payload);
      if (result.error) toast.error(result.error);
      else { toast.success(result.success); setDialogOpen(false); resetForm(); }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Subject</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editItem ? "Edit" : "Add"} Subject</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={(e) => { setName(e.target.value); if (!editItem) setSlug(generateSlug(e.target.value)); }} placeholder="e.g. Mathematics" /></div>
                <div className="space-y-2"><Label>Code</Label><Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. MATH" /></div>
              </div>
              <div className="space-y-2"><Label>Department</Label><Input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g. Science" /></div>
              <Button onClick={handleSubmit} disabled={isPending} className="w-full">{isPending ? "Saving..." : editItem ? "Update" : "Create"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardContent className="p-0">
          {data.data.length === 0 ? <EmptyState title="No subjects" description="Add your first subject." /> : (
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Code</TableHead><TableHead>Department</TableHead><TableHead className="w-10" /></TableRow></TableHeader>
              <TableBody>
                {data.data.map((item: any) => (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-sm">{item.code || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{item.department || "—"}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-1 rounded hover:bg-muted"><MoreHorizontal className="h-4 w-4" /></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(item)}><Pencil className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
                          <DropdownMenuItem variant="destructive" onClick={() => startTransition(async () => { const r = await deleteSubject(item._id); if (r.error) toast.error(r.error); else toast.success(r.success); })} disabled={isPending}><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function CalendarTab({ data }: { data: PaginatedResult<any> }) {
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState("other");
  const [session, setSession] = useState("");
  const [status, setStatus] = useState("draft");

  const resetForm = () => { setTitle(""); setDescription(""); setDate(""); setEndDate(""); setType("other"); setSession(""); setStatus("draft"); };

  const handleSubmit = () => {
    startTransition(async () => {
      const payload = { title, description, date, endDate: endDate || undefined, type, session, status };
      const result = await createCalendarEvent(payload);
      if (result.error) toast.error(result.error);
      else { toast.success(result.success); setDialogOpen(false); resetForm(); }
    });
  };

  const typeColors: Record<string, string> = {
    holiday: "bg-red-100 text-red-700",
    exam: "bg-orange-100 text-orange-700",
    event: "bg-blue-100 text-blue-700",
    meeting: "bg-purple-100 text-purple-700",
    other: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Event</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Calendar Event</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2"><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Summer Vacation" /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Start Date</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
                <div className="space-y-2"><Label>End Date</Label><Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Type</Label>
                  <Select value={type} onValueChange={(v) => setType(v || "other")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="holiday">Holiday</SelectItem><SelectItem value="exam">Exam</SelectItem><SelectItem value="event">Event</SelectItem><SelectItem value="meeting">Meeting</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select>
                </div>
                <div className="space-y-2"><Label>Session</Label><Input value={session} onChange={(e) => setSession(e.target.value)} placeholder="e.g. 2025-26" /></div>
              </div>
              <div className="space-y-2"><Label>Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v || "draft")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="published">Published</SelectItem></SelectContent></Select>
              </div>
              <Button onClick={handleSubmit} disabled={isPending} className="w-full">{isPending ? "Saving..." : "Create"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardContent className="p-0">
          {data.data.length === 0 ? <EmptyState title="No calendar events" description="Add your first academic calendar event." /> : (
            <Table>
              <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Date</TableHead><TableHead>Type</TableHead><TableHead>Session</TableHead><TableHead>Status</TableHead><TableHead className="w-10" /></TableRow></TableHeader>
              <TableBody>
                {data.data.map((item: any) => (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{formatDate(item.date, { day: "numeric", month: "short", year: "numeric" })}</TableCell>
                    <TableCell><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[item.type] || typeColors.other}`}>{item.type}</span></TableCell>
                    <TableCell className="text-muted-foreground text-sm">{item.session}</TableCell>
                    <TableCell><StatusBadge status={item.status} /></TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-1 rounded hover:bg-muted"><MoreHorizontal className="h-4 w-4" /></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem variant="destructive" onClick={() => startTransition(async () => { const r = await deleteCalendarEvent(item._id); if (r.error) toast.error(r.error); else toast.success(r.success); })} disabled={isPending}><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
