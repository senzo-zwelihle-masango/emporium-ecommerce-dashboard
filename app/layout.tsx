import { metadata } from "@/lib/metadata";
import { ppneuemontrealBook, ppneuemontrealThin } from "@/lib/font";
import "./globals.css";

export { metadata };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ppneuemontrealBook.variable} ${ppneuemontrealThin.variable} font-ppneuemontreal-book antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
