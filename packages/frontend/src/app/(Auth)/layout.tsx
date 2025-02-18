import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apprentis",
  description: "Formation en sécurité informatique par la voie de l’apprentissage ",
}

export default function PrivateLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="relative min-h-screen min-w-screen overflow-hidden">
          {/* Blurred Background */}
          <div
            className="absolute inset-0 bg-cover bg-center filter blur-lg"
            style={{ backgroundImage: "url('/homepage.png')" }}
          ></div>
    
          {/* Content */}
          <div className="relative z-10">
            {children}
          </div>
        </div>
      );
}