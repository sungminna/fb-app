import Link from "next/link";
import { Button } from "@/components/ui/button";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Link href="/forum">FORUM</Link>
      <Link href="/chat">CHAT</Link>
      <Link href="/group">GROUP</Link>
      <Link href="/firebase">FIREBASE</Link>
    </main>
  );
}
