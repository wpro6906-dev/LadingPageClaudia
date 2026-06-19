import { useState, useEffect } from "react";
import { useGetProfile, getGetProfileQueryKey, useUpdateProfile } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export function IdentityManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: profile, isLoading } = useGetProfile({
    query: { queryKey: getGetProfileQueryKey() }
  });
  
  const updateMutation = useUpdateProfile();
  
  const [form, setForm] = useState({
    name: "",
    subtitle: "",
    tagline: "",
    logoUrl: "",
    backgroundUrl: "",
    primaryColor: "",
    goldColor: ""
  });

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        subtitle: profile.subtitle || "",
        tagline: profile.tagline || "",
        logoUrl: profile.logoUrl || "",
        backgroundUrl: profile.backgroundUrl || "",
        primaryColor: profile.primaryColor || "",
        goldColor: profile.goldColor || ""
      });
    }
  }, [profile]);

  const handleSave = () => {
    updateMutation.mutate({ data: form }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetProfileQueryKey() });
        toast({ title: "Profile updated" });
      }
    });
  };

  if (isLoading) return <div>Loading identity...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif text-foreground">Brand Identity</h2>
        <p className="text-muted-foreground text-sm">Update your public profile details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Name</label>
            <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Subtitle</label>
            <Input value={form.subtitle} onChange={e => setForm({...form, subtitle: e.target.value})} />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Tagline</label>
            <Textarea value={form.tagline} onChange={e => setForm({...form, tagline: e.target.value})} rows={3} />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Logo URL</label>
            <Input value={form.logoUrl} onChange={e => setForm({...form, logoUrl: e.target.value})} placeholder="Leave blank to use default" />
          </div>

          <Button onClick={handleSave} disabled={updateMutation.isPending} className="w-full">
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* Live Preview */}
        <Card className="border-primary/20 bg-background overflow-hidden relative min-h-[400px]">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background pointer-events-none" />
          <CardContent className="p-8 flex flex-col items-center justify-center h-full text-center relative z-10">
            <h3 className="text-xs font-mono text-muted-foreground mb-8 uppercase tracking-widest">Live Preview</h3>
            
            <h1 className="text-2xl font-serif font-medium text-foreground tracking-wide mb-1">
              {form.name || "Claudia Alzate"}
            </h1>
            <h2 className="text-xs font-sans tracking-widest text-primary uppercase mb-4">
              {form.subtitle || "Realtor®"}
            </h2>
            <p className="font-sans text-muted-foreground text-sm max-w-[240px] leading-relaxed">
              {form.tagline || "Te ayudo a encontrar más que una casa, tu próximo hogar."}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
