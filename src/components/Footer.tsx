import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="gradient-navy text-primary-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-md gradient-gold">
                <span className="text-sm font-bold text-accent-foreground">DKN</span>
              </div>
              <span className="font-display text-lg font-semibold">DKN & Associates</span>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              Trusted Chartered Accountants providing expert financial solutions for businesses and individuals since 2014.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-base font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              {[
                { label: "About Us", path: "/about" },
                { label: "Our Services", path: "/services" },
                { label: "Resources", path: "/resources" },
                { label: "Contact Us", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-base font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>Tax Planning & Filing</li>
              <li>Audit & Assurance</li>
              <li>Business Advisory</li>
              <li>GST Compliance</li>
              <li>Company Registration</li>
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h4 className="font-display text-base font-semibold mb-4">Working Hours</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>Mon - Sat: 9:30 AM - 7:30 PM</li>
              <li>Sun: 10:00 AM - 2:00 PM</li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-base font-semibold mb-4">Follow us on</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              {[
                { label: "Twitter", href: "https://www.google.com" },
                { label: "LinkedIn", href: "https://www.treebo.com/" },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Our Offices — address + contact combined */}
        <div className="mt-10 border-t border-primary-foreground/10 pt-8">
          <h4 className="font-display text-base font-semibold mb-6 text-center">Our Offices</h4>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Office 1 */}
            <div className="rounded-lg border border-primary-foreground/10 p-5 text-sm text-primary-foreground/70">
              <p className="font-medium text-primary-foreground mb-3">Office 1</p>
              <div className="flex items-start gap-2 mb-3">
                <MapPin size={14} className="mt-0.5 shrink-0 text-accent" />
                <span>Office No.7/8, 2nd Floor, Shree Rang Palace, Near INOX Multiplex, Zadeshwar Road, Bharuch, Gujarat, 392011</span>
              </div>
              <div className="space-y-1">
                <p className="flex items-center gap-2"><Mail size={14} className="shrink-0 text-accent" /> dhiraj@dknca.com</p>
                <p className="flex items-center gap-2"><Phone size={14} className="shrink-0 text-accent" /> +91 98241 12375</p>
                <p className="flex items-center gap-2"><Mail size={14} className="shrink-0 text-accent" /> niraj@dknca.com</p>
                <p className="flex items-center gap-2"><Phone size={14} className="shrink-0 text-accent" /> +91 94286 87870</p>
              </div>
            </div>

            {/* Office 2 */}
            <div className="rounded-lg border border-primary-foreground/10 p-5 text-sm text-primary-foreground/70">
              <p className="font-medium text-primary-foreground mb-3">Office 2</p>
              <div className="flex items-start gap-2 mb-3">
                <MapPin size={14} className="mt-0.5 shrink-0 text-accent" />
                <span>416-417, Nexus Business Hub, Maktampur Road, Kasak, Bharuch, Gujarat, 392001</span>
              </div>
              <div className="space-y-1">
                <p className="flex items-center gap-2"><Mail size={14} className="shrink-0 text-accent" /> kaushal@dknca.com</p>
                <p className="flex items-center gap-2"><Phone size={14} className="shrink-0 text-accent" /> +91 98980 69612</p>
              </div>
            </div>

            {/* Office 3 */}
            <div className="rounded-lg border border-primary-foreground/10 p-5 text-sm text-primary-foreground/70">
              <p className="font-medium text-primary-foreground mb-3">Office 3</p>
              <div className="flex items-start gap-2 mb-3">
                <MapPin size={14} className="mt-0.5 shrink-0 text-accent" />
                <span>10-11-12, Buddhadev Complex, Nr. Sevashram Hospital, Sevashram Road, Panchbatti, Bharuch, Gujarat, 392001</span>
              </div>
              <div className="space-y-1">
                <p className="flex items-center gap-2"><Mail size={14} className="shrink-0 text-accent" /> akshar@dknca.com</p>
                <p className="flex items-center gap-2"><Phone size={14} className="shrink-0 text-accent" /> +91 94268 58801</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-primary-foreground/10 pt-6 text-center text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} DKN & Associates. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
