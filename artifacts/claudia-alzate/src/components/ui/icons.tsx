import { Home, User, Link as LinkIcon, Instagram, Facebook, Globe, Phone } from "lucide-react";
import { SiWhatsapp, SiInstagram, SiFacebook } from "react-icons/si";

export function getIconComponent(name: string) {
  const n = name.toLowerCase();
  switch (n) {
    case "instagram":
      return SiInstagram;
    case "facebook":
      return SiFacebook;
    case "whatsapp":
      return SiWhatsapp;
    case "globe":
    case "website":
      return Globe;
    case "phone":
      return Phone;
    default:
      return LinkIcon;
  }
}
