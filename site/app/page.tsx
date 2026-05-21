import { NavBar } from '@/components/NavBar';
import { Hero } from '@/components/Hero';
import { Systems } from '@/components/Systems';
import { Architecture } from '@/components/Architecture';
import { Projects } from '@/components/Projects';
import { Philosophy } from '@/components/Philosophy';
import { Discovery } from '@/components/Discovery';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <>
      <NavBar />
      <main>
        <Hero />
        <Systems />
        <Architecture />
        <Projects />
        <Philosophy />
        <Discovery />
      </main>
      <Footer />
    </>
  );
}
