import { Mail, Phone, MapPin, Clock } from "lucide-react"

const contactDetails = [
  {
    icon: Mail,
    label: "Email",
    value: "prarambhpath4444@gmail.com",
    href: "mailto:prarambhpath4444@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 96898 58940",
    href: "tel:+919689858940",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "New Delhi, India",
    href: null,
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: "Mon - Sat, 10:00 AM - 6:00 PM IST",
    href: null,
  },
]

const socialLinks = [
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Twitter / X", href: "#" },
  { label: "YouTube", href: "#" },
]

export function ContactInfo() {
  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-2xl border border-border bg-card p-8 md:p-10">
        <h3 className="text-xl font-bold text-foreground">Get in Touch</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Reach out through any of the following channels.
        </p>

        <div className="mt-8 flex flex-col gap-6">
          {contactDetails.map((item) => (
            <div key={item.label} className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent">
                <item.icon className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </span>
                {item.href ? (
                  <a
                    href={item.href}
                    className="mt-0.5 block text-sm font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-0.5 text-sm font-medium text-foreground">
                    {item.value}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-8 md:p-10">
        <h3 className="text-lg font-bold text-foreground">Follow Us</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Stay connected through our social channels.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
