import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Apprentis-Private",
    description: "Formation en sécurité informatique par la voie de l’apprentissage ",
}

export default function PrivateLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return <div className="bg-gruvbox min-h-screen w-screen">{children}</div>
}