import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  MessageCircle,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const contactInfo = [
  {
    icon: MapPin,
    title: "Location",
    details: "St. Xavier's College, Mumbai",
    subDetails: "5, Mahapalika Marg, Mumbai 400001",
  },
  {
    icon: Mail,
    title: "Email",
    details: "contact@tfsxaviers.com",
    subDetails: "info@tfsxaviers.com",
  },
  {
    icon: Phone,
    title: "Phone",
    details: "+91 98765 43210",
    subDetails: "Mon-Fri, 9:00 AM - 6:00 PM",
  },
];

const socialLinks = [
  {
    icon: Instagram,
    href: "#",
    label: "Instagram",
    color: "hover:text-pink-400",
  },
  {
    icon: Linkedin,
    href: "#",
    label: "LinkedIn",
    color: "hover:text-blue-400",
  },
  { icon: Twitter, href: "#", label: "Twitter", color: "hover:text-sky-400" },
  {
    icon: MessageCircle,
    href: "#",
    label: "Discord",
    color: "hover:text-purple-400",
  },
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-20 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #000012 0%, #1a1a2e 50%, #0a0a23 100%)",
      }}
    >
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-finance-gold to-finance-electric bg-clip-text text-transparent">
            Get In Touch
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-finance-gold to-finance-electric mx-auto mb-6" />
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
            Ready to join our financial community? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <h3 className="text-3xl font-bold text-finance-gold mb-8">
              Let's Connect
            </h3>

            {/* Contact Info Cards */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="flex items-start space-x-4 p-6 bg-finance-navy/30 backdrop-blur-sm rounded-xl border border-finance-gold/20 hover:border-finance-gold/40 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-finance-gold to-finance-electric rounded-lg flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-6 h-6 text-finance-navy" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-finance-gold mb-1">
                      {info.title}
                    </h4>
                    <p className="text-foreground font-medium">
                      {info.details}
                    </p>
                    <p className="text-foreground/60 text-sm">
                      {info.subDetails}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="pt-8"
            >
              <h4 className="text-xl font-semibold text-finance-electric mb-4">
                Follow Us
              </h4>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className={`w-12 h-12 bg-finance-navy/50 backdrop-blur-sm rounded-lg flex items-center justify-center border border-finance-gold/20 transition-all duration-300 ${social.color} hover:border-finance-gold/60 hover:scale-110`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-finance-navy/30 backdrop-blur-sm rounded-xl p-8 border border-finance-gold/20"
          >
            <h3 className="text-2xl font-bold text-finance-electric mb-6">
              Send us a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-finance-gold mb-2">
                    Name
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    className="bg-finance-navy/50 border-finance-gold/30 text-foreground placeholder-foreground/50 focus:border-finance-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-finance-gold mb-2">
                    Email
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="bg-finance-navy/50 border-finance-gold/30 text-foreground placeholder-foreground/50 focus:border-finance-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-finance-gold mb-2">
                  Subject
                </label>
                <Input
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="What's this about?"
                  className="bg-finance-navy/50 border-finance-gold/30 text-foreground placeholder-foreground/50 focus:border-finance-gold"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-finance-gold mb-2">
                  Message
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us more..."
                  rows={6}
                  className="bg-finance-navy/50 border-finance-gold/30 text-foreground placeholder-foreground/50 focus:border-finance-gold resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-finance-gold to-finance-electric text-finance-navy hover:scale-105 transition-all duration-300"
                size="lg"
              >
                Send Message
                <Send className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
