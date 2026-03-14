import { useEffect, useState, useRef } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, Loader2, FileText, Trash2, Users, Shield, UserPlus, FolderOpen, ChevronDown, ChevronRight, Eye, EyeOff, Download, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
}

interface Document {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string | null;
  file_size: number | null;
  category: string;
  description: string | null;
  created_at: string;
  client_id: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  created_at: string;
  is_read: boolean;
}

const categories = [
  "Income Tax Returns",
  "GST Returns",
  "TDS Returns",
  "Audit Reports",
  "Financial Statements",
  "Certificates",
  "Notices & Orders",
  "General",
];

const AdminPanel = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [clients, setClients] = useState<Profile[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Upload form state
  const [selectedClient, setSelectedClient] = useState("");
  const [category, setCategory] = useState("General");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Create client form state
  const [newClientName, setNewClientName] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newClientPassword, setNewClientPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [creatingClient, setCreatingClient] = useState(false);

  // Client folder expansion state
  const [expandedClients, setExpandedClients] = useState<Set<string>>(new Set());

  const unreadCount = messages.filter((m) => !m.is_read).length;

  const markMessagesAsRead = async () => {
    const unreadIds = messages.filter((m) => !m.is_read).map((m) => m.id);
    if (unreadIds.length === 0) return;

    await supabase
      .from("contact_messages")
      .update({ is_read: true } as any)
      .in("id", unreadIds);

    setMessages((prev) => prev.map((m) => ({ ...m, is_read: true })));
  };

  useEffect(() => {
    const init = async () => {
      if (!user) return;

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      const admin = roles?.some((r) => r.role === "admin") ?? false;
      setIsAdmin(admin);

      if (!admin) {
        setLoading(false);
        return;
      }

      const { data: profiles } = await supabase.from("profiles").select("*");
      setClients(profiles || []);

      const { data: docs } = await supabase
        .from("client_documents")
        .select("*")
        .order("created_at", { ascending: false });

      setDocuments(docs || []);

      const { data: msgs } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      setMessages(msgs || []);
      setLoading(false);
    };

    init();
  }, [user]);

  const handleUpload = async () => {
    if (!selectedFile || !selectedClient || !user) {
      toast({ variant: "destructive", title: "Missing fields", description: "Select a client and file." });
      return;
    }

    setUploading(true);

    const filePath = `${selectedClient}/${Date.now()}_${selectedFile.name}`;

    const { error: uploadError } = await supabase.storage
      .from("client-documents")
      .upload(filePath, selectedFile);

    if (uploadError) {
      toast({ variant: "destructive", title: "Upload failed", description: uploadError.message });
      setUploading(false);
      return;
    }

    const { error: dbError } = await supabase.from("client_documents").insert({
      client_id: selectedClient,
      uploaded_by: user.id,
      file_name: selectedFile.name,
      file_path: filePath,
      file_type: selectedFile.type,
      file_size: selectedFile.size,
      category,
      description: description || null,
    });

    if (dbError) {
      toast({ variant: "destructive", title: "Error saving document", description: dbError.message });
      setUploading(false);
      return;
    }

    toast({ title: "Document uploaded", description: `${selectedFile.name} assigned to client.` });

    const { data: docs } = await supabase
      .from("client_documents")
      .select("*")
      .order("created_at", { ascending: false });
    setDocuments(docs || []);

    setSelectedFile(null);
    setDescription("");
    if (fileRef.current) fileRef.current.value = "";
    setUploading(false);
  };

  const handleDelete = async (doc: Document) => {
    await supabase.storage.from("client-documents").remove([doc.file_path]);
    await supabase.from("client_documents").delete().eq("id", doc.id);

    setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
    toast({ title: "Document deleted" });
  };

  const handleDownload = async (doc: Document) => {
    const { data } = await supabase.storage
      .from("client-documents")
      .createSignedUrl(doc.file_path, 60);

    if (data?.signedUrl) {
      window.open(data.signedUrl, "_blank");
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientEmail || !newClientPassword) {
      toast({ variant: "destructive", title: "Missing fields", description: "Email and password are required." });
      return;
    }

    setCreatingClient(true);

    const { data, error } = await supabase.functions.invoke("create-client", {
      body: { email: newClientEmail, password: newClientPassword, full_name: newClientName },
    });

    setCreatingClient(false);

    if (error || data?.error) {
      toast({ variant: "destructive", title: "Failed to create client", description: data?.error || error?.message });
      return;
    }

    toast({ title: "Client created", description: `${newClientEmail} can now sign in.` });

    // Refresh clients list
    const { data: profiles } = await supabase.from("profiles").select("*");
    setClients(profiles || []);

    setNewClientName("");
    setNewClientEmail("");
    setNewClientPassword("");
  };

  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client?.full_name || client?.email || clientId.slice(0, 8);
  };

  const toggleClientExpand = (clientId: string) => {
    setExpandedClients((prev) => {
      const next = new Set(prev);
      if (next.has(clientId)) next.delete(clientId);
      else next.add(clientId);
      return next;
    });
  };

  const clientsWithDocs = clients.map((client) => ({
    ...client,
    docs: documents.filter((d) => d.client_id === client.id),
  })).sort((a, b) => b.docs.length - a.docs.length);

  const formatSize = (bytes: number | null) => {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
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

  if (!isAdmin) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <Shield className="h-12 w-12 text-destructive/50 mb-4" />
          <h2 className="font-display text-2xl font-bold text-foreground">Access Denied</h2>
          <p className="mt-2 text-muted-foreground">You do not have admin privileges.</p>
          <Button variant="outline" className="mt-6" onClick={() => navigate("/portal")}>
            Go to My Documents
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="bg-background py-12 md:py-16">
        <div className="container">
          <div className="mb-8">
            <p className="text-sm font-medium uppercase tracking-widest text-accent">Administration</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">
              Admin Panel
            </h1>
          </div>

          <Tabs defaultValue="clients-folder" className="space-y-6">
            <TabsList className="flex-wrap">
              <TabsTrigger value="clients-folder" className="gap-1.5">
                <FolderOpen className="h-4 w-4" /> Client Folders
              </TabsTrigger>
              <TabsTrigger value="upload" className="gap-1.5">
                <Upload className="h-4 w-4" /> Upload Document
              </TabsTrigger>
              <TabsTrigger value="create-client" className="gap-1.5">
                <UserPlus className="h-4 w-4" /> Create Client
              </TabsTrigger>
              <TabsTrigger value="clients" className="gap-1.5">
                <Users className="h-4 w-4" /> All Clients
              </TabsTrigger>
              <TabsTrigger value="messages" className="gap-1.5" onClick={markMessagesAsRead}>
                <MessageSquare className="h-4 w-4" /> Messages
                {unreadCount > 0 && (
                  <span className="ml-1 text-xs bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Client Folders Tab */}
            <TabsContent value="clients-folder">
              <div className="space-y-3">
                {clientsWithDocs.length === 0 ? (
                  <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
                    No clients found. Create a client first.
                  </div>
                ) : (
                  clientsWithDocs.map((client) => (
                    <div key={client.id} className="rounded-lg border border-border bg-card overflow-hidden">
                      <button
                        onClick={() => toggleClientExpand(client.id)}
                        className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left"
                      >
                        {expandedClients.has(client.id) ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                        )}
                        <FolderOpen className="h-5 w-5 text-accent shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="font-semibold text-foreground">
                            {client.full_name || client.email || client.id.slice(0, 8)}
                          </span>
                          {client.full_name && client.email && (
                            <span className="ml-2 text-xs text-muted-foreground">{client.email}</span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          {client.docs.length} {client.docs.length === 1 ? "file" : "files"}
                        </span>
                      </button>

                      {expandedClients.has(client.id) && (
                        <div className="border-t border-border">
                          {client.docs.length === 0 ? (
                            <p className="p-4 text-sm text-muted-foreground">No documents uploaded yet.</p>
                          ) : (
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>File Name</TableHead>
                                  <TableHead>Category</TableHead>
                                  <TableHead>Size</TableHead>
                                  <TableHead>Date</TableHead>
                                  <TableHead className="w-[100px]">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {client.docs.map((doc) => (
                                  <TableRow key={doc.id}>
                                    <TableCell className="font-medium">
                                      <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                                        <div>
                                          <p className="truncate max-w-[200px]">{doc.file_name}</p>
                                          {doc.description && (
                                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{doc.description}</p>
                                          )}
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-sm">{doc.category}</TableCell>
                                    <TableCell className="text-sm">{formatSize(doc.file_size)}</TableCell>
                                    <TableCell className="text-sm">{new Date(doc.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                      <div className="flex gap-1">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => handleDownload(doc)}
                                          className="text-muted-foreground hover:text-foreground"
                                        >
                                          <Download className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => handleDelete(doc)}
                                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Upload Tab */}
            <TabsContent value="upload">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-border bg-card p-6 max-w-xl"
              >
                <h2 className="font-display text-xl font-semibold text-foreground mb-6">Upload Document for Client</h2>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>Client</Label>
                    <Select value={selectedClient} onValueChange={setSelectedClient}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.full_name || c.email || c.id.slice(0, 8)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Description (optional)</Label>
                    <Input
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="e.g. FY 2024-25 ITR"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>File</Label>
                    <Input
                      ref={fileRef}
                      type="file"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    />
                  </div>

                  <Button
                    onClick={handleUpload}
                    disabled={uploading || !selectedFile || !selectedClient}
                    className="w-full gradient-gold text-accent-foreground font-semibold hover:opacity-90 border-0"
                  >
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                    {uploading ? "Uploading..." : "Upload Document"}
                  </Button>
                </div>
              </motion.div>
            </TabsContent>

            {/* Create Client Tab */}
            <TabsContent value="create-client">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-border bg-card p-6 max-w-xl"
              >
                <h2 className="font-display text-xl font-semibold text-foreground mb-2">Create New Client</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Create a login account for a client. They will be able to sign in and view their documents.
                </p>
                <form onSubmit={handleCreateClient} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="client-name">Full Name</Label>
                    <Input
                      id="client-name"
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      placeholder="Client's full name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="client-email">Email *</Label>
                    <Input
                      id="client-email"
                      type="email"
                      value={newClientEmail}
                      onChange={(e) => setNewClientEmail(e.target.value)}
                      placeholder="client@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="client-password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="client-password"
                        type={showNewPassword ? "text" : "password"}
                        value={newClientPassword}
                        onChange={(e) => setNewClientPassword(e.target.value)}
                        placeholder="Minimum 6 characters"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={creatingClient}
                    className="w-full gradient-gold text-accent-foreground font-semibold hover:opacity-90 border-0"
                  >
                    {creatingClient ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
                    {creatingClient ? "Creating..." : "Create Client Account"}
                  </Button>
                </form>
              </motion.div>
            </TabsContent>

            {/* All Clients Tab */}
            <TabsContent value="clients">
              <div className="rounded-lg border border-border bg-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Documents</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                          No clients found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      clients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell className="font-medium">{client.full_name || "—"}</TableCell>
                          <TableCell>{client.email || "—"}</TableCell>
                          <TableCell>
                            {documents.filter((d) => d.client_id === client.id).length}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages">
              <div className="rounded-lg border border-border bg-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-[60px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messages.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                          No messages yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      messages.map((msg) => (
                        <TableRow key={msg.id}>
                          <TableCell className="font-medium">{msg.name}</TableCell>
                          <TableCell>{msg.email}</TableCell>
                          <TableCell>{msg.phone || "—"}</TableCell>
                          <TableCell>{msg.subject || "—"}</TableCell>
                          <TableCell className="max-w-[300px] truncate">{msg.message}</TableCell>
                          <TableCell className="text-sm">{new Date(msg.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={async () => {
                                await supabase.from("contact_messages").delete().eq("id", msg.id);
                                setMessages((prev) => prev.filter((m) => m.id !== msg.id));
                                toast({ title: "Message deleted" });
                              }}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default AdminPanel;
