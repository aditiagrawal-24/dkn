import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, TrendingUp, Users, Award, FileText, Building } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const stats = [
  { value: "25+", label: "Years of Experience" },
  { value: "1000+", label: "Clients Served" },
  { value: "₹50Lakhs+", label: "Tax Savings Delivered/Services Offered" },
  { value: "100%", label: "Compliance Rate" },
];

const services = [
  { icon: Shield, title: "Tax Planning", desc: "Strategic tax optimization and timely compliance." },
  { icon: TrendingUp, title: "Audit & Assurance", desc: "Thorough financial audits and assurance services." },
  { icon: Users, title: "Business Advisory", desc: "Expert guidance on growth strategy and planning." },
  { icon: Award, title: "GST Services", desc: "Complete GST registration, filing, and audit." },
  { icon: FileText, title: "Bookkeeping", desc: "Accurate and timely bookkeeping solutions." },
  // { icon: Building, title: "Company Registration", desc: "End-to-end incorporation and compliance." },
];

const HomePage = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="absolute inset-0 gradient-navy opacity-85" />
        <div className="relative container py-20 md:py-32">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-2xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">Welcome Back</p>
            <h1 className="font-display text-4xl font-bold text-primary-foreground md:text-5xl">
              Expert Financial Solutions for <span className="text-gradient-gold">Your Growth</span>
            </h1>
            <p className="mt-4 text-primary-foreground/75 md:text-lg max-w-lg">
              Navigate the complexities of finance with a dedicated team of Chartered Accountants by your side.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/services">
                <Button size="lg" className="gradient-gold text-accent-foreground font-semibold hover:opacity-90 border-0">
                  Our Services <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-card">
        <div className="container grid grid-cols-2 gap-6 py-10 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <p className="font-display text-3xl font-bold text-accent md:text-4xl">{s.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-sm font-medium uppercase tracking-widest text-accent">Our Expertise</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">How We Can Help</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="rounded-lg border border-border bg-card p-6 hover:shadow-lg hover:border-accent/30 transition-all">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg gradient-gold">
                  <s.icon className="h-5 w-5 text-accent-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
