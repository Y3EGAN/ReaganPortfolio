import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://reaganhu.dev"),
  title: "Reagan Hu",
  description: "Reagan Hu builds robotic and intelligent systems across perception, control, learning, hardware, and human interaction.",
  keywords: ["Reagan Hu", "robotics", "machine learning", "computer vision", "control", "University of Toronto"],
  openGraph: {
    title: "Reagan Hu",
    description: "Engineering Science student working on robot learning, embedded control, and teleoperation.",
    type: "website",
    images: [{ url: "/images/reagan-horizon-original.jpg", width: 1824, height: 1368 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reagan Hu",
    description: "Robot learning, embedded control, and teleoperation.",
    images: ["/images/reagan-horizon-original.jpg"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
