import type { Metadata } from "next";
import { Download } from "lucide-react";
import { MathTexture } from "@/components/MathTexture";
import { BrandMark } from "@/components/BrandMark";
import { TOKEN } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Whitepaper",
  description:
    "⚡ZAPP — Tesla's Unfinished Revolution. The full whitepaper (v3): the signal, the problem, the solution, the frequency, token architecture, and the honest words at the end.",
};

const TOC = [
  ["signal", "I. The Signal"],
  ["problem", "II. The Problem"],
  ["solution", "III. The Solution"],
  ["frequency", "IV. The Frequency — 3 · 6 · 9"],
  ["architecture", "V. Token Architecture"],
  ["movement", "VI. The Movement"],
  ["roadmap", "VII. The Roadmap"],
  ["transmission", "VIII. Transmission Lines"],
  ["honest-words", "IX. Honest Words at the End"],
] as const;

export default function WhitepaperPage() {
  return (
    <main className="relative min-h-screen bg-present-black px-6 pb-28 pt-36 text-present-white">
      <MathTexture era="present" />

      <article className="relative mx-auto max-w-reading">
        {/* ── Cover ── */}
        <header className="border-b border-white/10 pb-12 text-center">
          <BrandMark
            as="h1"
            boltClassName="text-present-yellow"
            className="text-5xl font-semibold text-present-white sm:text-6xl"
          />
          <p className="mt-4 font-serif text-2xl italic text-present-white/80">
            Tesla&rsquo;s Unfinished Revolution
          </p>
          <p className="mx-auto mt-8 max-w-xl text-pretty font-serif text-lg leading-relaxed text-present-white/60">
            &ldquo;If you knew the magnificence of 3, 6 and 9, you would have a
            key to the universe.&rdquo; — Nikola Tesla
          </p>
          <p className="mt-6 font-mono text-xs uppercase tracking-ritual text-present-yellow">
            Free Energy = Free Money ∞
          </p>
          <p className="mt-1 font-mono text-xs uppercase tracking-ritual text-present-white/40">
            The frequency they tried to silence
          </p>
          <p className="mt-6 font-mono text-xs uppercase tracking-wider text-present-white/40">
            Published on the Solana blockchain · 1 May 2026 · 3 · 6 · 9 ∞
          </p>

          <a
            href="/ZAPP_Whitepaper_369.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-2 rounded-full border border-present-yellow/60 px-6 py-2.5 font-sans text-xs uppercase tracking-wider text-present-yellow transition-colors hover:bg-present-yellow hover:text-present-black"
          >
            <Download size={15} /> Download PDF
          </a>
        </header>

        {/* ── Table of contents ── */}
        <nav aria-label="Contents" className="border-b border-white/10 py-10">
          <p className="font-mono text-xs uppercase tracking-ritual text-present-white/40">
            Contents
          </p>
          <ol className="mt-4 space-y-2">
            {TOC.map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="font-serif text-lg text-present-white/70 transition-colors hover:text-present-yellow"
                >
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* ── Body ── */}
        <div className="prose-zapp mt-12 space-y-16">
          <Section id="signal" title="I. The Signal">
            <p>Money is energy.</p>
            <p>
              Energy travels at the speed of light. So why does it take three
              days to send money to Africa? Why does it cost forty dollars to
              wire funds to Asia? Why do banks open and close, charging fees at
              every step, deciding who deserves access and who does not?
            </p>
            <p>
              Nikola Tesla understood this. A century ago he built a tower —
              Wardenclyffe — designed to transmit free energy to every human
              being on Earth. Wirelessly. Instantaneously. For free. No meter. No
              bill. No gatekeeper.
            </p>
            <p>
              JP Morgan pulled the funding. The tower was demolished. The
              frequency went silent.
            </p>
            <p>They did not stop the idea. They only delayed it.</p>
            <Quote>
              The day science begins to study non-physical phenomena, it will
              make more progress in one decade than in all the previous centuries
              of its existence. — Nikola Tesla
            </Quote>
            <p>
              ⚡ZAPP is that signal. Built on Solana. Owned by no one. Available
              to everyone. The answer Tesla never got to give.
            </p>
          </Section>

          <Section id="problem" title="II. The Problem — The World Was Built Around a Meter">
            <p>
              JP Morgan&rsquo;s question, when Tesla pitched him on free energy,
              was simple: &ldquo;Where do we put the meter?&rdquo;
            </p>
            <p>
              There was no answer, because there was no meter. Free energy meant
              free people. Free people don&rsquo;t generate billable revenue. The
              tower came down.
            </p>
            <p>
              That same logic has governed finance for centuries. Banks exist not
              to move money efficiently, they exist to capture value at every
              point of transfer. Fees for sending. Fees for receiving. Fees for
              existing. Arbitrary business hours. Borders that turn into walls.
              Systems that exclude billions of people by design.
            </p>
            <Subhead>The Cost of Controlled Energy</Subhead>
            <ul>
              <li>
                $45 average cost to send $200 internationally through a bank
              </li>
              <li>1.4 billion adults worldwide remain unbanked</li>
              <li>Banking systems close daily — crypto never does</li>
              <li>
                Transfer times: 1–5 business days vs. blockchain: seconds
              </li>
              <li>Every middleman takes a cut, you pay for all of them</li>
            </ul>
            <p>
              The system is not broken. It is working exactly as designed, to
              extract from you.
            </p>
          </Section>

          <Section id="solution" title="III. The Solution — Free Energy = Free Money">
            <p>
              ⚡ZAPP is built on one idea: energy should move freely. Money is
              energy. Therefore money should move freely.
            </p>
            <p>
              No banks. No borders. No intermediaries. No permission required.
            </p>
            <p>
              Built on Solana, the fastest, lowest-fee blockchain on Earth, ⚡ZAPP
              completes what Tesla started. A transfer of value that moves at the
              speed of light, accessible to anyone with a phone, anywhere on this
              planet.
            </p>
            <Subhead>Why Solana</Subhead>
            <ul>
              <li>65,000+ transactions per second — faster than Visa</li>
              <li>Average transaction fee: $0.00025</li>
              <li>Sub-second finality — not minutes, not hours, seconds</li>
              <li>Decentralized and censorship-resistant</li>
              <li>No permission needed to participate</li>
            </ul>
            <p>
              Tesla&rsquo;s frequency, transmitted at the speed of light. That is
              Solana. That is ⚡ZAPP.
            </p>
          </Section>

          <Section id="frequency" title="IV. The Frequency — 3 · 6 · 9">
            <Quote>
              If you only knew the magnificence of the 3, 6 and 9, then you would
              have a key to the universe. — Nikola Tesla
            </Quote>
            <p>
              This was not a casual statement. Tesla was obsessed with the numbers
              3, 6 and 9. He walked around buildings three times before entering.
              He stayed in hotels with room numbers divisible by 3. He believed
              these numbers formed the root pattern of nature itself — the
              frequency beneath all creation.
            </p>
            <p>
              3. The seed. The triangle. The first stable structure. 6. The
              bloom. The honeycomb. The carbon atom. Life itself. 9. The
              completion. The sum that returns to itself. 3+6=9. 9+9=18. 1+8=9.
              Always 9.
            </p>
            <p>
              ⚡ZAPP launched May 1st, 2026. The Telegram: t.me/ZAPP369. The
              website: zapp369.energy. The frequency is not decoration — it is the
              signal.
            </p>
            <p>
              When the market cap touched $3,690 — Tesla&rsquo;s sacred number —
              it was not a coincidence. The universe was listening.
            </p>
          </Section>

          <Section id="architecture" title="V. Token Architecture">
            <Subhead>The Basics</Subhead>
            <ul>
              <li>Name: ⚡ZAPP</li>
              <li>Chain: Solana</li>
              <li>Total Supply: 1,000,000,000 (one billion) — fixed forever</li>
              <li>Tax: 0% — no buy tax, no sell tax</li>
              <li>Launch: May 1st, 2026 — Workers Day</li>
              <li>Platform: pump.fun (bonding curve, graduated to PumpSwap)</li>
            </ul>
            <Subhead>Liquidity &amp; Safety — Verified On-Chain</Subhead>
            <p>
              ⚡ZAPP launched through pump.fun&rsquo;s bonding curve mechanism. On
              May 8th, 2026, the curve graduated and the liquidity migrated to the
              Pump.fun AMM (PumpSwap). The proof, on-chain, today:
            </p>
            <ul>
              <li>
                LP permanently burned. 4,194.40 LP tokens were minted to the pool
                and burned in the same transaction sequence. Current LP holders:
                zero. The liquidity cannot be withdrawn by anyone — including the
                founders.
              </li>
              <li>
                Mint authority: revoked. No new ⚡ZAPP can ever be created. Supply
                is sealed at 1 billion forever.
              </li>
              <li>
                Freeze authority: revoked. No wallet can be frozen. The signal
                cannot be censored.
              </li>
              <li>0% tax means 100% of your transaction reaches you.</li>
            </ul>
            <p>
              Burned LP = no rug pull possible. Ever. There are no meters on
              ⚡ZAPP. JP Morgan&rsquo;s question has no answer here.
            </p>
            <p className="break-all font-mono text-sm text-present-white/70">
              Contract Address: {TOKEN.contract}
            </p>
          </Section>

          <Section id="movement" title="VI. The Movement">
            <p>
              A frequency means nothing without receivers. Tesla&rsquo;s tower was
              powerful — but it needed a world willing to listen.
            </p>
            <p>
              ⚡ZAPP built its community in real time. In a single day, 1,438
              people joined the Telegram — just people who recognised the signal.
              The frequency keeps reaching new ears, every day, organically.
            </p>
            <Subhead>Community Principles</Subhead>
            <ul>
              <li>Everyone is welcome. No minimums. No gatekeeping.</li>
              <li>No scammers. No rugpulls. No walls.</li>
              <li>Community owned — no corporation, no VC, no bank</li>
              <li>Transparent. On-chain. Verifiable.</li>
              <li>3 · 6 · 9 ∞ — the frequency binds us</li>
            </ul>
            <Subhead>Milestones (May 2026)</Subhead>
            <ul>
              <li>Launched fair on pump.fun (May 1)</li>
              <li>ATH market cap touched on May 8</li>
              <li>Bonding curve graduated, LP permanently burned (May 8)</li>
              <li>Listed on PumpSwap AMM</li>
              <li>Verified on DEXScreener</li>
              <li>Listed on Jupiter Exchange</li>
              <li>270+ holders, 2,400+ Telegram members, growing daily</li>
            </ul>
          </Section>

          <Section id="roadmap" title="VII. The Roadmap">
            <Subhead>Phase 1 — The Signal (Now)</Subhead>
            <ul>
              <li>Daily Tesla content on Twitter @ZAPPonSOL</li>
              <li>Community growth on Telegram t.me/ZAPP369</li>
              <li>DEXScreener verified ✓</li>
              <li>Jupiter Exchange listed ✓</li>
            </ul>
            <Subhead>Phase 2 — The Tower</Subhead>
            <ul>
              <li>Bonding curve graduation (~$45K mcap) ✓</li>
              <li>PumpSwap listing upon graduation ✓</li>
              <li>LP permanently burned at graduation ✓</li>
              <li>CoinGecko submission</li>
              <li>CoinMarketCap submission</li>
            </ul>
            <Subhead>Phase 3 — Energy for Everyone</Subhead>
            <p>
              The community is exploring how to put ⚡ZAPP&rsquo;s speed and
              zero-fee architecture to work where it matters most. These are the
              directions the community is moving toward — not deadlines, not
              promises, but the shape of what&rsquo;s next:
            </p>
            <ul>
              <li>
                Instant ⚡ZAPP payments at live events, concerts, and community
                gatherings worldwide
              </li>
              <li>
                Building toward partnerships with humanitarian organisations and
                NGOs
              </li>
              <li>
                Supporting individuals and families in need — direct, borderless,
                instant — when the community decides together
              </li>
              <li>
                Reaching grassroots communities across Africa, Asia, and Latin
                America
              </li>
              <li>
                Micro-grants and donations powered by ⚡ZAPP — no bank, no
                middleman
              </li>
              <li>
                Onboarding corporate and community sponsors who share the mission
              </li>
              <li>Free energy for the people. The revolution Tesla started.</li>
            </ul>
          </Section>

          <Section id="transmission" title="VIII. Transmission Lines">
            <p>All frequencies. All channels. One signal.</p>
            <ul>
              <li>Website: zapp369.energy</li>
              <li>Twitter: x.com/ZAPPonSOL (verified ✓)</li>
              <li>Telegram: t.me/ZAPP369</li>
              <li>
                Buy on Jupiter:
                jup.ag/tokens/Ab16ce5SDbibTbXevxHLpqUnUvu9tNkkpaJcSDvCpump
              </li>
              <li>
                Buy on pump.fun:
                pump.fun/coin/Ab16ce5SDbibTbXevxHLpqUnUvu9tNkkpaJcSDvCpump
              </li>
              <li>
                Chart:
                dexscreener.com/solana/Ab16ce5SDbibTbXevxHLpqUnUvu9tNkkpaJcSDvCpump
              </li>
            </ul>
            <p>
              ⚡ZAPP is not just a token. It is the answer Tesla never got to
              give. Decentralised. Borderless. Free for everyone. Forever on the
              blockchain.
            </p>
            <p className="font-mono text-sm uppercase tracking-ritual text-present-yellow">
              3 · 6 · 9 ∞ · Free Energy = Free Money ∞ · ⚡ZAPP
            </p>
          </Section>

          {/* The non-negotiable MiCA risk disclosure. Anchor target: #honest-words */}
          <section
            id="honest-words"
            className="scroll-mt-28 rounded-2xl border border-present-yellow/30 bg-white/[0.02] p-8"
          >
            <h2 className="font-serif text-3xl text-present-white">
              IX. Honest Words at the End
            </h2>
            <p className="mt-4 font-mono text-xs uppercase tracking-ritual text-present-yellow">
              This section is here because it has to be. Read it.
            </p>
            <div className="prose-zapp mt-6 space-y-5 text-present-white/75">
              <p>
                ⚡ZAPP is a memecoin — a community/culture token on the Solana
                blockchain. It is not a registered security, an investment
                product, or a financial instrument. ⚡ZAPP does not promise
                returns, future value, or specific outcomes. The price can go to
                zero. Memecoins regularly do.
              </p>
              <p>
                The mint and freeze authorities being revoked, and the LP being
                burned, eliminate specific risk vectors (no new supply minting, no
                wallet freezing, no liquidity withdrawal). They do not eliminate
                all risk. Market volatility, illiquidity, and macro conditions can
                still wipe out value.
              </p>
              <p>
                The roadmap above describes directions the community is moving
                toward. Items not marked complete are aspirations, not
                commitments. The community decides together what happens next, in
                the open, on its own time.
              </p>
              <p>
                Buy only what you can afford to lose entirely. Always do your own
                research. Nothing in this document is financial, investment,
                legal, or tax advice.
              </p>
              <p>
                In the EU/EEA, this document complies with MiCA&rsquo;s
                transparency and fair-marketing requirements. ⚡ZAPP is offered as
                a community/culture token below the public-offering thresholds
                defined in MiCA Article 4(3).
              </p>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}

/* ── Small presentational helpers ── */

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="font-serif text-3xl text-present-white sm:text-4xl">
        {title}
      </h2>
      <div className="prose-zapp mt-6 space-y-5">{children}</div>
    </section>
  );
}

function Subhead({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="pt-2 font-mono text-xs uppercase tracking-ritual text-present-yellow">
      {children}
    </h3>
  );
}

function Quote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="border-l-2 border-present-yellow/60 pl-6 font-serif text-xl italic leading-relaxed text-present-white/80">
      {children}
    </blockquote>
  );
}
