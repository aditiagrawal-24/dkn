import { useEffect, useState, useRef } from "react";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { FileText, Download, Calendar, ExternalLink, Plus, Trash2, Loader2, Edit2, X, Check, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Guide {
  id: string;
  title: string;
  description: string | null;
  tag: string | null;
  file_path: string | null;
  file_name: string | null;
  sort_order: number | null;
}

interface Deadline {
  id: string;
  event: string;
  deadline_date: string;
  status: string | null;
  sort_order: number | null;
}

interface Link {
  id: string;
  title: string;
  url: string;
  sort_order: number | null;
}

const ResourcesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [isAdmin, setIsAdmin] = useState(false);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [guideOpen, setGuideOpen] = useState(false);
  const [deadlineOpen, setDeadlineOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);

  // Guide form
  const [guideTitle, setGuideTitle] = useState("");
  const [guideDesc, setGuideDesc] = useState("");
  const [guideTag, setGuideTag] = useState("");
  const [guideFile, setGuideFile] = useState<File | null>(null);
  const [guideSaving, setGuideSaving] = useState(false);
  const guideFileRef = useRef<HTMLInputElement>(null);

  // Deadline form
  const [dlEvent, setDlEvent] = useState("");
  const [dlDate, setDlDate] = useState("");
  const [dlSaving, setDlSaving] = useState(false);

  // Link form
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkSaving, setLinkSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [guidesRes, deadlinesRes, linksRes] = await Promise.all([
        supabase.from("resources_guides").select("*").order("sort_order"),
        supabase.from("resources_deadlines").select("*").order("sort_order"),
        supabase.from("resources_links").select("*").order("sort_order"),
      ]);
      setGuides(guidesRes.data || []);
      setDeadlines(deadlinesRes.data || []);
      setLinks(linksRes.data || []);

      if (user) {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id);
        setIsAdmin(roles?.some((r) => r.role === "admin") ?? false);
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  // --- Guide CRUD ---
  const handleAddGuide = async () => {
    if (!guideTitle) return;
    setGuideSaving(true);

    let filePath: string | null = null;
    let fileName: string | null = null;

    if (guideFile) {
      const path = `guides/${Date.now()}_${guideFile.name}`;
      const { error } = await supabase.storage.from("resource-files").upload(path, guideFile);
      if (error) {
        toast({ variant: "destructive", title: "File upload failed", description: error.message });
        setGuideSaving(false);
        return;
      }
      filePath = path;
      fileName = guideFile.name;
    }

    const { error } = await supabase.from("resources_guides").insert({
      title: guideTitle,
      description: guideDesc || null,
      tag: guideTag || "General",
      file_path: filePath,
      file_name: fileName,
      sort_order: guides.length,
    });

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Guide added" });
      const { data } = await supabase.from("resources_guides").select("*").order("sort_order");
      setGuides(data || []);
      setGuideTitle(""); setGuideDesc(""); setGuideTag(""); setGuideFile(null);
      if (guideFileRef.current) guideFileRef.current.value = "";
      setGuideOpen(false);
    }
    setGuideSaving(false);
  };

  const handleDeleteGuide = async (g: Guide) => {
    if (g.file_path) {
      await supabase.storage.from("resource-files").remove([g.file_path]);
    }
    await supabase.from("resources_guides").delete().eq("id", g.id);
    setGuides((prev) => prev.filter((x) => x.id !== g.id));
    toast({ title: "Guide deleted" });
  };

  const handleDownloadGuide = (g: Guide) => {
    if (!g.file_path) return;
    const { data } = supabase.storage.from("resource-files").getPublicUrl(g.file_path);
    if (data?.publicUrl) window.open(data.publicUrl, "_blank");
  };

  // --- Deadline CRUD ---
  const handleAddDeadline = async () => {
    if (!dlEvent || !dlDate) return;
    setDlSaving(true);

    const { error } = await supabase.from("resources_deadlines").insert({
      event: dlEvent,
      deadline_date: dlDate,
      status: "upcoming",
      sort_order: deadlines.length,
    });

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Deadline added" });
      const { data } = await supabase.from("resources_deadlines").select("*").order("sort_order");
      setDeadlines(data || []);
      setDlEvent(""); setDlDate("");
      setDeadlineOpen(false);
    }
    setDlSaving(false);
  };

  const handleDeleteDeadline = async (d: Deadline) => {
    await supabase.from("resources_deadlines").delete().eq("id", d.id);
    setDeadlines((prev) => prev.filter((x) => x.id !== d.id));
    toast({ title: "Deadline deleted" });
  };

  // --- Link CRUD ---
  const handleAddLink = async () => {
    if (!linkTitle || !linkUrl) return;
    setLinkSaving(true);

    const { error } = await supabase.from("resources_links").insert({
      title: linkTitle,
      url: linkUrl,
      sort_order: links.length,
    });

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Link added" });
      const { data } = await supabase.from("resources_links").select("*").order("sort_order");
      setLinks(data || []);
      setLinkTitle(""); setLinkUrl("");
      setLinkOpen(false);
    }
    setLinkSaving(false);
  };

  const handleDeleteLink = async (l: Link) => {
    await supabase.from("resources_links").delete().eq("id", l.id);
    setLinks((prev) => prev.filter((x) => x.id !== l.id));
    toast({ title: "Link deleted" });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="gradient-navy py-16 md:py-24">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-widest text-accent">Resources</p>
            <h1 className="mt-2 font-display text-4xl font-bold text-primary-foreground md:text-5xl">
              Helpful <span className="text-gradient-gold">Resources & Guides</span>
            </h1>
            <p className="mt-4 text-primary-foreground/70 md:text-lg">
              Stay informed with our guides, important deadlines, and useful links to help you stay compliant.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Guides & Downloads */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl font-bold text-foreground">Guides & Downloads</h2>
            {isAdmin && (
              <Dialog open={guideOpen} onOpenChange={setGuideOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1.5 gradient-gold text-accent-foreground border-0 hover:opacity-90">
                    <Plus className="h-4 w-4" /> Add Guide
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Guide / Download</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                      <Label>Title *</Label>
                      <Input value={guideTitle} onChange={(e) => setGuideTitle(e.target.value)} placeholder="Guide title" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Description</Label>
                      <Input value={guideDesc} onChange={(e) => setGuideDesc(e.target.value)} placeholder="Brief description" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Tag</Label>
                      <Input value={guideTag} onChange={(e) => setGuideTag(e.target.value)} placeholder="e.g. Tax Guide, GST" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>File (PDF, etc.)</Label>
                      <Input ref={guideFileRef} type="file" onChange={(e) => setGuideFile(e.target.files?.[0] || null)} />
                    </div>
                    <Button onClick={handleAddGuide} disabled={guideSaving || !guideTitle} className="w-full gradient-gold text-accent-foreground border-0 hover:opacity-90">
                      {guideSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                      {guideSaving ? "Saving..." : "Add Guide"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {guides.length === 0 ? (
            <p className="text-muted-foreground text-sm">No guides available yet.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {guides.map((g, i) => (
                <motion.div key={g.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-4 rounded-lg border border-border bg-card p-5 hover:shadow-md transition-all">
                  <div className="shrink-0 h-10 w-10 rounded-lg gradient-gold flex items-center justify-center">
                    <FileText className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground text-sm">{g.title}</h3>
                      {g.tag && <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">{g.tag}</span>}
                    </div>
                    {g.description && <p className="mt-1 text-xs text-muted-foreground">{g.description}</p>}
                    {g.file_name && <p className="mt-1 text-[10px] text-muted-foreground/60">{g.file_name}</p>}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {g.file_path && (
                      <Button variant="ghost" size="sm" onClick={() => handleDownloadGuide(g)}>
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    {isAdmin && (
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteGuide(g)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Deadlines & Links */}
      <section className="py-16 bg-muted">
        <div className="container grid gap-8 lg:grid-cols-2">
          {/* Deadlines */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent" /> Important Deadlines
              </h2>
              {isAdmin && (
                <Dialog open={deadlineOpen} onOpenChange={setDeadlineOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-1.5 gradient-gold text-accent-foreground border-0 hover:opacity-90">
                      <Plus className="h-4 w-4" /> Add
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Deadline</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                      <div className="space-y-1.5">
                        <Label>Date *</Label>
                        <Input value={dlDate} onChange={(e) => setDlDate(e.target.value)} placeholder="e.g. Jul 31, 2026" />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Event *</Label>
                        <Input value={dlEvent} onChange={(e) => setDlEvent(e.target.value)} placeholder="e.g. ITR Filing Deadline" />
                      </div>
                      <Button onClick={handleAddDeadline} disabled={dlSaving || !dlEvent || !dlDate} className="w-full gradient-gold text-accent-foreground border-0 hover:opacity-90">
                        {dlSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                        {dlSaving ? "Saving..." : "Add Deadline"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            <div className="space-y-3">
              {deadlines.length === 0 ? (
                <p className="text-muted-foreground text-sm">No deadlines set.</p>
              ) : (
                deadlines.map((d) => (
                  <div key={d.id} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
                    <span className="shrink-0 text-sm font-semibold text-accent w-28">{d.deadline_date}</span>
                    <span className="text-sm text-foreground flex-1">{d.event}</span>
                    {isAdmin && (
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteDeadline(d)} className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Links */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-accent" /> Useful Links
              </h2>
              {isAdmin && (
                <Dialog open={linkOpen} onOpenChange={setLinkOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-1.5 gradient-gold text-accent-foreground border-0 hover:opacity-90">
                      <Plus className="h-4 w-4" /> Add
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Link</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                      <div className="space-y-1.5">
                        <Label>Title *</Label>
                        <Input value={linkTitle} onChange={(e) => setLinkTitle(e.target.value)} placeholder="e.g. Income Tax Portal" />
                      </div>
                      <div className="space-y-1.5">
                        <Label>URL *</Label>
                        <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://..." />
                      </div>
                      <Button onClick={handleAddLink} disabled={linkSaving || !linkTitle || !linkUrl} className="w-full gradient-gold text-accent-foreground border-0 hover:opacity-90">
                        {linkSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                        {linkSaving ? "Saving..." : "Add Link"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            <div className="space-y-3">
              {links.length === 0 ? (
                <p className="text-muted-foreground text-sm">No links available.</p>
              ) : (
                links.map((l) => (
                  <div key={l.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4 hover:border-accent/30 transition-all">
                    <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-foreground flex-1 hover:text-accent transition-colors">
                      {l.title}
                    </a>
                    <div className="flex items-center gap-1">
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      {isAdmin && (
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteLink(l)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ResourcesPage;
