import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-4xl font-bold mb-8">Bienvenue sur CoBill CRM</h1>
      <div className="space-x-4">
        <Button asChild>
          <Link href="/login">Se connecter</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard">Tableau de Bord</Link>
        </Button>
      </div>
    </div>
  );
}