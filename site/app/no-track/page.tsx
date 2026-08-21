import type { Metadata } from 'next';
import { NoTrackClient } from './NoTrackClient';

export const metadata: Metadata = {
  title: 'Analytics opt-out | ForgeMesh',
  description: 'Exclude this browser from ForgeMesh first-party analytics.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <main className="flex min-h-screen items-center bg-[#050509] px-6 text-slate-100">
      <NoTrackClient />
    </main>
  );
}
