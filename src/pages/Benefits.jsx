import React, { useState } from 'react';
import BottomNav from '@/components/layout/BottomNav';
import { ExternalLink, ChevronDown, ChevronUp, FileText, GraduationCap, Calculator } from 'lucide-react';

const VA_LINKS = [
  {
    name: 'VA Disability Compensation Rates',
    description: 'Official VA.gov charts for disability percentages and monthly compensation rates.',
    action: 'View VA Charts',
    url: 'https://www.va.gov/disability/compensation-rates/veteran-rates/',
    icon: FileText,
  },
  {
    name: 'ArmyIgnitED (Tuition Assistance)',
    description: 'Apply for TA, manage funding requests, and track education goals in one portal.',
    action: 'Open ArmyIgnitED',
    url: 'https://www.armyignited.army.mil/student/public/welcome',
    icon: GraduationCap,
  },
  {
    name: 'Post-9/11 GI Bill Time Calculator',
    description: 'Understand how active duty service counts toward Post-9/11 GI Bill eligibility and benefits.',
    action: 'GI Bill Guide',
    url: 'https://www.va.gov/education/about-gi-bill-benefits/post-9-11/',
    icon: Calculator,
  },
];

const CATEGORIES = [
  {
    id: 'discounts',
    emoji: '🎟️',
    label: 'Discounts & Recreation',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50 border-indigo-200',
    benefits: [
      {
        name: 'Commissary & Exchange (PX/BX)',
        description: 'Tax-free shopping with prices typically 20–30% below retail. Open to all active duty and dependents.',
        action: 'Shop Online',
        url: 'https://www.shopmyexchange.com/',
      },
      {
        name: 'MWR Recreation',
        description: 'Discounted tickets to theme parks, concerts, travel, gyms, and outdoor recreation.',
        action: 'ITR / MWR Portal',
        url: 'https://www.armymwr.com',
      },
      {
        name: 'Space-A Travel',
        description: 'Fly free or at low cost on military aircraft to available destinations worldwide.',
        action: 'Space-A Info',
        url: 'https://www.militaryonesource.mil/travel/',
      },
      {
        name: 'ID.me Military Discounts',
        description: 'Verify your military status once and unlock hundreds of civilian discounts (Amazon, Apple, etc.).',
        action: 'Verify with ID.me',
        url: 'https://www.id.me/military',
      },
      {
        name: 'GOVX Special Pricing',
        description: 'Similar to ID.me, verify your status and access special pricing on partners (Oakley, Sports Tickets, etc.).',
        action: 'Savings For Those Who Serve',
        url: 'https://www.govx.com/',
      },
    ],
  },
  {
    id: 'pay',
    emoji: '💰',
    label: 'Pay & Allowances',
    color: 'text-green-600',
    bg: 'bg-green-50 border-green-200',
    benefits: [
      {
        name: 'Basic Pay',
        description: 'Monthly base pay based on rank and years of service.',
        action: 'View Pay Tables',
        url: 'https://myarmybenefits.us.army.mil/Benefit-Library/Federal-Benefits/Basic-Pay',
      },
      {
        name: 'Basic Allowance for Housing (BAH)',
        description: 'Monthly housing stipend based on rank, dependency status, and duty location.',
        action: 'BAH Calculator',
        url: 'https://myarmybenefits.us.army.mil/Benefit-Library/Federal-Benefits/Basic-Allowance-for-Housing-(BAH)',
      },
      {
        name: 'Basic Allowance for Subsistence (BAS)',
        description: 'Monthly food allowance for enlisted members and officers.',
        action: 'Learn More',
        url: 'https://militarypay.defense.gov/pay/allowances/bas.aspx',
      },
      {
        name: 'Special & Incentive Pay',
        description: 'Hazardous duty pay, combat pay, flight pay, dive pay, and more.',
        action: 'View Special Pay',
        url: 'https://myarmybenefits.us.army.mil/Benefit-Library/Federal-Benefits/Bonuses',
      },
      {
        name: 'MyPay Portal',
        description: 'View your past and future expected pay statements, manage tax withholdings, and update direct deposit info.',
        action: 'Access MyPay',
        url: 'https://mypay.dfas.mil/',
      },
    ],
  },
  {
    id: 'healthcare',
    emoji: '🏥',
    label: 'Healthcare',
    color: 'text-blue-600',
    bg: 'bg-blue-50 border-blue-200',
    benefits: [
      {
        name: 'TRICARE Health Insurance',
        description: 'Comprehensive health coverage for active duty members and their families at little or no cost.',
        action: 'TRICARE Portal',
        url: 'https://www.tricare.mil',
      },
      {
        name: 'TRICARE Dental Program',
        description: 'Affordable dental coverage for service members and eligible dependents.',
        action: 'Enroll / Manage',
        url: 'https://www.tricare.mil/CoveredServices/Dental',
      },
      {
        name: 'TRICARE Vision',
        description: 'Routine eye exams covered at military treatment facilities.',
        action: 'Learn More',
        url: 'https://tricare.mil/CoveredServices/Vision',
      },
      {
        name: 'Mental Health Services',
        description: 'Free, confidential counseling through Military OneSource and on-post resources.',
        action: 'Get Help Now',
        url: 'https://www.militaryonesource.mil/health-wellness/mental-health/',
      },
    ],
  },
  {
    id: 'education',
    emoji: '🎓',
    label: 'Education',
    color: 'text-purple-600',
    bg: 'bg-purple-50 border-purple-200',
    benefits: [
      {
        name: 'Post-9/11 GI Bill (Ch. 33)',
        description: 'Covers full tuition, housing allowance (BAH E-5 w/ dependents), and book stipend up to 36 months.',
        action: 'Apply on VA.gov',
        url: 'https://www.va.gov/education/how-to-apply/',
      },
      {
        name: 'Tuition Assistance (TA)',
        description: 'Army pays up to $4,500/year for college courses taken while on active duty.',
        action: 'Open ArmyIgnitED',
        url: 'https://www.armyignited.army.mil/student/public/welcome',
      },
      {
        name: 'Montgomery GI Bill (Ch. 30)',
        description: 'Monthly education stipend for service members who contributed $1,200 at enlistment.',
        action: 'Learn More',
        url: 'https://www.va.gov/education/about-gi-bill-benefits/montgomery-active-duty/',
      },
      {
        name: 'MyCAA (Spouse)',
        description: 'Up to $4,000 in financial assistance for eligible military spouses pursuing education/careers.',
        action: 'Apply on MyCAA',
        url: 'https://mycaa.militaryonesource.mil',
      },
    ],
  },
  {
    id: 'retirement',
    emoji: '📈',
    label: 'Retirement & Finance',
    color: 'text-orange-600',
    bg: 'bg-orange-50 border-orange-200',
    benefits: [
      {
        name: 'Blended Retirement System (BRS)',
        description: 'Combines 20-year defined-benefit retirement with TSP matching contributions.',
        action: 'BRS Overview',
        url: 'https://myarmybenefits.us.army.mil/Benefit-Library/Federal-Benefits/Blended-Retirement-System?serv=125',
      },
      {
        name: 'Thrift Savings Plan (TSP)',
        description: 'Federal 401(k)-equivalent with up to 5% matching under BRS. Contribute any amount.',
        action: 'Manage TSP',
        url: 'https://www.tsp.gov',
      },
      {
        name: 'Savings Deposit Program (SDP)',
        description: 'Earn 10% annual interest on deposits up to $10,000 while deployed to a combat zone.',
        action: 'Learn More',
        url: 'https://myarmybenefits.us.army.mil/Benefit-Library/Federal-Benefits/Savings-Deposit-Program-(SDP)',
      },
      {
        name: 'Servicemembers Civil Relief Act (SCRA)',
        description: 'Caps interest rates at 6% on pre-service debt, protects against eviction and foreclosure.',
        action: 'SCRA Info',
        url: 'https://myarmybenefits.us.army.mil/Benefit-Library/Federal-Benefits/Servicemembers-Civil-Relief-Act-(SCRA)',
      },
    ],
  },
  {
    id: 'insurance',
    emoji: '🛡️',
    label: 'Life Insurance',
    color: 'text-red-600',
    bg: 'bg-red-50 border-red-200',
    benefits: [
      {
        name: 'Servicemembers Group Life Insurance (SGLI)',
        description: 'Low-cost term life insurance up to $500,000 for active duty members.',
        action: 'Manage SGLI',
        url: 'https://www.va.gov/life-insurance/options-eligibility/sgli/',
      },
      {
        name: 'Family SGLI (FSGLI)',
        description: 'Spouse coverage up to $100,000 and $10,000 per child at low cost.',
        action: 'Learn More',
        url: 'https://www.va.gov/life-insurance/options-eligibility/fsgli/',
      },
      {
        name: 'Traumatic SGLI (TSGLI)',
        description: 'Lump-sum payment ($25K–$100K) if you suffer severe injury in the line of duty.',
        action: 'TSGLI Info',
        url: 'https://www.va.gov/life-insurance/options-eligibility/tsgli/',
      },
    ],
  },
  {
    id: 'transition',
    emoji: '🚀',
    label: 'Transition & Career',
    color: 'text-teal-600',
    bg: 'bg-teal-50 border-teal-200',
    benefits: [
      {
        name: 'Transition Assistance Program (TAP)',
        description: 'Mandatory pre-separation program covering employment, VA benefits, and transition planning.',
        action: 'TAP Resources',
        url: 'https://www.tapevents.mil',
      },
      {
        name: 'SkillBridge',
        description: 'Work at a civilian company for up to 180 days before ETS while still drawing full pay.',
        action: 'Find Opportunities',
        url: 'https://skillbridge.osd.mil',
      },
      {
        name: 'Army COOL (Credentialing)',
        description: 'Funding to earn civilian certifications and licenses that match your MOS.',
        action: 'Browse Credentials',
        url: 'https://www.cool.osd.mil/army/index.html',
      },
      {
        name: 'VA Vocational Rehabilitation (Ch. 31)',
        description: 'Education and employment support for veterans with service-connected disabilities.',
        action: 'Apply on VA.gov',
        url: 'https://www.va.gov/careers-employment/vocational-rehabilitation/',
      },
    ],
  },
  {
    id: 'housing',
    emoji: '🏠',
    label: 'Housing',
    color: 'text-yellow-700',
    bg: 'bg-yellow-50 border-yellow-200',
    benefits: [
      {
        name: 'VA Home Loan Guarantee',
        description: 'Buy a home with 0% down, no PMI, and competitive rates. Available after 90+ days of service.',
        action: 'Get a Certificate',
        url: 'https://www.va.gov/housing-assistance/home-loans/',
      },
      {
        name: 'On-Post / Barracks Housing',
        description: 'Government-furnished quarters on installation at no cost (single soldiers, typically E-5 and below).',
        action: 'Army Housing Portal',
        url: 'https://www.housing.army.mil',
      },
      {
        name: 'Privatized Housing (Balfour Beatty, etc.)',
        description: 'Off-post privatized housing paid via BAH. Contact your installation housing office to apply.',
        action: 'Find My Installation',
        url: 'https://installations.militaryonesource.mil',
      },
    ],
  },
  {
    id: 'family',
    emoji: '👨‍👩‍👧',
    label: 'Family & Legal',
    color: 'text-pink-600',
    bg: 'bg-pink-50 border-pink-200',
    benefits: [
      {
        name: 'Army Family Action Plan (AFAP)',
        description: 'Advocacy program improving Army quality-of-life issues identified by Soldiers and Families.',
        action: 'Learn More',
        url: 'https://www.armymwr.com/programs-and-services/personal-assistance/army-family-action-plan',
      },
      {
        name: 'Military OneSource',
        description: 'Free counseling (12 sessions), financial coaching, tax prep (MilTax), and more.',
        action: 'Access Now',
        url: 'https://www.militaryonesource.mil',
      },
      {
        name: 'JAG Legal Assistance',
        description: 'Free legal help with wills, powers of attorney, family law, and more from your installation JAG office.',
        action: 'Find JAG Office',
        url: 'https://legalassistance.law.af.mil',
      },
      {
        name: 'Child Development Centers (CDC)',
        description: 'Subsidized on-post childcare with income-based fees. Priority given to active duty families.',
        action: 'Find a CDC',
        url: 'https://installations.militaryonesource.mil',
      },
    ],
  },
  {
    id: 'more',
    emoji: '📚',
    label: 'And more...',
    color: 'text-cyan-700',
    bg: 'bg-cyan-50 border-cyan-200',
    benefits: [
      {
        name: 'Military Benefits Compilation File',
        description: 'A bundled PDF with additional military and veteran benefits, freebies, and reference links.',
        action: 'Open PDF',
        url: 'https://drive.google.com/file/d/1KvUZYJ7ND20tifNiuw66IYYAn29V9H2H/view?usp=sharing',
      },
    ],
  },
];

function VaLinkCard({ link }) {
  const Icon = link.icon;
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-inter font-semibold text-foreground">{link.name}</p>
          <p className="mt-1 text-xs text-muted-foreground font-inter leading-relaxed">{link.description}</p>
          <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-inter font-bold uppercase tracking-widest text-primary">
            {link.action}
            <ExternalLink className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </a>
  );
}

function BenefitCard({ benefit }) {
  return (
    <div className="flex items-start justify-between gap-3 py-4 border-b border-border last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-inter font-semibold text-foreground">{benefit.name}</p>
        <p className="text-xs text-muted-foreground font-inter mt-0.5 leading-relaxed">{benefit.description}</p>
      </div>
      <a
        href={benefit.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-[10px] font-inter font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors"
      >
        {benefit.action}
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
}

function CategorySection({ cat }) {
  const [open, setOpen] = useState(true);
  return (
    <div className={`rounded-xl border ${cat.bg} overflow-hidden mb-3`}>
      <button
        className="flex w-full flex-shrink-0 items-center justify-between px-page py-3"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{cat.emoji}</span>
          <span className={`text-xs font-inter font-bold uppercase tracking-widest ${cat.color}`}>{cat.label}</span>
          <span className="text-[10px] text-muted-foreground font-mono">({cat.benefits.length})</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && (
        <div className="bg-card px-page">
          {cat.benefits.map(b => <BenefitCard key={b.name} benefit={b} />)}
        </div>
      )}
    </div>
  );
}

export default function Benefits() {
  return (
    <div className="flex min-h-screen max-w-full flex-col overflow-x-hidden bg-background">
      <div className="px-page pb-header-pb pt-header-pt">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">U.S. ARMY</p>
        <h1 className="text-2xl font-inter font-black text-foreground uppercase tracking-tight">SOLDIER BENEFITS</h1>
        <p className="text-xs text-muted-foreground font-inter mt-1">
          {CATEGORIES.reduce((n, c) => n + c.benefits.length, 0)} benefits across {CATEGORIES.length} categories
        </p>
      </div>

      <div className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-page pb-bottom-scroll">
        <div className="mb-5 rounded-2xl border border-teal-200 bg-teal-50/80 p-4 dark:border-teal-900/50 dark:bg-teal-950/20">
          <p className="text-[10px] uppercase tracking-[0.2em] text-teal-800 dark:text-teal-300 font-inter mb-1">Education &amp; VA</p>
          <h2 className="text-sm font-inter font-bold text-foreground uppercase tracking-wide mb-3">VA Disability &amp; TA Links</h2>
          <div className="space-y-3">
            {VA_LINKS.map(link => (
              <VaLinkCard key={link.name} link={link} />
            ))}
          </div>
        </div>

        {CATEGORIES.map(cat => (
          <CategorySection key={cat.id} cat={cat} />
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
