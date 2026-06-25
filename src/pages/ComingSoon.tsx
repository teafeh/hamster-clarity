import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { BsTwitterX, BsInstagram, BsTiktok, BsLinkedin } from "react-icons/bs";
import { supabase } from "@/lib/supabase";
import Hamsterlogo from "../../public/animations/Hamster.svg";
import Hamster from "../../public/animations/Hamster.svg";

// ─── Types ────────────────────────────────────────────────────────────────────

type WizardStep = 1 | 2 | 3 | 4;
type SubmitState = "idle" | "loading" | "success";

interface WaitlistData {
  email: string;
  businessType: string;
  referralSource: string;
}

interface Slide {
  lines: string[];
  accent?: number;
}

interface SelectOption {
  emoji: string;
  label: string;
}

const SOCIAL_LINKS = [
  {
    name: "X",
    url: "https://x.com/flowbyhamster",
    icon: <BsTwitterX size={18} />,
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/flowbyhamster",
    icon: <BsInstagram size={18} />,
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@hamster.web",
    icon: <BsTiktok size={18} />,
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/hamster-co/",
    icon: <BsLinkedin size={18} />,
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const SLIDES: Slide[] = [
  { lines: ["AI Operations", "for Service Businesses"], accent: 0 },
  { lines: ["Stop drowning in", "WhatsApp chaos."], accent: 1 },
  { lines: ["No more missed", "bookings or follow-ups."], accent: 1 },
  { lines: ["We're building", "something special."], accent: 1 },
];

const SLIDE_DURATION = 4200;
const TRANSITION_DURATION = 0.8;
const TOTAL_STEPS: WizardStep = 4;

const BUSINESS_TYPES: SelectOption[] = [
  { emoji: "💇", label: "Salon & Spa" },
  { emoji: "🏥", label: "Clinic" },
  { emoji: "⚖️", label: "Law Firm" },
  { emoji: "🏋️", label: "Gym" },
  { emoji: "🐶", label: "Pet Services" },
  { emoji: "🍽️", label: "Restaurant" },
  { emoji: "📸", label: "Creative Agency" },
  { emoji: "💼", label: "Consulting" },
  { emoji: "🏠", label: "Home Services" },
  { emoji: "✨", label: "Other" },
];

const REFERRAL_SOURCES: SelectOption[] = [
  { emoji: "𝕏", label: "Twitter / X" },
  { emoji: "💼", label: "LinkedIn" },
  { emoji: "📸", label: "Instagram" },
  { emoji: "🎵", label: "TikTok" },
  { emoji: "🤝", label: "Friend" },
  { emoji: "💬", label: "WhatsApp" },
  { emoji: "🔍", label: "Google" },
  { emoji: "📧", label: "Newsletter" },
  { emoji: "▶️", label: "YouTube" },
  { emoji: "🌐", label: "Community" },
  { emoji: "✨", label: "Other" },
];

const STEP_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─── Hamster SVG Mascot ───────────────────────────────────────────────────────

function HamsterMascot({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <ellipse cx="60" cy="95" rx="38" ry="36" fill="currentColor" />
      <ellipse cx="60" cy="62" rx="30" ry="28" fill="currentColor" />
      <ellipse cx="34" cy="66" rx="12" ry="10" fill="currentColor" opacity="0.7" />
      <ellipse cx="86" cy="66" rx="12" ry="10" fill="currentColor" opacity="0.7" />
      <ellipse cx="38" cy="38" rx="11" ry="10" fill="currentColor" />
      <ellipse cx="82" cy="38" rx="11" ry="10" fill="currentColor" />
      <ellipse cx="38" cy="38" rx="6" ry="5.5" fill="currentColor" opacity="0.45" />
      <ellipse cx="82" cy="38" rx="6" ry="5.5" fill="currentColor" opacity="0.45" />
      <circle cx="50" cy="60" r="4.5" fill="currentColor" opacity="0.15" />
      <circle cx="70" cy="60" r="4.5" fill="currentColor" opacity="0.15" />
      <circle cx="50" cy="60" r="2.5" fill="currentColor" opacity="0.7" />
      <circle cx="70" cy="60" r="2.5" fill="currentColor" opacity="0.7" />
      <ellipse cx="60" cy="70" rx="3" ry="2" fill="currentColor" opacity="0.5" />
      <ellipse cx="60" cy="100" rx="22" ry="20" fill="currentColor" opacity="0.25" />
      <ellipse cx="44" cy="128" rx="10" ry="7" fill="currentColor" />
      <ellipse cx="76" cy="128" rx="10" ry="7" fill="currentColor" />
      <ellipse cx="26" cy="98" rx="7" ry="5" fill="currentColor" />
      <ellipse cx="94" cy="98" rx="7" ry="5" fill="currentColor" />
    </svg>
  );
}

function BrandLogo({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <img
      src="/logo/flowbyhamster.png"
      alt="Flow Logo"
      className={className}
      style={{ objectFit: "contain", ...style }}
    />
  );
}

// ─── Background / Texture ─────────────────────────────────────────────────────

function GrainOverlay() {
  return (
    <div aria-hidden="true" style={{
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.032,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundRepeat: "repeat", backgroundSize: "128px 128px",
    }} />
  );
}

function BackgroundGradients() {
  return (
    <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: "-15%", left: "-10%", width: "65vw", height: "65vw", borderRadius: "50%", background: "radial-gradient(ellipse at center, rgba(184,92,56,0.08) 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", top: "15%", right: "-12%", width: "50vw", height: "50vw", borderRadius: "50%", background: "radial-gradient(ellipse at center, rgba(220,140,80,0.06) 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", bottom: "-10%", left: "25%", width: "60vw", height: "40vw", borderRadius: "50%", background: "radial-gradient(ellipse at center, rgba(184,92,56,0.04) 0%, transparent 70%)" }} />
    </div>
  );
}

// ─── Rotating headline ────────────────────────────────────────────────────────

function RotatingHeadline() {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCurrent((p) => (p + 1) % SLIDES.length), SLIDE_DURATION);
    return () => clearInterval(t);
  }, []);
  const slide = SLIDES[current];
  return (
    <div className="headline-container" style={{ position: "relative", minHeight: "72px", height: "8vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(2px)" }}
          transition={{ duration: TRANSITION_DURATION, ease: STEP_EASE }}
          style={{ textAlign: "center", width: "100%" }}
        >
          {slide.lines.map((line, i) => (
            <div key={i} style={{
              display: "block",
              fontSize: "clamp(1.25rem, 3.4vh, 2.4rem)",
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              fontFamily: "var(--font-serif)",
              color: i === slide.accent ? "#B85C38" : "#1C1A17",
              fontStyle: i === slide.accent ? "italic" : "normal",
            }}>{line}</div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Slide dots ───────────────────────────────────────────────────────────────

function SlideDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="slide-dots" style={{ display: "flex", gap: "6px", justifyContent: "center", marginTop: "8px" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ width: i === current ? "18px" : "6px", height: "6px", borderRadius: "99px", background: i === current ? "#B85C38" : "#E2DDD5", transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }} />
      ))}
    </div>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ step, total }: { step: WizardStep; total: number }) {
  const pct = ((step - 1) / (total - 1)) * 100;
  const labels = ["Email Address", "Business Vertical", "Referral Source", "Final Step"];
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.06em", color: "#A29C95", textTransform: "uppercase" }}>
          Step {step} of {total}
        </span>
        <span style={{ fontSize: "0.68rem", fontWeight: 500, color: "#6B6560" }}>{labels[step - 1]}</span>
      </div>
      <div style={{ height: "3px", background: "#EFEBE4", borderRadius: "99px", overflow: "hidden" }}>
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: STEP_EASE }}
          style={{ height: "100%", background: "#B85C38", borderRadius: "99px" }}
        />
      </div>
    </div>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function SpinnerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" style={{ animation: "spin 0.75s linear infinite" }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

// ─── Primary button ───────────────────────────────────────────────────────────

function PrimaryButton({ onClick, disabled, loading, children }: {
  onClick?: () => void; disabled?: boolean; loading?: boolean; children: React.ReactNode;
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { y: -1, boxShadow: "0 4px 12px rgba(28,26,23,0.08)" } : {}}
      whileTap={!disabled && !loading ? { scale: 0.99 } : {}}
      style={{
        width: "100%", padding: "12px 24px", borderRadius: "12px", border: "none",
        background: disabled ? "#E6E1DA" : "#1C1A17",
        color: disabled ? "#A29C95" : "#FDFCFA",
        fontSize: "0.88rem", fontWeight: 600,
        cursor: disabled || loading ? "not-allowed" : "pointer",
        fontFamily: "inherit", letterSpacing: "0.01em",
        transition: "background 0.2s, color 0.2s",
        display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
      }}
    >
      {loading ? <><SpinnerIcon /><span>Securing your spot…</span></> : children}
    </motion.button>
  );
}

// ─── Back button ──────────────────────────────────────────────────────────────

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: -2 }}
      style={{
        background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem",
        color: "#A29C95", fontFamily: "inherit", padding: "2px 0",
        display: "flex", alignItems: "center", gap: "4px", fontWeight: 500,
        marginBottom: "12px", transition: "color 0.2s",
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#1C1A17")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#A29C95")}
    >
      ← Back
    </motion.button>
  );
}

// ─── Step slide wrapper ───────────────────────────────────────────────────────

function StepSlide({ children, stepKey, direction }: { children: React.ReactNode; stepKey: number; direction: 1 | -1 }) {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={stepKey}
        custom={direction}
        initial={{ opacity: 0, x: direction * 20, filter: "blur(2px)" }}
        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, x: direction * -16, filter: "blur(1px)" }}
        transition={{ duration: 0.35, ease: STEP_EASE }}
        style={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Option card grid ─────────────────────────────────────────────────────────

function OptionGrid({ options, selected, onSelect }: {
  options: SelectOption[]; selected: string; onSelect: (label: string) => void;
}) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "6px",
      marginBottom: "14px",
      maxHeight: "155px",
      overflowY: "auto",
      paddingRight: "2px",
    }} className="custom-scrollbar">
      {options.map((opt) => {
        const isSelected = selected === opt.label;
        return (
          <motion.button
            key={opt.label}
            onClick={() => onSelect(opt.label)}
            whileHover={{ y: -1, background: isSelected ? "rgba(184,92,56,0.06)" : "#FDFCFA" }}
            whileTap={{ scale: 0.99 }}
            style={{
              padding: "10px 12px", borderRadius: "10px",
              border: isSelected ? "1.5px solid #B85C38" : "1.5px solid #EAE4DC",
              background: isSelected ? "rgba(184,92,56,0.04)" : "#FAFAF9",
              cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: "10px",
              textAlign: "left",
              transition: "border-color 0.15s, background 0.15s",
            }}
          >
            <span style={{ fontSize: "1.1rem", display: "inline-flex", flexShrink: 0 }}>{opt.emoji}</span>
            <span style={{ fontSize: "0.78rem", fontWeight: isSelected ? 600 : 500, color: isSelected ? "#B85C38" : "#2C2A27", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {opt.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

// ─── Confetti ─────────────────────────────────────────────────────────────────

function Confetti() {
  const pieces = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: ["#B85C38", "#C47A52", "#D4A373", "#1C1A17", "#E8DDD0"][i % 5],
    size: Math.random() * 6 + 4,
    delay: Math.random() * 0.6,
    duration: Math.random() * 1.2 + 1.4,
    rotate: Math.random() * 360,
  }));
  return (
    <div aria-hidden="true" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 50, overflow: "hidden" }}>
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0, scale: 1 }}
          animate={{ y: "110vh", opacity: [1, 1, 0], rotate: p.rotate, scale: [1, 0.8, 0.6] }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
          style={{ position: "absolute", top: 0, width: p.size, height: p.size * 0.55, background: p.color, borderRadius: "2px" }}
        />
      ))}
    </div>
  );
}

// ─── Success screen ───────────────────────────────────────────────────────────

function SuccessScreen({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: "Flow by Hamster",
      text: "I'm joining Flow, the AI operations platform for service businesses. Join me!",
      url: "https://useflow.ng",
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Setup bypass fallback structural integrity pass
    }
  };

  return (
    <>
      <Confetti />
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: STEP_EASE }}
        style={{ textAlign: "center", padding: "6px 0" }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 22, delay: 0.1 }}
          style={{ display: "flex", justifyContent: "center", marginBottom: "14px" }}
        >
          <img src={Hamster} alt="Flow Hamster" style={{ width: "56px", height: "56px", objectFit: "contain" }} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ fontSize: "1.45rem", fontWeight: 700, fontFamily: "var(--font-serif)", color: "#1C1A17", lineHeight: 1.25, marginBottom: "8px" }}
        >
          You're officially on the list.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ fontSize: "0.82rem", color: "#6B6560", lineHeight: 1.5, maxWidth: "340px", margin: "0 auto 12px" }}
        >
          We'll be sending occasional updates, early previews, and your invitation before public launch.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ fontSize: "0.78rem", color: "#A29C95", marginBottom: "20px" }}
        >
          Check your inbox at <strong style={{ color: "#1C1A17", fontWeight: 600 }}>{email}</strong> for your welcome verification details.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}
        >
          <PrimaryButton onClick={handleShare}>
            Share Flow with a friend →
          </PrimaryButton>

          <AnimatePresence>
            {copied && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ fontSize: "0.75rem", color: "#2E7D32", fontWeight: 500 }}
              >
                ✓ Access link copied to system clipboard
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  );
}

// ─── Wizard ───────────────────────────────────────────────────────────────────

function WaitlistWizard() {
  const [step, setStep] = useState<WizardStep>(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [data, setData] = useState<WaitlistData>({ email: "", businessType: "", referralSource: "" });
  const [emailError, setEmailError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
  const customInputRef = useRef<HTMLInputElement>(null);

  const advance = useCallback(() => { setDirection(1); setStep((s) => Math.min(s + 1, TOTAL_STEPS) as WizardStep); }, []);
  const goBack = useCallback(() => { setDirection(-1); setStep((s) => Math.max(s - 1, 1) as WizardStep); }, []);

  useEffect(() => { if (step === 1) setTimeout(() => emailRef.current?.focus(), 380); }, [step]);

  const handleSubmit = useCallback(async () => {
    try {
      setSubmitState("loading");
      setSubmitError("");

      const { data: response, error } =
        await supabase.functions.invoke(
          "join-waitlist",
          {
            body: {
              email: data.email,
              business_type: data.businessType,
              source: data.referralSource,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
          }
        );

      if (error) throw error;

      if (response?.success === false) {
        setSubmitError(response.message);
        setSubmitState("idle");
        return;
      }

      setSubmitState("success");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitState("idle");
    }
  }, [data]);

  if (submitState === "success") return <SuccessScreen email={data.email} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <ProgressBar step={step} total={TOTAL_STEPS} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", minHeight: 0 }}>
        <StepSlide stepKey={step} direction={direction}>

          {step === 1 && (
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 600, color: "#1C1A17", marginBottom: "4px", fontFamily: "var(--font-serif)" }}>
                What's your email?
              </h3>
              <p style={{ fontSize: "0.8rem", color: "#A29C95", marginBottom: "16px" }}>
                We'll only send updates worth reading.
              </p>
              <input
                ref={emailRef}
                type="email"
                value={data.email}
                onChange={(e) => { setData((d) => ({ ...d, email: e.target.value })); setEmailError(""); }}
                onKeyDown={(e) => { if (e.key === "Enter" && isEmailValid) { setEmailError(""); advance(); } }}
                placeholder="name@company.com"
                style={{
                  width: "100%", padding: "12px 16px", fontSize: "0.9rem", borderRadius: "10px",
                  border: emailError ? "1.5px solid #C0392B" : "1.5px solid #EAE4DC",
                  background: "#FAFAF9", color: "#1C1A17", outline: "none", fontFamily: "inherit",
                  boxSizing: "border-box", marginBottom: "12px",
                  transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#B85C38"; e.target.style.background = "#FDFCFA"; e.target.style.boxShadow = "0 0 0 3px rgba(184,92,56,0.08)"; }}
                onBlur={(e) => { e.target.style.borderColor = emailError ? "#C0392B" : "#EAE4DC"; e.target.style.background = "#FAFAF9"; e.target.style.boxShadow = "none"; }}
              />
              {emailError && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: "0.75rem", color: "#C0392B", marginBottom: "10px", paddingLeft: "2px" }}>
                  {emailError}
                </motion.p>
              )}
              <PrimaryButton disabled={!isEmailValid} onClick={() => { setEmailError(""); advance(); }}>
                Continue →
              </PrimaryButton>
            </div>
          )}

          {step === 2 && (
            <div>
              <BackButton onClick={goBack} />
              <h3 style={{ fontSize: "1.02rem", fontWeight: 600, color: "#1C1A17", marginBottom: "0.3rem", fontFamily: "'Georgia', serif" }}>
                What kind of business do you run?
              </h3>
              <p style={{ fontSize: "0.8rem", color: "#A39E98", marginBottom: "0.9rem" }}>
                We'll tailor Flow to your world.
              </p>

              {/* Safely check if 'Other' is picked or a custom text is actively being typed */}
              {data.businessType === "Other" || (data.businessType && !BUSINESS_TYPES.some(b => b.label === data.businessType)) ? (
                <div>
                  <input
                    ref={customInputRef}
                    type="text"
                    value={data.businessType === "Other" ? "" : data.businessType}
                    onChange={(e) => setData((d) => ({ ...d, businessType: e.target.value || "Other" }))}
                    onKeyDown={(e) => { if (e.key === "Enter" && data.businessType.trim() && data.businessType !== "Other") advance(); }}
                    placeholder="Specify your business type"
                    autoFocus
                    style={{
                      width: "100%", padding: "12px 16px", fontSize: "0.9rem", borderRadius: "10px",
                      border: "1.5px solid #EAE4DC", background: "#FAFAF9", color: "#1C1A17",
                      outline: "none", fontFamily: "inherit", boxSizing: "border-box", marginBottom: "12px",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "#B85C38"; e.target.style.boxShadow = "0 0 0 3px rgba(184,92,56,0.08)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#EAE4DC"; e.target.style.boxShadow = "none"; }}
                  />
                  <div style={{ display: "flex", gap: "8px" }}>
                    <PrimaryButton disabled={!data.businessType.trim() || data.businessType === "Other"} onClick={advance}>Continue →</PrimaryButton>
                    <button
                      onClick={() => setData((d) => ({ ...d, businessType: "" }))}
                      style={{ background: "none", border: "none", color: "#A29C95", fontSize: "0.8rem", cursor: "pointer", fontFamily: "inherit" }}
                    >
                      Change option
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <OptionGrid options={BUSINESS_TYPES} selected={data.businessType} onSelect={(v) => setData((d) => ({ ...d, businessType: v }))} />
                  <PrimaryButton disabled={!data.businessType} onClick={advance}>Continue →</PrimaryButton>
                </>
              )}
            </div>
          )}

          {step === 3 && (
            <div>
              <BackButton onClick={goBack} />
              <h3 style={{ fontSize: "1.02rem", fontWeight: 600, color: "#1C1A17", marginBottom: "0.3rem", fontFamily: "'Georgia', serif" }}>
                How did you hear about Flow?
              </h3>
              <p style={{ fontSize: "0.8rem", color: "#A39E98", marginBottom: "0.9rem" }}>
                Helps us understand where to show up.
              </p>

              {/* Safely check if 'Other' is picked or a custom text is actively being typed */}
              {data.referralSource === "Other" || (data.referralSource && !REFERRAL_SOURCES.some(r => r.label === data.referralSource)) ? (
                <div>
                  <input
                    ref={customInputRef}
                    type="text"
                    value={data.referralSource === "Other" ? "" : data.referralSource}
                    onChange={(e) => setData((d) => ({ ...d, referralSource: e.target.value || "Other" }))}
                    onKeyDown={(e) => { if (e.key === "Enter" && data.referralSource.trim() && data.referralSource !== "Other") advance(); }}
                    placeholder="Tell us where you found us"
                    autoFocus
                    style={{
                      width: "100%", padding: "12px 16px", fontSize: "0.9rem", borderRadius: "10px",
                      border: "1.5px solid #EAE4DC", background: "#FAFAF9", color: "#1C1A17",
                      outline: "none", fontFamily: "inherit", boxSizing: "border-box", marginBottom: "12px",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "#B85C38"; e.target.style.boxShadow = "0 0 0 3px rgba(184,92,56,0.08)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#EAE4DC"; e.target.style.boxShadow = "none"; }}
                  />
                  <div style={{ display: "flex", gap: "8px" }}>
                    <PrimaryButton disabled={!data.referralSource.trim() || data.referralSource === "Other"} onClick={advance}>Continue →</PrimaryButton>
                    <button
                      onClick={() => setData((d) => ({ ...d, referralSource: "" }))}
                      style={{ background: "none", border: "none", color: "#A29C95", fontSize: "0.8rem", cursor: "pointer", fontFamily: "inherit" }}
                    >
                      Change option
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <OptionGrid options={REFERRAL_SOURCES} selected={data.referralSource} onSelect={(v) => setData((d) => ({ ...d, referralSource: v }))} />
                  <PrimaryButton disabled={!data.referralSource} onClick={advance}>Continue →</PrimaryButton>
                </>
              )}
            </div>
          )}

          
          {step === 4 && (
            <div style={{ textAlign: "center" }}>
              <BackButton onClick={goBack} />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: STEP_EASE }}
                style={{ fontSize: "1.8rem", marginBottom: "6px", lineHeight: 1 }}
              >
                🚀
              </motion.div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, fontFamily: "var(--font-serif)", color: "#1C1A17", marginBottom: "4px" }}>
                You're almost in.
              </h3>
              <p style={{ fontSize: "0.82rem", color: "#6B6560", lineHeight: 1.45, maxWidth: "320px", margin: "0 auto 8px" }}>
                Join forward-thinking founders building the future of African service businesses.
              </p>
              <div style={{ display: "inline-flex", gap: "12px", fontSize: "0.72rem", fontWeight: 500, color: "#B85C38", background: "rgba(184,92,56,0.05)", padding: "4px 10px", borderRadius: "6px", marginBottom: "16px" }}>
                <span>{data.businessType}</span>
                <span style={{ color: "#E6E1DA" }}>|</span>
                <span>Via {data.referralSource}</span>
              </div>

              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    marginBottom: "10px", padding: "8px 12px", borderRadius: "8px",
                    background: "#FDF2F2", border: "1px solid #F5C2C7",
                    color: "#B42318", fontSize: "0.78rem", textAlign: "center",
                  }}
                >
                  {submitError}
                </motion.div>
              )}
              <PrimaryButton loading={submitState === "loading"} onClick={handleSubmit}>
                Join the Waitlist →
              </PrimaryButton>
              <p style={{ marginTop: "8px", fontSize: "0.7rem", color: "#A29C95" }}>
                Guaranteed zero spam infrastructure.
              </p>
            </div>
          )}

        </StepSlide>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ComingSoon() {
  const [slideIndex, setSlideIndex] = useState(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 28 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 28 });

  useEffect(() => {
    const t = setInterval(() => setSlideIndex((p) => (p + 1) % SLIDES.length), SLIDE_DURATION);
    return () => clearInterval(t);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    mouseX.set((e.clientX - cx) / cx);
    mouseY.set((e.clientY - cy) / cy);
  }, [mouseX, mouseY]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;0,6..72,700;1,6..72,400&display=swap');
        
        :root {
          --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          --font-serif: 'Newsreader', Georgia, serif;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; overflow: hidden; }
        
        body { 
          font-family: var(--font-sans); 
          background: #F8F5F0; 
          color: #1C1A17; 
          -webkit-font-smoothing: antialiased; 
          -moz-osx-font-smoothing: grayscale;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes floatSlow { 0%, 100% { transform: translateY(0px) rotate(-1deg); } 50% { transform: translateY(-8px) rotate(1deg); } }
        
        ::selection { background: rgba(184,92,56,0.12); color: #B85C38; }
        input::placeholder { color: #A29C95; }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E6E1DA;
          border-radius: 99px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #D5CFC6;
        }

        /* Responsive UI Adjustments based on mobile canvas review */
        @media (max-width: 600px) {
          header {
            padding: 16px 20px !important;
          }
          main {
            padding: 0 20px !important;
          }
          .main-stack {
            gap: 10px !important;
          }
          .badge-container {
            transform: scale(0.9);
          }
          .headline-container {
            height: auto !important;
            min-height: 56px !important;
            margin-bottom: 4px;
          }
          .slide-dots {
            margin-top: 4px !important;
          }
          .subtext-para {
            font-size: 0.8rem !important;
            line-height: 1.4 !important;
            margin-bottom: 2px !important;
          }
          .wizard-card-box {
            padding: 18px 16px !important;
            min-height: auto !important;
          }
          .floating-mascot-bottom {
            display: none !important;
          }
          footer {
            padding: 16px 20px !important;
          }
          .footer-text-stack {
            gap: 8px !important;
          }
          .footer-divider {
            height: 8px !important;
          }
        }

        @media (prefers-reduced-motion: reduce) { * { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; } }
      `}</style>

      <div onMouseMove={handleMouseMove} style={{ height: "100vh", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
        <BackgroundGradients />
        <GrainOverlay />

        {/* Dynamic Background Watermark */}
        <motion.div aria-hidden="true" style={{ position: "fixed", right: "-4vw", bottom: "-4vw", width: "32vw", maxWidth: "480px", opacity: 0.035, pointerEvents: "none", zIndex: 0, color: "#5A3020", x: springX, y: springY }}>
          <HamsterMascot />
        </motion.div>

        {/* ── Header ── */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            flexShrink: 0,
            // Reduced horizontal padding to 20px so it breathes beautifully on mobile
            padding: "20px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            zIndex: 10,
            // Optional: sets a max-width for desktop so it doesn't stretch infinitely
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto"
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* Slightly tuned down the width to 115px so it fits gracefully on mobile devices */}
            <BrandLogo style={{ width: "115px", height: "auto" }} />
          </div>

          <a
            href="https://useflow.ng"
            onClick={(e) => e.preventDefault()}
            style={{
              fontSize: "0.75rem", // Marginally smaller for tighter mobile typography
              fontWeight: 500,
              color: "#A29C95",
              textDecoration: "none",
              letterSpacing: "0.01em",
              cursor: "not-allowed",
              pointerEvents: "none"
            }}
          >
            useflow.ng
          </a>
        </motion.header>

        {/* ── Main Viewport Wrapper ── */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 40px", position: "relative", zIndex: 10, textAlign: "center", minHeight: 0, overflow: "hidden" }}>

          {/* Main layout container stack */}
          <div className="main-stack" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", width: "100%", maxWidth: "460px" }}>

            {/* Badge Element */}
            <motion.div className="badge-container" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(184,92,56,0.06)", border: "1px solid rgba(184,92,56,0.15)", borderRadius: "99px", padding: "4px 12px" }}>
                <span style={{ fontSize: "0.7rem" }}>🚀</span>
                <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.08em", color: "#B85C38", textTransform: "uppercase" }}>Flow by Hamster</span>
              </div>
            </motion.div>

            {/* Headline Block */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.15 }} style={{ width: "100%" }}>
              <RotatingHeadline />
              <SlideDots current={slideIndex} total={SLIDES.length} />
            </motion.div>

            {/* Secondary Copy Text */}
            <motion.p
              className="subtext-para"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              style={{ fontSize: "0.88rem", color: "#6B6560", lineHeight: 1.5, maxWidth: "380px" }}
            >
              Join founders and service business owners gaining early access to the future of operations.
            </motion.p>

            {/* Core Card Container */}
            <motion.div
              className="wizard-card-box"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              style={{
                width: "100%",
                background: "#FDFCFA",
                borderRadius: "16px",
                border: "1px solid rgba(180,165,150,0.16)",
                padding: "24px",
                textAlign: "left",
                boxShadow: "0 10px 35px rgba(40,30,20,0.04), 0 1px 3px rgba(0,0,0,0.01)",
                minHeight: "310px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <WaitlistWizard />
            </motion.div>

            {/* Passive Mascot Accent (Hidden on small mobile devices to maximize space) */}
            <motion.div
              className="floating-mascot-bottom"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              aria-hidden="true"
              style={{ color: "#C47A52", width: "32px", animation: "floatSlow 4s ease-in-out infinite", opacity: 0.65, marginTop: "4px" }}
            >
              <HamsterMascot />
            </motion.div>

          </div>
        </main>

        {/* ── Footer ── */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ flexShrink: 0, padding: "24px 40px", borderTop: "1px solid rgba(180,165,150,0.12)", position: "relative", zIndex: 10 }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: "1200px", margin: "0 auto" }}>
            <div className="footer-text-stack" style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "#A29C95" }}>Launching soon</span>
              <span className="footer-divider" style={{ width: "1px", height: "10px", background: "#E6E1DA" }} />
              <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "#A29C95" }}>Built in Nigeria 🇳🇬</span>
            </div>

            <nav aria-label="Footer social navigation links">
              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#969088",
                      transition: "color .2s cubic-bezier(0.16, 1, 0.3, 1)",
                      display: "flex",
                      alignItems: "center",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#B85C38"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "#969088"; }}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </nav>
          </div>
        </motion.footer>
      </div>
    </>
  );
}