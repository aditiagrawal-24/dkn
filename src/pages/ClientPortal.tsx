import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { FileText, Download, Loader2, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Document {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string | null;
  file_size: number | null;
  category: string;
  description: string | null;
  created_at: string;
}

const ClientPortal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      // Check if admin
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (roles?.some((r) => r.role === "admin")) {
        setIsAdmin(true);
      }

      // Fetch documents
      const { data } = await supabase
        .from("client_documents")
        .select("*")
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });

      setDocuments(data || []);
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const handleDownload = async (doc: Document) => {
    const { data } = await supabase.storage
      .from("client-documents")
      .createSignedUrl(doc.file_path, 60);

    if (data?.signedUrl) {
      window.open(data.signedUrl, "_blank");
    }
  };

  const formatSize = (bytes: number | null) => {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const grouped = documents.reduce<Record<string, Document[]>>((acc, doc) => {
    const cat = doc.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(doc);
    return acc;
  }, {});

  return (
    <Layout>
      <section className="bg-background py-12 md:py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-accent">Client Portal</p>
              <h1 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">
                My Documents
              </h1>
              <p className="mt-2 text-muted-foreground">
                Access your filed returns and important documents.
              </p>
            </div>
            {isAdmin && (
              <Button onClick={() => navigate("/admin")} className="gradient-gold text-accent-foreground font-semibold hover:opacity-90 border-0">
                Admin Panel
              </Button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : documents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 rounded-lg border border-border bg-card"
            >
              <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 font-display text-lg font-semibold text-foreground">No documents yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Your documents will appear here once uploaded by your CA.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {Object.entries(grouped).map(([category, docs]) => (
                <div key={category}>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-4">{category}</h2>
                  <div className="grid gap-3">
                    {docs.map((doc, i) => (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between rounded-lg border border-border bg-card p-4 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                            <FileText className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{doc.file_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatSize(doc.file_size)} · {new Date(doc.created_at).toLocaleDateString()}
                              {doc.description && ` · ${doc.description}`}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(doc)}
                          className="shrink-0"
                        >
                          <Download className="h-4 w-4 mr-1" /> Download
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ClientPortal;
