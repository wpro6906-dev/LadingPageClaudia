import { useState, useEffect } from "react";
import { useGetProfile, getGetProfileQueryKey, useUpdateProfile } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Save, Home, MapPin, Star, Key, Building2 } from "lucide-react";

export function IdentityManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: profile, isLoading } = useGetProfile({
    query: { queryKey: getGetProfileQueryKey() }
  });
  
  const updateMutation = useUpdateProfile();
  
  const [form, setForm] = useState({
    firstName: "Claudia",
    lastName: "Alzate",
    firstNameColor: "#FFFFFF",
    lastNameColor: "#D4B483",
    subtitleText: "REALTOR",
    subtitleColor: "#D4B483",
    decoratorEnabled: true,
    decoratorIcon: "home",
    decoratorColor: "#D4B483",
    tagline1: "Te ayudo a encontrar más que una casa,",
    tagline2: "tu próximo hogar.",
    tagline1Color: "#FFFFFF",
    tagline2Color: "#D4B483",
    bgOverlay: 0.7,
    bgBlur: 0,
    bgZoom: 1,
    bgPosition: "center",
    gradientTop: true,
    gradientBottom: true,
    showDecorLines: true,
    showGlow: true,
    nameLetterSpacing: "0.05em",
    showArrowOnButtons: true,
    showAccentBarOnButtons: true,
    logoUrl: "",
    backgroundUrl: ""
  });

  useEffect(() => {
    if (profile) {
      const vc = (profile as any).visualConfig || {};
      setForm(prev => ({
        ...prev,
        logoUrl: profile.logoUrl || "",
        backgroundUrl: profile.backgroundUrl || "",
        firstName: vc.firstName ?? "Claudia",
        lastName: vc.lastName ?? "Alzate",
        firstNameColor: vc.firstNameColor ?? "#FFFFFF",
        lastNameColor: vc.lastNameColor ?? "#D4B483",
        subtitleText: vc.subtitleText ?? "REALTOR",
        subtitleColor: vc.subtitleColor ?? "#D4B483",
        decoratorEnabled: vc.decoratorEnabled ?? true,
        decoratorIcon: vc.decoratorIcon ?? "home",
        decoratorColor: vc.decoratorColor ?? "#D4B483",
        tagline1: vc.tagline1 ?? "Te ayudo a encontrar más que una casa,",
        tagline2: vc.tagline2 ?? "tu próximo hogar.",
        tagline1Color: vc.tagline1Color ?? "#FFFFFF",
        tagline2Color: vc.tagline2Color ?? "#D4B483",
        bgOverlay: vc.bgOverlay ?? 0.7,
        bgBlur: vc.bgBlur ?? 0,
        bgZoom: vc.bgZoom ?? 1,
        bgPosition: vc.bgPosition ?? "center",
        gradientTop: vc.gradientTop ?? true,
        gradientBottom: vc.gradientBottom ?? true,
        showDecorLines: vc.showDecorLines ?? true,
        showGlow: vc.showGlow ?? true,
        nameLetterSpacing: vc.nameLetterSpacing ?? "0.05em",
        showArrowOnButtons: vc.showArrowOnButtons ?? true,
        showAccentBarOnButtons: vc.showAccentBarOnButtons ?? true,
      }));
    }
  }, [profile]);

  const handleSave = () => {
    updateMutation.mutate({ 
      data: {
        name: form.firstName + " " + form.lastName,
        subtitle: form.subtitleText,
        tagline: form.tagline1 + " " + form.tagline2,
        logoUrl: form.logoUrl || null,
        backgroundUrl: form.backgroundUrl || null,
        visualConfig: {
          firstName: form.firstName,
          lastName: form.lastName,
          firstNameColor: form.firstNameColor,
          lastNameColor: form.lastNameColor,
          subtitleText: form.subtitleText,
          subtitleColor: form.subtitleColor,
          decoratorEnabled: form.decoratorEnabled,
          decoratorIcon: form.decoratorIcon,
          decoratorColor: form.decoratorColor,
          tagline1: form.tagline1,
          tagline2: form.tagline2,
          tagline1Color: form.tagline1Color,
          tagline2Color: form.tagline2Color,
          bgOverlay: form.bgOverlay,
          bgBlur: form.bgBlur,
          bgZoom: form.bgZoom,
          bgPosition: form.bgPosition,
          gradientTop: form.gradientTop,
          gradientBottom: form.gradientBottom,
          showDecorLines: form.showDecorLines,
          showGlow: form.showGlow,
          nameLetterSpacing: form.nameLetterSpacing,
          showArrowOnButtons: form.showArrowOnButtons,
          showAccentBarOnButtons: form.showAccentBarOnButtons,
        }
      } as any 
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetProfileQueryKey() });
        toast({ title: "Perfil actualizado" });
      }
    });
  };

  const updateField = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) return <div className="p-8">Cargando identidad...</div>;

  const DecoratorIcon = (() => {
    const name = form.decoratorIcon?.toLowerCase();
    if (name === "mappin") return MapPin;
    if (name === "star") return Star;
    if (name === "key") return Key;
    if (name === "building2" || name === "building") return Building2;
    return Home;
  })();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif text-foreground">Identidad Visual</h2>
        <p className="text-muted-foreground text-sm">Personaliza el diseño premium de tu perfil.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
        <div className="space-y-6">
          <Tabs defaultValue="identity" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="identity">Identidad</TabsTrigger>
              <TabsTrigger value="colors">Colores</TabsTrigger>
              <TabsTrigger value="decorations">Decoraciones</TabsTrigger>
              <TabsTrigger value="background">Fondo</TabsTrigger>
            </TabsList>
            
            <TabsContent value="identity" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input value={form.firstName} onChange={e => updateField("firstName", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input value={form.lastName} onChange={e => updateField("lastName", e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Subtítulo (ej: REALTOR)</Label>
                <Input value={form.subtitleText} onChange={e => updateField("subtitleText", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Tagline línea 1</Label>
                <Textarea value={form.tagline1} onChange={e => updateField("tagline1", e.target.value)} rows={2} />
              </div>
              <div className="space-y-2">
                <Label>Tagline línea 2</Label>
                <Textarea value={form.tagline2} onChange={e => updateField("tagline2", e.target.value)} rows={2} />
              </div>
              <div className="space-y-2">
                <Label>Logo URL</Label>
                <Input value={form.logoUrl} onChange={e => updateField("logoUrl", e.target.value)} placeholder="Dejar en blanco para usar por defecto" />
              </div>
            </TabsContent>

            <TabsContent value="colors" className="space-y-4">
              {[
                { key: "firstNameColor", label: "Color del primer nombre" },
                { key: "lastNameColor", label: "Color del apellido" },
                { key: "subtitleColor", label: "Color del subtítulo" },
                { key: "decoratorColor", label: "Color del decorador" },
                { key: "tagline1Color", label: "Color de frase línea 1" },
                { key: "tagline2Color", label: "Color de frase línea 2" }
              ].map(item => (
                <div key={item.key} className="flex items-center gap-4">
                  <div className="w-1/2">
                    <Label>{item.label}</Label>
                  </div>
                  <div className="flex-1 flex gap-2">
                    <input 
                      type="color" 
                      value={(form as any)[item.key]} 
                      onChange={e => updateField(item.key, e.target.value)} 
                      className="w-10 h-10 rounded cursor-pointer border border-primary/20"
                    />
                    <Input 
                      value={(form as any)[item.key]} 
                      onChange={e => updateField(item.key, e.target.value)}
                      className="flex-1 font-mono text-xs uppercase"
                    />
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="decorations" className="space-y-6">
              <div className="flex items-center justify-between">
                <Label className="cursor-pointer" htmlFor="decoratorEnabled">Mostrar separador decorativo</Label>
                <Switch id="decoratorEnabled" checked={form.decoratorEnabled} onCheckedChange={v => updateField("decoratorEnabled", v)} />
              </div>
              {form.decoratorEnabled && (
                <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                  <Label>Nombre del ícono</Label>
                  <Input value={form.decoratorIcon} onChange={e => updateField("decoratorIcon", e.target.value)} placeholder="home, mapPin, star, key, building2" />
                  <p className="text-xs text-muted-foreground">home, mapPin, star, key, building2</p>
                </div>
              )}
              <div className="flex items-center justify-between">
                <Label className="cursor-pointer" htmlFor="showDecorLines">Mostrar líneas decorativas</Label>
                <Switch id="showDecorLines" checked={form.showDecorLines} onCheckedChange={v => updateField("showDecorLines", v)} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="cursor-pointer" htmlFor="showGlow">Mostrar efecto de brillo</Label>
                <Switch id="showGlow" checked={form.showGlow} onCheckedChange={v => updateField("showGlow", v)} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="cursor-pointer" htmlFor="showArrowOnButtons">Flecha en botones</Label>
                <Switch id="showArrowOnButtons" checked={form.showArrowOnButtons} onCheckedChange={v => updateField("showArrowOnButtons", v)} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="cursor-pointer" htmlFor="showAccentBarOnButtons">Barra de acento en botones</Label>
                <Switch id="showAccentBarOnButtons" checked={form.showAccentBarOnButtons} onCheckedChange={v => updateField("showAccentBarOnButtons", v)} />
              </div>
            </TabsContent>

            <TabsContent value="background" className="space-y-6">
              <div className="space-y-2">
                <Label>Background URL</Label>
                <Input value={form.backgroundUrl} onChange={e => updateField("backgroundUrl", e.target.value)} placeholder="Dejar en blanco para usar degradado" />
              </div>
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Opacidad del overlay</Label>
                    <span className="text-xs text-muted-foreground">{form.bgOverlay}</span>
                  </div>
                  <Slider value={[form.bgOverlay]} min={0} max={1} step={0.05} onValueChange={v => updateField("bgOverlay", v[0])} />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Blur del fondo</Label>
                    <span className="text-xs text-muted-foreground">{form.bgBlur}px</span>
                  </div>
                  <Slider value={[form.bgBlur]} min={0} max={20} step={1} onValueChange={v => updateField("bgBlur", v[0])} />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Zoom del fondo</Label>
                    <span className="text-xs text-muted-foreground">{form.bgZoom}x</span>
                  </div>
                  <Slider value={[form.bgZoom]} min={0.5} max={2} step={0.05} onValueChange={v => updateField("bgZoom", v[0])} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Posición del fondo</Label>
                <Input value={form.bgPosition} onChange={e => updateField("bgPosition", e.target.value)} placeholder="center, top, bottom, etc" />
              </div>
              <div className="flex items-center justify-between">
                <Label className="cursor-pointer" htmlFor="gradientTop">Gradiente superior</Label>
                <Switch id="gradientTop" checked={form.gradientTop} onCheckedChange={v => updateField("gradientTop", v)} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="cursor-pointer" htmlFor="gradientBottom">Gradiente inferior</Label>
                <Switch id="gradientBottom" checked={form.gradientBottom} onCheckedChange={v => updateField("gradientBottom", v)} />
              </div>
            </TabsContent>
          </Tabs>

          <Button onClick={handleSave} disabled={updateMutation.isPending} className="w-full gap-2">
            <Save className="w-4 h-4" />
            {updateMutation.isPending ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>

        {/* Live Preview Sidebar */}
        <div className="sticky top-6">
          <Card className="border-primary/20 bg-background overflow-hidden relative">
            <div className="absolute inset-0 z-0">
               {form.backgroundUrl ? (
                 <>
                   <div 
                     className="absolute inset-0 scale-105"
                     style={{
                       backgroundImage: `url(${form.backgroundUrl})`,
                       backgroundSize: `${(form.bgZoom || 1) * 100}%`,
                       backgroundPosition: form.bgPosition || "center",
                       filter: `blur(${form.bgBlur || 0}px)`
                     }}
                   />
                   <div className="absolute inset-0 bg-black" style={{ opacity: form.bgOverlay ?? 0.7 }} />
                 </>
               ) : (
                 <div className="absolute inset-0 bg-gradient-to-b from-[#0a0806] to-background" />
               )}
            </div>
            
            <CardContent className="p-6 flex flex-col items-center justify-center min-h-[480px] text-center relative z-10 scale-[0.8] origin-top">
              <h3 className="text-[10px] font-mono text-muted-foreground mb-8 uppercase tracking-widest bg-black/50 px-2 py-1 rounded backdrop-blur-sm">Live Preview</h3>
              
              <div className="flex flex-col items-center mb-2">
                <span className="text-4xl font-serif font-light" style={{ color: form.firstNameColor, letterSpacing: form.nameLetterSpacing, fontFamily: "'Playfair Display', serif" }}>
                  {form.firstName}
                </span>
                <span className="text-4xl font-serif font-medium" style={{ color: form.lastNameColor, letterSpacing: form.nameLetterSpacing, fontFamily: "'Playfair Display', serif" }}>
                  {form.lastName}
                </span>
              </div>
              
              <p className="text-[10px] font-sans uppercase mb-4 tracking-[0.4em]" style={{ color: form.subtitleColor, fontFamily: "'Montserrat', sans-serif" }}>
                {form.subtitleText}
              </p>

              {form.decoratorEnabled && (
                <div className="flex flex-row items-center gap-2 mb-4 w-full max-w-[120px]">
                  <div className="flex-1 h-px bg-primary opacity-50" />
                  <DecoratorIcon className="w-3 h-3" style={{ color: form.decoratorColor }} />
                  <div className="flex-1 h-px bg-primary opacity-50" />
                </div>
              )}

              <div className="flex flex-col items-center gap-1 mt-2">
                <p className="font-sans text-[12px] opacity-80 text-center" style={{ color: form.tagline1Color }}>
                  {form.tagline1}
                </p>
                <p className="text-lg font-semibold text-center leading-snug" style={{ color: form.tagline2Color, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>
                  {form.tagline2}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
