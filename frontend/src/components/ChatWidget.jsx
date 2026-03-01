import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

/* ═══════════════════ ICONS ═══════════════════ */
const IC = {
    bot: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V10a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4z" /><circle cx="9" cy="14" r="1.2" fill="currentColor" /><circle cx="15" cy="14" r="1.2" fill="currentColor" /><path d="M9 18h6" /></svg>,
    send: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7z" /></svg>,
    close: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg>,
    trash: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6M10 11v6m4-6v6M9 6V4h6v2" /></svg>,
    mini: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /></svg>,
    book: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>,
    ext: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17 17 7M7 7h10v10" /></svg>,
    user: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>,
    moon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>,
    sun: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>,
    lock: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
    question: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><circle cx="12" cy="17" r=".5" fill="currentColor" /></svg>,
};

/* ═══════════════════ ROLE CONFIG ═══════════════════ */
const ROLE_CONFIG = {
    ADMIN: { label: 'Administrateur', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', emoji: '🔴' },
    MODERATEUR: { label: 'Modérateur', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', emoji: '🟡' },
    USER: { label: 'Utilisateur', color: '#22c55e', bg: 'rgba(34,197,94,0.12)', emoji: '🟢' },
    VISITOR: { label: 'Visiteur', color: '#94a3b8', bg: 'rgba(148,163,184,0.12)', emoji: '⚪' },
};

/* ═══════════════════ THEMES ═══════════════════ */
const THEME = {
    light: {
        windowBg: '#ffffff', windowBorder: '1px solid rgba(99,102,241,0.2)',
        windowShadow: '0 0 0 1px rgba(99,102,241,0.06), 0 24px 64px rgba(0,0,0,0.12)',
        headerBg: 'linear-gradient(180deg, #f8f9ff 0%, #f3f4fd 100%)',
        headerBorder: '1px solid rgba(99,102,241,0.12)', headerName: '#1e1b4b', headerSub: '#6b7280',
        iconBtn: '#9ca3af', iconBtnHover: 'rgba(99,102,241,0.08)',
        bodyBg: '#ffffff', senderLabel: '#9ca3af',
        userBubbleBg: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        userBubbleText: '#ffffff', asstBubbleBg: '#f3f4f6', asstBubbleText: '#1f2937',
        asstBubbleBorder: '1px solid #e5e7eb', errorBubbleBg: '#fef2f2', errorBubbleText: '#dc2626',
        errorBorder: '1px solid #fecaca',
        questionBubbleBg: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
        questionBubbleText: '#065f46', questionBubbleBorder: '1px solid #a7f3d0',
        accessDeniedBg: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
        accessDeniedText: '#92400e', accessDeniedBorder: '1px solid #fcd34d',
        chipBg: '#eef0ff', chipBorder: '1px solid #c7d2fe', chipText: '#4f46e5', chipHover: '#e0e7ff',
        resultsBg: '#f9fafb', resultsBorder: '1px solid #e5e7eb', resultsHeader: '#4f46e5',
        resultsHeaderBg: '#eef0ff', resultTitle: '#111827', resultAuthors: '#6b7280',
        resultDivider: '1px solid #f3f4f6', resultLink: '#4f46e5', resultHover: 'rgba(99,102,241,0.04)',
        inputRowBg: '#f9fafb', inputRowBorder: '1px solid #e5e7eb', inputRowFocus: '1px solid #6366f1',
        inputText: '#111827', inputPlaceholder: '#9ca3af',
        footerBg: '#ffffff', footerBorder: '1px solid #f3f4f6', hintText: '#d1d5db',
        sendActiveBg: 'linear-gradient(135deg, #6366f1, #8b5cf6)', sendInactiveBg: '#e5e7eb',
        sendActiveColor: '#ffffff', sendInactiveColor: '#9ca3af',
        fabBg: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', fabText: '#ffffff',
        fabBorder: 'none', fabShadow: '0 4px 20px rgba(99,102,241,0.45)',
        typingBg: '#f3f4f6', typingBorder: '1px solid #e5e7eb', typingDot: '#d1d5db',
        onlineDot: '#22c55e', boldText: '#111827',
        dots: {
            GREET: '#6366f1', THANKS: '#22c55e', BYE: '#f59e0b', COMPLIMENT: '#ec4899',
            HELP: '#0ea5e9', PROBLEM: '#ef4444', SEARCH: '#10b981', CLARIFY: '#f59e0b',
            QUESTION: '#10b981', ACCESS_DENIED: '#f59e0b', GENERAL: '#9ca3af', ERROR: '#ef4444'
        },
    },
    dark: {
        windowBg: '#0d1117', windowBorder: '1px solid rgba(99,102,241,0.18)',
        windowShadow: '0 0 0 1px rgba(99,102,241,0.08), 0 28px 80px rgba(0,0,0,0.7)',
        headerBg: 'linear-gradient(180deg, #161b27 0%, #0d1117 100%)',
        headerBorder: '1px solid rgba(99,102,241,0.1)', headerName: '#f1f5f9', headerSub: '#475569',
        iconBtn: '#475569', iconBtnHover: 'rgba(148,163,184,0.08)',
        bodyBg: '#0d1117', senderLabel: '#334155',
        userBubbleBg: 'linear-gradient(135deg, #5254f0 0%, #7c3aed 100%)',
        userBubbleText: '#ffffff', asstBubbleBg: 'rgba(30,41,59,0.85)', asstBubbleText: '#cbd5e1',
        asstBubbleBorder: '1px solid rgba(148,163,184,0.08)',
        errorBubbleBg: 'rgba(239,68,68,0.08)', errorBubbleText: '#fca5a5', errorBorder: '1px solid rgba(239,68,68,0.2)',
        questionBubbleBg: 'rgba(16,185,129,0.08)',
        questionBubbleText: '#6ee7b7', questionBubbleBorder: '1px solid rgba(16,185,129,0.2)',
        accessDeniedBg: 'rgba(245,158,11,0.08)',
        accessDeniedText: '#fcd34d', accessDeniedBorder: '1px solid rgba(245,158,11,0.2)',
        chipBg: 'rgba(99,102,241,0.08)', chipBorder: '1px solid rgba(99,102,241,0.2)',
        chipText: '#818cf8', chipHover: 'rgba(99,102,241,0.18)',
        resultsBg: 'rgba(13,17,23,0.9)', resultsBorder: '1px solid rgba(99,102,241,0.15)',
        resultsHeader: '#6366f1', resultsHeaderBg: 'rgba(99,102,241,0.04)',
        resultTitle: '#e2e8f0', resultAuthors: '#475569',
        resultDivider: '1px solid rgba(148,163,184,0.05)', resultLink: '#6366f1',
        resultHover: 'rgba(99,102,241,0.06)',
        inputRowBg: 'rgba(22,27,39,0.8)', inputRowBorder: '1px solid rgba(99,102,241,0.12)',
        inputRowFocus: '1px solid rgba(99,102,241,0.4)', inputText: '#e2e8f0', inputPlaceholder: '#475569',
        footerBg: '#0d1117', footerBorder: '1px solid rgba(99,102,241,0.08)', hintText: '#1e293b',
        sendActiveBg: 'linear-gradient(135deg, #6366f1, #8b5cf6)', sendInactiveBg: 'rgba(99,102,241,0.1)',
        sendActiveColor: '#ffffff', sendInactiveColor: '#374151',
        fabBg: '#0f172a', fabText: '#e2e8f0', fabBorder: '1px solid rgba(99,102,241,0.35)',
        fabShadow: '0 0 0 3px rgba(99,102,241,0.08), 0 8px 28px rgba(0,0,0,0.5)',
        typingBg: 'rgba(30,41,59,0.6)', typingBorder: '1px solid rgba(148,163,184,0.07)', typingDot: '#4b5563',
        onlineDot: '#4ade80', boldText: '#f1f5f9',
        dots: {
            GREET: '#818cf8', THANKS: '#4ade80', BYE: '#fbbf24', COMPLIMENT: '#f472b6',
            HELP: '#38bdf8', PROBLEM: '#f87171', SEARCH: '#34d399', CLARIFY: '#fbbf24',
            QUESTION: '#34d399', ACCESS_DENIED: '#fbbf24', GENERAL: '#94a3b8', ERROR: '#f87171'
        },
    },
};

/* ═══════════════════ ROLE WELCOME MESSAGES ═══════════════════ */
const getWelcome = (role) => {
    const messages = {
        ADMIN: {
            content: 'Bonjour Administrateur ! 👋 Je suis **ARIA**, votre assistant intelligent IA-Technology.\n\nEn tant qu\'admin, vous avez accès à toutes les fonctionnalités :\n• 👥 Gestion des chercheurs\n• 📚 Gestion des publications\n• 🏷️ Gestion des domaines\n• 👤 Gestion des comptes\n\nQue souhaitez-vous faire ?',
            chips: ['👥 Gérer les chercheurs', '📚 Gérer les publications', '🔍 Chercher des publications', '📊 Tableau de bord'],
        },
        MODERATEUR: {
            content: 'Bonjour Modérateur ! 👋 Je suis **ARIA**, votre assistant IA-Technology.\n\nEn tant que modérateur, vous pouvez :\n• 📰 Gérer les actualités\n• 📢 Publier des annonces\n• 🌟 Mettre en avant des projets\n\nQue souhaitez-vous faire ?',
            chips: ['📰 Gérer les actualités', '📢 Publier une annonce', '🔍 Chercher des publications', '🌟 Projets récents'],
        },
        USER: {
            content: 'Bonjour ! 👋 Je suis **ARIA**, votre assistant de recherche IA-Technology.\n\nJe peux vous aider à :\n• 🔍 Trouver des publications scientifiques\n• 👨‍🔬 Découvrir les chercheurs\n• 📥 Télécharger des documents\n\nVoulez-vous que je vous guide dans votre recherche ?',
            chips: ['🔍 Chercher des publications', '🎯 Recherche guidée par intérêts', '👨‍🔬 Voir les chercheurs', '📚 Toutes les publications'],
        },
        VISITOR: {
            content: 'Bienvenue ! 👋 Je suis **ARIA**, l\'assistant de la plateforme IA-Technology.\n\nJe peux vous montrer ce que nous proposons. Pour accéder à la recherche avancée et au téléchargement, vous devrez vous connecter.\n\nQue souhaitez-vous découvrir ?',
            chips: ['🌐 Découvrir la plateforme', '🔑 Se connecter', '📝 S\'inscrire', '📚 Publications publiques'],
        },
    };
    const cfg = messages[role] || messages.VISITOR;
    return { role: 'assistant', action: 'GREET', content: cfg.content, chips: cfg.chips, results: [] };
};

/* ═══════════════════ CHIPS CONFIG ═══════════════════ */
const CHIPS_BY_ACTION = {
    GREET: ['🔍 Lancer une recherche', '🛠️ Comment ça marche ?', '📚 Publications récentes'],
    THANKS: ['🔍 Nouvelle recherche', '📚 Explorer les publications', '👋 Au revoir'],
    BYE: [],
    HELP: ['🔍 Chercher maintenant', '📚 Voir les publications', '👨‍🔬 Les chercheurs'],
    SEARCH: ['🔍 Nouvelle recherche', '🎯 Affiner par intérêts', '📖 Voir tout'],
    QUESTION: [],   // pas de chips pendant questionnaire
    ACCESS_DENIED: ['� Se connecter', '� S\'inscrire', '� Publications publiques'],
    GENERAL: ['🔍 Chercher des publications', '🛠️ Aide', '📚 Publications'],
};

const CHIP_MESSAGES = {
    '🛠️ Comment ça marche ?': 'comment tu fonctionnes ?',
    '🛠️ Comment utiliser ?': 'comment utiliser la plateforme ?',
    '🛠️ Aide': 'aide',
    '👋 Au revoir': 'au revoir',
    '🎯 Recherche guidée par intérêts': 'je veux une recherche guidée selon mes intérêts',
    '🎯 Affiner par intérêts': 'je veux affiner ma recherche par intérêts',
    '🌐 Découvrir la plateforme': 'présente-moi la plateforme IA-Technology',
    '📰 Gérer les actualités': 'comment gérer les actualités ?',
    '📢 Publier une annonce': 'comment publier une annonce ?',
    '� Projets récents': 'montre-moi comment mettre en avant les projets récents',
};

const NAV_CHIPS = {
    '👥 Gérer les chercheurs': '/admin/researchers',
    '📚 Gérer les publications': '/admin/publications',
    '📊 Tableau de bord': '/admin',
    '👨‍🔬 Voir les chercheurs': '/researchers',
    '📚 Toutes les publications': '/publications',
    '📚 Publications récentes': '/publications',
    '📚 Explorer les publications': '/publications',
    '📚 Publications publiques': '/publications',
    '📖 Voir tout': '/publications',
    '👨‍🔬 Les chercheurs': '/researchers',
    '� Se connecter': '/login',
    '📝 S\'inscrire': '/register',
};

/* ═══════════════════ COMPONENT ═══════════════════ */
export default function ChatWidget() {
    const { user, isAuthenticated } = useAuth();

    // Calcul du rôle API
    const userRole = isAuthenticated
        ? (user?.role === 'MODERATEUR' ? 'MODERATOR' : user?.role || 'USER')
        : 'VISITOR';

    const roleDisplay = user?.role || 'VISITOR';
    const roleCfg = ROLE_CONFIG[roleDisplay] || ROLE_CONFIG.VISITOR;

    const [open, setOpen] = useState(false);
    const [dark, setDark] = useState(false);
    const [messages, setMessages] = useState(() => [getWelcome(roleDisplay)]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [pubs, setPubs] = useState([]);
    const [unread, setUnread] = useState(0);
    const [appeared, setAppeared] = useState(false);
    const [focused, setFocused] = useState(false);

    const bottomRef = useRef(null);
    const textaRef = useRef(null);
    const T = dark ? THEME.dark : THEME.light;

    // Reset welcome message quand le rôle change (login/logout)
    useEffect(() => {
        setMessages([getWelcome(roleDisplay)]);
    }, [roleDisplay]);

    useEffect(() => {
        api.get('/public/publications')
            .then(r => setPubs(Array.isArray(r.data) ? r.data : (r.data?.content ?? [])))
            .catch(() => { });
        setTimeout(() => setAppeared(true), 500);
    }, []);

    useEffect(() => {
        if (open) {
            setUnread(0);
            setTimeout(() => textaRef.current?.focus(), 150);
            setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'instant' }), 80);
        }
    }, [open]);

    useEffect(() => {
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 60);
    }, [messages, loading]);

    const handleChipClick = (chip) => {
        if (chip === '🔄 Recharger la page') { window.location.reload(); return; }
        if (NAV_CHIPS[chip]) { window.location.href = NAV_CHIPS[chip]; return; }
        const msg = CHIP_MESSAGES[chip];
        if (msg) sendMessage(msg);
        else sendMessage(chip.replace(/^[^\s]+\s/, ''));
    };

    const sendMessage = async (text = input) => {
        const msg = text.trim();
        if (!msg || loading) return;
        setInput('');
        if (textaRef.current) textaRef.current.style.height = 'auto';

        const userMsg = { role: 'user', content: msg };
        const updated = [...messages, userMsg];
        setMessages(updated);
        setLoading(true);

        try {
            const history = updated.filter((_, i) => i > 0).slice(0, -1).map(m => ({ role: m.role, content: m.content }));
            const { data } = await api.post('/public/ia/chat', {
                message: msg,
                history,
                publications: pubs,
                userRole,          // ← envoi du rôle
            });

            const { reply, results, search_done, action, step } = data;
            const chips = CHIPS_BY_ACTION[action] || CHIPS_BY_ACTION.GENERAL;

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: reply,
                results: results || [],
                search_done,
                action: action || 'GENERAL',
                chips,
                step,
            }]);
            if (!open) setUnread(u => u + 1);
        } catch {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Désolé, une erreur est survenue. Veuillez réessayer.',
                results: [], action: 'ERROR', chips: [], error: true,
            }]);
        } finally {
            setLoading(false);
        }
    };

    const scoreColor = s => s >= 0.7 ? '#22c55e' : s >= 0.5 ? '#f59e0b' : '#94a3b8';

    /* ─── Render Markdown basique ─── */
    const renderContent = (text) =>
        text.split('\n').map((line, i) => {
            if (line.startsWith('• ') || line.startsWith('- ')) {
                return (
                    <div key={i} style={{ display: 'flex', gap: 7, paddingLeft: 4, marginTop: 3 }}>
                        <span style={{ color: T.dots.GREET, flexShrink: 0, marginTop: 1 }}>•</span>
                        <span>{renderBold(line.slice(2))}</span>
                    </div>
                );
            }
            if (line === '') return <div key={i} style={{ height: 5 }} />;
            return <div key={i} style={{ lineHeight: 1.65 }}>{renderBold(line)}</div>;
        });

    const renderBold = (line) =>
        line.split(/\*\*(.*?)\*\*/g).map((p, i) =>
            i % 2 === 1 ? <strong key={i} style={{ color: T.boldText, fontWeight: 700 }}>{p}</strong> : <span key={i}>{p}</span>
        );

    /* ─── Style de bulle selon l'action ─── */
    const getBubbleStyle = (msg) => {
        if (msg.role === 'user') return {
            background: T.userBubbleBg, color: T.userBubbleText, border: 'none',
            borderRadius: '16px 16px 3px 16px',
            boxShadow: '0 4px 14px rgba(99,102,241,.25)',
        };
        if (msg.error) return {
            background: T.errorBubbleBg, color: T.errorBubbleText, border: T.errorBorder,
            borderRadius: '16px 16px 16px 3px',
        };
        if (msg.action === 'QUESTION') return {
            background: T.questionBubbleBg, color: T.questionBubbleText, border: T.questionBubbleBorder,
            borderRadius: '16px 16px 16px 3px',
        };
        if (msg.action === 'ACCESS_DENIED') return {
            background: T.accessDeniedBg, color: T.accessDeniedText, border: T.accessDeniedBorder,
            borderRadius: '16px 16px 16px 3px',
        };
        return {
            background: T.asstBubbleBg, color: T.asstBubbleText, border: T.asstBubbleBorder,
            borderRadius: '16px 16px 16px 3px',
            boxShadow: '0 1px 4px rgba(0,0,0,.07)',
        };
    };

    const selectionCSS = dark
        ? `::selection { background: #6366f1; color: #fff; }
       .cw-bubble-user ::selection { background: rgba(255,255,255,0.35); color: #fff; }
       .cw-bubble-asst ::selection { background: #6366f1; color: #fff; }`
        : `::selection { background: #c7d2fe; color: #1e1b4b; }
       .cw-bubble-user ::selection { background: rgba(255,255,255,0.4); color: #fff; }
       .cw-bubble-asst ::selection { background: #c7d2fe; color: #1e1b4b; }`;

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes cwSlide  { from{opacity:0;transform:translateY(16px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes cwFade   { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes cwBounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }
        @keyframes cwPulse  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.85)} }
        @keyframes cwShake  { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-3px)} 40%,80%{transform:translateX(3px)} }
        ${selectionCSS}
        .cw-chip:hover   { opacity:.85; transform:translateY(-1px); }
        .cw-ibtn:hover   { opacity:.8; }
        .cw-rcard:hover  { background:${T.resultHover} !important; }
        .cw-send:hover:not(:disabled) { transform:scale(1.08) !important; }
        .cw-fab:hover    { filter:brightness(1.08); transform:scale(1.04) translateY(-2px) !important; }
        .cw-textarea::placeholder { color: ${T.inputPlaceholder}; }
        .cw-step-badge   { display:inline-flex; align-items:center; gap:4px; background:rgba(16,185,129,0.15); color:#059669; border-radius:20px; padding:2px 8px; font-size:10px; font-weight:700; margin-bottom:6px; }
        .cw-denied-badge { display:inline-flex; align-items:center; gap:4px; background:rgba(245,158,11,0.12); color:#92400e; border-radius:20px; padding:2px 8px; font-size:10px; font-weight:700; margin-bottom:6px; }
      `}</style>

            {/* ── FAB ── */}
            <button
                className="cw-fab"
                style={{
                    position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
                    display: 'flex', alignItems: 'center', gap: 9,
                    background: T.fabBg, color: T.fabText, border: T.fabBorder, borderRadius: 50,
                    padding: open ? '11px 13px' : '11px 18px 11px 14px', cursor: 'pointer',
                    boxShadow: T.fabShadow, transition: 'all .35s cubic-bezier(.34,1.56,.64,1)',
                    transform: appeared ? 'scale(1) translateY(0)' : 'scale(.5) translateY(30px)',
                    opacity: appeared ? 1 : 0, fontSize: 13, fontWeight: 600,
                    fontFamily: '"DM Sans",system-ui,sans-serif',
                }}
                onClick={() => setOpen(o => !o)}
            >
                <span style={{ display: 'flex', position: 'relative' }}>
                    {open ? IC.close : IC.bot}
                    {!open && unread > 0 && (
                        <span style={{ position: 'absolute', top: -7, right: -7, background: '#ef4444', color: '#fff', borderRadius: 10, fontSize: 10, fontWeight: 700, padding: '2px 5px', border: `2px solid ${dark ? '#0d1117' : '#fff'}`, lineHeight: 1.3 }}>
                            {unread}
                        </span>
                    )}
                </span>
                {!open && <span>ARIA</span>}
            </button>

            {/* ── WINDOW ── */}
            {open && (
                <div style={{
                    position: 'fixed', bottom: 84, right: 24, zIndex: 9999,
                    width: 400, background: T.windowBg, borderRadius: 18, overflow: 'hidden',
                    border: T.windowBorder, boxShadow: T.windowShadow,
                    display: 'flex', flexDirection: 'column',
                    maxHeight: 590,
                    transition: 'max-height .4s cubic-bezier(.16,1,.3,1)',
                    fontFamily: '"DM Sans",system-ui,sans-serif',
                    animation: 'cwSlide .38s cubic-bezier(.16,1,.3,1)',
                }}>

                    {/* HEADER */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '12px 14px', background: T.headerBg,
                        borderBottom: T.headerBorder, flexShrink: 0,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: 10,
                                background: 'linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0, boxShadow: '0 3px 10px rgba(99,102,241,.4)', color: '#fff',
                            }}>
                                {IC.bot}
                            </div>
                            <div>
                                <div style={{ fontSize: 13.5, fontWeight: 700, color: T.headerName, letterSpacing: '-.01em', display: 'flex', alignItems: 'center', gap: 7 }}>
                                    ARIA
                                    {/* Badge de rôle */}
                                    <span style={{
                                        fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 20,
                                        background: roleCfg.bg, color: roleCfg.color,
                                        border: `1px solid ${roleCfg.color}33`,
                                    }}>
                                        {roleCfg.emoji} {roleCfg.label}
                                    </span>
                                </div>
                                <div style={{ fontSize: 11, color: T.headerSub, display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                                    <div style={{ width: 6, height: 6, borderRadius: 3, background: T.onlineDot, animation: 'cwPulse 2s infinite' }} />
                                    <span>En ligne · Groq AI</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <button className="cw-ibtn" onClick={() => setDark(d => !d)} title={dark ? 'Mode clair' : 'Mode sombre'}
                                style={{ background: 'transparent', border: 'none', color: T.iconBtn, cursor: 'pointer', padding: 6, borderRadius: 7, display: 'flex', alignItems: 'center', transition: 'all .18s' }}>
                                {dark ? IC.sun : IC.moon}
                            </button>
                            <button className="cw-ibtn" onClick={() => setMessages([getWelcome(roleDisplay)])} title="Nouvelle conversation"
                                style={{ background: 'transparent', border: 'none', color: T.iconBtn, cursor: 'pointer', padding: 6, borderRadius: 7, display: 'flex', alignItems: 'center', transition: 'all .18s' }}>
                                {IC.trash}
                            </button>
                            <button className="cw-ibtn" onClick={() => setOpen(false)} title="Fermer"
                                style={{ background: 'transparent', border: 'none', color: T.iconBtn, cursor: 'pointer', padding: 6, borderRadius: 7, display: 'flex', alignItems: 'center', transition: 'all .18s' }}>
                                {IC.close}
                            </button>
                        </div>
                    </div>

                    {/* BODY */}
                    <div style={{
                        flex: 1, overflowY: 'auto', padding: '14px 12px', background: T.bodyBg,
                        display: 'flex', flexDirection: 'column', gap: 14,
                        scrollbarWidth: 'thin',
                        scrollbarColor: dark ? 'rgba(99,102,241,.1) transparent' : 'rgba(99,102,241,.15) transparent',
                    }}>
                        {messages.map((msg, idx) => {
                            const dotColor = T.dots[msg.action] || T.dots.GENERAL;
                            return (
                                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 5, animation: 'cwFade .28s ease' }}>

                                    {/* Badges spéciaux */}
                                    {msg.role === 'assistant' && msg.action === 'QUESTION' && (
                                        <div className="cw-step-badge">
                                            {IC.question} Étape {msg.step || '?'} / 4
                                        </div>
                                    )}
                                    {msg.role === 'assistant' && msg.action === 'ACCESS_DENIED' && (
                                        <div className="cw-denied-badge">
                                            {IC.lock} Accès restreint
                                        </div>
                                    )}

                                    {/* Label */}
                                    <div style={{ fontSize: 10.5, color: T.senderLabel, paddingLeft: msg.role !== 'user' ? 3 : 0, paddingRight: msg.role === 'user' ? 3 : 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                                        {msg.role === 'user'
                                            ? <>{IC.user}<span>Vous</span></>
                                            : <><span style={{ color: dotColor, fontSize: 8 }}>●</span><span>ARIA</span></>
                                        }
                                    </div>

                                    {/* Bubble */}
                                    <div
                                        className={msg.role === 'user' ? 'cw-bubble-user' : 'cw-bubble-asst'}
                                        style={{
                                            maxWidth: '88%', padding: '10px 13px', userSelect: 'text',
                                            fontSize: 13.5, lineHeight: 1.65,
                                            ...getBubbleStyle(msg),
                                        }}
                                    >
                                        {msg.role === 'assistant' ? renderContent(msg.content) : msg.content}
                                    </div>

                                    {/* Chips — seulement sur le dernier message assistant */}
                                    {msg.chips?.length > 0 && !loading && idx === messages.length - 1 && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 2 }}>
                                            {msg.chips.map(chip => (
                                                <button key={chip} className="cw-chip"
                                                    onClick={() => handleChipClick(chip)}
                                                    style={{
                                                        background: T.chipBg, border: T.chipBorder, color: T.chipText,
                                                        borderRadius: 20, padding: '5px 11px', fontSize: 11.5, fontWeight: 500,
                                                        cursor: 'pointer', transition: 'all .18s', fontFamily: 'inherit',
                                                    }}>
                                                    {chip}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Results */}
                                    {msg.results?.length > 0 && (
                                        <div style={{ marginTop: 4, background: T.resultsBg, border: T.resultsBorder, borderRadius: 12, overflow: 'hidden', width: '100%', maxWidth: '88%' }}>
                                            <div style={{ padding: '7px 11px', fontSize: 10.5, fontWeight: 700, color: T.resultsHeader, letterSpacing: '.07em', textTransform: 'uppercase', borderBottom: T.resultsBorder, background: T.resultsHeaderBg, display: 'flex', alignItems: 'center', gap: 6 }}>
                                                {IC.book}
                                                {msg.results.length} publication{msg.results.length > 1 ? 's' : ''} trouvée{msg.results.length > 1 ? 's' : ''}
                                            </div>
                                            {msg.results.slice(0, 4).map(pub => (
                                                <Link key={pub.id} to={`/publications/${pub.id}`} className="cw-rcard" onClick={() => setOpen(false)}
                                                    style={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '9px 11px', textDecoration: 'none', borderBottom: T.resultDivider, transition: 'background .15s' }}>
                                                    <div style={{ fontSize: 12.5, fontWeight: 600, color: T.resultTitle, lineHeight: 1.4 }}>{pub.titre}</div>
                                                    {pub.chercheursNoms?.length > 0 && (
                                                        <div style={{ fontSize: 11, color: T.resultAuthors }}>{pub.chercheursNoms.join(', ')}</div>
                                                    )}
                                                    <div style={{ fontSize: 11, fontWeight: 700, color: scoreColor(pub.score), marginTop: 2 }}>
                                                        ● {Math.round(pub.score * 100)}% pertinent
                                                    </div>
                                                </Link>
                                            ))}
                                            {msg.results.length > 4 && (
                                                <Link to="/publications" onClick={() => setOpen(false)}
                                                    style={{ display: 'block', padding: '7px 11px', fontSize: 11, color: T.resultLink, textAlign: 'center', textDecoration: 'none' }}>
                                                    +{msg.results.length - 4} de plus {IC.ext}
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Typing indicator */}
                        {loading && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 5, animation: 'cwFade .28s ease' }}>
                                <div style={{ fontSize: 10.5, color: T.senderLabel, paddingLeft: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <span style={{ color: T.dots.GENERAL, fontSize: 8 }}>●</span><span>ARIA</span>
                                </div>
                                <div style={{ display: 'flex', gap: 4, padding: '11px 14px', background: T.typingBg, borderRadius: '16px 16px 16px 3px', border: T.typingBorder, width: 56, alignItems: 'center' }}>
                                    {[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: T.typingDot, animation: `cwBounce 1.2s ease-in-out ${i * .15}s infinite` }} />)}
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* FOOTER */}
                    <div style={{ padding: '10px 12px 12px', borderTop: T.footerBorder, background: T.footerBg, flexShrink: 0 }}>
                        <div style={{
                            display: 'flex', gap: 8, alignItems: 'flex-end',
                            background: T.inputRowBg, borderRadius: 12,
                            border: focused ? T.inputRowFocus : T.inputRowBorder,
                            padding: '7px 8px 7px 12px', transition: 'border .2s',
                        }}>
                            <textarea
                                ref={textaRef}
                                rows={1}
                                className="cw-textarea"
                                value={input}
                                onFocus={() => setFocused(true)}
                                onBlur={() => setFocused(false)}
                                onChange={e => {
                                    setInput(e.target.value);
                                    e.target.style.height = 'auto';
                                    e.target.style.height = Math.min(e.target.scrollHeight, 90) + 'px';
                                }}
                                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                                disabled={loading}
                                placeholder="Écrivez un message..."
                                style={{
                                    flex: 1, background: 'transparent', border: 'none', outline: 'none',
                                    color: T.inputText, fontSize: 13.5, resize: 'none',
                                    maxHeight: 90, minHeight: 20, fontFamily: 'inherit', lineHeight: 1.5, paddingTop: 2,
                                }}
                            />
                            <button
                                className="cw-send"
                                disabled={!input.trim() || loading}
                                onClick={() => sendMessage()}
                                style={{
                                    background: input.trim() && !loading ? T.sendActiveBg : T.sendInactiveBg,
                                    border: 'none', borderRadius: 9,
                                    color: input.trim() && !loading ? T.sendActiveColor : T.sendInactiveColor,
                                    width: 32, height: 32, cursor: input.trim() && !loading ? 'pointer' : 'default',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all .2s', flexShrink: 0,
                                    boxShadow: input.trim() && !loading ? '0 3px 10px rgba(99,102,241,.35)' : 'none',
                                }}
                            >
                                {IC.send}
                            </button>
                        </div>
                        <div style={{ fontSize: 10, color: T.hintText, textAlign: 'center', marginTop: 5, letterSpacing: '.03em' }}>
                            Entrée pour envoyer · Maj+Entrée pour nouvelle ligne
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}