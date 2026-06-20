import { useState, useEffect } from "react";
import { useGetProfile, getGetProfileQueryKey, useGetLinks, getGetLinksQueryKey } from "@workspace/api-client-react";
import logoPath from "@assets/image_1781908878316.png";
import { getIconComponent, ChevronRight } from "@/components/ui/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Home, MapPin, Star, Key, Building2 } from "lucide-react";

interface VisualConfig {
  firstName?: string;
  lastName?: string;
  firstNameColor?: string;
  lastNameColor?: string;
  subtitleText?: string;
  subtitleColor?: string;
  decoratorEnabled?: boolean;
  decoratorIcon?: string;
  decoratorColor?: string;
  tagline1?: string;
  tagline2?: string;
  tagline1Color?: string;
  tagline2Color?: string;
  bgOverlay?: number;
  bgBlur?: number;
  bgZoom?: number;
  bgPosition?: string;
  mobileBgPosition?: string;
  mobileBgZoom?: number;
  mobileBgOverlay?: number;
  gradientTop?: boolean;
  gradientBottom?: boolean;
  showDecorLines?: boolean;
  showGlow?: boolean;
  nameLetterSpacing?: string;
  showArrowOnButtons?: boolean;
  showAccentBarOnButtons?: boolean;
}

function getVC(profile: any): Required<VisualConfig> {
  const defaults = {
    firstName: "Claudia", lastName: "Alzate",
    firstNameColor: "#FFFFFF", lastNameColor: "#D4B483",
    subtitleText: "REALTOR", subtitleColor: "#D4B483",
    decoratorEnabled: true, decoratorIcon: "home", decoratorColor: "#D4B483",
    tagline1: "Te ayudo a encontrar más que una casa,", tagline2: "tu próximo hogar.",
    tagline1Color: "#FFFFFF", tagline2Color: "#D4B483",
    bgOverlay: 0.7, bgBlur: 0, bgZoom: 1, bgPosition: "center",
    mobileBgPosition: "60% center", mobileBgZoom: 1.15, mobileBgOverlay: 0.52,
    gradientTop: true, gradientBottom: true, showDecorLines: true, showGlow: true,
    nameLetterSpacing: "0.05em", showArrowOnButtons: true, showAccentBarOnButtons: true
  };
  return { ...defaults, ...(profile?.visualConfig || {}) };
}

export default function PublicProfile() {
  const { data: profile, isLoading: isProfileLoading } = useGetProfile({
    query: { queryKey: getGetProfileQueryKey() }
  });
  
  const { data: links, isLoading: isLinksLoading } = useGetLinks({
    query: { queryKey: getGetLinksQueryKey() }
  });

  const activeLinks = links?.filter(link => link.active).sort((a, b) => a.order - b.order) || [];

  useEffect(() => {
    fetch('/api/analytics/track', {
      method: 'POST',
      body: JSON.stringify({ type: 'page_view' }),
      headers: { 'Content-Type': 'application/json' }
    }).catch(() => {});
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: any) => {
    e.preventDefault();
    fetch('/api/analytics/track', {
      method: 'POST',
      body: JSON.stringify({ type: 'link_click', linkId: link.id }),
      headers: { 'Content-Type': 'application/json' }
    })
      .catch(() => {})
      .finally(() => {
        window.open(link.url, '_blank', 'noopener,noreferrer');
      });
  };

  if (isProfileLoading) {
    return (
      <div className="min-h-[100dvh] bg-background text-foreground flex flex-col items-center p-6">
        <Skeleton className="w-24 h-24 rounded-full mt-12 mb-6" />
        <Skeleton className="w-64 h-8 mb-2" />
        <Skeleton className="w-32 h-4 mb-8" />
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="w-full h-16 rounded-xl bg-card/40" />
          <Skeleton className="w-full h-16 rounded-xl bg-card/40" />
          <Skeleton className="w-full h-16 rounded-xl bg-card/40" />
        </div>
      </div>
    );
  }

  const vc = getVC(profile);
  
  const DecoratorIcon = (() => {
    const name = vc.decoratorIcon?.toLowerCase();
    if (name === "mappin") return MapPin;
    if (name === "star") return Star;
    if (name === "key") return Key;
    if (name === "building2" || name === "building") return Building2;
    return Home;
  })();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="min-h-[100dvh] bg-transparent lg:bg-background text-foreground relative flex flex-col lg:flex-row overflow-hidden lg:overflow-hidden">
      {/* Mobile background — full-bleed image with luxury gradient layers */}
      <div className="absolute inset-0 lg:hidden -z-10 overflow-hidden">
        {profile?.backgroundUrl ? (
          <>
            {/* Base image — fills entire screen, zoomed & repositioned for portrait */}
            <img
              src={profile.backgroundUrl}
              alt=""
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: vc.mobileBgPosition || "60% center",
                transform: `scale(${vc.mobileBgZoom || 1.15})`,
                transformOrigin: "center center",
                filter: vc.bgBlur ? `blur(${vc.bgBlur}px)` : undefined,
              }}
            />
            {/* Base overlay — light, just to unify tone */}
            <div className="absolute inset-0" style={{ background: "rgba(5,3,2,0.22)" }} />
            {/* Top vignette — enough to read text, not enough to kill the image */}
            <div
              className="absolute inset-x-0 top-0"
              style={{
                height: "48%",
                background: "linear-gradient(to bottom, rgba(5,3,2,0.80) 0%, rgba(5,3,2,0.38) 50%, transparent 100%)",
              }}
            />
            {/* Bottom cinematic fade — image melts into the dark links section */}
            <div
              className="absolute inset-x-0 bottom-0"
              style={{
                height: "52%",
                background: "linear-gradient(to top, rgba(5,3,2,1) 0%, rgba(5,3,2,0.90) 18%, rgba(5,3,2,0.55) 50%, transparent 100%)",
              }}
            />
            {/* Lateral vignette — subtle edge depth */}
            <div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(5,3,2,0.35) 100%)",
              }}
            />
            {/* Warm golden shimmer in the visible image zone */}
            <div
              className="absolute inset-x-0"
              style={{
                top: "28%",
                height: "32%",
                background: "linear-gradient(to bottom, transparent, rgba(212,175,55,0.06), transparent)",
                pointerEvents: "none",
              }}
            />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0806] to-background" />
        )}
      </div>

      {/* Left Column / Mobile Header */}
      <div className="relative w-full lg:w-[40%] flex flex-col items-center justify-center px-8 pt-6 pb-3 lg:p-12 z-10 
        lg:border-r border-primary/20 shrink-0 lg:h-[100dvh] overflow-hidden">
        
        {/* Desktop left column background */}
        <div className="absolute inset-0 hidden lg:block -z-10">
          {profile?.backgroundUrl ? (
            <>
              <div 
                className="absolute inset-0 scale-105"
                style={{
                  backgroundImage: `url(${profile.backgroundUrl})`,
                  backgroundSize: `${(vc.bgZoom || 1) * 100}%`,
                  backgroundPosition: vc.bgPosition || "center",
                  filter: `blur(${vc.bgBlur || 0}px)`
                }}
              />
              <div className="absolute inset-0 bg-black" style={{ opacity: vc.bgOverlay ?? 0.7 }} />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0806] to-background" />
          )}
        </div>

        {vc.gradientTop && (
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-background to-transparent z-0 pointer-events-none" />
        )}
        
        {vc.gradientBottom && (
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-background z-0 hidden lg:block pointer-events-none" />
        )}

        {vc.showDecorLines && (
          <>
            <div className="absolute w-px h-1/2 bg-gradient-to-b from-transparent via-primary/20 to-transparent left-0 top-1/4 pointer-events-none" />
            <div className="absolute w-px h-1/2 bg-gradient-to-b from-transparent via-primary/20 to-transparent right-0 top-1/4 pointer-events-none" />
          </>
        )}

        {vc.showGlow && (
          <div className="absolute w-96 h-96 -top-24 left-1/2 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        )}

        {/* Logo */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-3 lg:mb-8 rounded-full relative z-10"
        >
          <div className="absolute inset-0 rounded-full border border-primary/10 animate-pulse shadow-[0_0_20px_rgba(212,175,55,0.15)] scale-[1.05]"></div>
          <div className="w-20 h-20 lg:w-36 lg:h-36 overflow-hidden rounded-full border border-primary/40 bg-black/60 p-1 backdrop-blur-sm relative z-10">
            <img src={profile?.logoUrl || logoPath} alt="Logo" className="w-full h-full object-cover rounded-full" />
          </div>
        </motion.div>

        {/* Identity */}
        <div className="flex flex-col items-center mb-1 lg:mb-3 z-10">
          <motion.span 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl lg:text-6xl font-serif text-center font-light"
            style={{ color: vc.firstNameColor, letterSpacing: vc.nameLetterSpacing, fontFamily: "'Playfair Display', serif" }}
          >
            {vc.firstName}
          </motion.span>
          <motion.span 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-3xl lg:text-6xl font-serif text-center font-medium"
            style={{ color: vc.lastNameColor, letterSpacing: vc.nameLetterSpacing, fontFamily: "'Playfair Display', serif" }}
          >
            {vc.lastName}
          </motion.span>
        </div>
        
        <motion.p 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xs font-sans uppercase mb-2 lg:mb-6 text-center tracking-[0.4em] z-10"
          style={{ color: vc.subtitleColor, fontFamily: "'Montserrat', sans-serif" }}
        >
          {vc.subtitleText}
        </motion.p>

        {vc.decoratorEnabled !== false && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-row items-center gap-3 mb-2 lg:mb-6 z-10 w-full max-w-[160px]"
          >
            <div className="flex-1 max-w-[60px] h-px bg-primary opacity-50" />
            <DecoratorIcon className="w-3 h-3" style={{ color: vc.decoratorColor }} />
            <div className="flex-1 max-w-[60px] h-px bg-primary opacity-50" />
          </motion.div>
        )}
        
        <div className="flex flex-col items-center gap-1 lg:gap-2 z-10">
          <motion.p 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="font-sans text-xs lg:text-sm opacity-80 text-center"
            style={{ color: vc.tagline1Color }}
          >
            {vc.tagline1}
          </motion.p>
          <motion.p 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-lg lg:text-2xl font-semibold text-center"
            style={{ color: vc.tagline2Color, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}
          >
            {vc.tagline2}
          </motion.p>
        </div>

        <div className="hidden lg:block absolute bottom-8 left-0 right-0 text-center z-10">
           <p className="text-[10px] text-muted-foreground/60 font-sans tracking-widest uppercase">
            © {new Date().getFullYear()} {vc.firstName} {vc.lastName}
          </p>
        </div>
      </div>

      {/* Right Column / Mobile Links */}
      <div className="w-full lg:w-[60%] flex flex-col items-center justify-center px-6 pt-2 pb-6 lg:p-12 lg:h-[100dvh] lg:overflow-y-auto bg-background/50 relative z-10">
        <main className="w-full max-w-md mx-auto flex flex-col flex-1 lg:flex-none justify-center">
          
          {/* Links */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="w-full space-y-3 lg:space-y-4 mb-8 lg:mb-0"
          >
            {isLinksLoading ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="w-full h-20 rounded-xl bg-card/40" />)
            ) : (
              activeLinks.map((link) => {
                const Icon = getIconComponent(link.icon);
                return (
                  <motion.div
                    variants={itemVariants}
                    key={link.id}
                  >
                    <a
                      href={link.url}
                      onClick={(e) => handleLinkClick(e, link)}
                      className="group relative block w-full bg-card/40 backdrop-blur-md border border-primary/15 rounded-2xl py-5 px-6 transition-all duration-400 hover:bg-card/70 hover:border-primary/50 hover:shadow-[0_0_24px_rgba(212,175,55,0.12)] overflow-hidden"
                    >
                      {vc.showAccentBarOnButtons !== false && (
                        <div className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full bg-gradient-to-b from-transparent via-primary/60 to-transparent" />
                      )}
                      
                      <div className="flex items-center gap-4 relative z-10">
                        <div className="bg-primary/8 rounded-xl p-3 shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <h3 className="font-sans font-semibold text-sm text-foreground group-hover:text-primary transition-colors duration-300 truncate">
                            {link.title}
                          </h3>
                          {link.description && (
                            <p className="text-xs text-muted-foreground/70 mt-0.5 truncate">
                              {link.description}
                            </p>
                          )}
                        </div>
                        {vc.showArrowOnButtons !== false && (
                          <div className="shrink-0">
                            <ChevronRight className="w-4 h-4 text-primary/40 group-hover:text-primary/80 group-hover:translate-x-1 transition-all duration-300" />
                          </div>
                        )}
                      </div>
                    </a>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </main>

        {/* Footer (Mobile only, Desktop handles it in left col) */}
        <footer className="lg:hidden py-10 text-center w-full mt-auto flex flex-col items-center border-t border-primary/10">
          <div className="w-12 h-px bg-primary/40 mb-6" />
          <p className="text-[10px] text-muted-foreground/40 font-sans tracking-wider uppercase">
            © {new Date().getFullYear()} {vc.firstName} {vc.lastName}
          </p>
        </footer>
      </div>
    </div>
  );
}
