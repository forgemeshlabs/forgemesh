import type { Metadata } from 'next';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ShareBar } from '@/components/ShareBar';
import { ForgeMeshMark } from '@/components/ForgeMeshMark';
import { NavBar } from '@/components/NavBar';

const PAGE_URL = 'https://forgemesh.io/wallet';

export const metadata: Metadata = {
  metadataBase: new URL('https://forgemesh.io'),
  title: 'Set Up a Crypto Wallet to Get Paid by Bots | ForgeMesh Labs',
  description:
    'A plain-language guide to creating a wallet that receives USDC on Base: seed phrase safety, the security habits that matter, MetaMask step by step, Coinbase Wallet, Rabby, and when to move to a cold wallet.',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: 'article',
    url: PAGE_URL,
    title: 'Set up a wallet to get paid by bots',
    description:
      'Seed phrases, security habits, MetaMask step by step, other options, and when a cold wallet makes sense. Written for site owners, not traders.',
    siteName: 'ForgeMesh Labs',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Set up a wallet to get paid by bots',
    description: 'Seed phrases, security habits, MetaMask step by step, and when a cold wallet makes sense.',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'HowTo',
      name: 'Set up a crypto wallet to receive crawl payments in USDC on Base',
      description:
        'Create a self-custody wallet, protect the seed phrase, add the Base network, and paste the public address into Pay-per-Crawl.',
      totalTime: 'PT15M',
      step: [
        { '@type': 'HowToStep', name: 'Understand what you are making', text: 'A wallet is a key pair. The public address receives money; the seed phrase controls it. Nobody can reset either.' },
        { '@type': 'HowToStep', name: 'Install MetaMask from the official source', text: 'Get it from metamask.io or the browser store entry it links to. Never from a search ad or a link in a message.' },
        { '@type': 'HowToStep', name: 'Write the seed phrase on paper', text: 'Twelve words, in order, on paper or metal. Never in a screenshot, a note app, email or a password manager that syncs to the cloud.' },
        { '@type': 'HowToStep', name: 'Add the Base network', text: 'MetaMask lists Base under popular networks; one click adds it. USDC on Base is what crawlers pay with.' },
        { '@type': 'HowToStep', name: 'Copy the public address into the plugin', text: 'The 0x address, 42 characters. Paste it into Pay-per-Crawl settings and send yourself a small test first.' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'Do I need to buy any crypto to receive payments?', acceptedAnswer: { '@type': 'Answer', text: 'No. Receiving USDC on Base costs you nothing. You only need a little ETH on Base (a dollar or two) if you later want to move the USDC somewhere else.' } },
        { '@type': 'Question', name: 'Is it safe to publish my wallet address on my website?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. The address is public by design, like an account number. The risk is the seed phrase, which never leaves the paper you wrote it on.' } },
        { '@type': 'Question', name: 'What if I lose the seed phrase?', acceptedAnswer: { '@type': 'Answer', text: 'If the device also dies or the app is removed, the funds are gone. There is no reset. That is why the phrase goes on paper in two places before any money arrives.' } },
        { '@type': 'Question', name: 'When should I get a hardware (cold) wallet?', acceptedAnswer: { '@type': 'Answer', text: 'When the balance is more than you would be comfortable losing to a browser extension bug or a phishing page. Many site owners keep a hot wallet as the receiving address and sweep to a hardware wallet monthly.' } },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'ForgeMesh Labs', item: 'https://forgemesh.io' },
        { '@type': 'ListItem', position: 2, name: 'Wallet setup guide', item: PAGE_URL },
      ],
    },
  ],
};

const btn =
  'inline-flex items-center justify-center gap-2 rounded border border-white/[0.12] px-5 py-3 text-sm font-medium text-slate-300 transition-all hover:border-blue-500/50 hover:text-white';
const primary =
  'inline-flex items-center justify-center gap-2 rounded border border-blue-500/40 bg-blue-500/10 px-5 py-3 text-sm font-medium text-slate-100 transition-all hover:border-blue-400/70 hover:bg-blue-500/20';
const h2 = 'mt-14 text-2xl font-semibold tracking-tight text-slate-50';
const h3 = 'mt-8 text-lg font-medium text-slate-100';
const p = 'mt-4 text-base leading-8 text-slate-400';
const card = 'rounded border border-white/[0.06] bg-white/[0.02] p-5';
const warn = 'rounded border border-amber-500/30 bg-amber-500/[0.06] p-5';
const list = 'mt-4 list-disc space-y-2 pl-5 text-base leading-7 text-slate-400';
const steps = 'mt-4 list-decimal space-y-3 pl-5 text-base leading-7 text-slate-400';

const rules: [string, string][] = [
  ['The seed phrase is the wallet', 'Twelve or twenty-four words. Anyone who has them has the money, from anywhere, forever. No company can undo a transfer.'],
  ['Nobody legitimate will ever ask for it', 'Not MetaMask support, not Coinbase, not ForgeMesh, not a "validation" page, not a wallet "sync". Every request for the phrase is theft.'],
  ['Paper, not pixels', 'Write it by hand. No photo, no screenshot, no note app, no email draft, no cloud password manager. Phones and laptops get backed up to places you do not control.'],
  ['Two copies, two places', 'Fire, flood and a lost bag are more likely than a hacker. A second copy at a different address covers all three.'],
  ['The address is public, the phrase is not', 'Your 0x address goes on your website, in the plugin, in invoices. That is fine. It is an account number, not a password.'],
  ['Type URLs, do not click them', 'Fake wallet sites rank in search ads and arrive in DMs. Bookmark the real one the first time and only use the bookmark.'],
  ['Check the first and last characters', 'When you paste an address anywhere, read the first four and last four characters back. Malware that swaps clipboard addresses exists.'],
  ['Separate the wallet from your daily browser', 'A browser profile used only for the wallet, with no other extensions, removes most of the ways an extension gets attacked.'],
];

export default function WalletPage() {
  return (
    <>
      <NavBar />
      <main id="main-content" className="min-h-screen overflow-hidden bg-[#050509] text-slate-100">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

        <section className="relative px-6 pb-20 pt-28 sm:pt-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(59,130,246,0.20),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(14,165,233,0.10),transparent_30%)]" />
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
              <ForgeMeshMark size={22} className="shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">Guide · 15 minutes · No purchase needed</span>
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
              Set up a wallet to get paid by bots
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-400">
              Pay-per-Crawl sends crawl payments straight to a wallet you control. This page gets you
              one, safely, even if you have never touched crypto. It is written for site owners, not
              traders: you are creating an account number that can receive USDC, and protecting the
              one secret that controls it.
            </p>

            <div className={`mt-8 ${warn}`}>
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-1 h-5 w-5 shrink-0 text-amber-300" aria-hidden />
                <p className="text-base leading-7 text-amber-100/90">
                  <strong className="text-amber-200">The one rule.</strong> Your wallet will give you a list of
                  twelve words called a seed phrase (also "recovery phrase" or "secret phrase"). Those words
                  are the money. Write them on paper, keep the paper somewhere safe, and never type them
                  into anything except the wallet app itself when restoring it. Everything else on this page
                  is detail.
                </p>
              </div>
            </div>

            <h2 className={h2}>What a wallet actually is</h2>
            <p className={p}>
              A wallet is not an account at a company. It is a pair of keys generated on your device. One
              is public: a 42-character string starting with <code className="text-slate-300">0x</code> that
              anyone can send money to, the way anyone can pay into an account number. The other is private
              and is what the seed phrase encodes. Whoever holds the private key can move the funds, and
              nobody, including the wallet maker, can reset it, freeze it or recover it for you.
            </p>
            <p className={p}>
              The money itself lives on a public ledger, the Base network. The wallet app is just a window
              onto it. If your laptop dies, you install the app on another machine, enter the twelve words,
              and the same address with the same balance is back. If you lose the twelve words and the
              laptop, the balance is still on the ledger, visible to the whole world, and reachable by
              nobody.
            </p>
            <p className={p}>
              Crawlers pay in USDC, a dollar-pegged token, on Base, a low-fee network run on top of
              Ethereum. Receiving is free. You only ever need a tiny amount of ETH on Base (a dollar or
              two) if you decide to move the USDC somewhere else later.
            </p>

            <h2 className={h2}>Security habits, in order of importance</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {rules.map(([t, d]) => (
                <div key={t} className={card}>
                  <h3 className="font-medium text-slate-100">{t}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{d}</p>
                </div>
              ))}
            </div>

            <h2 className={h2}>Option 1: MetaMask, step by step</h2>
            <p className={p}>
              MetaMask is the most widely used browser wallet, works on Chrome, Firefox, Brave and Edge,
              has phone apps, and supports Base out of the box. It is a hot wallet: the keys live on the
              device, protected by a password you choose. Good for receiving, fine for modest balances.
            </p>
            <ol className={steps}>
              <li>
                <strong className="text-slate-200">Open a fresh browser profile.</strong> In Chrome: profile icon
                → Add. Name it "Wallet". No other extensions go in it, ever.
              </li>
              <li>
                <strong className="text-slate-200">Type</strong> <code className="text-slate-300">metamask.io</code>{' '}
                into the address bar yourself and click Download there. It sends you to the official store
                listing. Do not install from a search result or a link someone sent you.
              </li>
              <li>
                <strong className="text-slate-200">Create a new wallet.</strong> Choose a long password. This
                password only protects the app on this device; it is not the seed phrase and cannot recover
                anything on another machine.
              </li>
              <li>
                <strong className="text-slate-200">Reveal the Secret Recovery Phrase and write it on paper.</strong>{' '}
                Number the words 1 to 12. Check spelling. MetaMask will quiz you on a few words; do it from
                the paper, not from memory, so you know the paper is right.
              </li>
              <li>
                <strong className="text-slate-200">Make the second copy now</strong>, on a second sheet, and put
                it somewhere else: a relative's house, a safe deposit box, a locked drawer at work. Do not
                photograph either sheet.
              </li>
              <li>
                <strong className="text-slate-200">Add the Base network.</strong> Click the network name at the
                top left (it says Ethereum Mainnet) → the Base entry under popular networks → Add. If you
                ever have to enter it by hand: name Base, RPC{' '}
                <code className="text-slate-300">https://mainnet.base.org</code>, chain ID 8453, currency ETH,
                explorer <code className="text-slate-300">https://basescan.org</code>.
              </li>
              <li>
                <strong className="text-slate-200">Copy your address.</strong> Click the account name; the 0x
                address copies to the clipboard. Paste it somewhere visible and read the first four and last
                four characters back against the app.
              </li>
              <li>
                <strong className="text-slate-200">Paste it into Pay-per-Crawl settings</strong> as the payout
                wallet. The plugin checks the format. Save, then open{' '}
                <code className="text-slate-300">basescan.org/address/&lt;your address&gt;</code>: that page is your
                statement, and it will show every crawl payment as it lands.
              </li>
              <li>
                <strong className="text-slate-200">Optional but wise: a test transfer.</strong> If you have a
                friend or a second wallet, receive one dollar of USDC first and watch it appear in MetaMask.
                If USDC does not show, use "Import tokens" and pick USDC on Base; the balance was always
                there, the app just was not displaying it.
              </li>
            </ol>
            <p className={p}>
              Later, when a balance builds up: turn on the phone app only if you need it, keep the browser
              profile dedicated, and treat any pop-up asking you to "sign" something you did not initiate
              as hostile. Receiving money never requires you to sign anything.
            </p>

            <h2 className={h2}>Other options</h2>
            <p className={p}>
              All of these produce the same kind of 0x address and work with Pay-per-Crawl. Pick by where you
              want the keys to live.
            </p>

            <h3 className={h3}>Coinbase Wallet (not the Coinbase exchange app)</h3>
            <p className={p}>
              A self-custody wallet from the company that built Base, with a browser extension and phone
              apps. Same seed-phrase model as MetaMask, slightly friendlier onboarding, Base selected by
              default. Note the distinction: the <em>Coinbase</em> app is an exchange account where Coinbase
              holds the keys; <em>Coinbase Wallet</em> is a separate app where you do. Either address can
              receive USDC on Base, but only the Wallet gives you a seed phrase and full control. If you use
              an exchange address, confirm it supports USDC deposits on the Base network specifically before
              pasting it anywhere.
            </p>

            <h3 className={h3}>Rabby</h3>
            <p className={p}>
              An open-source browser wallet that shows you, in plain terms, what every transaction will do
              before you approve it, and warns about suspicious contracts. A good choice if you expect to
              interact with anything beyond plain receiving. Same seed-phrase rules.
            </p>

            <h3 className={h3}>Rainbow, Trust Wallet, Zerion</h3>
            <p className={p}>
              Phone-first wallets with Base support. Fine for receiving. The phone is the device at risk,
              so screen lock, up-to-date OS and no sideloaded apps matter more than usual.
            </p>

            <h3 className={h3}>A smart account or embedded wallet</h3>
            <p className={p}>
              Some services create a wallet for you behind an email login and recover it through their
              systems instead of a seed phrase. Convenient, and fine for small amounts, but you are trusting
              that company's security and continued existence. For a payout address you expect to use for
              years, prefer a wallet whose phrase you hold.
            </p>

            <h2 className={h2}>Cold wallets: when and why</h2>
            <p className={p}>
              Everything above is a hot wallet: the private key sits on a device that is also online,
              browsing the web, running other software. A cold (hardware) wallet keeps the key inside a
              small dedicated device that never exposes it. Transactions are prepared on your computer and
              signed inside the device, which shows you the amount and destination on its own screen before
              you press a physical button. Malware on the computer cannot sign anything.
            </p>
            <p className={p}>
              You do not need one on day one. A reasonable line: when the balance is more than you would
              shrug off losing to a browser bug or a convincing phishing page, move it. The common pattern
              among site owners is to keep the hot wallet as the receiving address pasted into the plugin,
              and sweep to the hardware wallet once a month. You can also point the plugin directly at the
              hardware wallet's address; receiving still needs no signing, so the device only comes out when
              you want to spend.
            </p>
            <ul className={list}>
              <li>
                <strong className="text-slate-200">Ledger</strong> (Nano S Plus, Nano X, Flex, Stax). The widest
                software support, Base and USDC included.{' '}
                <a href="/go/ledger" data-umami-event="affiliate_click" data-umami-event-partner="ledger" className="text-blue-400 hover:text-blue-300">
                  Buy from Ledger directly
                </a>
                . That is an affiliate link; it funds this site at no cost to you.
              </li>
              <li>
                <strong className="text-slate-200">Trezor</strong> (Safe 3, Safe 5). Open-source firmware, also
                works with MetaMask and Rabby as the signing device.
              </li>
            </ul>
            <div className={`mt-6 ${warn}`}>
              <p className="text-base leading-7 text-amber-100/90">
                <strong className="text-amber-200">Buy hardware wallets only from the maker's own store.</strong>{' '}
                Never second-hand, never from a marketplace seller, never one that arrives with the seed
                phrase already filled in on a card. A pre-seeded device is a theft waiting for your first
                deposit. On first use the device must generate a brand-new phrase in front of you.
              </p>
            </div>
            <p className={p}>
              The same paper-and-two-places rule applies to the hardware wallet's phrase. The device is
              replaceable; the phrase is not.
            </p>

            <h2 className={h2}>Things that look like problems but are not</h2>
            <ul className={list}>
              <li>
                <strong className="text-slate-200">USDC arrived but the balance shows zero.</strong> The app is not
                displaying the token yet. Import tokens → USDC on Base. Check basescan.org to confirm it is
                there.
              </li>
              <li>
                <strong className="text-slate-200">A tiny unexpected deposit, or a transfer you never made in your history.</strong>{' '}
                Address poisoning: someone sends dust from an address that looks like yours, hoping you copy
                it from history later. Ignore it, never copy addresses from history, and read our{' '}
                <a href="/blog/address-poisoning-dust-attack-x402-agent-wallets" className="text-blue-400 hover:text-blue-300">
                  note on dust attacks
                </a>
                .
              </li>
              <li>
                <strong className="text-slate-200">Random tokens or NFTs appearing.</strong> Airdropped bait. Do not
                interact with them, do not try to sell them; leave them hidden.
              </li>
              <li>
                <strong className="text-slate-200">An email saying your wallet needs "verification" or "migration".</strong>{' '}
                Wallets have no accounts and send no emails. Delete it.
              </li>
            </ul>

            <h2 className={h2}>Tax and records</h2>
            <p className={p}>
              Crawl payments are income in most places, in the currency value on the day received. Your
              basescan address page is a complete ledger with timestamps and amounts, and Pay-per-Crawl Pro
              exports a settlements CSV with the transaction hash on every row for a bookkeeper. Keep the
              address you use for the site separate from any personal wallet so the statement stays clean.
            </p>

            <div className="mt-12 flex flex-col gap-3 sm:flex-row">
              <a href="/wordpress" className={primary}>
                Set up Pay-per-Crawl <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <a href="/plugins" className={btn}>Other platforms</a>
              <a href="mailto:hello@forgemesh.io" className={btn}>hello@forgemesh.io</a>
            </div>
            <p className="mt-6 text-sm leading-6 text-slate-500">
              This is a setup guide, not financial advice. ForgeMesh never holds your keys or your funds,
              and will never ask for a seed phrase.
            </p>
          </div>
        </section>

        <ShareBar />
        <Footer />
      </main>
    </>
  );
}
