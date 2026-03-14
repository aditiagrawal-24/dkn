import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Shield, TrendingUp, Users, Award, FileText, Building, Calculator, Briefcase } from "lucide-react";

const services = [
  { icon: Shield, title: "Tax Planning & Filing", desc: "Strategic tax planning for individuals, HUFs, and businesses. We ensure maximum legitimate savings while maintaining full compliance with Income Tax laws.", features: ["Income Tax Return Filing", "Tax Saving Strategies", "Advance Tax Planning", "TDS Compliance"] },
  { icon: TrendingUp, title: "Audit & Assurance", desc: "Comprehensive audit services that provide stakeholders with confidence in the accuracy and reliability of your financial statements.", features: ["Statutory Audit", "Internal Audit", "Tax Audit", "Bank Audit"] },
  { icon: Users, title: "Business Advisory", desc: "Expert strategic guidance to help businesses make informed financial decisions and achieve sustainable growth.", features: ["Business Valuation", "Financial Modeling", "Mergers & Acquisitions", "Due Diligence"] },
  { icon: Award, title: "GST Services", desc: "Complete GST lifecycle management from registration to audit support, ensuring seamless indirect tax compliance.", features: ["GST Registration", "Return Filing", "GST Audit", "Refund Claims"] },
  { icon: FileText, title: "Accounting & Bookkeeping", desc: "Accurate and timely bookkeeping services to keep your financial records organized and audit-ready.", features: ["Ledger Maintenance", "Bank Reconciliation", "Payroll Processing", "MIS Reports"] },
  // { icon: Building, title: "Company Registration", desc: "End-to-end company incorporation and regulatory compliance services for startups and businesses.", features: ["Private Limited", "LLP Registration", "OPC Formation", "NGO/Trust Registration"] },
  { icon: Calculator, title: "ROC Compliance", desc: "Annual compliance and regulatory filing services to keep your company in good standing with authorities.", features: ["Annual Returns", "Board Resolutions", "Change in Directors", "Registered Office Change"] },
  // { icon: Briefcase, title: "FEMA & International Tax", desc: "Expert guidance on cross-border transactions, foreign exchange regulations, and international tax planning.", features: ["FEMA Compliance", "Transfer Pricing", "NRI Taxation", "DTAA Benefits"] },
];

const ServicesPage = () => {
  return (
    <Layout>
      <section className="gradient-navy py-16 md:py-24">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-widest text-accent">Our Services</p>
            <h1 className="mt-2 font-display text-4xl font-bold text-primary-foreground md:text-5xl">
              Comprehensive <span className="text-gradient-gold">Financial Solutions</span>
            </h1>
            <p className="mt-4 text-primary-foreground/70 md:text-lg">
              We offer a full spectrum of financial and advisory services to help you stay compliant and grow with confidence.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2">
            {services.map((s, i) => (
              <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="rounded-lg border border-border bg-card p-6 hover:shadow-lg hover:border-accent/30 transition-all">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 inline-flex h-12 w-12 items-center justify-center rounded-lg gradient-gold">
                    <s.icon className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground">{s.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                    <ul className="mt-4 grid grid-cols-2 gap-2">
                      {s.features.map((f) => (
                        <li key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <span className="h-1 w-1 rounded-full bg-accent shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ServicesPage;
