import type { Metadata } from 'next';
import {
  Activity,
  AudioLines,
  CircleDollarSign,
  Command,
  Languages,
  Mic,
  SlidersHorizontal,
  Volume2,
  WalletCards,
} from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'ClawVoice x402 - Voice for OpenClaw Agents | ForgeMesh Labs',
  description:
    'ClawVoice gives OpenClaw agents spoken replies, push-to-talk input, hosted or local voice, and a local Base USDC x402 wallet with spend caps.',
  applicationName: 'ClawVoice x402',
  keywords: [
    'ClawVoice',
    'OpenClaw voice',
    'OpenClaw agent voice',
    'ClawHub voice skill',
    'x402 voice',
    'agent voice',
    'AI agent text to speech',
    'push to talk agent',
    'Base USDC agent wallet',
    'ForgeMesh Voice',
  ],
  alternates: {
    canonical: '/clawvoice',
  },
  openGraph: {
    title: 'ClawVoice x402 - Voice for OpenClaw Agents',
    description:
      'A ClawHub skill for agent voice: spoken replies, push-to-talk input, hosted voice, local setup, x402 payments, and configurable voice controls.',
    url: 'https://forgemesh.io/clawvoice',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClawVoice x402',
    description: 'Give OpenClaw agents a voice with ClawVoice by ForgeMesh Labs.',
  },
};

const quickCommands = [
  'clawvoice init --mode hybrid --mic',
  'clawvoice install-mic',
  'clawvoice talk',
  'clawvoice stop',
];


const pricingRows = [
  {
    provider: 'ClawVoice local',
    model: 'Free after local setup',
    cost: 'No per-call hosted voice charge',
    bestFor: 'OpenClaw users who can install the local runtime and want private, repeat use.',
    source: null,
  },
  {
    provider: 'ClawVoice hosted x402',
    model: 'Pay per approved call from a local Base USDC wallet',
    cost: '$0.005 ForgeMesh compatibility fee plus hosted endpoint price',
    bestFor: 'Agents that need hosted fallback without a monthly voice subscription.',
    source: 'https://voice.forgemesh.io',
  },
  {
    provider: 'ElevenLabs',
    model: 'Subscription credit pool',
    cost: 'Free 10k credits; Starter $6/mo with 30k credits; Creator $22/mo with 121k credits',
    bestFor: 'Creator workflows, voice cloning, studio tools, and broad audio production.',
    source: 'https://elevenlabs.io/pricing',
  },
  {
    provider: 'Google Chirp 3 HD',
    model: 'Per-character Google Cloud billing',
    cost: '$30 per 1M characters; other Google TTS tiers range from $4 to $160 per 1M characters',
    bestFor: 'Google Cloud teams that want managed TTS with cloud billing and quota controls.',
    source: 'https://cloud.google.com/text-to-speech/pricing',
  },
  {
    provider: 'Amazon Polly',
    model: 'Per-character AWS billing',
    cost: 'Standard $4, Neural $16, Generative $30, Long-Form $100 per 1M characters',
    bestFor: 'AWS-native applications that already use IAM, CloudWatch, and AWS billing.',
    source: 'https://aws.amazon.com/polly/pricing/',
  },
  {
    provider: 'Azure Speech',
    model: 'Per-character Azure billing, region and tier dependent',
    cost: 'Free tier includes 0.5M neural characters per month; paid pricing varies by region and tier',
    bestFor: 'Microsoft/Azure environments that need enterprise speech services and procurement controls.',
    source: 'https://azure.microsoft.com/en-us/pricing/details/speech/',
  },
];

const voiceOptions = [
  { label: 'Voice ID', value: 'M1, F1, or hosted voice IDs' },
  { label: 'Language', value: '31-language guide, default en' },
  { label: 'Endpoint tier', value: 'base, pro, custom, long variants' },
  { label: 'Preset', value: 'hosted preset pass-through' },
  { label: 'Mix', value: 'hosted mix pass-through' },
  { label: 'Expression', value: 'expression plus level' },
  { label: 'Expression controls', value: 'name=value controls' },
];

const languageCodes = [
  'en',
  'es',
  'fr',
  'de',
  'it',
  'pt',
  'nl',
  'pl',
  'cs',
  'hu',
  'ro',
  'el',
  'sv',
  'da',
  'fi',
  'no',
  'ru',
  'uk',
  'tr',
  'ar',
  'he',
  'hi',
  'bn',
  'id',
  'ms',
  'fil',
  'vi',
  'th',
  'ja',
  'ko',
  'zh',
];


const faqItems = [
  {
    question: 'What is ClawVoice?',
    answer:
      'ClawVoice is an OpenClaw and ClawHub skill from ForgeMesh Labs that gives agents spoken replies, terminal push-to-talk input, hosted or local voice output, and a local Base USDC x402 wallet with spend controls.',
  },
  {
    question: 'How do I make my OpenClaw agent speak out loud?',
    answer:
      'Install and initialize ClawVoice, then tell the agent: Use ClawVoice to speak your responses out loud from now on. The agent should call clawvoice speak for normal user-facing replies.',
  },
  {
    question: 'How do I talk to my agent with a microphone?',
    answer:
      'Run clawvoice install-mic once, then run clawvoice talk. In the current terminal push-to-talk flow, speak normally and press Enter when you are done talking.',
  },
  {
    question: 'Can ClawVoice use hosted voice if local voice is not installed?',
    answer:
      'Yes. In hosted or hybrid mode, ClawVoice can use hosted ForgeMesh Voice through x402 when the local wallet has a small USDC balance on Base and the user approves paid calls.',
  },
  {
    question: 'Can I customize my agent voice?',
    answer:
      'Yes. ClawVoice supports voice ID, language, endpoint tier, preset, mix, expression, expression level, and expression controls through setup or the clawvoice voice command.',
  },
  {
    question: 'How does ClawVoice pricing compare with hosted TTS providers?',
    answer:
      'ClawVoice local mode has no per-call hosted voice charge after setup. Hosted ClawVoice uses approved x402 calls from the local wallet, while providers such as ElevenLabs, Google Cloud, Amazon Polly, and Azure Speech usually bill through subscription credits or cloud per-character pricing.',
  },
];

const howToSteps = [
  'Install ClawVoice from ClawHub or the release bundle.',
  'Run clawvoice init --mode hybrid --mic.',
  'Optionally customize your agent voice during setup or with clawvoice voice.',
  'Run clawvoice install-mic once for microphone input.',
  'Run clawvoice talk, speak normally, then press Enter when done talking.',
  'Say stop talking or run clawvoice stop to interrupt playback.',
];

const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ClawVoice x402',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'macOS, Linux, Windows via WSL2',
    url: 'https://forgemesh.io/clawvoice',
    downloadUrl: 'https://github.com/forgemeshlabs/clawvoice-x402',
    softwareVersion: '0.3.18',
    author: {
      '@type': 'Organization',
      name: 'ForgeMesh Labs',
      url: 'https://forgemesh.io',
    },
    description:
      'OpenClaw voice skill for spoken replies, push-to-talk input, hosted or local voice output, and local Base USDC x402 wallet controls.',
    keywords:
      'OpenClaw voice, ClawVoice, ClawHub voice skill, x402 voice, agent voice, push-to-talk agent, Base USDC wallet',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'ClawVoice install is free. Hosted voice calls may require x402 payment from the local wallet.',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to talk to an OpenClaw agent with ClawVoice',
    description: 'Install ClawVoice, initialize it, install microphone support, and start terminal push-to-talk.',
    step: howToSteps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      text: step,
    })),
  },
];

const featureBlocks = [
  {
    title: 'Speak replies out loud',
    text: 'Tell an OpenClaw agent to use ClawVoice from now on. It calls the CLI for user-facing replies while still writing the full answer in chat.',
    icon: Volume2,
  },
  {
    title: 'Talk back with push-to-talk',
    text: 'Run install-mic once, then clawvoice talk. Speak normally, press Enter when done, and ClawVoice transcribes locally before the agent answers.',
    icon: Mic,
  },
  {
    title: 'Use local or hosted voice',
    text: 'Use a free local voice engine after setup, hosted x402 voice when local install is not available, or hybrid mode for local-first fallback.',
    icon: AudioLines,
  },
  {
    title: 'Keep spend controlled',
    text: 'A local Base USDC hot wallet, approval prompts, daily caps, session caps, balance checks, and withdrawals keep hosted calls bounded.',
    icon: WalletCards,
  },
];

function TerminalPanel() {
  return (
    <div className="relative rounded-2xl border border-white/[0.08] bg-[#07070d] p-4 shadow-[0_24px_80px_-42px_rgba(59,130,246,0.65)]">
      <div className="mb-4 flex items-center justify-between border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-blue-400/70" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-600">ClawVoice CLI</span>
      </div>
      <div className="space-y-3 font-mono text-xs leading-relaxed text-slate-300 sm:text-sm">
        {quickCommands.map((command) => (
          <div key={command} className="grid grid-cols-[auto_1fr] gap-3">
            <span className="text-blue-400">$</span>
            <span className="break-words">{command}</span>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-xl border border-blue-400/10 bg-blue-400/[0.04] p-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-blue-300/80">Agent instruction</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          Use ClawVoice to speak your responses out loud from now on. Stop talking when I say stop.
        </p>
      </div>
    </div>
  );
}

export default function ClawVoicePage() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen overflow-hidden bg-[#050509] text-slate-100">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <section className="relative px-6 pb-20 pt-28 sm:pt-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(59,130,246,0.20),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(14,165,233,0.10),transparent_30%)]" />
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div>
              <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
                <ForgeMeshMark size={22} className="shrink-0" />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
                  OpenClaw voice skill
                </span>
              </div>
              <h1 className="max-w-3xl text-4xl font-semibold leading-[0.98] tracking-tight text-slate-50 sm:text-6xl">
                ClawVoice gives your agent a voice.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
                Spoken replies, terminal push-to-talk, hosted x402 fallback, local voice setup, and a small-balance Base
                USDC wallet built for OpenClaw agents.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href="https://github.com/forgemeshlabs/clawvoice-x402"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg bg-slate-100 px-5 py-3 text-sm font-medium text-slate-950 transition active:translate-y-px"
                >
                  View on GitHub
                </a>
                <a
                  href="https://clawhub.ai/forgemeshlabs/skills/clawvoice-x402"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg border border-white/[0.12] px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-blue-400/40 active:translate-y-px"
                >
                  Open in ClawHub
                </a>
              </div>
            </div>
            <TerminalPanel />
          </div>
        </section>

        <section className="border-y border-white/[0.06] bg-[#080810] px-6 py-12">
          <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-4">
            {[
              ['62', 'first-day installs observed'],
              ['31', 'language codes in the global guide'],
              ['0.3.18', 'current release bundle'],
              ['Base', 'USDC wallet network'],
            ].map(([value, label]) => (
              <div key={label} className="border-l border-white/[0.08] pl-5">
                <p className="font-mono text-2xl text-slate-100">{value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-600">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 max-w-2xl">
              <p className="mb-3 text-xs uppercase tracking-[0.22em] text-blue-300/70">What it does</p>
              <h2 className="text-3xl font-medium tracking-tight text-slate-100 sm:text-4xl">
                A voice layer for agent workflows.
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {featureBlocks.map((feature) => {
                const Icon = feature.icon;
                return (
                  <article
                    key={feature.title}
                    className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition hover:border-blue-400/25 hover:bg-blue-400/[0.03]"
                  >
                    <Icon className="mb-5 h-6 w-6 text-blue-300" strokeWidth={1.6} />
                    <h3 className="text-lg font-medium text-slate-100">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-500">{feature.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#080810] px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 max-w-3xl">
              <p className="mb-3 text-xs uppercase tracking-[0.22em] text-blue-300/70">Cost model comparison</p>
              <h2 className="text-3xl font-medium tracking-tight text-slate-100 sm:text-4xl">
                Local voice, hosted x402 voice, and cloud TTS are different buying models.
              </h2>
              <p className="mt-5 text-sm leading-7 text-slate-500">
                ClawVoice is optimized for OpenClaw agents: local-first when possible, hosted x402 fallback when needed,
                and wallet-level spend controls. The comparison below uses public pricing pages checked on July 3, 2026;
                provider prices can change.
              </p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#050509]">
              <div className="hidden grid-cols-[1fr_1.05fr_1.15fr_1.25fr] border-b border-white/[0.07] bg-white/[0.03] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500 md:grid">
                <span>Provider</span>
                <span>Buying model</span>
                <span>Published cost signal</span>
                <span>Best fit</span>
              </div>
              <div className="divide-y divide-white/[0.07]">
                {pricingRows.map((row) => (
                  <article key={row.provider} className="grid gap-4 px-5 py-5 md:grid-cols-[1fr_1.05fr_1.15fr_1.25fr]">
                    <div>
                      <p className="font-mono text-sm text-slate-100">{row.provider}</p>
                      {row.source && (
                        <a
                          href={row.source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-block text-xs text-blue-300/70 hover:text-blue-200"
                        >
                          pricing source
                        </a>
                      )}
                    </div>
                    <p className="text-sm leading-6 text-slate-400">{row.model}</p>
                    <p className="text-sm leading-6 text-slate-300">{row.cost}</p>
                    <p className="text-sm leading-6 text-slate-500">{row.bestFor}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#080810] px-6 py-20">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.22em] text-blue-300/70">Customize your agent&apos;s voice</p>
              <h2 className="text-3xl font-medium tracking-tight text-slate-100 sm:text-4xl">
                Use the OpenClaw page for agent voice. Use voice.forgemesh.io for the hosted voice surface.
              </h2>
              <p className="mt-5 text-sm leading-7 text-slate-500">
                This page is OpenClaw-specific: install, setup, ClawHub, wallet behavior, push-to-talk, and the CLI options
                an agent needs. The hosted voice endpoint can keep its own API-focused surface at voice.forgemesh.io.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {voiceOptions.map((option) => (
                <div key={option.label} className="rounded-xl border border-white/[0.07] bg-[#050509] p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-blue-300" strokeWidth={1.7} />
                    <p className="text-sm font-medium text-slate-200">{option.label}</p>
                  </div>
                  <p className="text-xs leading-6 text-slate-600">{option.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.22em] text-blue-300/70">Global-friendly</p>
              <h2 className="text-3xl font-medium tracking-tight text-slate-100 sm:text-4xl">
                Built-in guide for 31 language codes.
              </h2>
              <p className="mt-5 text-sm leading-7 text-slate-500">
                Language support is exposed through <span className="font-mono text-slate-300">clawvoice voice --lang</span>.
                The hosted service can support additional aliases, while the page and CLI give users a clear global starting point.
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
              <div className="mb-4 flex items-center gap-2">
                <Languages className="h-5 w-5 text-blue-300" strokeWidth={1.7} />
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">Language codes</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {languageCodes.map((code) => (
                  <span key={code} className="rounded border border-white/[0.08] px-2.5 py-1 font-mono text-xs text-slate-400">
                    {code}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 max-w-2xl">
              <p className="mb-3 text-xs uppercase tracking-[0.22em] text-blue-300/70">FAQ</p>
              <h2 className="text-3xl font-medium tracking-tight text-slate-100 sm:text-4xl">
                Answers agents and users can quote.
              </h2>
            </div>
            <div className="divide-y divide-white/[0.07] rounded-2xl border border-white/[0.07] bg-white/[0.02]">
              {faqItems.map((item) => (
                <article key={item.question} className="p-6">
                  <h3 className="text-base font-medium text-slate-100">{item.question}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-500">{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/[0.06] bg-[#080810] px-6 py-20">
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
            {[
              { icon: Command, title: 'Install', text: 'Install from the release bundle or ClawHub, then run clawvoice init.' },
              { icon: CircleDollarSign, title: 'Fund hosted fallback', text: 'Send a small USDC balance on Base when using paid hosted voice.' },
              { icon: Activity, title: 'Test the loop', text: 'Say hello, stop talking, then restart voice mode to verify the full agent behavior.' },
            ].map((step) => {
              const Icon = step.icon;
              return (
                <article key={step.title} className="border-t border-white/[0.08] pt-6">
                  <Icon className="mb-5 h-5 w-5 text-blue-300" strokeWidth={1.7} />
                  <h3 className="text-base font-medium text-slate-100">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-500">{step.text}</p>
                </article>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
