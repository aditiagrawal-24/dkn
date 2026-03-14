import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <Layout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="absolute inset-0 gradient-navy opacity-85" />
        <div className="relative container py-24 md:py-36 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl font-bold text-primary-foreground md:text-5xl">
              Welcome to <span className="text-gradient-gold">DKN & Associates</span>
            </h1>
            <p className="mt-4 text-primary-foreground/70 md:text-lg max-w-lg mx-auto">
              Your trusted Chartered Accountant firm for all financial needs.
            </p>
            <Link to="/dashboard" className="mt-8 inline-block">
              <Button size="lg" className="gradient-gold text-accent-foreground font-semibold hover:opacity-90 border-0">
                Enter Portal <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
