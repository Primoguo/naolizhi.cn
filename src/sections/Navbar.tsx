import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMagnetic } from "@/hooks/use-magnetic";

const NAV_LINKS = [
  { label: "功能", href: "#features" },
  { label: "下载", href: "#download" },
];

function MagneticDownloadBtn() {
  const { magRef, onMouseMove, onMouseLeave } = useMagnetic(0.25);
  return (
    <a
      ref={magRef}
      href="#download"
      className="inline-flex transition-transform duration-200 ease-out"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <Button className="rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40">
        免费下载
      </Button>
    </a>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/70 backdrop-blur-xl shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <img
              src="/logo.png"
              alt="挠荔枝"
              className="h-9 w-auto transition-transform duration-300 group-hover:scale-105"
            />
            <span className="text-lg font-bold text-white tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
              挠荔枝 <span className="text-primary font-extrabold">Knowledge</span>
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
            <MagneticDownloadBtn />
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="切换菜单"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen
            ? "max-h-64 opacity-100"
            : "max-h-0 opacity-0"
        } bg-black/90 backdrop-blur-xl border-t border-white/10`}
      >
        <div className="px-4 py-4 space-y-3">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-muted-foreground hover:text-foreground py-2"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#download"
            onClick={() => setMobileOpen(false)}
          >
            <Button className="w-full rounded-full bg-primary hover:bg-primary/90 text-white">
              免费下载
            </Button>
          </a>
        </div>
      </div>
    </nav>
  );
}
