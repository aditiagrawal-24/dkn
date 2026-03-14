import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, TrendingUp, Users, Award } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

const stats = [
  { value: "25+", label: "Years of Experience" },
  { value: "1000+", label: "Clients Served" },
  { value: "₹50Lakhs+", label: "Tax Savings Delivered" },
  { value: "100%", label: "Compliance Rate" },
];

const highlights = [
  {
    icon: Shield,
    title: "Tax Planning & Filing",
    desc: "Strategic tax optimization and timely compliance for individuals and businesses.",
  },
  {
    icon: TrendingUp,
    title: "Audit & Assurance",
    desc: "Thorough audits that give stakeholders confidence in your financial statements.",
  },
  {
    icon: Users,
    title: "Business Advisory",
    desc: "Expert guidance on business structure, growth strategy, and financial planning.",
  },
  {
    icon: Award,
    title: "GST Compliance",
    desc: "End-to-end GST services from registration to return filing and audit support.",
  },
];

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 gradient-navy opacity-80" />
        <div className="relative container py-24 md:py-36 lg:py-44">
          <motion.div
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            <motion.p
              custom={0}
              variants={fadeUp}
              className="mb-3 text-sm font-medium uppercase tracking-widest text-accent"
            >
              Chartered Accountants
            </motion.p>
            <motion.h1
              custom={1}
              variants={fadeUp}
              className="font-display text-4xl font-bold leading-tight text-primary-foreground md:text-5xl lg:text-6xl"
            >
              Your Trusted Partner in{" "}
              <span className="text-gradient-gold">Financial Excellence</span>
            </motion.h1>
            <motion.p
              custom={2}
              variants={fadeUp}
              className="mt-5 max-w-lg text-base text-primary-foreground/75 md:text-lg"
            >
              Expert accounting, taxation, and advisory services tailored to help your business grow with confidence.
            </motion.p>
            <motion.div custom={3} variants={fadeUp} className="mt-8 flex flex-wrap gap-4">
              {user ? (
                <Link to="/home">
                  <Button size="lg" className="gradient-gold text-accent-foreground font-semibold hover:opacity-90 border-0">
                    Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/auth">
                    <Button size="lg" className="gradient-gold text-accent-foreground font-semibold hover:opacity-90 border-0">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
                    >
                      Client Login
                    </Button>
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-card">
        <div className="container grid grid-cols-2 gap-6 py-10 md:grid-cols-4 md:py-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <p className="font-display text-3xl font-bold text-accent md:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services Highlight */}
      <section className="bg-background py-16 md:py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-sm font-medium uppercase tracking-widest text-accent">
              What We Do
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">
              Comprehensive Financial Services
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              From tax planning to business advisory, we provide end-to-end financial solutions for your success.
            </p>
          </motion.div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group rounded-lg border border-border bg-card p-6 transition-all hover:shadow-lg hover:border-accent/30"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg gradient-gold">
                  <item.icon className="h-6 w-6 text-accent-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/services">
              <Button variant="outline">
                View All Services <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-navy py-16 md:py-20">
        <div className="container text-center">
          <h2 className="font-display text-3xl font-bold text-primary-foreground md:text-4xl">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-primary-foreground/70">
            Schedule a free consultation with our experts and discover how we can help your business thrive.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/contact">
              <Button size="lg" className="gradient-gold text-accent-foreground font-semibold hover:opacity-90 border-0">
                Book a Consultation
              </Button>
            </Link>
            <Link to="/about">
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
              >
                Learn More About Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};
export default LandingPage;