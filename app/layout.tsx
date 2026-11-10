import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PokoBot by FLUXY.ID - AI WhatsApp Automation & CRM",
  description: "Next-generation WhatsApp CRM and AI Assistant by FLUXY.ID powered by WAHA & Advanced AI Engine",
  manifest: "/manifest-omnichannel.json",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="bg-poko-canvas text-poko-charcoal antialiased selection:bg-poko-linen selection:text-poko-charcoal">
        {children}
      </body>
    </html>
  );
}
