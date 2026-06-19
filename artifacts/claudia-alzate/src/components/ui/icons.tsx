import { Home, Link as LinkIcon, Globe, Phone, Mail, MapPin, Star, Key, Building2, ChevronRight, Linkedin, Twitter, Youtube } from "lucide-react";
import { SiWhatsapp, SiInstagram, SiFacebook, SiTiktok } from "react-icons/si";

export function getIconComponent(name: string) {
  const n = name.toLowerCase();
  switch (n) {
    case "instagram": return SiInstagram;
    case "facebook": return SiFacebook;
    case "whatsapp": return SiWhatsapp;
    case "tiktok": return SiTiktok;
    case "linkedin": return Linkedin;
    case "twitter": case "x": return Twitter;
    case "youtube": return Youtube;
    case "phone": return Phone;
    case "mail": case "email": return Mail;
    case "mappin": case "location": return MapPin;
    case "star": return Star;
    case "key": return Key;
    case "building": case "building2": return Building2;
    case "home": return Home;
    case "globe": case "website": return Globe;
    default: return LinkIcon;
  }
}

export { ChevronRight };
