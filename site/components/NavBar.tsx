'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { ForgeMeshMark } from './ForgeMeshMark';
import { RailTicker } from './RailTicker';
import { NAV_GROUPS, TOP_LINKS, type NavLink } from '@/lib/navigation';

const linkStyle = 'flex items-center justify-between gap-3 rounded px-3 py-2.5 text-sm text-slate-300 hover:bg-blue-500/10 hover:text-white focus-visible:outline-2 focus-visible:outline-blue-300';

function NavigationLink({ link, close }: { link: NavLink; close: () => void }) {
  return <a href={link.href} onClick={close} className={linkStyle}
    target={link.href.startsWith('http') ? '_blank' : undefined}
    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}>
    <span>{link.label}</span>
    {link.price && <span className="shrink-0 text-xs text-blue-200">{link.price}</span>}
  </a>;
}

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const nav = useRef<HTMLElement>(null);
  const mobileTrigger = useRef<HTMLButtonElement>(null);
  const close = () => { setOpen(false); setDropdown(null); };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (dropdown) nav.current?.querySelector<HTMLButtonElement>(`#nav-trigger-${dropdown}`)?.focus();
      else if (open) mobileTrigger.current?.focus();
      setDropdown(null); setOpen(false);
    };
    const outside = (event: PointerEvent) => {
      if (!nav.current?.contains(event.target as Node)) { setDropdown(null); setOpen(false); }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', outside); };
  }, [open, dropdown]);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1280px)');
    const resize = () => { setOpen(false); setDropdown(null); };
    media.addEventListener('change', resize);
    return () => media.removeEventListener('change', resize);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  return <nav ref={nav} aria-label="Main navigation" onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDropdown(null);
  }} className={`fixed inset-x-0 top-0 z-50 transition-colors ${scrolled || open || dropdown ? 'border-b border-white/[0.06] bg-[#050509]/95' : 'bg-transparent'}`}>
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
      <a href="/" onClick={close} className="flex shrink-0 items-center gap-2 text-sm font-medium text-slate-200">
        <ForgeMeshMark size={30} /> <span>ForgeMesh<span className="hidden sm:inline"> Labs</span></span>
      </a>
      <div className="hidden items-center gap-1 xl:flex">
        {TOP_LINKS.map(link => <NavigationLink key={link.href} link={link} close={close} />)}
        {NAV_GROUPS.map(group => <div key={group.id} className="relative">
          <button id={`nav-trigger-${group.id}`} type="button" aria-expanded={dropdown === group.id} aria-controls={`nav-panel-${group.id}`}
            onClick={() => setDropdown(value => value === group.id ? null : group.id)} className={linkStyle}>
            {group.label}<ChevronDown className="h-3 w-3" aria-hidden="true" />
          </button>
          <div id={`nav-panel-${group.id}`} hidden={dropdown !== group.id}
            className="absolute right-0 top-full mt-3 max-h-[calc(100dvh-7rem)] w-[36rem] overflow-y-auto overscroll-contain rounded border border-white/10 bg-[#050509] p-4 shadow-xl">
            <div className="grid grid-cols-2 gap-4">
              {group.sections.map(section => <section key={section.label} aria-label={section.label}>
                <p className="px-3 pb-2 text-xs font-medium uppercase tracking-wider text-slate-500">{section.label}</p>
                {section.links.map(link => <NavigationLink key={link.href} link={link} close={close} />)}
              </section>)}
            </div>
          </div>
        </div>)}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <a href="https://kit.forgemesh.io" target="_blank" rel="noopener noreferrer"
          className="rounded border border-blue-400/40 bg-blue-500/10 px-3 py-2 text-xs font-medium text-blue-100 sm:text-sm">Free checklist</a>
        <a href="https://github.com/forgemeshlabs" target="_blank" rel="noopener noreferrer" className="hidden px-2 py-2 text-sm text-slate-300 xl:block">GitHub</a>
        <button ref={mobileTrigger} type="button" onClick={() => setOpen(value => !value)} aria-expanded={open}
          aria-controls="mobile-nav" aria-label={open ? 'Close menu' : 'Open menu'}
          className="flex h-10 w-10 items-center justify-center rounded border border-white/15 text-slate-200 xl:hidden">
          {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>
    </div>
    <div id="mobile-nav" hidden={!open} className="max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain border-t border-white/10 bg-[#050509] px-4 pb-8 pt-3 xl:hidden">
      <div className="flex flex-wrap gap-2">{TOP_LINKS.map(link => <NavigationLink key={link.href} link={link} close={close} />)}</div>
      {NAV_GROUPS.map(group => <section key={group.id} className="mt-6" aria-label={group.label}>
        <h2 className="px-3 text-base font-semibold text-slate-100">{group.label}</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">{group.sections.map(section => <div key={section.label}>
          <p className="px-3 pb-1 text-xs uppercase tracking-wider text-slate-500">{section.label}</p>
          {section.links.map(link => <NavigationLink key={link.href} link={link} close={close} />)}
        </div>)}</div>
      </section>)}
      <a href="https://github.com/forgemeshlabs" className={linkStyle}>GitHub →</a>
    </div>
    <RailTicker />
  </nav>;
}
