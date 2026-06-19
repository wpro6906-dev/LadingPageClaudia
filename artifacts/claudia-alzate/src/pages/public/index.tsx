import { useEffect } from "react";
import { useGetProfile, getGetProfileQueryKey, useGetLinks, getGetLinksQueryKey } from "@workspace/api-client-react";
import logoPath from "@assets/image_1781908878316.png";
import { getIconComponent } from "@/components/ui/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

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
    }).catch(console.error);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: any) => {
    e.preventDefault();
    fetch('/api/analytics/track', {
      method: 'POST',
      body: JSON.stringify({ type: 'link_click', linkId: link.id }),
      headers: { 'Content-Type': 'application/json' }
    })
      .catch(console.error)
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground relative flex flex-col lg:flex-row overflow-hidden lg:overflow-hidden">
      
      {/* Left Column / Mobile Header */}
      <div className="relative w-full lg:w-[40%] flex flex-col items-center justify-center p-8 lg:p-12 z-10 
        bg-gradient-to-b from-background to-black lg:border-r border-primary/20 shrink-0 lg:h-[100dvh]">
        
        {/* Subtle radial background gradient for mobile (and desktop left col) */}
        <div className="absolute top-0 inset-x-0 h-64 bg-radial from-primary/8 to-transparent opacity-60 pointer-events-none" />
        {/* Luxury subtle pattern/noise */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

        {/* Logo */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 rounded-full relative"
        >
          <div className="absolute inset-0 rounded-full border border-primary animate-pulse shadow-[0_0_20px_rgba(212,175,55,0.3)]"></div>
          <div className="w-28 h-28 lg:w-36 lg:h-36 overflow-hidden rounded-full border border-primary/40 bg-black/60 p-1 backdrop-blur-sm relative z-10">
            <img src={profile?.logoUrl || logoPath} alt="Logo" className="w-full h-full object-cover rounded-full" />
          </div>
        </motion.div>

        {/* Identity */}
        <motion.h1 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl lg:text-5xl font-serif text-foreground tracking-widest mb-3 text-center text-balance font-light"
        >
          {profile?.name || "Claudia Alzate"}
        </motion.h1>
        
        <motion.h2 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-xs lg:text-sm font-sans text-primary uppercase mb-6 text-center tracking-[0.35em]"
        >
          {profile?.subtitle || "Realtor®"}
        </motion.h2>

        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-16 h-px bg-primary mb-6"
        />
        
        <motion.p 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center text-[#f8f5f0] max-w-[300px] lg:max-w-[340px] leading-relaxed text-[18px] lg:text-[20px]"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}
        >
          "{profile?.tagline || "Te ayudo a encontrar más que una casa, tu próximo hogar."}"
        </motion.p>

        <div className="hidden lg:block absolute bottom-8 left-0 right-0 text-center">
           <p className="text-[10px] text-muted-foreground/60 font-sans tracking-widest uppercase">
            © {new Date().getFullYear()} Claudia Alzate Realtor®
          </p>
        </div>
      </div>

      {/* Right Column / Mobile Links */}
      <div className="w-full lg:w-[60%] flex flex-col items-center justify-center p-6 lg:p-12 lg:h-[100dvh] lg:overflow-y-auto bg-background/50 relative z-10">
        <main className="w-full max-w-md mx-auto flex flex-col flex-1 lg:flex-none justify-center">
          
          {/* Links */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="w-full space-y-4 mb-16 lg:mb-0"
          >
            {isLinksLoading ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="w-full h-20 rounded-xl bg-card/40" />)
            ) : (
              activeLinks.map((link) => {
                const Icon = getIconComponent(link.icon);
                return (
                  <motion.a
                    variants={itemVariants}
                    whileHover={{ scale: 1.01 }}
                    key={link.id}
                    href={link.url}
                    onClick={(e) => handleLinkClick(e, link)}
                    className="group relative block w-full bg-card/60 backdrop-blur-sm border border-primary/20 rounded-xl py-5 px-6 transition-all duration-500 hover:bg-card/80 hover:border-primary/60 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] overflow-hidden"
                  >
                    {/* Left accent bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="flex items-center gap-5 relative z-10">
                      <div className="text-primary group-hover:scale-110 transition-transform duration-500 drop-shadow-md">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-sans font-medium text-foreground tracking-wide group-hover:text-primary transition-colors duration-300 text-[15px]">
                          {link.title}
                        </h3>
                        {link.description && (
                          <p className="text-xs text-muted-foreground mt-1 opacity-80 tracking-wide">
                            {link.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.a>
                );
              })
            )}
          </motion.div>
        </main>

        {/* Footer (Mobile only, Desktop handles it in left col) */}
        <footer className="lg:hidden py-10 text-center w-full mt-auto flex flex-col items-center border-t border-primary/10">
          <div className="w-12 h-px bg-primary/40 mb-6" />
          <p className="text-[10px] text-muted-foreground/60 font-sans tracking-widest uppercase mb-2">
            REALTOR® LICENSED PROFESSIONAL
          </p>
          <p className="text-[10px] text-muted-foreground/40 font-sans tracking-wider uppercase">
            © {new Date().getFullYear()} Claudia Alzate Realtor®
          </p>
        </footer>
      </div>
    </div>
  );
}
