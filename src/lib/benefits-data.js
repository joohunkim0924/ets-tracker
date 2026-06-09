import { FileText, GraduationCap, Calculator } from 'lucide-react';

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
}

function withBenefitIds(category) {
  return {
    ...category,
    benefits: category.benefits.map(b => ({
      ...b,
      id: `${category.id}-${slugify(b.name)}`,
    })),
  };
}

const RAW_CATEGORIES = [
  {
    id: 'discounts',
    emoji: '🎟️',
    label: 'Discounts',
    tileGradient: 'from-fuchsia-500 to-purple-700',
    benefits: [
      { name: 'Commissary & Exchange (PX/BX)', description: 'Tax-free shopping with prices typically 20–30% below retail. Open to all active duty and dependents.', action: 'Shop Online', url: 'https://www.shopmyexchange.com/' },
      { name: 'MWR Recreation', description: 'Discounted tickets to theme parks, concerts, travel, gyms, and outdoor recreation.', action: 'ITR / MWR Portal', url: 'https://www.armymwr.com' },
      { name: 'Space-A Travel', description: 'Fly free or at low cost on military aircraft to available destinations worldwide.', action: 'Space-A Info', url: 'https://www.militaryonesource.mil/travel/' },
      { name: 'ID.me Military Discounts', description: 'Verify your military status once and unlock hundreds of civilian discounts (Amazon, Apple, etc.).', action: 'Verify with ID.me', url: 'https://www.id.me/military' },
      { name: 'GOVX Special Pricing', description: 'Similar to ID.me, verify your status and access special pricing on partners (Oakley, Sports Tickets, etc.).', action: 'Savings For Those Who Serve', url: 'https://www.govx.com/' },
    ],
  },
  {
    id: 'pay',
    emoji: '💰',
    label: 'Pay',
    tileGradient: 'from-amber-500 to-orange-700',
    benefits: [
      { name: 'Basic Pay', description: 'Monthly base pay based on rank and years of service.', action: 'View Pay Tables', url: 'https://myarmybenefits.us.army.mil/Benefit-Library/Federal-Benefits/Basic-Pay' },
      { name: 'Basic Allowance for Housing (BAH)', description: 'Monthly housing stipend based on rank, dependency status, and duty location.', action: 'BAH Calculator', url: 'https://myarmybenefits.us.army.mil/Benefit-Library/Federal-Benefits/Basic-Allowance-for-Housing-(BAH)' },
      { name: 'Basic Allowance for Subsistence (BAS)', description: 'Monthly food allowance for enlisted members and officers.', action: 'Learn More', url: 'https://militarypay.defense.gov/pay/allowances/bas.aspx' },
      { name: 'Special & Incentive Pay', description: 'Hazardous duty pay, combat pay, flight pay, dive pay, and more.', action: 'View Special Pay', url: 'https://myarmybenefits.us.army.mil/Benefit-Library/Federal-Benefits/Bonuses' },
      { name: 'MyPay Portal', description: 'View your past and future expected pay statements, manage tax withholdings, and update direct deposit info.', action: 'Access MyPay', url: 'https://mypay.dfas.mil/' },
    ],
  },
  {
    id: 'healthcare',
    emoji: '🏥',
    label: 'Healthcare',
    tileGradient: 'from-sky-500 to-blue-700',
    benefits: [
      { name: 'TRICARE Health Insurance', description: 'Comprehensive health coverage for active duty members and their families at little or no cost.', action: 'TRICARE Portal', url: 'https://www.tricare.mil' },
      { name: 'TRICARE Dental Program', description: 'Affordable dental coverage for service members and eligible dependents.', action: 'Enroll / Manage', url: 'https://www.tricare.mil/CoveredServices/Dental' },
      { name: 'TRICARE Vision', description: 'Routine eye exams covered at military treatment facilities.', action: 'Learn More', url: 'https://tricare.mil/CoveredServices/Vision' },
      { name: 'Mental Health Services', description: 'Free, confidential counseling through Military OneSource and on-post resources.', action: 'Get Help Now', url: 'https://www.militaryonesource.mil/health-wellness/mental-health/' },
    ],
  },
  {
    id: 'education',
    emoji: '🎓',
    label: 'Education',
    tileGradient: 'from-violet-500 to-indigo-700',
    benefits: [
      { name: 'Post-9/11 GI Bill (Ch. 33)', description: 'Covers full tuition, housing allowance (BAH E-5 w/ dependents), and book stipend up to 36 months.', action: 'Apply on VA.gov', url: 'https://www.va.gov/education/how-to-apply/' },
      { name: 'Tuition Assistance (TA)', description: 'Army pays up to $4,500/year for college courses taken while on active duty.', action: 'Open ArmyIgnitED', url: 'https://www.armyignited.army.mil/student/public/welcome' },
      { name: 'Montgomery GI Bill (Ch. 30)', description: 'Monthly education stipend for service members who contributed $1,200 at enlistment.', action: 'Learn More', url: 'https://www.va.gov/education/about-gi-bill-benefits/montgomery-active-duty/' },
      { name: 'MyCAA (Spouse)', description: 'Up to $4,000 in financial assistance for eligible military spouses pursuing education/careers.', action: 'Apply on MyCAA', url: 'https://mycaa.militaryonesource.mil' },
    ],
  },
  {
    id: 'retirement',
    emoji: '📈',
    label: 'Finance',
    tileGradient: 'from-emerald-500 to-teal-700',
    benefits: [
      { name: 'Blended Retirement System (BRS)', description: 'Combines 20-year defined-benefit retirement with TSP matching contributions.', action: 'BRS Overview', url: 'https://myarmybenefits.us.army.mil/Benefit-Library/Federal-Benefits/Blended-Retirement-System?serv=125' },
      { name: 'Thrift Savings Plan (TSP)', description: 'Federal 401(k)-equivalent with up to 5% matching under BRS. Contribute any amount.', action: 'Manage TSP', url: 'https://www.tsp.gov' },
      { name: 'Savings Deposit Program (SDP)', description: 'Earn 10% annual interest on deposits up to $10,000 while deployed to a combat zone.', action: 'Learn More', url: 'https://myarmybenefits.us.army.mil/Benefit-Library/Federal-Benefits/Savings-Deposit-Program-(SDP)' },
      { name: 'Servicemembers Civil Relief Act (SCRA)', description: 'Caps interest rates at 6% on pre-service debt, protects against eviction and foreclosure.', action: 'SCRA Info', url: 'https://myarmybenefits.us.army.mil/Benefit-Library/Federal-Benefits/Servicemembers-Civil-Relief-Act-(SCRA)' },
    ],
  },
  {
    id: 'insurance',
    emoji: '🛡️',
    label: 'Insurance',
    tileGradient: 'from-rose-500 to-red-700',
    benefits: [
      { name: 'Servicemembers Group Life Insurance (SGLI)', description: 'Low-cost term life insurance up to $500,000 for active duty members.', action: 'Manage SGLI', url: 'https://www.va.gov/life-insurance/options-eligibility/sgli/' },
      { name: 'Family SGLI (FSGLI)', description: 'Spouse coverage up to $100,000 and $10,000 per child at low cost.', action: 'Learn More', url: 'https://www.va.gov/life-insurance/options-eligibility/fsgli/' },
      { name: 'Traumatic SGLI (TSGLI)', description: 'Lump-sum payment ($25K–$100K) if you suffer severe injury in the line of duty.', action: 'TSGLI Info', url: 'https://www.va.gov/life-insurance/options-eligibility/tsgli/' },
    ],
  },
  {
    id: 'transition',
    emoji: '🚀',
    label: 'Career',
    tileGradient: 'from-cyan-500 to-blue-700',
    benefits: [
      { name: 'Transition Assistance Program (TAP)', description: 'Mandatory pre-separation program covering employment, VA benefits, and transition planning.', action: 'TAP Resources', url: 'https://www.tapevents.mil' },
      { name: 'SkillBridge', description: 'Work at a civilian company for up to 180 days before ETS while still drawing full pay.', action: 'Find Opportunities', url: 'https://skillbridge.osd.mil' },
      { name: 'Army COOL (Credentialing)', description: 'Funding to earn civilian certifications and licenses that match your MOS.', action: 'Browse Credentials', url: 'https://www.cool.osd.mil/army/index.html' },
      { name: 'VA Vocational Rehabilitation (Ch. 31)', description: 'Education and employment support for veterans with service-connected disabilities.', action: 'Apply on VA.gov', url: 'https://www.va.gov/careers-employment/vocational-rehabilitation/' },
    ],
  },
  {
    id: 'housing',
    emoji: '🏠',
    label: 'Housing',
    tileGradient: 'from-yellow-500 to-amber-700',
    benefits: [
      { name: 'VA Home Loan Guarantee', description: 'Buy a home with 0% down, no PMI, and competitive rates. Available after 90+ days of service.', action: 'Get a Certificate', url: 'https://www.va.gov/housing-assistance/home-loans/' },
      { name: 'On-Post / Barracks Housing', description: 'Government-furnished quarters on installation at no cost (single soldiers, typically E-5 and below).', action: 'Army Housing Portal', url: 'https://www.housing.army.mil' },
      { name: 'Privatized Housing (Balfour Beatty, etc.)', description: 'Off-post privatized housing paid via BAH. Contact your installation housing office to apply.', action: 'Find My Installation', url: 'https://installations.militaryonesource.mil' },
    ],
  },
  {
    id: 'family',
    emoji: '👨‍👩‍👧',
    label: 'Family',
    tileGradient: 'from-pink-500 to-rose-700',
    benefits: [
      { name: 'Army Family Action Plan (AFAP)', description: 'Advocacy program improving Army quality-of-life issues identified by Soldiers and Families.', action: 'Learn More', url: 'https://www.armymwr.com/programs-and-services/personal-assistance/army-family-action-plan' },
      { name: 'Military OneSource', description: 'Free counseling (12 sessions), financial coaching, tax prep (MilTax), and more.', action: 'Access Now', url: 'https://www.militaryonesource.mil' },
      { name: 'JAG Legal Assistance', description: 'Free legal help with wills, powers of attorney, family law, and more from your installation JAG office.', action: 'Find JAG Office', url: 'https://legalassistance.law.af.mil' },
      { name: 'Child Development Centers (CDC)', description: 'Subsidized on-post childcare with income-based fees. Priority given to active duty families.', action: 'Find a CDC', url: 'https://installations.militaryonesource.mil' },
    ],
  },
  {
    id: 'more',
    emoji: '📚',
    label: 'More',
    tileGradient: 'from-slate-500 to-zinc-700',
    benefits: [
      { name: 'Military Benefits Compilation File', description: 'A bundled PDF with additional military and veteran benefits, freebies, and reference links.', action: 'Open PDF', url: 'https://drive.google.com/file/d/1KvUZYJ7ND20tifNiuw66IYYAn29V9H2H/view?usp=sharing' },
    ],
  },
];

export const CATEGORIES = RAW_CATEGORIES.map(withBenefitIds);

export const VA_LINKS = [
  {
    id: 'va-disability-rates',
    name: 'VA Disability Compensation Rates',
    description: 'Official VA.gov charts for disability percentages and monthly compensation rates.',
    action: 'View VA Charts',
    url: 'https://www.va.gov/disability/compensation-rates/veteran-rates/',
    icon: FileText,
  },
  {
    id: 'va-armyignited',
    name: 'ArmyIgnitED (Tuition Assistance)',
    description: 'Apply for TA, manage funding requests, and track education goals in one portal.',
    action: 'Open ArmyIgnitED',
    url: 'https://www.armyignited.army.mil/student/public/welcome',
    icon: GraduationCap,
  },
  {
    id: 'va-gi-bill',
    name: 'Post-9/11 GI Bill Time Calculator',
    description: 'Understand how active duty service counts toward Post-9/11 GI Bill eligibility and benefits.',
    action: 'GI Bill Guide',
    url: 'https://www.va.gov/education/about-gi-bill-benefits/post-9-11/',
    icon: Calculator,
  },
];

export const TOTAL_BENEFITS = CATEGORIES.reduce((n, c) => n + c.benefits.length, 0) + VA_LINKS.length;

export function getCategoryById(id) {
  return CATEGORIES.find(c => c.id === id) ?? null;
}

export function getAllBenefitItems() {
  const items = [];

  VA_LINKS.forEach(link => {
    items.push({
      id: link.id,
      type: 'va',
      name: link.name,
      description: link.description,
      action: link.action,
      url: link.url,
      icon: link.icon,
      categoryId: 'education',
      categoryLabel: 'Education',
      categoryEmoji: '🎓',
    });
  });

  CATEGORIES.forEach(cat => {
    cat.benefits.forEach(benefit => {
      items.push({
        id: benefit.id,
        type: 'benefit',
        name: benefit.name,
        description: benefit.description,
        action: benefit.action,
        url: benefit.url,
        categoryId: cat.id,
        categoryLabel: cat.label,
        categoryEmoji: cat.emoji,
      });
    });
  });

  return items;
}

export function getBenefitItemById(id) {
  return getAllBenefitItems().find(item => item.id === id) ?? null;
}

export function searchBenefitItems(query) {
  const q = query.trim().toLowerCase();
  if (!q) return getAllBenefitItems();

  return getAllBenefitItems().filter(item =>
    item.name.toLowerCase().includes(q)
    || item.description.toLowerCase().includes(q)
    || item.action.toLowerCase().includes(q)
    || item.categoryLabel.toLowerCase().includes(q)
  );
}
