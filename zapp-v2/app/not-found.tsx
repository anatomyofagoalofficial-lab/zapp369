import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { MathTexture } from "@/components/MathTexture";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <MathTexture era="home" />

      <p className="relative font-mono text-xs uppercase tracking-ritual text-present-white/40">
        Signal lost · 404
      </p>
      <h1 className="relative font-serif text-5xl font-semibold text-present-white sm:text-6xl">
        This frequency doesn&rsquo;t exist.
      </h1>
      <p className="relative max-w-reading text-pretty leading-relaxed text-present-white/60">
        The page you&rsquo;re looking for isn&rsquo;t on this signal. Return to
        the foyer and choose an era.
      </p>

      <Link
        href="/"
        className="relative mt-2 inline-flex items-center gap-2 rounded-full border border-present-yellow/70 px-8 py-3 font-sans text-sm uppercase tracking-wider text-present-yellow transition-colors duration-300 hover:bg-present-yellow hover:text-present-black"
      >
        Back to <BrandMark />
      </Link>
    </main>
  );
}
