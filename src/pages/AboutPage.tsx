import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Target, Eye, Award, Users } from "lucide-react";
import dhirajPhoto from "@/assets/dhiraj.jpg";
import kaushalPhoto from "@/assets/kaushal.jpg";
import nirajPhoto from "@/assets/niraj.jpg";
import aksharPhoto from "@/assets/akshar.jpg";

const values = [
  { icon: Target, title: "Integrity", desc: "We uphold the highest ethical standards in every engagement." },
  { icon: Eye, title: "Transparency", desc: "Clear communication and honest reporting at every step." },
  { icon: Award, title: "Excellence", desc: "Committed to delivering exceptional quality in all our services." },
  { icon: Users, title: "Client-Centric", desc: "Your success is our success — we tailor solutions to your needs." },
];

const team = [
  { name: "CA Dhiraj Agrawal", role: "Partner", photo: dhirajPhoto },
  { name: "CA Kaushal Surti", role: "Partner", photo: kaushalPhoto },
  { name: "CA Niraj Agrawal", role: "Partner", photo: nirajPhoto },
  { name: "CA Akshar Mehta", role: "Partner", photo: aksharPhoto },
];

const AboutPage = () => {
  return (
    <Layout>
      {/* Header */}
      <section className="gradient-navy py-16 md:py-24">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-widest text-accent">About Us</p>
            <h1 className="mt-2 font-display text-4xl font-bold text-primary-foreground md:text-5xl">
              Building Trust Through <span className="text-gradient-gold">Financial Expertise</span>
            </h1>
            <p className="mt-4 text-primary-foreground/70 md:text-lg">
              Established in 2014, DKN & Associates has been a trusted name in chartered accountancy, serving businesses and individuals across India with integrity and excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-sm font-medium uppercase tracking-widest text-accent">Our Values</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-foreground">What We Stand For</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center rounded-lg border border-border bg-card p-6">
                <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full gradient-gold">
                  <v.icon className="h-6 w-6 text-accent-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-sm font-medium uppercase tracking-widest text-accent">Our Team</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-foreground">Meet Our Partners</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {team.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="rounded-lg border border-border bg-card p-6 text-center">
                {t.photo ? (
                  <img src={t.photo} alt={t.name} className="mx-auto mb-4 h-32 w-32 rounded-full object-cover object-top border-2 border-accent/30" />
                ) : (
                  <img src="/placeholder.svg" alt={t.name} className="mx-auto mb-4 h-32 w-32 rounded-full object-cover object-top border-2 border-accent/30 bg-muted" />
                )}
                <h3 className="font-display text-lg font-semibold text-foreground">{t.name}</h3>
                <p className="text-sm font-medium text-accent">{t.role}</p>

              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
