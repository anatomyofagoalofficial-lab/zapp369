import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { ScrollTeleport } from "@/components/ScrollTeleport";
import {
  IllustratedScene, SceneCopy, SceneKicker, SceneTitle, SceneBody,
} from "@/components/IllustratedScene";

export const metadata: Metadata = {
  title: "Past · The Tower",
  description: "From the pyramids of Giza to Wardenclyffe — humans have always built the impossible.",
};

export default function PastPage() {
  return (
    <main className="relative bg-black text-white">

      {/* PROLOG */}
      <IllustratedScene src="/illustrations/pyramids.jpg"
        alt="The Pyramids of Egypt — ancient engraving on papyrus"
        position="center 40%" veil="dark">
        <SceneCopy>
          <SceneKicker>Before ⚡ZAPP — 2560 BC · Giza</SceneKicker>
          <SceneTitle>Humans have always built<br />
            the <em className="italic text-present-yellow">impossible</em>.
          </SceneTitle>
          <SceneBody>They said it couldn&rsquo;t be done. Every single time,
            they were wrong. The pyramids. The hanging gardens. The tower
            that would give the world free energy.</SceneBody>
        </SceneCopy>
      </IllustratedScene>
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <IllustratedScene src="/illustrations/babylon-3d.jpg"
        alt="Babylon — the hanging gardens" position="center 35%" veil="dark">
        <SceneCopy>
          <SceneKicker>Before ⚡ZAPP — 600 BC · Babylon</SceneKicker>
          <SceneTitle>Every great age builds<br />
            something <em className="italic text-present-yellow">eternal</em>.
          </SceneTitle>
          <SceneBody>Babylon. Egypt. Rome. Each civilisation left a monument that
            defied its time. Tesla was building the monument of the modern age.</SceneBody>
        </SceneCopy>
      </IllustratedScene>
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <IllustratedScene src="/illustrations/babylon-ink.jpg"
        alt="Babylon — classical ink engraving" position="center 40%" veil="dark">
        <SceneCopy>
          <SceneKicker>The Pattern — Across All Time</SceneKicker>
          <SceneTitle>Power has always<br />
            <em className="italic text-present-yellow">controlled</em> the energy.
          </SceneTitle>
          <SceneBody>Pharaohs controlled the Nile. Kings controlled the trade routes.
            Banks control the money. The pattern repeats — until someone breaks it.</SceneBody>
        </SceneCopy>
      </IllustratedScene>
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* THE METER — JP Morgan's question, visually answered */}
      <IllustratedScene src="/illustrations/no-meter.jpg"
        alt="Mascot stepping on a broken meter — You can't put a meter on free"
        position="center 40%" veil="light">
        <SceneCopy>
          <SceneKicker>Past · The Question · 1903</SceneKicker>
          <SceneTitle>&ldquo;Where do we put<br />
            the <em className="italic text-present-yellow">meter</em>?&rdquo;
          </SceneTitle>
          <SceneBody>JP Morgan&rsquo;s question when Tesla pitched him free energy.
            There was no answer — because there was no meter. Free energy meant
            free people. The funding was pulled.</SceneBody>
        </SceneCopy>
      </IllustratedScene>
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* TESLA */}
      <IllustratedScene src="/illustrations/tesla-speed.jpg"
        alt="⚡ZAPP mascot with Wardenclyffe tower and speed lines"
        position="center 30%" veil="default">
        <SceneCopy>
          <SceneKicker>3 · Past · The Tower · 1899</SceneKicker>
          <SceneTitle>Tesla wanted energy<br />
            at the <em className="italic text-present-yellow">speed of light</em>.
          </SceneTitle>
          <SceneBody>No meter. No bill. No gatekeeper. Wardenclyffe Tower —
            free wireless energy for every human being on Earth.
            He was already building it.</SceneBody>
        </SceneCopy>
      </IllustratedScene>
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <IllustratedScene src="/illustrations/369-sacred.jpg"
        alt="3·6·9 sacred geometry" position="center 35%" veil="light">
        <SceneCopy>
          <SceneKicker>Past · The Frequency · 3 · 6 · 9</SceneKicker>
          <SceneTitle>
            <em className="italic text-present-yellow">3 · 6 · 9</em><br />
            The key to the universe.
          </SceneTitle>
          <SceneBody>Tesla wasn&rsquo;t obsessed with numbers. He was obsessed with
            the truth. The frequency beneath all of creation.
            The pattern nobody else could see.</SceneBody>
        </SceneCopy>
      </IllustratedScene>
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <IllustratedScene src="/illustrations/tesla-369.jpg"
        alt="⚡ZAPP mascot energetic with 3·6·9 and lightning"
        position="center 25%" veil="default">
        <SceneCopy>
          <SceneKicker>Past · Why It Matters</SceneKicker>
          <SceneTitle>The key to<br />
            the <em className="italic text-present-yellow">universe</em>.
          </SceneTitle>
          <SceneBody>3 · 6 · 9 ∞ — the pattern he built Wardenclyffe around.
            The signal he never got to send.</SceneBody>
        </SceneCopy>
      </IllustratedScene>
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <IllustratedScene src="/illustrations/why-zapp.jpg"
        alt="Why ⚡ZAPP" position="center" veil="light">
        <SceneCopy>
          <SceneKicker>The Idea</SceneKicker>
          <p className="font-serif italic text-white/80"
            style={{ fontSize: "clamp(1.1rem,1.6vw,1.3rem)", maxWidth: "52ch" }}>
            One frequency. One signal. One world.
          </p>
        </SceneCopy>
      </IllustratedScene>
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <IllustratedScene src="/illustrations/tribute-v2.jpg"
        alt="A tribute to the man who saw the future"
        position="center 25%" veil="default">
        <SceneCopy>
          <SceneKicker>Past · Wardenclyffe · 1893–1917</SceneKicker>
          <SceneTitle>A tower built to<br />
            <em className="italic text-present-yellow">free</em> the world.
          </SceneTitle>
          <SceneBody>No meter. No bill. No gatekeeper. Free wireless energy for
            every human being on Earth. The greatest gift ever attempted.</SceneBody>
        </SceneCopy>
      </IllustratedScene>
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Tower demolished */}
      <IllustratedScene src="/illustrations/silent.jpg"
        alt="The tower demolished — the frequency went silent"
        position="center" veil="light">
        <SceneCopy>
          <SceneKicker>Past · The Fall · 1917</SceneKicker>
        </SceneCopy>
      </IllustratedScene>
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* THE BRIDGE */}
      <IllustratedScene src="/illustrations/then-now.jpg"
        alt="Split: demolished tower on left, Solana network on right — A century later, Solana broke the same monopoly"
        position="center 40%" veil="default" minHeight="100vh">
        <SceneCopy>
          <SceneKicker>Past → Present · The Bridge · 100 Years Later</SceneKicker>
          <SceneTitle>
            <em className="italic text-present-yellow">A century later</em>,<br />
            Solana broke it.
          </SceneTitle>
          <SceneBody>The tower came down. The monopoly survived for a hundred years.
            Then Solana broke the same monopoly Tesla tried to break.
            ⚡ZAPP is the signal that connects both.</SceneBody>
        </SceneCopy>
      </IllustratedScene>

      {/* Onward */}
      <section className="relative z-10 px-8 py-24">
        <Reveal className="mx-auto flex max-w-reading flex-col items-start gap-4">
          <p className="font-mono text-xs uppercase tracking-ritual text-white/40">
            They did not stop the idea.
          </p>
          <Link href="/present"
            className="group inline-flex items-center gap-2 font-serif text-3xl
                       text-present-yellow transition-colors hover:text-white">
            They only delayed it
            <ArrowRight size={26} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </section>

      <ScrollTeleport to="/present" />
    </main>
  );
}
