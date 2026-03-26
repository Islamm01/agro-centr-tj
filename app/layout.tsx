// app/layout.tsx
import type { Metadata } from "next";
import { Noto_Sans as NotoSans } from "next/font/google";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { LangProvider } from "@/components/providers/LangProvider";
import "./globals.css";

// Noto Sans supports Russian Cyrillic perfectly
const noto = NotoSans({
  subsets: ["cyrillic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-noto",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Агро Центр Тоҷикистон", template: "%s | Агро Центр ТЖ" },
  description: "Современная платформа оптово-розничной торговли сельхозпродукцией в Таджикистане.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={noto.variable}>
      <body className="font-sans antialiased bg-white text-black">
        <SessionProvider>
          <LangProvider>
            {children}
          </LangProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
