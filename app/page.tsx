import Link from "next/link";
import { Button } from "@/components/ui/button";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button>Click !</Button>
      <Link href="/forum">FORUM</Link>
      <Link href="/signin">LOGIN</Link>
      <Link href="/group">GROUP</Link>
      <Link href="/firebase">FIREBASE</Link>
    </main>
  );
}
