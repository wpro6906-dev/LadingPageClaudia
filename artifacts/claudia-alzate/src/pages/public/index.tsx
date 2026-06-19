import { useGetProfile, getGetProfileQueryKey, useGetLinks, getGetLinksQueryKey } from "@workspace/api-client-react";
import logoPath from "@assets/image_1781908878316.png";
import { getIconComponent } from "@/components/ui/icons";
import { Skeleton } from "@/components/ui/skeleton";

export default function PublicProfile() {
  const { data: profile, isLoading: isProfileLoading } = useGetProfile({
    query: { queryKey: getGetProfileQueryKey() }
  });
  
  const { data: links, isLoading: isLinksLoading } = useGetLinks({
    query: { queryKey: getGetLinksQueryKey() }
  });

  const activeLinks = links?.filter(link => link.active).sort((a, b) => a.order - b.order) || [];

  if (isProfileLoading) {
    return (
      <div className="min-h-[100dvh] bg-background text-foreground flex flex-col items-center p-6">
        <Skeleton className="w-24 h-24 rounded-full mt-12 mb-6" />
        <Skeleton className="w-64 h-8 mb-2" />
        <Skeleton className="w-32 h-4 mb-8" />
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="w-full h-16 rounded-xl" />
          <Skeleton className="w-full h-16 rounded-xl" />
          <Skeleton className="w-full h-16 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background text-foreground relative overflow-hidden flex flex-col items-center">
      {/* Subtle luxury texture/gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

      <main className="w-full max-w-md px-6 py-12 flex flex-col items-center z-10 flex-1">
        {/* Logo */}
        <div className="mb-6 rounded-full overflow-hidden border border-primary/20 bg-black/50 p-2 backdrop-blur-sm shadow-2xl">
          <img src={profile?.logoUrl || logoPath} alt="Logo" className="w-24 h-24 object-contain rounded-full" />
        </div>

        {/* Identity */}
        <h1 className="text-3xl font-serif font-medium text-foreground tracking-wide mb-1 text-center">
          {profile?.name || "Claudia Alzate"}
        </h1>
        <h2 className="text-sm font-sans tracking-widest text-primary uppercase mb-6 text-center">
          {profile?.subtitle || "Realtor®"}
        </h2>
        
        <p className="text-center font-sans text-muted-foreground text-sm max-w-[280px] mb-10 leading-relaxed">
          {profile?.tagline || "Te ayudo a encontrar más que una casa, tu próximo hogar."}
        </p>

        {/* Links */}
        <div className="w-full space-y-4 mb-12">
          {isLinksLoading ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="w-full h-16 rounded-xl" />)
          ) : (
            activeLinks.map((link) => {
              const Icon = getIconComponent(link.icon);
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block w-full bg-card/80 backdrop-blur-sm border border-primary/30 rounded-xl p-4 transition-all duration-500 hover:bg-card hover:border-primary hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] transform hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg text-primary group-hover:scale-110 transition-transform duration-500">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-sans font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                        {link.title}
                      </h3>
                      {link.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 opacity-80">
                          {link.description}
                        </p>
                      )}
                    </div>
                  </div>
                </a>
              );
            })
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center z-10 w-full mt-auto">
        <p className="text-xs text-muted-foreground/60 font-sans tracking-wider uppercase">
          Claudia Alzate Realtor® • {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
