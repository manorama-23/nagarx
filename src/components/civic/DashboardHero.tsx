import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useLanguage, type Language } from "@/lib/language";


function NagarXLogo() {
  return (
    <svg
      viewBox="0 0 200 150"
      className="h-[96px] w-[128px] shrink-0 drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="nl_outerArc" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="45%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>
        <linearGradient id="nl_outerArcBlue" x1="0.8" y1="0.1" x2="0.2" y2="0.9">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id="nl_pinGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="25%" stopColor="#FBBF24" />
          <stop offset="60%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="nl_domeGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#BFDBFE" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="nl_colGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="60%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <linearGradient id="nl_skyscraperLP" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="35%" stopColor="#F59E0B" />
          <stop offset="65%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
        <linearGradient id="nl_skyscraperBlue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#67E8F9" />
          <stop offset="40%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="nl_skyscraperRP" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F9A8D4" />
          <stop offset="45%" stopColor="#D946EF" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <radialGradient id="nl_tree1" cx="40%" cy="25%" r="75%">
          <stop offset="0%" stopColor="#86EFAC" />
          <stop offset="40%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#15803D" />
        </radialGradient>
        <radialGradient id="nl_tree2" cx="40%" cy="25%" r="75%">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="45%" stopColor="#16A34A" />
          <stop offset="100%" stopColor="#14532D" />
        </radialGradient>
        <linearGradient id="nl_handGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="40%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>
        <linearGradient id="nl_roadGold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <linearGradient id="nl_chatGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>
        <linearGradient id="nl_peopleBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7DD3FC" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        <filter id="nl_pinGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="1.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* === Outer Arc Ring (Gold to Blue) === */}
      <path
        d="M 26 118 Q 10 72 38 32 Q 74 -2 114 4 Q 156 10 186 56 Q 202 88 196 124"
        stroke="url(#nl_outerArc)"
        strokeWidth="6.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 120 5 Q 160 12 188 58 Q 202 88 196 124"
        stroke="url(#nl_outerArcBlue)"
        strokeWidth="6.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* === People / Group Icon (Left) === */}
      <g transform="translate(18, 70)">
        <ellipse cx="20" cy="24" rx="22" ry="14" fill="#FCD34D" opacity="0.4" />
        {/* Left person */}
        <circle cx="8" cy="4" r="4.2" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="0.4" />
        <path d="M 2 12 Q 2 7 8 7 Q 14 7 14 12 L 14 28 L 2 28 Z" fill="url(#nl_peopleBody)" />
        {/* Center person (larger) */}
        <circle cx="22" cy="0" r="5.5" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="0.4" />
        <path d="M 13 10 Q 13 4 22 4 Q 31 4 31 10 L 31 30 L 13 30 Z" fill="url(#nl_peopleBody)" />
        <ellipse cx="22" cy="9" rx="3" ry="1.5" fill="#BFDBFE" opacity="0.8" />
        {/* Right person */}
        <circle cx="36" cy="4" r="4.2" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="0.4" />
        <path d="M 30 12 Q 30 7 36 7 Q 42 7 42 12 L 42 28 L 30 28 Z" fill="url(#nl_peopleBody)" />
      </g>

      {/* === Chat Bubble (Right) === */}
      <g transform="translate(158, 76)">
        <path
          d="M 2 4 Q 2 0 6 0 L 30 0 Q 34 0 34 4 L 34 22 Q 34 26 30 26 L 14 26 L 8 32 L 8 26 L 6 26 Q 2 26 2 22 Z"
          fill="url(#nl_chatGrad)"
          opacity="0.92"
          stroke="#0284C7"
          strokeWidth="0.8"
        />
        <circle cx="11" cy="13" r="1.8" fill="#FFFFFF" opacity="0.95" />
        <circle cx="18" cy="13" r="1.8" fill="#FFFFFF" opacity="0.95" />
        <circle cx="25" cy="13" r="1.8" fill="#FFFFFF" opacity="0.95" />
      </g>

      {/* === Skyscrapers (Background layer) === */}
      {/* Left: Yellow/Purple gradient building */}
      <g transform="translate(46, 52)">
        <path d="M 0 44 L 0 4 L 2 2 L 18 0 L 20 2 L 20 44 Z" fill="url(#nl_skyscraperLP)" stroke="#7C3AED" strokeWidth="0.3" />
        {[0, 1, 2, 3, 4, 5].map((r) =>
          [0, 1, 2].map((c) => (
            <rect
              key={`lp-${r}-${c}`}
              x={3 + c * 5}
              y={7 + r * 6.5}
              width="3"
              height="4"
              rx="0.5"
              fill="#FEF3C7"
              opacity={0.85}
            />
          ))
        )}
      </g>
      {/* Left: Tall narrow blue skyscraper */}
      <g transform="translate(68, 40)">
        <rect x="0" y="0" width="7" height="64" rx="1" fill="url(#nl_skyscraperBlue)" stroke="#1E40AF" strokeWidth="0.3" />
        <rect x="1" y="1" width="5" height="62" rx="0.8" fill="#38BDF8" opacity="0.3" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((r) => (
          <rect
            key={`blu-${r}`}
            x="1.5"
            y={4 + r * 7.2}
            width="4"
            height="4.5"
            rx="0.5"
            fill="#E0F2FE"
            opacity="0.9"
          />
        ))}
        {/* Top accent */}
        <path d="M 0 0 L 3.5 -4 L 7 0 Z" fill="#F59E0B" />
      </g>
      {/* Center-left: Thicker blue building */}
      <g transform="translate(78, 48)">
        <rect x="0" y="0" width="10" height="56" rx="1.5" fill="url(#nl_skyscraperBlue)" stroke="#1E40AF" strokeWidth="0.3" />
        <path d="M 0 0 L 5 -5 L 10 0 Z" fill="#0284C7" />
        {[0, 1, 2, 3, 4, 5].map((r) =>
          [0, 1].map((c) => (
            <rect
              key={`bblu-${r}-${c}`}
              x={1.5 + c * 4}
              y={4 + r * 8}
              width="3"
              height="5"
              rx="0.5"
              fill="#DBEAFE"
              opacity="0.88"
            />
          ))
        )}
      </g>

      {/* Right: Purple/Pink building */}
      <g transform="translate(128, 54)">
        <rect x="0" y="0" width="20" height="58" rx="2" fill="url(#nl_skyscraperRP)" stroke="#7E22CE" strokeWidth="0.3" />
        <path d="M 0 0 L 10 -5 L 20 0 Z" fill="#C026D3" />
        {[0, 1, 2, 3, 4, 5, 6].map((r) =>
          [0, 1, 2].map((c) => (
            <rect
              key={`rp-${r}-${c}`}
              x={2.5 + c * 5}
              y={5 + r * 7.3}
              width="3.5"
              height="4.5"
              rx="0.5"
              fill="#FDF4FF"
              opacity="0.9"
            />
          ))
        )}
      </g>
      {/* Right: Tall blue skyscraper */}
      <g transform="translate(151, 48)">
        <rect x="0" y="0" width="9" height="64" rx="1.5" fill="url(#nl_skyscraperBlue)" stroke="#1E40AF" strokeWidth="0.3" />
        <rect x="1" y="1" width="7" height="62" rx="1" fill="#67E8F9" opacity="0.25" />
        <path d="M 0 0 L 4.5 -5 L 9 0 Z" fill="#0EA5E9" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((r) =>
          [0, 1].map((c) => (
            <rect
              key={`rblu-${r}-${c}`}
              x={1.2 + c * 3.6}
              y={4 + r * 7.2}
              width="3"
              height="4.5"
              rx="0.5"
              fill="#E0F2FE"
              opacity="0.88"
            />
          ))
        )}
      </g>

      {/* === Central Domed Heritage Building === */}
      <g transform="translate(82, 44)">
        {/* Flagpole + Flag */}
        <g transform="translate(18, -16)">
          <rect x="0" y="0" width="1.6" height="18" rx="0.8" fill="#F1F5F9" />
          <rect x="-1" y="16" width="3.6" height="2" rx="1" fill="#94A3B8" />
          <g transform="translate(1.6, 0.5)">
            <path d="M 0 0 C 5 0.5, 10 0, 14 0.5 L 14 3.8 C 10 3.3, 5 3.8, 0 3.3 Z" fill="#FF9933" />
            <path d="M 0 3.3 C 5 3.8, 10 3.3, 14 3.8 L 14 7 C 10 6.6, 5 7, 0 6.6 Z" fill="#FFFFFF" />
            <path d="M 0 6.6 C 5 7, 10 6.6, 14 7 L 14 10.2 C 10 9.8, 5 10.2, 0 9.8 Z" fill="#138808" />
            <g transform="translate(7, 5)">
              <circle cx="0" cy="0" r="1.3" fill="none" stroke="#000080" strokeWidth="0.35" />
              {Array.from({ length: 12 }).map((_, i) => {
                const a = (i * Math.PI * 2) / 12;
                return (
                  <line
                    key={`ch-${i}`}
                    x1={Math.cos(a) * 0.4}
                    y1={Math.sin(a) * 0.4}
                    x2={Math.cos(a) * 1.2}
                    y2={Math.sin(a) * 1.2}
                    stroke="#000080"
                    strokeWidth="0.22"
                  />
                );
              })}
            </g>
          </g>
        </g>

        {/* Base / Steps */}
        <rect x="-2" y="58" width="40" height="4" rx="1" fill="#CBD5E1" />
        <rect x="0" y="55" width="36" height="4" rx="1" fill="#E2E8F0" />

        {/* Wings (side sections) */}
        <rect x="-6" y="34" width="12" height="24" rx="1.2" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="0.4" />
        <rect x="-6" y="32" width="12" height="3" rx="1" fill="#1E40AF" />
        <rect x="-3" y="42" width="4" height="14" rx="0.6" fill="#1E40AF" opacity="0.55" />
        <rect x="1" y="42" width="4" height="14" rx="0.6" fill="#1E40AF" opacity="0.55" />

        <rect x="30" y="34" width="12" height="24" rx="1.2" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="0.4" />
        <rect x="30" y="32" width="12" height="3" rx="1" fill="#1E40AF" />
        <rect x="33" y="42" width="4" height="14" rx="0.6" fill="#1E40AF" opacity="0.55" />
        <rect x="37" y="42" width="4" height="14" rx="0.6" fill="#1E40AF" opacity="0.55" />

        {/* Main building body */}
        <rect x="4" y="24" width="28" height="33" rx="1.5" fill="#FFFFFF" stroke="#60A5FA" strokeWidth="0.5" />

        {/* Columns */}
        {[0, 1, 2, 3, 4].map((i) => {
          const cx = 6 + i * 5.6;
          return (
            <g key={`col-${i}`}>
              <rect x={cx - 1.6} y="26" width="3.2" height="30" rx="0.8" fill="url(#nl_colGrad)" />
              <rect x={cx - 2} y="24" width="4" height="2.8" rx="0.8" fill="#F59E0B" />
              <rect x={cx - 2} y="54" width="4" height="2.8" rx="0.8" fill="#F59E0B" />
            </g>
          );
        })}

        {/* Architrave / Entablature above columns */}
        <rect x="3" y="21" width="30" height="4" rx="1" fill="#F59E0B" />
        <rect x="3" y="20.5" width="30" height="1" fill="#FCD34D" />

        {/* Dome */}
        <path
          d="M 6 21 Q 6 4 18 2 Q 30 4 30 21 Z"
          fill="url(#nl_domeGrad)"
          stroke="#3B82F6"
          strokeWidth="0.6"
        />
        <path
          d="M 10 21 Q 10 10 18 8.5 Q 26 10 26 21"
          fill="#FFFFFF"
          opacity="0.55"
        />
        {/* Dome top / finial */}
        <circle cx="18" cy="3" r="1.6" fill="#FCD34D" stroke="#B45309" strokeWidth="0.3" />
        <rect x="17.4" y="4.5" width="1.2" height="3" rx="0.5" fill="#F59E0B" />
        {/* Flagpole base */}
        <rect x="17.6" y="7" width="0.8" height="1" fill="#94A3B8" />
      </g>

      {/* === Trees (on both sides of building) === */}
      <g transform="translate(70, 86)">
        <rect x="3.5" y="16" width="2.5" height="10" rx="1.2" fill="#78350F" />
        <ellipse cx="4.7" cy="12" rx="7" ry="8" fill="url(#nl_tree1)" />
        <ellipse cx="0.5" cy="16" rx="4.5" ry="5" fill="url(#nl_tree2)" opacity="0.95" />
      </g>
      <g transform="translate(60, 90)">
        <rect x="2.8" y="13" width="2" height="8" rx="1" fill="#78350F" />
        <ellipse cx="3.8" cy="10" rx="5.5" ry="6" fill="url(#nl_tree2)" />
      </g>
      <g transform="translate(122, 86)">
        <rect x="3.5" y="16" width="2.5" height="10" rx="1.2" fill="#78350F" />
        <ellipse cx="4.7" cy="12" rx="7" ry="8" fill="url(#nl_tree1)" />
        <ellipse cx="9.5" cy="16" rx="4.5" ry="5" fill="url(#nl_tree2)" opacity="0.95" />
      </g>
      <g transform="translate(134, 90)">
        <rect x="2.8" y="13" width="2" height="8" rx="1" fill="#78350F" />
        <ellipse cx="3.8" cy="10" rx="5.5" ry="6" fill="url(#nl_tree2)" />
      </g>
      <g transform="translate(142, 94)">
        <rect x="2.2" y="10" width="1.8" height="6" rx="0.9" fill="#78350F" />
        <ellipse cx="3.1" cy="8" rx="4.2" ry="4.8" fill="url(#nl_tree2)" opacity="0.95" />
      </g>

      {/* === Hand / Palm (Bottom center) === */}
      <path
        d="M 30 130 Q 40 112 70 114 Q 88 114 96 120 Q 108 112 118 118 Q 132 118 140 128 Q 150 140 120 142 Q 80 146 50 142 Q 28 140 30 130 Z"
        fill="url(#nl_handGrad)"
        stroke="#0284C7"
        strokeWidth="0.6"
        opacity="0.96"
      />
      <path
        d="M 36 130 Q 44 117 68 119 Q 84 119 92 124 Q 102 117 112 122 Q 124 122 132 130"
        stroke="#67E8F9"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />

      {/* === Road converging to building === */}
      <g opacity="0.95">
        {/* Left road ribbon */}
        <path
          d="M 34 130 L 70 98 L 78 100 L 74 104 L 42 134 Z"
          fill="url(#nl_roadGold)"
          stroke="#B45309"
          strokeWidth="0.3"
        />
        <path
          d="M 40 128 L 72 102 L 76 104 L 72 108 L 46 132 Z"
          fill="#FFFFFF"
          opacity="0.4"
        />
        {/* Center road ribbon */}
        <path
          d="M 80 98 L 90 96 L 100 128 L 88 130 Z"
          fill="url(#nl_roadGold)"
          stroke="#B45309"
          strokeWidth="0.3"
        />
        {/* Right road ribbon */}
        <path
          d="M 100 98 L 112 102 L 164 130 L 154 134 L 112 106 Z"
          fill="url(#nl_roadGold)"
          stroke="#B45309"
          strokeWidth="0.3"
        />
        <path
          d="M 102 102 L 114 106 L 158 130 L 150 132 L 110 110 Z"
          fill="#FFFFFF"
          opacity="0.35"
        />
      </g>

      {/* === Location Pin (top center) with Ripple Rings === */}
      {/* Ripple rings */}
      <g transform="translate(100, 16)" opacity="0.9">
        <ellipse cx="0" cy="18" rx="30" ry="5.5" fill="none" stroke="#38BDF8" strokeWidth="1.2" />
        <ellipse cx="0" cy="18" rx="22" ry="4" fill="none" stroke="#0EA5E9" strokeWidth="1" />
        <ellipse cx="0" cy="18" rx="14" ry="2.6" fill="none" stroke="#38BDF8" strokeWidth="0.8" />
        {/* Ripple highlight */}
        <ellipse cx="0" cy="18" rx="30" ry="5.5" fill="#38BDF8" opacity="0.06" />
      </g>

      {/* Pin itself */}
      <g transform="translate(100, 6)" filter="url(#nl_pinGlow)">
        <path
          d="M 0 -2 C -8.5 -2 -14 3.5 -14 10 C -14 16.5 -8 23 0 27 C 8 23 14 16.5 14 10 C 14 3.5 8.5 -2 0 -2 Z"
          fill="url(#nl_pinGrad)"
          stroke="#B45309"
          strokeWidth="0.5"
        />
        {/* Pin inner highlight */}
        <path
          d="M -10 7 C -10 2 -5 -2 0 -2 C -4 2 -8 5 -10 7 Z"
          fill="#FEF9C3"
          opacity="0.6"
        />
        {/* Pin hole */}
        <circle cx="0" cy="9" r="4.8" fill="#FFFFFF" opacity="0.98" />
        <circle cx="0" cy="9" r="3.4" fill="#1E40AF" />
        <circle cx="0" cy="9" r="2" fill="#60A5FA" />
        <circle cx="-0.8" cy="8.2" r="0.7" fill="#BFDBFE" opacity="0.95" />
      </g>
    </svg>
  );
}

function CityIllustration() {
  return (
    <svg
      viewBox="0 0 720 240"
      className="h-full w-full object-cover object-right pointer-events-none select-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMaxYMid meet"
    >
      <defs>
        <linearGradient id="skyGrad2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0640a3" stopOpacity="0" />
          <stop offset="40%" stopColor="#1e90ff" stopOpacity="0.18" />
          <stop offset="70%" stopColor="#60A5FA" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="towerG2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#93C5FD" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.92" />
        </linearGradient>
        <linearGradient id="bldBody2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#BFDBFE" />
        </linearGradient>
        <linearGradient id="bldRoof2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <radialGradient id="treeCanopy" cx="40%" cy="25%" r="75%">
          <stop offset="0%" stopColor="#86EFAC" />
          <stop offset="40%" stopColor="#4ADE80" />
          <stop offset="75%" stopColor="#16A34A" />
          <stop offset="100%" stopColor="#14532D" />
        </radialGradient>
        <radialGradient id="treeCanopy2" cx="40%" cy="25%" r="75%">
          <stop offset="0%" stopColor="#BBF7D0" />
          <stop offset="40%" stopColor="#4ADE80" />
          <stop offset="80%" stopColor="#15803D" />
          <stop offset="100%" stopColor="#14532D" />
        </radialGradient>
        <linearGradient id="waterG2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7DD3FC" />
          <stop offset="40%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>
        <linearGradient id="cloudG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#DBEAFE" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="flagSaffron" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFB366" />
          <stop offset="100%" stopColor="#FF9933" />
        </linearGradient>
        <linearGradient id="flagGreen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#138808" />
        </linearGradient>
      </defs>

      {/* Sky gradient wash - lighter toward right */}
      <rect x="0" y="0" width="720" height="240" fill="url(#skyGrad2)" />

      {/* Clouds */}
      <g transform="translate(380, 34)" fill="url(#cloudG)">
        <ellipse cx="0" cy="10" rx="26" ry="8" />
        <ellipse cx="18" cy="6" rx="20" ry="7" />
        <ellipse cx="-18" cy="8" rx="18" ry="6" />
      </g>
      <g transform="translate(520, 28)" fill="url(#cloudG)">
        <ellipse cx="0" cy="10" rx="22" ry="7" />
        <ellipse cx="16" cy="7" rx="18" ry="6" />
        <ellipse cx="-14" cy="9" rx="15" ry="5" />
      </g>

      {/* === Background skyline - distant towers === */}
      <g opacity="0.55">
        <rect x="120" y="108" width="30" height="96" rx="2" fill="url(#towerG2)" />
        <rect x="158" y="92" width="34" height="112" rx="2" fill="url(#towerG2)" />
        <rect x="200" y="114" width="28" height="90" rx="2" fill="url(#towerG2)" />
        <rect x="236" y="78" width="40" height="126" rx="2" fill="url(#towerG2)" />
        <rect x="284" y="96" width="32" height="108" rx="2" fill="url(#towerG2)" />
        <rect x="324" y="118" width="26" height="86" rx="2" fill="url(#towerG2)" />
        <rect x="358" y="100" width="36" height="104" rx="2" fill="url(#towerG2)" />
        <rect x="402" y="122" width="24" height="82" rx="2" fill="url(#towerG2)" />
      </g>

      {/* === Heritage Building + Flag === */}
      {/* Flagpole base on top of central heritage building */}
      <g transform="translate(548, 14)">
        <rect x="0" y="0" width="3" height="124" rx="1.5" fill="#F1F5F9" />
        <rect x="-2" y="122" width="7" height="4" rx="1" fill="#CBD5E1" />
        {/* Flag */}
        <g transform="translate(3, 2)">
          <path
            d="M 0 0 C 18 2, 38 0, 56 2 L 56 14 C 38 12, 18 14, 0 12 Z"
            fill="url(#flagSaffron)"
          />
          <path
            d="M 0 12 C 18 14, 38 12, 56 14 L 56 26 C 38 24, 18 26, 0 24 Z"
            fill="#FFFFFF"
          />
          <path
            d="M 0 24 C 18 26, 38 24, 56 26 L 56 38 C 38 36, 18 38, 0 36 Z"
            fill="url(#flagGreen)"
          />
          {/* Ashoka Chakra */}
          <g transform="translate(28, 19)">
            <circle cx="0" cy="0" r="5.5" fill="none" stroke="#000080" strokeWidth="0.8" />
            <circle cx="0" cy="0" r="1.2" fill="#000080" />
            {Array.from({ length: 24 }).map((_, i) => {
              const a = (i * Math.PI * 2) / 24;
              return (
                <line
                  key={`spoke-${i}`}
                  x1={Math.cos(a) * 1.6}
                  y1={Math.sin(a) * 1.6}
                  x2={Math.cos(a) * 5.2}
                  y2={Math.sin(a) * 5.2}
                  stroke="#000080"
                  strokeWidth="0.45"
                />
              );
            })}
          </g>
        </g>
      </g>

      {/* Heritage Building (white with arches) */}
      <g>
        {/* Base platform / steps */}
        <rect x="456" y="204" width="240" height="10" rx="2" fill="#E2E8F0" opacity="0.9" />
        {/* Main body */}
        <rect x="468" y="126" width="216" height="80" rx="4" fill="url(#bldBody2)" stroke="#94A3B8" strokeWidth="0.5" />
        {/* Upper smaller block (behind flag) */}
        <rect x="528" y="102" width="96" height="30" rx="3" fill="url(#bldBody2)" stroke="#94A3B8" strokeWidth="0.5" />
        {/* Roof */}
        <rect x="464" y="122" width="224" height="6" rx="2" fill="url(#bldRoof2)" />
        <rect x="524" y="98" width="104" height="6" rx="2" fill="url(#bldRoof2)" />
        {/* Roof balustrade */}
        <g>
          {Array.from({ length: 14 }).map((_, i) => (
            <rect
              key={`bal1-${i}`}
              x={468 + i * 15.4}
              y={116}
              width="3"
              height="8"
              rx="1"
              fill="#CBD5E1"
            />
          ))}
        </g>
        {/* Arches */}
        <g>
          {Array.from({ length: 5 }).map((_, i) => {
            const cx = 496 + i * 42;
            return (
              <g key={`arch2-${i}`}>
                <path
                  d={`M ${cx - 14} 204 L ${cx - 14} 162 Q ${cx} 144 ${cx + 14} 162 L ${cx + 14} 204 Z`}
                  fill="#1E3A8A"
                  opacity="0.55"
                />
                {/* Arch highlights */}
                <path
                  d={`M ${cx - 11} 204 L ${cx - 11} 165 Q ${cx} 149 ${cx + 11} 165 L ${cx + 11} 204 Z`}
                  fill="#3B82F6"
                  opacity="0.22"
                />
                {/* Columns */}
                <rect x={cx - 18} y={134} width="5" height="72" rx="2" fill="#F8FAFC" opacity="0.95" />
                <rect x={cx + 13} y={134} width="5" height="72" rx="2" fill="#F8FAFC" opacity="0.95" />
                {/* Column capitals */}
                <rect x={cx - 20} y={130} width="9" height="5" rx="1.5" fill="#E2E8F0" />
                <rect x={cx + 11} y={130} width="9" height="5" rx="1.5" fill="#E2E8F0" />
              </g>
            );
          })}
        </g>
        {/* Upper block windows */}
        <g>
          {Array.from({ length: 6 }).map((_, i) => (
            <rect
              key={`upw-${i}`}
              x={538 + i * 14}
              y={112}
              width="8"
              height="14"
              rx="1.5"
              fill="#1E40AF"
              opacity="0.5"
            />
          ))}
        </g>
        {/* Side wings windows */}
        <g>
          {[0, 1].map((row) =>
            [0, 1, 2].map((col) => (
              <rect
                key={`sw-${row}-${col}`}
                x={476 + col * 14}
                y={140 + row * 22}
                width="8"
                height="14"
                rx="1.5"
                fill="#1E40AF"
                opacity="0.45"
              />
            ))
          )}
          {[0, 1].map((row) =>
            [0, 1, 2].map((col) => (
              <rect
                key={`sw2-${row}-${col}`}
                x={648 + col * 14}
                y={140 + row * 22}
                width="8"
                height="14"
                rx="1.5"
                fill="#1E40AF"
                opacity="0.45"
              />
            ))
          )}
        </g>
      </g>

      {/* === Trees === */}
      {/* Small trees in front-left of heritage building */}
      <g transform="translate(430, 158)">
        <rect x="6" y="34" width="4" height="20" rx="1.5" fill="#78350F" />
        <ellipse cx="8" cy="26" rx="18" ry="20" fill="url(#treeCanopy)" />
        <ellipse cx="2" cy="32" rx="11" ry="12" fill="url(#treeCanopy2)" opacity="0.9" />
        <ellipse cx="15" cy="30" rx="10" ry="11" fill="url(#treeCanopy2)" opacity="0.85" />
      </g>
      <g transform="translate(394, 168)">
        <rect x="5" y="30" width="3.5" height="18" rx="1.5" fill="#78350F" />
        <ellipse cx="6.5" cy="24" rx="15" ry="17" fill="url(#treeCanopy)" />
        <ellipse cx="1" cy="28" rx="9" ry="10" fill="url(#treeCanopy2)" opacity="0.9" />
      </g>
      <g transform="translate(362, 174)">
        <rect x="4" y="28" width="3" height="16" rx="1.5" fill="#78350F" />
        <ellipse cx="5.5" cy="22" rx="13" ry="14" fill="url(#treeCanopy)" />
      </g>
      <g transform="translate(334, 180)">
        <rect x="3.5" y="24" width="3" height="14" rx="1.5" fill="#78350F" />
        <ellipse cx="5" cy="19" rx="11" ry="12" fill="url(#treeCanopy)" opacity="0.92" />
      </g>
      <g transform="translate(308, 186)">
        <rect x="3" y="20" width="2.5" height="12" rx="1.2" fill="#78350F" />
        <ellipse cx="4.2" cy="16" rx="9" ry="10" fill="url(#treeCanopy)" opacity="0.88" />
      </g>

      {/* Right side trees - bigger, closer */}
      <g transform="translate(690, 136)">
        <rect x="9" y="54" width="6" height="38" rx="2.5" fill="#78350F" />
        <ellipse cx="12" cy="42" rx="30" ry="34" fill="url(#treeCanopy)" />
        <ellipse cx="-2" cy="52" rx="18" ry="20" fill="url(#treeCanopy2)" opacity="0.92" />
        <ellipse cx="28" cy="48" rx="17" ry="19" fill="url(#treeCanopy2)" opacity="0.9" />
        <ellipse cx="14" cy="26" rx="20" ry="22" fill="url(#treeCanopy2)" opacity="0.88" />
      </g>
      <g transform="translate(640, 146)">
        <rect x="7" y="48" width="5" height="34" rx="2" fill="#78350F" />
        <ellipse cx="9.5" cy="38" rx="26" ry="30" fill="url(#treeCanopy)" />
        <ellipse cx="-2" cy="46" rx="15" ry="17" fill="url(#treeCanopy2)" opacity="0.92" />
        <ellipse cx="22" cy="44" rx="14" ry="16" fill="url(#treeCanopy2)" opacity="0.88" />
      </g>
      <g transform="translate(598, 156)">
        <rect x="6" y="42" width="4.5" height="30" rx="2" fill="#78350F" />
        <ellipse cx="8.5" cy="32" rx="22" ry="26" fill="url(#treeCanopy)" />
        <ellipse cx="-1" cy="40" rx="13" ry="14" fill="url(#treeCanopy2)" opacity="0.9" />
      </g>

      {/* Bushes / low greenery */}
      <g>
        <ellipse cx="450" cy="212" rx="24" ry="8" fill="url(#treeCanopy2)" opacity="0.85" />
        <ellipse cx="484" cy="214" rx="18" ry="6" fill="url(#treeCanopy2)" opacity="0.8" />
        <ellipse cx="514" cy="215" rx="14" ry="5" fill="url(#treeCanopy2)" opacity="0.78" />
        <ellipse cx="692" cy="214" rx="26" ry="7" fill="url(#treeCanopy2)" opacity="0.86" />
      </g>

      {/* Waterfront / river */}
      <path
        d="M 0 214 Q 160 208 340 212 Q 500 216 720 212 L 720 240 L 0 240 Z"
        fill="url(#waterG2)"
      />
      {/* Water highlight lines */}
      <g stroke="#FFFFFF" strokeWidth="0.8" opacity="0.35" strokeLinecap="round">
        <path d="M 40 222 Q 120 220 200 222" />
        <path d="M 260 228 Q 360 226 460 229" />
        <path d="M 520 220 Q 600 218 680 221" />
      </g>
    </svg>
  );
}

const HERO_TRANSLATIONS: Record<Language, {
  subTitle: string;
  searchPlaceholder: string;
}> = {
  en: {
    subTitle: "Your Voice • Our Responsibility",
    searchPlaceholder: "Search for grievances, departments, reports...",
  },
  hi: {
    subTitle: "आपकी आवाज • हमारा दायित्व",
    searchPlaceholder: "शिकायतें, विभाग, रिपोर्ट खोजें...",
  },
  ta: {
    subTitle: "உங்கள் குரல் • எங்கள் கடமை",
    searchPlaceholder: "புகார்கள், துறைகள், அறிக்கைகளைத் தேடுக...",
  },
  te: {
    subTitle: "మీ గొంతు • మా బాధ్యత",
    searchPlaceholder: "ఫిర్యాదులు, విభాగాలు, నివేదికల కోసం వెతకండి...",
  },
  or: {
    subTitle: "ଆପଣଙ୍କ ସ୍ୱର • ଆମର ଦାୟିତ୍ୱ",
    searchPlaceholder: "ଅଭିଯୋଗ, ବିଭାଗ କିମ୍ବା ରିପୋର୍ଟ ସନ୍ଧାନ କରନ୍ତୁ...",
  },
  mr: {
    subTitle: "तुमचा आवाज • आमची जबाबदारी",
    searchPlaceholder: "तक्रारी, विभाग, अहवाल शोधा...",
  },
  bn: {
    subTitle: "আপনার কণ্ঠ • আমাদের দায়িত্ব",
    searchPlaceholder: "অভিযোগ, বিভাগ বা রিপোর্ট খুঁজুন...",
  },
  gu: {
    subTitle: "આપનો અવાજ • અમારી જવાબદારી",
    searchPlaceholder: "ફરિયાદો, વિભાગો, અહેવાलो શોધો...",
  },
  pa: {
    subTitle: "ਤੁਹਾਡੀ ਅਵਾਜ਼ • ਸਾਡੀ ਜ਼ਿੰਮੇਵਾਰੀ",
    searchPlaceholder: "ਸ਼ਿਕਾਇਤਾਂ, ਵਿਭਾਗਾਂ, ਰਿਪੋਰਟਾਂ ਦੀ ਖੋਜ ਕਰੋ...",
  },
};

export function DashboardHero({
  onSearch,
}: {
  onSearch?: (query: string) => void;
}) {
  const [q, setQ] = useState("");
  const { language } = useLanguage();
  const t = HERO_TRANSLATIONS[language];

  return (
    <section
      className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 shadow-[0_8px_32px_rgb(0,0,0,0.18)] h-[176px] min-h-[176px]"
      style={{
        background:
          "linear-gradient(102deg, #021e5c 0%, #042d7a 18%, #0a45b0 40%, #1368d9 65%, #1e90ff 88%, #38bdf8 100%)",
      }}
    >
      <div className="absolute right-0 top-0 bottom-0 w-[56%] pointer-events-none z-0 flex items-center justify-end">
        <CityIllustration />
      </div>

      <div className="relative z-10 flex items-center justify-between h-full px-5 md:px-8 lg:px-10">
        {/* Left: Logo + Text */}
        <div className="flex items-center gap-0 shrink-0 max-w-[460px] -ml-2 md:-ml-3 lg:-ml-4 mt-2.5 md:mt-3.5 lg:mt-4">
          <img
            src="/nagarx-circular-logo.png"
            alt="NagarX Logo"
            className="h-28 w-28 md:h-[120px] md:w-[120px] shrink-0 object-contain"
          />
          <div className="flex flex-col justify-center -ml-2 md:-ml-4 lg:-ml-5 mt-1 md:mt-2 lg:mt-2.5">
            <img
              src="/nagarx-text-logo.png"
              alt="NagarX"
              className="h-14 md:h-[76px] lg:h-[84px] shrink-0 object-contain drop-shadow-[0_4px_12px_rgba(56,189,248,0.3)]"
            />
            <h1
              className="hidden"
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(34px, 4.8vw, 54px)",
                background:
                  "linear-gradient(135deg, #ffffff 0%, #f0f9ff 35%, #bae6fd 70%, #38bdf8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 4px 12px rgba(56, 189, 248, 0.4))",
              }}
            >
              NagarX
            </h1>
            <p
              className="font-semibold tracking-wider mt-1 whitespace-nowrap text-white/80"
              style={{ fontSize: "clamp(10px, 1.15vw, 13.5px)" }}
            >
              {t.subTitle}
            </p>
          </div>
        </div>

        {/* Center: Search Pill */}
        <div className="flex-1 max-w-[560px] mx-4 md:mx-6 lg:mx-8 shrink-0">
          <div className="relative group">
            <Search className="pointer-events-none absolute left-4 md:left-5 top-1/2 -translate-y-1/2 h-5 w-5 md:h-6 md:w-6 text-blue-900/65 group-focus-within:text-blue-600 transition-colors" />
            <Input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                onSearch?.(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSearch?.(q);
              }}
              placeholder={t.searchPlaceholder}
              className="h-12 md:h-14 w-full pl-12 md:pl-14 pr-5 md:pr-6 rounded-full bg-white text-slate-800 font-medium border-0 shadow-[0_8px_24px_rgba(0,0,0,0.25)] placeholder:text-slate-500/75 focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-0 transition-all"
              style={{ fontSize: "clamp(13px, 1.2vw, 15px)" }}
            />
          </div>
        </div>

        {/* Right buffer */}
        <div className="w-[12%] hidden xl:block pointer-events-none" aria-hidden />
      </div>
    </section >
  );
}