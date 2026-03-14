import { useState } from "react";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, Clock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const offices = [
  {
    name: "Office 1",
    emails: ["dhiraj@dknca.com", "niraj@dknca.com"],
    phones: ["+91 98241 12375", "+91 94286 87870"],
  },
  {
    name: "Office 2",
    emails: ["kaushal@dknca.com"],
    phones: ["+91 98980 69612"],
  },
  {
    name: "Office 3",
    emails: ["akshar@dknca.com"],
    phones: ["+91 94268 58801"],
  },
];

const generalInfo = [
  { icon: Clock, title: "Working Hours", lines: ["Mon - Sat: 9:30 AM - 7:30 PM", "Sun: 10:00 AM - 2:00 PM"] },
];

const ContactPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast({ title: "Missing fields", description: "Please fill in name, email and message.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      subject: form.subject.trim() || null,
      message: form.message.trim(),
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    } else {
      toast({ title: "Message sent!", description: "We'll get back to you soon." });
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    }
  };

  return (
    <Layout>
      <section className="gradient-navy py-16 md:py-24">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-widest text-accent">Contact Us</p>
            <h1 className="mt-2 font-display text-4xl font-bold text-primary-foreground md:text-5xl">
              Let's <span className="text-gradient-gold">Connect</span>
            </h1>
            <p className="mt-4 text-primary-foreground/70 md:text-lg">
              Have questions? Reach out to us for a free consultation and discover how we can help.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container grid gap-12 lg:grid-cols-2">
          {/* Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">Send Us a Message</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" value={form.name} onChange={handleChange} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="Please enter a valid 10 digit phone number" value={form.phone} onChange={handleChange} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="How can we help?" value={form.subject} onChange={handleChange} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Tell us about your requirements..." rows={5} value={form.message} onChange={handleChange} />
              </div>
              <Button type="submit" disabled={loading} className="gradient-gold text-accent-foreground font-semibold hover:opacity-90 border-0">
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : "Send Message"}
              </Button>
            </form>
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">Our Office Contacts</h2>
            <div className="grid gap-4">
              {offices.map((office) => (
                <div key={office.name} className="rounded-lg border border-border bg-card p-5">
                  <h3 className="font-display font-semibold text-foreground mb-3">{office.name}</h3>
                  <div className="space-y-2">
                    {office.emails.map((email) => (
                      <div key={email} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4 shrink-0 text-accent" />
                        <a href={`mailto:${email}`} className="hover:text-accent transition-colors">{email}</a>
                      </div>
                    ))}
                    {office.phones.map((phone) => (
                      <div key={phone} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4 shrink-0 text-accent" />
                        <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-accent transition-colors">{phone}</a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {generalInfo.map((c) => (
              <div key={c.title} className="mt-4 rounded-lg border border-border bg-card p-5">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg gradient-gold">
                  <c.icon className="h-5 w-5 text-accent-foreground" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">{c.title}</h3>
                {c.lines.map((line) => (
                  <p key={line} className="text-xs text-muted-foreground mt-1">{line}</p>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
