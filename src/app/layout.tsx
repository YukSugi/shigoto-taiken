import type { Metadata } from "next";
import { M_PLUS_Rounded_1c, Geist_Mono } from "next/font/google";
import "./globals.css";

const rounded = M_PLUS_Rounded_1c({
  variable: "--font-rounded",
  weight: ["400", "500", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "お仕事体験.com — 気になる仕事を4択ゲームで体験しよう",
  description:
    "高校生・大学生向け職業体験RPG。営業、マーケティング、エンジニアなどの仕事を4択ゲームで体験できます。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${rounded.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
