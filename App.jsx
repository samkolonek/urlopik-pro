import React, { useState, useMemo, useEffect } from 'react';
import { 
  Palmtree, 
  Zap, 
  CalendarDays, 
  PlusCircle, 
  AlertCircle,
  ArrowUpDown,
  ShieldCheck,
  Globe,
  ArrowRightCircle,
  Settings2,
  LayoutDashboard,
  Sun,
  Moon,
  FastForward,
  FileText,
  CheckCircle2,
  Circle,
  MousePointerClick,
  AlertTriangle,
  Info,
  Eye,
  X,
  Trash2,
  RefreshCw,
  HelpCircle,
  BookOpen,
  MousePointer2,
  Mail,
  Save,
  FolderOpen,
  CalendarPlus,
  Download,
  Upload,
  ExternalLink,
  Coffee,
  ChevronRight,
  ChevronLeft,
  Filter,
  Sparkles,
  Lock,
  Wand2,
  Heart,
  RotateCcw
} from 'lucide-react';

/**
 * Urlopik Pro v5.29.5 - A4 Guide Layout, Premium Hover Effects
 * Autor: samkolonek@gmail.com
 */

// --- LOGIKA MOTYWU I PWA ---
let currentManifestUrl = null;
const applyNativeTheme = (themeName) => {
  const isDark = themeName === 'dark';
  const bgColor = isDark ? '#111111' : '#f8fafc';
  const headerColor = isDark ? '#1a1a1a' : '#ffffff';

  if (isDark) {
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
  }
  document.body.style.backgroundColor = bgColor;

  let metaTheme = document.querySelector('meta[name="theme-color"]');
  if (!metaTheme) {
    metaTheme = document.createElement('meta');
    metaTheme.name = 'theme-color';
    document.head.appendChild(metaTheme);
  }
  metaTheme.setAttribute('content', headerColor);

  const manifest = {
    name: "Urlopik Pro",
    short_name: "Urlopik",
    display: "standalone",
    theme_color: headerColor,
    background_color: bgColor,
    icons: [{
      src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2310b981' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'/%3E%3C/svg%3E",
      sizes: "192x192",
      type: "image/svg+xml",
      purpose: "any maskable"
    }]
  };
  
  const manifestBlob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
  if (currentManifestUrl) URL.revokeObjectURL(currentManifestUrl);
  currentManifestUrl = URL.createObjectURL(manifestBlob);
  
  let manifestLink = document.querySelector('link[rel="manifest"]');
  if (!manifestLink) {
    manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    document.head.appendChild(manifestLink);
  }
  manifestLink.href = currentManifestUrl;
};

// --- LOGIKA DAT I ŚWIĄT ---

const getHolidaysForYear = (year) => {
  const holidays = [
    { name: 'Nowy Rok', m: 0, d: 1 },
    { name: 'Trzech Króli', m: 0, d: 6 },
    { name: 'Święto Pracy', m: 4, d: 1 },
    { name: 'Święto Konstytucji 3 Maja', m: 4, d: 3 },
    { name: 'Wniebowzięcie NMP', m: 7, d: 15 },
    { name: 'Wszystkich Świętych', m: 10, d: 1 },
    { name: 'Święto Niepodległości', m: 10, d: 11 },
    { name: 'Wigilia Bożego Narodzenia', m: 11, d: 24 },
    { name: 'Boże Narodzenie (Dzień 1)', m: 11, d: 25 },
    { name: 'Boże Narodzenie (Dzień 2)', m: 11, d: 26 },
  ];

  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  
  const easterSunday = new Date(year, month - 1, day);
  const easterMonday = new Date(year, month - 1, day + 1);
  const corpusChristi = new Date(year, month - 1, day + 60);

  holidays.push({ name: 'Wielkanoc', m: easterSunday.getMonth(), d: easterSunday.getDate() });
  holidays.push({ name: 'Poniedziałek Wielkanocny', m: easterMonday.getMonth(), d: easterMonday.getDate() });
  holidays.push({ name: 'Boże Ciało', m: corpusChristi.getMonth(), d: corpusChristi.getDate() });

  return holidays.map(h => ({ ...h, y: year })).sort((a, b) => {
    if (a.m !== b.m) return a.m - b.m;
    return a.d - b.d;
  });
};

const isWorkDay = (date, holidayList) => {
  const dayOfWeek = date.getDay(); 
  if (dayOfWeek === 0 || dayOfWeek === 6) return false;
  return !holidayList.some(h => 
    h.y === date.getFullYear() && h.m === date.getMonth() && h.d === date.getDate()
  );
};

const getHolidayName = (date, holidayList) => {
  const h = holidayList.find(h => 
    h.y === date.getFullYear() && h.m === date.getMonth() && h.d === date.getDate()
  );
  return h ? h.name : null;
};

const calculateTotalFreeRange = (allDays, startIdx, endIdx, holidayList, otherYearDatesSet = new Set()) => {
  let firstDay = startIdx;
  let lastDay = endIdx - 1;

  while (firstDay > 0 && !isWorkDay(allDays[firstDay - 1].dateObj, holidayList) && !otherYearDatesSet.has(allDays[firstDay - 1].date)) {
    firstDay--;
  }
  while (lastDay < allDays.length - 1 && !isWorkDay(allDays[lastDay + 1].dateObj, holidayList) && !otherYearDatesSet.has(allDays[lastDay + 1].date)) {
    lastDay++;
  }

  return {
    total: lastDay - firstDay + 1,
    actualStart: allDays[firstDay].date,
    actualEnd: allDays[lastDay].date
  };
};

const formatDateShort = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' }).replace('.', '');
};

// --- KOMPONENTY UI ---

const MonthView = ({ year, month, hackDates, customDates, otherYearDates, simulatedDates, holidayList, activePoolDates, onDayClick }) => {
  const monthName = new Date(year, month).toLocaleString('pl-PL', { month: 'long' });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const blanks = Array(offset).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const dayLabels = ['P', 'W', 'Ś', 'C', 'P', 'S', 'N'];
  
  const todayStr = new Date().toLocaleDateString('en-CA');

  return (
    <div id={`month-${year}-${month}`} className="bg-white dark:bg-[#161616] p-4 rounded-[20px] border border-slate-200/60 dark:border-white/5 hover:border-emerald-500/30 transition-colors shadow-sm">
      <h4 className="text-sm font-bold uppercase tracking-[0.15em] text-slate-800 dark:text-slate-300 mb-4 text-center pb-2 border-b border-slate-100 dark:border-white/5">{monthName}</h4>
      <div className="grid grid-cols-7 gap-y-1 gap-x-0.5 text-xs font-bold text-slate-400 dark:text-slate-500 mb-2 text-center uppercase">
        {dayLabels.map((d, idx) => (
          <div key={`label-${year}-${month}-${idx}`} className={(idx === 5 || idx === 6) ? 'text-slate-400 dark:text-slate-500 opacity-60' : ''}>
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1 gap-x-0">
        {blanks.map((_, i) => <div key={`blank-${year}-${month}-${i}`} />)}
        {days.map(d => {
          const dateObj = new Date(year, month, d);
          const dateStr = dateObj.toLocaleDateString('en-CA');
          
          const prevDate = new Date(year, month, d - 1);
          const nextDate = new Date(year, month, d + 1);
          const isPrevSelected = activePoolDates && activePoolDates.has(prevDate.toLocaleDateString('en-CA'));
          const isNextSelected = activePoolDates && activePoolDates.has(nextDate.toLocaleDateString('en-CA'));

          const isHack = hackDates.has(dateStr);
          const isCustom = customDates.has(dateStr);
          const isOtherYear = otherYearDates && otherYearDates.has(dateStr);
          const isSimulatedFreed = simulatedDates && simulatedDates.has(dateStr);
          const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
          const isToday = dateStr === todayStr;
          const hName = getHolidayName(dateObj, holidayList);
          
          const isPast = dateStr < todayStr;
          const isWorkDayLocal = !isWeekend && !hName;
          const isPastActiveVacation = isPast && (isHack || isCustom) && isWorkDayLocal;
          
          let roundedClass = 'rounded-lg mx-0.5';
          if ((isHack || isCustom) && !isSimulatedFreed) {
             if (isPrevSelected && isNextSelected) roundedClass = 'rounded-none mx-0';
             else if (isPrevSelected) roundedClass = 'rounded-r-lg rounded-l-none ml-0 mr-0.5';
             else if (isNextSelected) roundedClass = 'rounded-l-lg rounded-r-none mr-0 ml-0.5';
          }

          let bgClass = isWeekend 
            ? 'text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-[#1a1a1a]' 
            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer';

          if (isSimulatedFreed) {
             bgClass = 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 font-black border-2 border-purple-400 dark:border-purple-500 border-dashed animate-pulse z-20 cursor-help mx-0.5 rounded-lg';
          } else if (isPastActiveVacation) {
             bgClass = `bg-slate-200 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500 font-bold cursor-pointer opacity-70 z-10 ${roundedClass}`;
          } else if (isHack && isCustom) bgClass = `bg-gradient-to-br from-emerald-500 to-blue-500 text-white font-bold cursor-pointer shadow-sm z-10 ${roundedClass}`;
          else if (isHack) bgClass = `bg-emerald-500 text-white font-bold cursor-pointer shadow-sm z-10 ${roundedClass}`;
          else if (isCustom) bgClass = `bg-blue-500 text-white font-bold cursor-pointer shadow-sm z-10 ${roundedClass}`;
          else if (isOtherYear) bgClass = 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-700 opacity-70 border border-slate-300 dark:border-slate-700 border-dashed mx-0.5 rounded-lg';
          else if (hName) bgClass = 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 font-bold hover:bg-rose-100 dark:hover:bg-rose-900/40 mx-0.5 rounded-lg';

          const todayClass = isToday ? 'ring-2 ring-emerald-500 dark:ring-emerald-400 ring-offset-1 dark:ring-offset-[#161616] z-20 mx-0.5 rounded-lg' : '';

          let tooltipText = "Kliknij, aby dodać/usunąć urlop";
          if (isPast && (isHack || isCustom || isOtherYear) && isWorkDayLocal) {
             tooltipText = "Urlop wykorzystany";
          } else if (isSimulatedFreed) {
             tooltipText = "Dzień objęty symulacją rezygnacji (+1 dni do budżetu nowej puli)";
          } else if (isOtherYear) {
             tooltipText = "Zajęte z budżetu innej puli. Kliknij, aby zwolnić i usunąć z poprzedniego planu.";
          } else if (isToday) {
             tooltipText = "Dzisiaj";
          }

          if (hName && !isSimulatedFreed) {
             tooltipText = `${hName}${isToday ? ' (Dzisiaj)' : ''}`;
          }

          return (
            <div key={`${year}-${month}-${d}`} 
              title={tooltipText}
              onClick={() => !isSimulatedFreed && onDayClick(dateStr)}
              className={`aspect-square flex flex-col items-center justify-center text-sm font-medium relative transition-colors duration-200 group ${bgClass} ${todayClass}`}
            >
              {d}
              {hName && !isHack && !isCustom && !isOtherYear && !isSimulatedFreed && <div className="absolute top-[3px] right-[3px] w-1.5 h-1.5 bg-rose-500 rounded-full" />}
              {hName && !isSimulatedFreed && (
                <div className="absolute invisible group-hover:visible bottom-full mb-2 px-3 py-1.5 bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold rounded-lg pointer-events-none whitespace-nowrap z-50 border border-white/10 text-center shadow-xl">
                  {hName}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-800"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- GŁÓWNA APLIKACJA ---

export default function App() {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  
  // Stany aplikacji
  const [planningMode, setPlanningMode] = useState(() => localStorage.getItem('urlopik_v5_mode') || 'current');
  const [theme, setTheme] = useState(() => localStorage.getItem('urlopik_v5_theme') || 'dark');
  
  const [maxSpend, setMaxSpend] = useState(() => {
    const saved = localStorage.getItem('urlopik_v5_max_spend');
    return saved ? parseInt(saved, 10) : 10;
  });
  
  const [analysisStart, setAnalysisStart] = useState(() => {
    const saved = localStorage.getItem('urlopik_v5_start');
    return saved ? saved : new Date().toLocaleDateString('en-CA');
  });
  
  const [onDemandReserve, setOnDemandReserve] = useState(() => {
    const saved = localStorage.getItem('urlopik_v5_on_demand');
    return saved ? parseInt(saved, 10) : 4;
  });
  
  const [showPreview, setShowPreview] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [settingsTab, setSettingsTab] = useState('config'); 
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortOption, setSortOption] = useState(() => localStorage.getItem('urlopik_v5_sort') || 'roi-desc');

  // Symulacja
  const [isSimulationMode, setSimulationMode] = useState(false);
  const [simulatedCancelledBlocks, setSimulatedCancelledBlocks] = useState([]);

  useEffect(() => {
    setSimulationMode(false);
    setSimulatedCancelledBlocks([]);
  }, [planningMode]);

  // Stan budżetu
  const [vacationBudgets, setVacationBudgets] = useState(() => {
    try {
      const saved = localStorage.getItem('urlopik_v5_budgets');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.next && typeof parsed.next.transferDone === 'undefined') parsed.next.transferDone = false;
        return parsed;
      }
      
      const oldBudget = localStorage.getItem('urlopik_v5_budget');
      if (oldBudget) {
        return { 
          current: JSON.parse(oldBudget), 
          next: { current: 26, previous: 0, extra: 0, transferDone: false } 
        };
      }
      return { 
        current: { current: 26, previous: 0, extra: 0 }, 
        next: { current: 26, previous: 0, extra: 0, transferDone: false } 
      };
    } catch (e) { 
      return { 
        current: { current: 26, previous: 0, extra: 0 }, 
        next: { current: 26, previous: 0, extra: 0, transferDone: false } 
      }; 
    }
  });

  const [selectedHacks, setSelectedHacks] = useState(() => {
    try {
      const saved = localStorage.getItem('urlopik_v5_hacks');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [customVacationDays, setCustomVacationDays] = useState(() => {
    try {
      const savedV3 = localStorage.getItem('urlopik_v5_custom_v3');
      if (savedV3) return JSON.parse(savedV3);
      
      const oldSaved = localStorage.getItem('urlopik_v5_custom');
      if (oldSaved) {
        const parsed = JSON.parse(oldSaved);
        return parsed.map(d => typeof d === 'string' ? { date: d, origin: 'current' } : d);
      }
      return [];
    } catch (e) { return []; }
  });

  const [savedPlans, setSavedPlans] = useState(() => {
    try {
      const saved = localStorage.getItem('urlopik_v5_saved_plans');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });
  
  const [newPlanName, setNewPlanName] = useState('');
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', action: null });
  const [transferModal, setTransferModal] = useState({ isOpen: false, unusedDays: 0 });

  // Wyliczenia lat bazowych
  const analysisYears = useMemo(() => planningMode === 'next' ? [currentYear + 1, currentYear + 2] : [currentYear, currentYear + 1], [currentYear, planningMode]);
  
  const holidayList = useMemo(() => [...getHolidaysForYear(analysisYears[0]), ...getHolidaysForYear(analysisYears[1])], [analysisYears]);

  // Aktywny budżet
  const activeBudget = vacationBudgets[planningMode] || { current: 26, previous: 0, extra: 0 };
  const baseTotalAvailable = activeBudget.current + activeBudget.previous + activeBudget.extra;

  const days = useMemo(() => {
    const result = [];
    const startDate = new Date(analysisYears[0], 0, 1);
    const endDate = new Date(analysisYears[1], 0, 31);
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      result.push({ date: d.toLocaleDateString('en-CA'), dateObj: new Date(d) });
    }
    return result;
  }, [analysisYears]);

  const visibleMonths = useMemo(() => {
    const months = [];
    if (planningMode === 'current') {
      const currentMonth = new Date().getMonth();
      for (let m = currentMonth; m <= 11; m++) months.push({ year: currentYear, month: m });
      months.push({ year: currentYear + 1, month: 0 }); 
    } else {
      for (let m = 0; m <= 11; m++) months.push({ year: currentYear + 1, month: m });
      months.push({ year: currentYear + 2, month: 0 });
    }
    return months;
  }, [currentYear, planningMode]);

  const generateReportForMode = (mode) => {
    const activeDates = new Set([
      ...customVacationDays.filter(c => c.origin === mode).map(c => c.date),
      ...selectedHacks.filter(h => h.origin === mode).flatMap(h => h.dates)
    ]);
    const otherDates = new Set([
      ...customVacationDays.filter(c => c.origin !== mode).map(c => c.date),
      ...selectedHacks.filter(h => h.origin !== mode).flatMap(h => h.dates)
    ]);
    
    const sortedDates = Array.from(activeDates).sort((a, b) => new Date(a) - new Date(b));
    const grouped = [];

    for (const dateStr of sortedDates) {
      if (grouped.length === 0) {
        grouped.push({ dates: [dateStr], cost: isWorkDay(new Date(dateStr), holidayList) ? 1 : 0 });
        continue;
      }
      
      const lastGroup = grouped[grouped.length - 1];
      const lastDateStr = lastGroup.dates[lastGroup.dates.length - 1];
      const currDate = new Date(dateStr);
      
      let isConnected = true;
      let checkDate = new Date(lastDateStr);
      checkDate.setDate(checkDate.getDate() + 1);
      
      while (checkDate < currDate) {
        const dateCheckStr = checkDate.toLocaleDateString('en-CA');
        if (isWorkDay(checkDate, holidayList) && !otherDates.has(dateCheckStr)) { 
          isConnected = false; 
          break; 
        }
        checkDate.setDate(checkDate.getDate() + 1);
      }

      if (isConnected) {
        lastGroup.dates.push(dateStr);
        lastGroup.cost += isWorkDay(currDate, holidayList) ? 1 : 0;
      } else {
        grouped.push({ dates: [dateStr], cost: isWorkDay(currDate, holidayList) ? 1 : 0 });
      }
    }

    return grouped.map(group => {
      const originalStart = group.dates[0];
      const originalEnd = group.dates[group.dates.length - 1];
      const startIdx = days.findIndex(d => d.date === originalStart);
      const endIdx = days.findIndex(d => d.date === originalEnd);
      
      let displayStart = originalStart;
      let displayEnd = originalEnd;
      let gain = group.cost;
      
      if (startIdx !== -1 && endIdx !== -1) {
        const { total, actualStart, actualEnd } = calculateTotalFreeRange(days, startIdx, endIdx + 1, holidayList, otherDates);
        displayStart = actualStart;
        displayEnd = actualEnd;
        gain = total;
      }

      const overlappingHacks = selectedHacks.filter(h => h.origin === mode && h.dates.some(d => group.dates.includes(d)));
      const isPureCustom = overlappingHacks.length === 0;
      const isCombined = !isPureCustom && group.dates.some(d => !overlappingHacks.flatMap(h => h.dates).includes(d));

      return { 
        displayStart, displayEnd, cost: group.cost, gain, 
        roi: group.cost > 0 ? gain / group.cost : 0, 
        isCustom: isPureCustom, isCombined, isHack: !isPureCustom,
        dates: group.dates 
      };
    }).sort((a, b) => new Date(a.displayStart) - new Date(b.displayStart));
  };

  const reports = useMemo(() => ({
    current: generateReportForMode('current'),
    next: generateReportForMode('next')
  }), [selectedHacks, customVacationDays, holidayList, days]);

  const unusedCurrentYearDays = useMemo(() => {
    const budget = vacationBudgets.current || { current: 26, previous: 0, extra: 0 };
    const total = budget.current + budget.previous + budget.extra;
    const cost = reports.current.reduce((sum, item) => sum + item.cost, 0);
    return Math.max(0, total - cost);
  }, [vacationBudgets, reports.current]);

  const simulatedBonus = useMemo(() => {
    if (!isSimulationMode) return 0;
    return reports.current
      .filter(item => simulatedCancelledBlocks.includes(item.displayStart))
      .reduce((sum, item) => sum + item.cost, 0);
  }, [isSimulationMode, simulatedCancelledBlocks, reports.current]);

  const totalAvailable = baseTotalAvailable + simulatedBonus;

  // Funkcja resetująca datę analizy na podstawie trybu
  const handleResetAnalysisDate = (mode = planningMode) => {
    if (mode === 'current') {
      setAnalysisStart(new Date().toLocaleDateString('en-CA'));
    } else {
      setAnalysisStart(`${currentYear + 1}-01-01`);
    }
  };

  const handleModeSwitch = (newMode) => {
    if (newMode === 'next' && planningMode === 'current') {
      const hasPrompted = localStorage.getItem('urlopik_transfer_prompted_v522');
      const isActualNewYear = new Date().getFullYear() >= (currentYear + 1); 
      
      if (unusedCurrentYearDays > 0 && !vacationBudgets.next.transferDone && !hasPrompted && isActualNewYear) {
        setTransferModal({ isOpen: true, unusedDays: unusedCurrentYearDays });
        return; 
      }
    }
    setPlanningMode(newMode);
    handleResetAnalysisDate(newMode); // Dodane: Reset daty przy zmianie trybu
  };

  const { usedDays, hackDatesSet, customDatesSet, otherYearDatesSet, simulatedDatesSet, totalFreeDays, activePoolDates } = useMemo(() => {
    const activeHacks = selectedHacks.filter(h => h.origin === planningMode);
    const activeCustom = customVacationDays.filter(c => c.origin === planningMode);
    const otherHacks = selectedHacks.filter(h => h.origin !== planningMode);
    const otherCustom = customVacationDays.filter(c => c.origin !== planningMode);

    const hSet = new Set(activeHacks.flatMap(h => h.dates));
    const cSet = new Set(activeCustom.map(c => c.date));
    const oSet = new Set([
      ...otherHacks.flatMap(h => h.dates),
      ...otherCustom.map(c => c.date)
    ]);

    const simSet = new Set();
    if (isSimulationMode) {
      reports.current
        .filter(item => simulatedCancelledBlocks.includes(item.displayStart))
        .flatMap(item => item.dates)
        .forEach(d => simSet.add(d));
    }

    let cost = 0;
    const activePoolSet = new Set([...hSet, ...cSet]);
    activePoolSet.forEach(dateStr => {
      if (isWorkDay(new Date(dateStr), holidayList)) cost++;
    });

    const allSelected = new Set([...activePoolSet, ...oSet]);
    let totalFree = 0;
    let currentBlockLength = 0;
    let blockHasActiveDay = false;
    
    for (let i = 0; i < days.length; i++) {
      const d = days[i];
      const isSimulatedRemoved = simSet.has(d.date);
      // ZMIANA 1: Ignorujemy otherYearDatesSet przy wyliczaniu zysku dla obecnej puli.
      // Traktujemy je jak zwykłe dni, żeby nie pompowały sztucznie statystyk wyświetlanej puli.
      const isFreeForThisPool = !isWorkDay(d.dateObj, holidayList) || (activePoolSet.has(d.date) && !isSimulatedRemoved);
      
      if (isFreeForThisPool && !oSet.has(d.date)) {
        currentBlockLength++;
        if (activePoolSet.has(d.date) && !isSimulatedRemoved) blockHasActiveDay = true;
      } else {
        if (blockHasActiveDay) totalFree += currentBlockLength;
        currentBlockLength = 0;
        blockHasActiveDay = false;
      }
    }
    if (blockHasActiveDay) totalFree += currentBlockLength;

    return { 
      usedDays: cost, 
      hackDatesSet: hSet, 
      customDatesSet: cSet, 
      otherYearDatesSet: oSet,
      simulatedDatesSet: simSet,
      totalFreeDays: totalFree,
      activePoolDates: activePoolSet
    };
  }, [selectedHacks, customVacationDays, holidayList, days, planningMode, isSimulationMode, simulatedCancelledBlocks, reports.current]);

  const hacks = useMemo(() => {
    const suggestions = [];
    const filterDate = new Date(analysisStart);
    const startIndex = days.findIndex(d => d.dateObj >= filterDate);
    if (startIndex === -1) return [];

    const isDayCostly = (dStr, dObj) => isWorkDay(dObj, holidayList) && !otherYearDatesSet.has(dStr);

    for (let i = startIndex; i < days.length; i++) {
      const isCleanStart = i === 0 || !isDayCostly(days[i-1].date, days[i-1].dateObj);
      
      if (isDayCostly(days[i].date, days[i].dateObj) && isCleanStart) {
        let currentGap = [];
        let j = i;
        
        // Zmieniona pętla: Generuje warianty także lekko ponad limit, by móc zbadać "dni przejściowe"
        while (j < days.length && currentGap.length <= maxSpend + 2) {
          if (otherYearDatesSet.has(days[j].date)) break;
          if (isDayCostly(days[j].date, days[j].dateObj)) {
            currentGap.push(days[j]);
            
            const isCleanEnd = j === days.length - 1 || !isDayCostly(days[j+1].date, days[j+1].dateObj);

            if (isCleanEnd) {
              const { total, actualStart, actualEnd } = calculateTotalFreeRange(days, i, j + 1, holidayList, otherYearDatesSet);
              
              // ZMIANA 2: Tarcza antykolizyjna (ok. tydzień buforu wokół dni z innej puli)
              let tooCloseToOtherYear = false;
              const sIdx = days.findIndex(d => d.date === actualStart);
              const eIdx = days.findIndex(d => d.date === actualEnd);
              if (sIdx !== -1 && eIdx !== -1) {
                for(let k = Math.max(0, sIdx - 6); k < sIdx; k++) {
                  if(otherYearDatesSet.has(days[k].date)) { tooCloseToOtherYear = true; break; }
                }
                if (!tooCloseToOtherYear) {
                  for(let k = eIdx + 1; k <= Math.min(days.length - 1, eIdx + 6); k++) {
                    if(otherYearDatesSet.has(days[k].date)) { tooCloseToOtherYear = true; break; }
                  }
                }
              }

              if (total > currentGap.length && !tooCloseToOtherYear) {
                const roiVal = total / currentGap.length;
                const hackMonth = new Date(actualStart).getMonth();
                suggestions.push({
                  dates: currentGap.map(d => d.date),
                  cost: currentGap.length,
                  gain: total,
                  roi: roiVal,
                  start: currentGap[0].date,
                  end: currentGap[currentGap.length - 1].date,
                  displayStart: actualStart,
                  displayEnd: actualEnd,
                  isExtended: currentGap.length > maxSpend,
                  isTurnOfYear: currentGap.some(d => d.date.includes('-12-') || d.date.includes('-01-01')),
                  isH1: (hackMonth >= 0 && hackMonth <= 5),
                  isH2: (hackMonth >= 6 && hackMonth <= 11),
                  isSummerPriority: (hackMonth >= 5 && hackMonth <= 7), 
                  isWinter: (hackMonth === 11 || hackMonth === 0 || hackMonth === 1) 
                });
              }
            }
          }
          j++;
        }
      }
    }

    const uniqueHacks = [];
    const seen = new Set();
    suggestions.sort((a, b) => b.gain - a.gain).forEach(h => {
      const key = `${h.start}-${h.cost}`;
      if (!seen.has(key)) { uniqueHacks.push(h); seen.add(key); }
    });

    selectedHacks.filter(s => s.origin === planningMode).forEach(s => {
      const key = `${s.start}-${s.cost}`;
      if (!seen.has(key)) { uniqueHacks.push(s); seen.add(key); }
    });

    return uniqueHacks
      .filter(h => {
        const isSelected = selectedHacks.some(s => s.start === h.start && s.cost === h.cost && s.origin === planningMode);
        if (isSelected) return true;
        
        // Wykrywanie dni przejściowych (tzw. "pułapek")
        const isTrap = uniqueHacks.some(h2 => {
          if (h2.cost <= h.cost) return false;
          
          const costDiff = h2.cost - h.cost;
          // Jeżeli przedłużenie urlopu o 1-2 dni zamyka "dziurę" do weekendu/święta i mieści się w puli (maxSpend)
          if (costDiff > 0 && costDiff <= 2 && h2.cost <= maxSpend) {
            const hStart = new Date(h.displayStart);
            const hEnd = new Date(h.displayEnd);
            const h2Start = new Date(h2.displayStart);
            const h2End = new Date(h2.displayEnd);
            return (h2Start <= hStart && h2End >= hEnd);
          }
          return false;
        });
        
        // Wyświetlamy tylko te hacki, które nie są ułomne (nie zostawiają 1-2 dni wolnych do weekendu, gdy stać nas na dłuższą wersję) 
        // i dodatkowo upewniamy się, że same w sobie mieszczą się w budżecie.
        return !isTrap && h.cost <= maxSpend;
      })
      .filter(h => {
        const isSelected = selectedHacks.some(s => s.start === h.start && s.cost === h.cost && s.origin === planningMode);
        if (isSelected) return true;
        if (new Date(h.displayStart).getFullYear() > analysisYears[0]) return false;
        if (activeFilter === 'h1') return h.isH1;
        if (activeFilter === 'h2') return h.isH2;
        if (activeFilter === 'summer') return h.isSummerPriority;
        if (activeFilter === 'winter') return h.isWinter;
        if (activeFilter === 'long') return h.gain >= 9;
        return true; 
      })
      .sort((a, b) => {
        const [key, direction] = sortOption.split('-');
        const dir = direction === 'asc' ? 1 : -1;
        if (key === 'roi') return (a.roi - b.roi) * dir; 
        if (key === 'gain') return (a.gain - b.gain) * dir; 
        if (key === 'cost') return (a.cost - b.cost) * dir; 
        if (key === 'date') return (new Date(a.start) - new Date(b.start)) * dir; 
        return 0;
      })
      .slice(0, 200); 
  }, [days, maxSpend, analysisStart, sortOption, holidayList, activeFilter, otherYearDatesSet, analysisYears, selectedHacks, planningMode]);

  const reportItems = reports[planningMode];

  useEffect(() => {
    localStorage.setItem('urlopik_v5_budgets', JSON.stringify(vacationBudgets));
    localStorage.setItem('urlopik_v5_mode', planningMode);
    localStorage.setItem('urlopik_v5_theme', theme);
    localStorage.setItem('urlopik_v5_hacks', JSON.stringify(selectedHacks));
    localStorage.setItem('urlopik_v5_custom_v3', JSON.stringify(customVacationDays));
    localStorage.setItem('urlopik_v5_saved_plans', JSON.stringify(savedPlans));
    localStorage.setItem('urlopik_v5_on_demand', onDemandReserve.toString());
    localStorage.setItem('urlopik_v5_max_spend', maxSpend.toString());
    localStorage.setItem('urlopik_v5_sort', sortOption);
    localStorage.setItem('urlopik_v5_start', analysisStart);
    applyNativeTheme(theme);
  }, [vacationBudgets, planningMode, theme, selectedHacks, customVacationDays, savedPlans, onDemandReserve, maxSpend, analysisStart, sortOption]);

  const handleApplySimulation = () => {
    let newCustom = [...customVacationDays];
    let newHacks = [...selectedHacks];
    let bonusToAdd = 0;
    const datesToRemove = new Set();
    reports.current.forEach(item => {
      if (simulatedCancelledBlocks.includes(item.displayStart)) {
          bonusToAdd += item.cost;
          item.dates.forEach(d => datesToRemove.add(d));
      }
    });
    datesToRemove.forEach(dateStr => {
      const hackIdx = newHacks.findIndex(h => h.origin === 'current' && h.dates.includes(dateStr));
      if (hackIdx !== -1) {
          const hack = newHacks[hackIdx];
          newHacks.splice(hackIdx, 1);
          const remaining = hack.dates.filter(d => d !== dateStr);
          remaining.forEach(rd => {
            if (!newCustom.some(c => c.date === rd && c.origin === 'current')) {
                newCustom.push({ date: rd, origin: 'current' });
            }
          });
      }
      const customIdx = newCustom.findIndex(c => c.date === dateStr && c.origin === 'current');
      if (customIdx !== -1) {
          newCustom.splice(customIdx, 1);
      }
    });
    setCustomVacationDays(newCustom);
    setSelectedHacks(newHacks);
    setVacationBudgets(p => ({
      ...p,
      next: { ...p.next, previous: p.next.previous + bonusToAdd, transferDone: true }
    }));
    setSimulationMode(false);
    setSimulatedCancelledBlocks([]);
    setConfirmModal({
      isOpen: true, 
      title: 'Transfer Zakończony', 
      message: `Uwolniono zaznaczone terminy z ${currentYear} r. Dodano +${bonusToAdd} dni do budżetu zaległego na ${currentYear + 1} r.`, 
      action: null
    });
  };

  const generatePDF = () => {
    const originalTitle = document.title;
    document.title = `plan_na_rok_${analysisYears[0]}_${new Date().toLocaleDateString('pl-PL').replace(/\./g, '-')}`;
    setTimeout(() => { 
      window.print(); 
      setTimeout(() => document.title = originalTitle, 1000); 
    }, 300);
  };

  const handleExportICS = () => {
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Urlopik Pro//PL\n";
    reportItems.forEach((item) => {
      const start = new Date(item.displayStart).toISOString().replace(/-|:|\.\d+/g, '').slice(0, 8);
      const endD = new Date(item.displayEnd);
      endD.setDate(endD.getDate() + 1);
      const end = endD.toISOString().replace(/-|:|\.\d+/g, '').slice(0, 8);
      icsContent += "BEGIN:VEVENT\n";
      icsContent += `DTSTART;VALUE=DATE:${start}\n`;
      icsContent += `DTEND;VALUE=DATE:${end}\n`;
      icsContent += `SUMMARY:Urlop (${item.gain} dni)\n`;
      icsContent += `DESCRIPTION:Wygenerowano w aplikacji Urlopik Pro.\n`;
      icsContent += "END:VEVENT\n";
    });
    icsContent += "END:VCALENDAR";
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `plan_urlopowy_${analysisYears[0]}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDayClick = (dateStr) => {
    const hackIndex = selectedHacks.findIndex(h => h.dates.includes(dateStr));
    if (hackIndex !== -1) {
      const hack = selectedHacks[hackIndex];
      setSelectedHacks(prev => prev.filter((_, i) => i !== hackIndex));
      const remainingDays = hack.dates.filter(d => d !== dateStr).map(d => ({ date: d, origin: hack.origin }));
      setCustomVacationDays(prev => {
        const filtered = prev.filter(c => c.date !== dateStr); 
        remainingDays.forEach(rd => {
          if (!filtered.some(f => f.date === rd.date)) filtered.push(rd);
        });
        return filtered;
      });
      return;
    }
    
    // Blokada ręcznego zaznaczania weekendów i świąt
    const dObj = new Date(dateStr);
    if (!isWorkDay(dObj, holidayList)) {
      return;
    }

    const existingCustomIndex = customVacationDays.findIndex(c => c.date === dateStr);
    if (existingCustomIndex !== -1) {
      setCustomVacationDays(prev => prev.filter((_, i) => i !== existingCustomIndex));
    } else {
      setCustomVacationDays(prev => [...prev, { date: dateStr, origin: planningMode }]);
    }
  };

  const toggleHackSelection = (hack) => {
    setSelectedHacks(prev => {
      const exists = prev.find(h => h.start === hack.start && h.cost === hack.cost && h.origin === planningMode);
      if (exists) return prev.filter(h => h !== exists);
      return [...prev, { ...hack, origin: planningMode }];
    });
  };

  const handleSavePlan = () => {
    if (!newPlanName.trim()) return;
    setSavedPlans([
      { 
        id: Date.now(), 
        name: newPlanName, 
        vacationBudgets, 
        selectedHacks, 
        customVacationDays, 
        planningMode, 
        timestamp: new Date().toLocaleString() 
      }, 
      ...savedPlans
    ]);
    setNewPlanName('');
  };

  const handleLoadPlan = (plan) => {
    setConfirmModal({ 
      isOpen: true, 
      title: "Wczytaj zapisany plan", 
      message: `Czy na pewno chcesz zastąpić swój obecny obszar roboczy planem: "${plan.name}"? Twoje niezapisane zmiany zostaną utracone.`, 
      action: () => {
        setVacationBudgets(plan.vacationBudgets || vacationBudgets); 
        setSelectedHacks(plan.selectedHacks || []); 
        setCustomVacationDays(plan.customVacationDays || []); 
        if (plan.planningMode) setPlanningMode(plan.planningMode);
        setShowSettings(false);
      }
    });
  };

  const handleExportBackup = () => {
    const data = { vacationBudgets, selectedHacks, customVacationDays, onDemandReserve, savedPlans, version: "5.29" };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `urlopik_pro_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportBackup = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.vacationBudgets) setVacationBudgets(data.vacationBudgets);
        if (data.selectedHacks) setSelectedHacks(data.selectedHacks);
        if (data.customVacationDays) setCustomVacationDays(data.customVacationDays);
        if (data.savedPlans) setSavedPlans(data.savedPlans);
        if (data.onDemandReserve) setOnDemandReserve(data.onDemandReserve);
        setConfirmModal({ isOpen: true, title: "Sukces", message: "Kopia zapasowa wczytana pomyślnie!", action: () => setShowSettings(false) });
      } catch (err) {
        setConfirmModal({ isOpen: true, title: "Błąd pliku", message: "Wybrany plik jest uszkodzony lub nie jest prawidłową kopią.", action: null });
      }
    };
    reader.readAsText(file);
    event.target.value = null; 
  };

  const isOverLimit = usedDays > totalAvailable;
  const isUsingReserve = !isOverLimit && usedDays > (totalAvailable - onDemandReserve);
  const hasData = reportItems.length > 0;

  const filterBtns = [
    { id: 'all', l: 'Wszystkie', baseClass: 'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300', activeClass: 'bg-slate-800 text-white dark:bg-slate-700 shadow-md ring-1 ring-slate-900/5 dark:ring-white/10' },
    { id: 'h1', l: 'I Półrocze', baseClass: 'bg-indigo-50 text-indigo-600 border border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20', activeClass: 'bg-indigo-500 text-white border-transparent shadow-md' },
    { id: 'h2', l: 'II Półrocze', baseClass: 'bg-teal-50 text-teal-600 border border-teal-200 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/20', activeClass: 'bg-teal-500 text-white border-transparent shadow-md' },
    { id: 'summer', l: '☀️ Lato', baseClass: 'bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-500 dark:border-amber-500/20', activeClass: 'bg-amber-400 text-amber-950 border-transparent shadow-md' },
    { id: 'winter', l: '❄️ Zima', baseClass: 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-500 dark:border-blue-500/20', activeClass: 'bg-blue-400 text-blue-950 border-transparent shadow-md' },
    { id: 'long', l: 'Długie (9+ dni)', baseClass: 'bg-purple-50 text-purple-600 border border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20', activeClass: 'bg-purple-500 text-white border-transparent shadow-md' }
  ];

  let remainingBgClass = 'bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/30';
  let remainingLabelClass = 'text-emerald-700 dark:text-emerald-500';
  let remainingValueClass = 'text-emerald-600 dark:text-emerald-400';

  if (isSimulationMode && simulatedBonus > 0) {
    remainingBgClass = 'bg-purple-100 border-purple-300 dark:bg-purple-500/20 dark:border-purple-500/50';
    remainingLabelClass = 'text-purple-700 dark:text-purple-400';
    remainingValueClass = 'text-purple-600 dark:text-purple-400 animate-pulse';
  } else if (isOverLimit) {
    remainingBgClass = 'bg-rose-50 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/30';
    remainingLabelClass = 'text-rose-600 dark:text-rose-500';
    remainingValueClass = 'text-rose-600 dark:text-rose-500';
  } else if (isUsingReserve && onDemandReserve > 0) {
    remainingBgClass = 'bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/30';
    remainingLabelClass = 'text-amber-700 dark:text-amber-500';
    remainingValueClass = 'text-amber-600 dark:text-amber-400';
  }

  return (
    <>
      <div className={`h-screen w-full flex flex-col font-sans overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'dark bg-[#111111] text-slate-200' : 'bg-slate-50 text-slate-900'}`}>
        
        {/* --- HEADER --- */}
        <header className="h-[60px] shrink-0 bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-white/5 flex items-center justify-between px-6 z-30 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <Palmtree className="text-emerald-500" size={20} />
            </div>
            <h1 className="text-base font-bold tracking-wide text-slate-800 dark:text-white flex items-center gap-2">
              Urlopik Pro <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-full border border-slate-200 dark:border-white/5">v5.29.5</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
              className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button 
              onClick={() => setShowSettings(true)} 
              className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-lg transition-all text-sm font-semibold"
            >
              <Settings2 size={16}/> Ustawienia
            </button>
            <button 
              onClick={() => setShowHelp(true)}
              className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-lg transition-all text-sm font-semibold"
            >
              <HelpCircle size={16}/> Pomoc
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden relative print:block print:overflow-visible">
          
          {/* --- SIDEBAR --- */}
          <aside className="w-[340px] shrink-0 bg-white dark:bg-[#161616] border-r border-slate-200/80 dark:border-white/5 flex flex-col z-20 print:hidden overflow-y-auto custom-scrollbar shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-none">
            <div className="p-6 space-y-8">
              
              <section className="space-y-4">
                <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <LayoutDashboard size={16} /> Parametry Analizy
                </h2>
                
                <div className="flex bg-slate-100 dark:bg-[#0a0a0a] p-1.5 rounded-lg border border-slate-200/60 dark:border-white/5 shadow-inner">
                  <button onClick={() => handleModeSwitch('current')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${planningMode === 'current' ? 'bg-white dark:bg-[#242424] text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-400'}`}>Bieżący ({currentYear})</button>
                  <button onClick={() => handleModeSwitch('next')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${planningMode === 'next' ? 'bg-white dark:bg-[#242424] text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-400'}`}>Przyszły ({currentYear + 1})</button>
                </div>

                <div className="space-y-4 pt-1">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">Analizuj od:</label>
                      <button 
                        onClick={() => handleResetAnalysisDate()} 
                        title="Przywróć domyślną datę"
                        className="p-1 text-slate-400 hover:text-emerald-500 transition-colors"
                      >
                        <RotateCcw size={14} />
                      </button>
                    </div>
                    <input type="date" value={analysisStart} onChange={e => setAnalysisStart(e.target.value)} className="w-full bg-slate-50 dark:bg-[#111111] border border-slate-200/60 dark:border-white/5 rounded-lg px-4 py-2.5 text-base font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-emerald-500 transition-all dark:[color-scheme:dark]" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Limit na hack</label>
                      <span className="text-xs font-bold bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded border border-emerald-200 dark:border-emerald-500/20">{maxSpend} DNI</span>
                    </div>
                    <input type="range" min="1" max="15" value={maxSpend} onChange={(e) => setMaxSpend(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <PlusCircle size={16} /> Twój Budżet {planningMode === 'current' ? currentYear : currentYear + 1}
                </h2>
                <div className="p-4 bg-slate-50/50 dark:bg-[#111111] border border-slate-100 dark:border-white/5 rounded-[20px]">
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[{l: 'Bazowa', k: 'current'}, {l: 'Zaległy', k: 'previous'}, {l: 'Dodatk.', k: 'extra'}].map(i => (
                      <div key={i.k} className="flex flex-col items-center group">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">{i.l}</span>
                        <input type="number" min="0" value={activeBudget[i.k]} onChange={(e) => {
                            const val = Math.max(0, parseInt(e.target.value) || 0);
                            setVacationBudgets(p => ({...p, [planningMode]: {...p[planningMode], [i.k]: val}}));
                          }} className="w-full bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 group-hover:border-emerald-300 dark:group-hover:border-emerald-500/50 rounded-xl py-2 text-center font-bold text-lg text-slate-800 dark:text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-sm" />
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-slate-200 dark:border-white/5 my-3"></div>
                  <div className="flex justify-between items-center px-1"><span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Łącznie w puli</span><span className="text-base font-bold text-slate-700 dark:text-slate-300">{totalAvailable} dni</span></div>
                  
                  {/* Suwak URLOPU NA ŻĄDANIE */}
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2 px-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Rezerwa UŻ</label>
                      <span className="text-xs font-bold bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded border border-amber-200 dark:border-amber-500/20">{onDemandReserve} DNI</span>
                    </div>
                    <input type="range" min="0" max="10" value={onDemandReserve} onChange={(e) => setOnDemandReserve(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500" />
                  </div>

                  <div className={`mt-5 p-5 rounded-xl flex justify-between items-center border shadow-sm transition-colors ${remainingBgClass}`}>
                    <span className={`text-sm font-black uppercase tracking-widest ${remainingLabelClass}`}>Pozostało</span>
                    <span className={`text-4xl font-black ${remainingValueClass}`}>{totalAvailable - usedDays}d</span>
                  </div>
                  {planningMode === 'next' && unusedCurrentYearDays > 0 && !vacationBudgets.next.transferDone && !isSimulationMode && (
                    <button 
                      onClick={() => setVacationBudgets(p => ({...p, next: {...p.next, previous: unusedCurrentYearDays, transferDone: true}}))} 
                      className="w-full mt-4 py-3 px-4 text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-xl flex items-center justify-center gap-2.5 transition-all border border-blue-200 dark:border-blue-500/20 shadow-sm leading-tight text-center"
                    >
                      <RefreshCw size={16} className="shrink-0" />
                      <span>Przenieś zeszłoroczny urlop <span className="whitespace-nowrap">(+{unusedCurrentYearDays} dni)</span></span>
                    </button>
                  )}
                  {planningMode === 'next' && reports.current.length > 0 && (
                    <button onClick={() => setSimulationMode(!isSimulationMode)} className={`w-full mt-3 py-2.5 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm border ${isSimulationMode ? 'bg-purple-600 text-white border-purple-700 hover:bg-purple-700' : 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 hover:bg-purple-100 dark:hover:bg-purple-500/20 border-purple-200 dark:border-purple-500/20'}`}><Wand2 size={14}/> {isSimulationMode ? 'Zakończ symulację' : 'Tryb Symulacji Transferu'}</button>
                  )}
                </div>
                {isSimulationMode && (
                  <div className="mt-4 p-5 bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-500/30 rounded-xl space-y-4 animate-in fade-in">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-purple-700 dark:text-purple-400 mb-2 border-b border-purple-200 dark:border-purple-500/30 pb-3 flex items-center gap-2"><Wand2 size={14}/> Zrezygnuj w {currentYear}:</h4>
                    <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
                      {reports.current.map((item, idx) => (
                        <label key={idx} className="flex items-start gap-3 cursor-pointer group">
                          <input type="checkbox" checked={simulatedCancelledBlocks.includes(item.displayStart)} onChange={(e) => {
                              if (e.target.checked) setSimulatedCancelledBlocks([...simulatedCancelledBlocks, item.displayStart]);
                              else setSimulatedCancelledBlocks(simulatedCancelledBlocks.filter(b => b !== item.displayStart));
                            }} className="mt-1 w-4 h-4 accent-purple-500 rounded cursor-pointer shrink-0" />
                          <div><div className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-purple-600 transition-colors">{formatDateShort(item.displayStart)} {item.displayStart !== item.displayEnd ? `- ${formatDateShort(item.displayEnd)}` : ''}</div><div className="text-xs font-bold text-purple-500 dark:text-purple-400">+ do budżetu {item.cost} d</div></div>
                        </label>
                      ))}
                    </div>
                    {simulatedCancelledBlocks.length > 0 && (
                      <button onClick={handleApplySimulation} className="w-full mt-4 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold text-sm rounded-lg shadow-md transition-colors">Zatwierdź Transfer (+{simulatedBonus} dni)</button>
                    )}
                  </div>
                )}
                {usedDays > 0 && !isSimulationMode && (
                  <div className="mt-6 space-y-3">
                    <div className="text-base sm:text-lg text-center font-medium text-slate-500 dark:text-slate-400 leading-relaxed">Użyto <strong className="text-slate-700 dark:text-slate-300">{usedDays} dni</strong> z tej puli,<br/>co daje łącznie <strong className="text-emerald-600 dark:text-emerald-400">{totalFreeDays} dni wolnych!</strong></div>
                    {isOverLimit && <div className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 p-3 rounded-xl border border-rose-200 dark:border-rose-500/20 text-center flex items-center justify-center gap-2 shadow-sm"><AlertTriangle size={16} /> Przekroczono dostępny budżet!</div>}
                    {isUsingReserve && onDemandReserve > 0 && !isOverLimit && <div className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 p-3 rounded-xl border border-amber-200 dark:border-amber-500/20 text-center flex items-center justify-center gap-2 shadow-sm"><AlertCircle size={16} /> Naruszasz rezerwę urlopu na żądanie!</div>}
                  </div>
                )}
              </section>

              <section className="pt-4 flex flex-col gap-3">
                <button onClick={() => setShowPreview(true)} disabled={!hasData || isOverLimit} className="w-full py-4 bg-slate-900 dark:bg-emerald-500 text-white rounded-xl font-bold text-base shadow-lg shadow-slate-900/10 dark:shadow-emerald-500/20 hover:bg-slate-800 dark:hover:bg-emerald-400 transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2"><Eye size={20}/> Podgląd Raportu</button>
                <button onClick={handleExportICS} disabled={!hasData || isOverLimit} className="w-full py-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:grayscale"><CalendarPlus size={18}/> Dodaj do Kalendarza (.ics)</button>
                <div className="flex gap-3">
                   <button onClick={handleExportBackup} className="flex-1 py-3 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-[#222] rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"><Download size={16}/> Kopia (JSON)</button>
                   <button onClick={() => setConfirmModal({isOpen: true, title: "Wyczyść kalendarz", message: `Czy usunąć wszystkie zaplanowane dni (własne i hacki) przypisane wyłącznie do puli roku ${planningMode === 'current' ? currentYear : currentYear + 1}?`, action: () => { setSelectedHacks(p => p.filter(h => h.origin !== planningMode)); setCustomVacationDays(p => p.filter(c => c.origin !== planningMode)); }})} className="flex-1 py-3 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-[#222] rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"><Trash2 size={16} /></button>
                </div>
              </section>
            </div>
          </aside>

          {/* --- MAIN CONTENT --- */}
          <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 bg-slate-50/50 dark:bg-[#111111] relative transition-colors">
            <div className="max-w-[1400px] mx-auto space-y-10">
              <section>
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-black flex items-center gap-3 text-slate-800 dark:text-white tracking-tight"><Zap className="text-amber-500" size={28} fill="currentColor"/> Znalezione okazje urlopowe</h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">Zakres wyszukiwania: od {Math.max(1, maxSpend - 2)} do {maxSpend + 2} dni z budżetu</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-4 mb-8 bg-white/70 dark:bg-[#1a1a1a]/80 backdrop-blur-md p-4 px-5 rounded-2xl border border-slate-200/60 dark:border-white/5 shadow-sm overflow-hidden">
                  <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar w-full sm:w-auto pb-2 sm:pb-0 -mb-2 sm:mb-0">
                     {filterBtns.map(f => (
                       <button key={f.id} onClick={() => setActiveFilter(f.id)} className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap shrink-0 ${activeFilter === f.id ? f.activeClass : `hover:opacity-80 ${f.baseClass}`}`}>{f.l}</button>
                     ))}
                  </div>
                  <div className="flex items-center gap-3 sm:pl-4 sm:border-l border-slate-200 dark:border-white/10 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest shrink-0"><ArrowUpDown size={14}/> Sortuj:</div>
                    <select value={sortOption} onChange={e => setSortOption(e.target.value)} className="bg-slate-100 dark:bg-[#111111] border border-transparent dark:border-white/10 rounded-xl px-4 py-2 text-base font-bold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer transition-all shadow-inner w-full sm:w-auto">
                      <option value="roi-desc">Najlepsze ROI (Zysk)</option>
                      <option value="gain-desc">Najdłuższe przerwy</option>
                      <option value="cost-asc">Najmniejszy koszt</option>
                      <option value="date-asc">Chronologicznie</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {hacks.length === 0 ? (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 border border-dashed border-slate-300 dark:border-white/10 rounded-[20px] bg-white/50 dark:bg-[#1a1a1a]/50"><Filter size={40} className="mb-4 opacity-50" /><span className="font-bold text-base">Brak propozycji spełniających kryteria.</span></div>
                  ) : hacks.map((h, i) => {
                    const isSelected = selectedHacks.some(s => s.start === h.start && s.cost === h.cost && s.origin === planningMode);
                    const hStart = new Date(h.displayStart).getTime();
                    const hEnd = new Date(h.displayEnd).getTime();
                    const isConflicting = !isSelected && selectedHacks.some(s => {
                      if (s.origin !== planningMode) return false;
                      const sStart = new Date(s.displayStart).getTime();
                      const sEnd = new Date(s.displayEnd).getTime();
                      return sStart <= hEnd && hStart <= sEnd;
                    });
                    const isManualConflict = !isSelected && customVacationDays.some(c => {
                      if (c.origin !== planningMode) return false;
                      const cDate = new Date(c.date).getTime();
                      return cDate >= hStart && cDate <= hEnd;
                    });
                    const isDisabled = isConflicting || isManualConflict;
                    let tooltipText = "";
                    if (isManualConflict) tooltipText = "Termin zajęty przez ręcznie wybrany urlop";
                    else if (isConflicting) tooltipText = "Konflikt z zaplanowanym Hackiem";
                    
                    const costRatio = Math.min(100, Math.max(0, (h.cost / h.gain) * 100));
                    const gainRatio = 100 - costRatio;
                    return (
                      <div key={i} title={tooltipText} onClick={() => !isDisabled && toggleHackSelection(h)} className={`p-5 rounded-[20px] transition-all duration-300 relative flex flex-col justify-between min-h-[140px] group overflow-hidden ${isSelected ? 'ring-2 ring-emerald-500 bg-emerald-50/80 dark:bg-[#18221c] shadow-lg -translate-y-1 cursor-pointer z-10' : (isDisabled ? 'border border-slate-200 dark:border-transparent bg-slate-50 dark:bg-[#161616] opacity-40 grayscale cursor-not-allowed' : 'border border-slate-200 dark:border-white/5 bg-white dark:bg-[#161616] hover:border-emerald-400 dark:hover:border-emerald-500/50 hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)] hover:-translate-y-1.5 cursor-pointer z-0 hover:z-20')}`}>
                        {isSelected && <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>}
                        <div className="flex justify-between items-start mb-3 mt-1">
                           <div className="flex flex-wrap gap-1.5">
                             <div className={`text-[11px] font-black px-2.5 py-1 rounded-md shadow-sm ${isSelected ? 'bg-emerald-500 text-white' : 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'}`}>ZYSK {h.roi.toFixed(1)}x</div>
                             {h.isSummerPriority && <div className="text-[10px] font-bold px-2 py-1 rounded-md bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center gap-1"><Sun size={10}/> Lato</div>}
                             {h.isWinter && <div className="text-[10px] font-bold px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 flex items-center gap-1"><Moon size={10}/> Zima</div>}
                           </div>
                           <div className="text-right shrink-0"><div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Koszt</div><div className="text-lg font-black text-slate-800 dark:text-slate-200 leading-none">{h.cost} dni</div></div>
                        </div>
                        <div className="my-1.5">
                          <div className="font-black text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight flex items-center gap-2">{formatDateShort(h.displayStart)} <ArrowRightCircle size={16} className="opacity-30 shrink-0"/> {formatDateShort(h.displayEnd)}</div>
                          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">{new Date(h.displayStart).getFullYear()} • łącznie {h.gain} dni wolnego</div>
                        </div>
                        <div className="flex justify-between items-end mt-2 gap-4">
                           <div className="flex-1 flex flex-col justify-end"><div className="flex h-1.5 w-full rounded-full overflow-hidden mt-2 bg-slate-100 dark:bg-slate-800"><div style={{width: `${costRatio}%`}} className={`transition-colors ${isSelected ? 'bg-emerald-400' : 'bg-slate-300 dark:bg-slate-600'}`}></div><div style={{width: `${gainRatio}%`}} className={`transition-colors ${isSelected ? 'bg-emerald-600' : 'bg-emerald-500'}`}></div></div></div>
                           <div className={`transition-colors shrink-0 ${isSelected ? 'text-emerald-500 drop-shadow-md' : 'text-slate-200 dark:text-slate-700 group-hover:text-emerald-400'}`}>{isSelected ? <CheckCircle2 size={24} fill="currentColor" className="text-white dark:text-[#18221c]"/> : <Circle size={24} />}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section>
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-8 gap-5 border-t border-slate-200 dark:border-white/5 pt-12">
                  <div><h3 className="text-xl md:text-2xl font-black flex items-center gap-3 text-slate-800 dark:text-white tracking-tight"><CalendarDays className="text-blue-500" size={28}/> Kalendarz podglądu ({planningMode === 'current' ? currentYear : currentYear + 1})</h3><p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-2">KLIKNIJ DNI, ABY ZAPLANOWAĆ (BĄDŹ ZWOLNIĆ) W RAMACH OBECNEJ PULI</p></div>
                  <div className="flex flex-wrap gap-5 text-xs font-bold uppercase tracking-widest text-slate-500 bg-white dark:bg-[#1a1a1a] px-5 py-3 rounded-[20px] border border-slate-200 dark:border-white/5 shadow-sm">
                     <span className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-full shadow-sm"></div> HACKI</span>
                     <span className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div> WŁASNE</span>
                     <span className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-300 dark:bg-slate-700 border border-slate-400 dark:border-slate-500 border-dashed rounded-full shadow-sm"></div> Z INNEJ PULI</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {visibleMonths.map(m => (
                    <MonthView key={`${m.year}-${m.month}`} {...m} holidayList={holidayList} hackDates={hackDatesSet} customDates={customDatesSet} otherYearDates={otherYearDatesSet} simulatedDates={simulatedDatesSet} activePoolDates={activePoolDates} onDayClick={handleDayClick} />
                  ))}
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>

      {/* MODALE */}
      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a1a1a] w-full max-w-2xl rounded-[20px] shadow-2xl flex flex-col overflow-hidden border border-slate-100 dark:border-white/10">
            <div className="px-8 py-5 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50 dark:bg-[#111111]">
              <h3 className="text-lg font-black uppercase tracking-widest text-slate-800 dark:text-white flex items-center gap-3">
                <Settings2 size={24} className="text-emerald-500" /> Ustawienia i Zapisane Plany
              </h3>
              <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X size={24}/>
              </button>
            </div>
            
            <div className="flex border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-[#161616]">
              <button onClick={() => setSettingsTab('config')} className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-colors border-b-2 ${settingsTab === 'config' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-[#1a1a1a]' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                Konfiguracja
              </button>
              <button onClick={() => setSettingsTab('saved')} className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-colors border-b-2 ${settingsTab === 'saved' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-[#1a1a1a]' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                Zapisane Warianty ({savedPlans.length})
              </button>
            </div>

            <div className="p-8 overflow-y-auto max-h-[60vh] custom-scrollbar bg-white dark:bg-[#1a1a1a]">
              {settingsTab === 'config' && (
                <div className="space-y-8">
                  <section>
                    <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Zarządzanie Danymi</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <button onClick={handleExportBackup} className="py-3 bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-bold rounded-xl flex items-center justify-center gap-2 text-sm transition-colors border border-slate-200 dark:border-white/5 shadow-sm">
                        <Download size={18} /> Kopia (.json)
                      </button>
                      <label className="py-3 bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-bold rounded-xl flex items-center justify-center gap-2 text-sm transition-colors border border-slate-200 dark:border-white/5 shadow-sm cursor-pointer">
                        <Upload size={18} /> Wczytaj Kopię
                        <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                      </label>
                    </div>
                    <button onClick={() => setConfirmModal({isOpen: true, title: 'Twardy Reset', message: 'Czy na pewno chcesz usunąć absolutnie wszystkie dane aplikacji? Tej operacji nie można cofnąć.', action: () => { localStorage.clear(); window.location.reload(); }})} className="mt-4 w-full py-3 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold rounded-xl flex items-center justify-center gap-2 text-sm transition-colors border border-rose-200 dark:border-rose-500/20 shadow-sm">
                      <Trash2 size={18} /> Usuń wszystkie dane i zresetuj
                    </button>
                  </section>
                  
                  <section>
                    <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Motyw Aplikacji</h4>
                    <div className="flex bg-slate-100 dark:bg-[#0a0a0a] p-1.5 rounded-xl border border-slate-200/60 dark:border-white/5 shadow-inner">
                      <button onClick={() => setTheme('light')} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${theme === 'light' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                        <Sun size={18}/> Jasny
                      </button>
                      <button onClick={() => setTheme('dark')} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${theme === 'dark' ? 'bg-[#242424] text-white shadow-sm border border-white/5' : 'text-slate-500 hover:text-slate-300'}`}>
                        <Moon size={18}/> Ciemny
                      </button>
                    </div>
                  </section>
                </div>
              )}
              
              {settingsTab === 'saved' && (
                <div className="space-y-6">
                  <div className="flex gap-3">
                    <input type="text" value={newPlanName} onChange={e => setNewPlanName(e.target.value)} placeholder="Wpisz nazwę obecnego planu..." className="flex-1 bg-slate-50 dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 font-bold text-slate-800 dark:text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" />
                    <button onClick={handleSavePlan} disabled={!newPlanName.trim()} className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 disabled:dark:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center gap-2 transition-colors shadow-sm">
                      <Save size={18} /> Zapisz
                    </button>
                  </div>
                  
                  {savedPlans.length === 0 ? (
                    <div className="py-12 flex flex-col items-center text-center text-slate-400 dark:text-slate-500 font-medium bg-slate-50 dark:bg-[#111] rounded-2xl border border-dashed border-slate-200 dark:border-white/5">
                      <FolderOpen size={48} className="mb-4 opacity-50" />
                      Nie masz jeszcze żadnych zapisanych planów.<br/>Skonfiguruj urlop i zapisz go powyżej!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {savedPlans.map(plan => (
                        <div key={plan.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-white/5 rounded-xl gap-4 hover:border-emerald-500/30 transition-colors">
                          <div>
                            <h5 className="font-bold text-slate-800 dark:text-white text-base">{plan.name}</h5>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                              <CalendarDays size={12}/> {plan.planningMode === 'current' ? currentYear : currentYear + 1} &nbsp;•&nbsp; {plan.timestamp}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button onClick={() => handleLoadPlan(plan)} className="px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-sm rounded-lg transition-colors flex items-center gap-2 shadow-sm border border-blue-200 dark:border-blue-500/20">
                              <FolderOpen size={16} /> Wczytaj
                            </button>
                            <button onClick={() => setSavedPlans(prev => prev.filter(p => p.id !== plan.id))} className="p-2.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 rounded-lg transition-colors border border-transparent hover:border-rose-200 dark:hover:border-rose-500/20">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showHelp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a1a1a] w-full max-w-5xl rounded-[20px] shadow-2xl flex flex-col overflow-hidden border border-slate-100 dark:border-white/10">
            <div className="px-8 py-5 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50 dark:bg-[#111111]"><h3 className="text-lg font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-500 flex items-center gap-3">Pomoc / FAQ</h3><button onClick={() => setShowHelp(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-white"><X size={24}/></button></div>
            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10 text-slate-700 dark:text-slate-300 bg-white dark:bg-[#1a1a1a]">
              <div className="space-y-6">
                <button onClick={() => { setShowHelp(false); setShowGuide(true); }} className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base rounded-[20px] shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"><BookOpen size={20} /> Otwórz pełny przewodnik po aplikacji <ChevronRight size={18} /></button>
                <div className="bg-slate-50 dark:bg-[#111] p-6 rounded-[20px] border border-slate-100 dark:border-white/5">
                  <h4 className="text-base font-black mb-3 flex items-center gap-2 text-slate-800 dark:text-white"><Zap size={20} className="text-emerald-500"/> Co to są "Hacki"?</h4>
                  <p className="text-sm font-medium leading-relaxed">To automatycznie wyliczone okresy, w których biorąc kilka dni urlopu, otrzymujesz długi ciąg dni wolnych dzięki sąsiedztwu weekendów i świąt.</p>
                  <img src="headerIcon.bmp" alt="Podgląd Hacków" className="mt-4 w-full h-auto rounded-xl border border-slate-200 dark:border-white/10 shadow-sm object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              </div>
              <div className="space-y-6 flex flex-col">
                <div className="bg-slate-50 dark:bg-[#111] p-6 rounded-[20px] border border-slate-100 dark:border-white/5 flex-1">
                  <h4 className="text-base font-black mb-5 flex items-center gap-2 text-slate-800 dark:text-white"><Info size={20} className="text-purple-500"/> Legenda kolorów</h4>
                  <ul className="space-y-4 text-sm font-medium">
                    <li className="flex items-center gap-3"><div className="w-4 h-4 bg-emerald-500 rounded-sm shrink-0"></div> <span><strong>Zielony:</strong> Wybrany Hack (optymalny most urlopowy).</span></li>
                    <li className="flex items-center gap-3"><div className="w-4 h-4 bg-blue-500 rounded-sm shrink-0"></div> <span><strong>Niebieski:</strong> Twój własny, ręcznie zaplanowany dzień urlopu.</span></li>
                    <li className="flex items-center gap-3"><div className="w-4 h-4 bg-slate-300 dark:bg-slate-700 opacity-70 rounded-sm shrink-0"></div> <span><strong>Wyszarzony:</strong> Dzień urlopu, który już minął (wykorzystany).</span></li>
                    <li className="flex items-center gap-3"><div className="w-4 h-4 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-sm shrink-0"></div> <span><strong>Szary z przerywaną ramką:</strong> Urlop "opłacony" z budżetu innego roku.</span></li>
                  </ul>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-[#111] p-5 rounded-[20px] border border-slate-100 dark:border-white/5 text-center flex flex-col items-center justify-center">
                    <Globe size={24} className="text-blue-500 mb-2"/>
                    <h4 className="text-xs font-black mb-2 text-slate-800 dark:text-white">Oficjalna strona programu Urlopik</h4>
                    <p className="text-[10px] text-slate-500 mb-2 leading-relaxed">Odwiedź naszą stronę, aby sprawdzić najnowsze aktualizacje, przeczytać bloga i poznać nowości.</p>
                    <p className="text-[10px] font-bold text-blue-500 dark:text-blue-400 mb-4 select-all">https://urlopikpro.duckdns.org</p>
                    <a href="https://urlopikpro.duckdns.org" target="_blank" rel="noopener noreferrer" className="mt-auto px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-lg transition-colors shadow-md w-full flex items-center justify-center gap-2">Odwiedź stronę <ExternalLink size={14}/></a>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-500/10 p-5 rounded-[20px] border border-amber-200 dark:border-amber-500/20 text-center flex flex-col items-center justify-center">
                    <Coffee size={24} className="text-amber-500 mb-2"/>
                    <h4 className="text-xs font-black mb-2 text-amber-900 dark:text-amber-400">Postaw wirtualną kawę wspierając twórcę programu</h4>
                    <p className="text-[10px] text-amber-700/70 dark:text-amber-500/70 mb-2 leading-relaxed">Jeśli Urlopik pomógł Ci zaplanować idealne wakacje, rozważ wsparcie projektu symboliczną kawą.</p>
                    <p className="text-[10px] font-bold text-amber-600 dark:text-amber-500 mb-4 select-all">https://buycoffee.to/samkolonek</p>
                    <a href="https://buycoffee.to/samkolonek" target="_blank" rel="noopener noreferrer" className="mt-auto px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-lg transition-colors shadow-md w-full flex items-center justify-center gap-2">☕ Postaw kawę <ExternalLink size={14}/></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPreview && (
        <div className="fixed inset-0 z-[150] bg-slate-200/90 dark:bg-[#0a0a0a]/90 backdrop-blur-sm overflow-y-auto p-4 sm:p-8 animate-in fade-in duration-200 print:p-0 print:bg-white flex flex-col items-center custom-scrollbar">
          <div className="w-full max-w-4xl flex justify-between items-center mb-6 sticky top-0 sm:top-4 z-10 bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-md p-3 sm:px-4 rounded-2xl shadow-sm border border-slate-200/50 dark:border-white/10 print:hidden">
            <button onClick={() => setShowPreview(false)} className="px-4 sm:px-5 py-2.5 bg-white dark:bg-[#2a2a2a] text-slate-600 dark:text-slate-300 rounded-xl font-bold text-sm shadow-sm border border-slate-200 dark:border-white/5 flex items-center gap-2 transition-all hover:bg-slate-50 dark:hover:bg-white/5"><ChevronLeft size={16}/> Wróć</button>
            <div className="flex gap-2 sm:gap-3">
              <button onClick={handleExportICS} className="px-4 sm:px-5 py-2.5 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 rounded-xl font-bold text-sm border border-blue-200 dark:border-blue-500/20 hover:bg-blue-100 dark:hover:bg-blue-500/20 active:scale-95 flex items-center gap-2 transition-all shadow-sm"><CalendarPlus size={16}/> .ics</button>
              <button onClick={generatePDF} className="px-5 sm:px-6 py-2.5 bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-500/20 hover:bg-emerald-400 active:scale-95 flex items-center gap-2 transition-all"><FileText size={16}/> PDF</button>
            </div>
          </div>
          <div className="w-full max-w-4xl bg-white rounded-2xl sm:rounded-[20px] shadow-2xl ring-1 ring-slate-900/5 p-8 sm:p-14 print:ring-0 print:shadow-none print:p-0 text-slate-900 origin-top">
             <div className="flex justify-between items-end border-b-2 border-slate-100 pb-6 mb-8">
                <div><h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight mb-2 text-slate-900">Plan Urlopowy</h2><p className="text-sm font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2"><Palmtree size={18}/> Rok {planningMode === 'current' ? currentYear : currentYear + 1}</p></div>
                <div className="text-right"><div className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1">Data wygenerowania</div><div className="text-lg font-bold text-slate-800">{new Date().toLocaleDateString('pl-PL')}</div></div>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100"><div className="flex justify-between items-start"><div><div className="text-[11px] font-bold text-slate-500 uppercase mb-2 tracking-widest">Użyto z puli</div><div className="text-3xl font-extrabold text-slate-800">{usedDays} <span className="text-sm font-bold text-slate-400">dni</span></div></div><div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 border-slate-100" style={{background: `conic-gradient(#10b981 ${(usedDays / totalAvailable) * 100}%, #e2e8f0 0)`}}><div className="w-6 h-6 bg-white rounded-full"></div></div></div></div>
                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 relative overflow-hidden"><Zap size={80} className="absolute -right-4 -bottom-4 text-emerald-500/10" fill="currentColor" /><div className="relative"><div className="text-[11px] font-bold text-emerald-600 uppercase mb-2 tracking-widest">Dni wolne</div><div className="text-3xl font-extrabold text-emerald-600">{totalFreeDays} <span className="text-sm font-bold text-emerald-600/60">dni</span></div></div></div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100"><div className="text-[11px] font-bold text-slate-500 uppercase mb-2 tracking-widest">Pozostało</div><div className="text-3xl font-extrabold text-slate-800">{totalAvailable - usedDays} <span className="text-sm font-bold text-slate-400">dni</span></div></div>
             </div>
             <div className="mb-10">
                <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-slate-400">Zestawienie Terminów</h4>
                <div className="space-y-3">
                   {reportItems.map((item, i) => (
                      <div key={i} className="flex flex-col sm:flex-row justify-between sm:items-center p-5 bg-white rounded-2xl border border-slate-100 shadow-sm print:shadow-none print:border-b print:py-4">
                         <div className="flex items-center gap-4"><div className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-500 text-sm font-bold rounded-xl shrink-0">{i+1}</div><div><div className="font-bold text-lg text-slate-800">{new Date(item.displayStart).toLocaleDateString('pl-PL', {day:'numeric',month:'long'})} {item.displayStart !== item.displayEnd && `— ${new Date(item.displayEnd).toLocaleDateString('pl-PL', {day:'numeric',month:'long'})}`}</div></div></div>
                         <div className="flex gap-8 text-right mt-4 sm:mt-0 pt-4 sm:pt-0 border-t border-slate-100 sm:border-t-0"><div><div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pobrano</div><div className="text-xl font-extrabold text-slate-800">{item.cost} d</div></div><div><div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Wolne</div><div className="text-xl font-extrabold text-emerald-600">{item.gain} d</div></div></div>
                      </div>
                   ))}
                </div>
             </div>
             <div className="mt-16 pt-8 border-t border-slate-100 flex justify-between items-center opacity-40"><div className="flex items-center gap-2"><Palmtree size={18}/><div className="text-[10px] font-bold uppercase tracking-widest">Urlopik Pro Universal v5.29.5</div></div></div>
          </div>
        </div>
      )}

      {showGuide && (
        <div className="fixed inset-0 z-[160] bg-slate-200/90 dark:bg-[#0a0a0a]/90 backdrop-blur-sm overflow-y-auto p-4 sm:p-8 animate-in fade-in duration-200 print:hidden flex flex-col items-center custom-scrollbar">
          <div className="w-full max-w-4xl flex justify-between items-center mb-6 sticky top-0 sm:top-4 z-10 bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-md p-3 sm:px-4 rounded-2xl shadow-sm border border-slate-200/50 dark:border-white/10">
            <h3 className="text-base sm:text-lg font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-500 flex items-center gap-3 pl-2"><BookOpen size={20}/> Pełny Przewodnik po Aplikacji</h3>
            <button onClick={() => setShowGuide(false)} className="px-4 sm:px-5 py-2.5 bg-white dark:bg-[#2a2a2a] text-slate-600 dark:text-slate-300 rounded-xl font-bold text-sm shadow-sm border border-slate-200 dark:border-white/5 flex items-center gap-2 transition-all hover:bg-slate-50 dark:hover:bg-white/5"><X size={16}/> Zamknij</button>
          </div>
          
          <div className="w-full max-w-4xl bg-white rounded-2xl sm:rounded-[20px] shadow-2xl ring-1 ring-slate-900/5 p-8 sm:p-14 text-slate-900 origin-top mb-20">
            <div className="space-y-12">
               <section className="text-center max-w-2xl mx-auto">
                 <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-[20px] flex items-center justify-center mx-auto mb-6 rotate-3 border border-emerald-100"><Palmtree size={40} /></div>
                 <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-slate-900">Witaj w Urlopik Pro</h2>
                 <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">Urlopik Pro to Twoje zaawansowane centrum dowodzenia urlopami. Aplikacja inteligentnie analizuje układ weekendów oraz świąt ustawowych w Polsce, aby podpowiedzieć Ci, kiedy wziąć urlop i zyskać jak najdłuższy, nieprzerwany wypoczynek przy minimalnym zużyciu dni z Twojej puli.</p>
               </section>
               
               <div className="border-t-2 border-slate-100"></div>
               
               <section>
                 <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-800"><Zap className="text-amber-500" size={28}/> 1. Szybki start (Jak to działa?)</h3>
                 <p className="text-slate-600 font-medium mb-4">Planowanie urlopu w aplikacji sprowadza się do 4 prostych kroków:</p>
                 <ol className="list-decimal pl-5 space-y-3 text-slate-600 font-medium leading-relaxed">
                    <li><strong className="text-slate-800">Skonfiguruj budżet:</strong> W lewym panelu wpisz liczbę dni urlopu, jaką dysponujesz w danym roku (pula bazowa, urlop zaległy, dni dodatkowe).</li>
                    <li><strong className="text-slate-800">Ustaw filtry wyszukiwania:</strong> Określ maksymalną liczbę dni (Limit na hack), jaką chcesz jednorazowo przeznaczyć na długi weekend.</li>
                    <li><strong className="text-slate-800">Wybierz najlepsze okazje:</strong> W głównej sekcji kliknij wybraną kartę (tzw. "Hack"), aby natychmiast dodać ją do swojego kalendarza.</li>
                    <li><strong className="text-slate-800">Wygeneruj raport:</strong> Kliknij przycisk <strong>Podgląd Raportu</strong> (ikona oka), aby zobaczyć przejrzyste podsumowanie i wyeksportować je do PDF lub dodać do kalendarza (.ics).</li>
                 </ol>
               </section>

               <section>
                 <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-800"><LayoutDashboard className="text-blue-500" size={28}/> 2. Budżet i Parametry Analizy</h3>
                 <p className="text-slate-600 font-medium mb-4">W lewym panelu znajduje się Twoje centrum sterowania.</p>
                 <ul className="space-y-4 text-slate-600 font-medium leading-relaxed">
                    <li><strong className="text-slate-800">Analizuj od:</strong> Domyślnie system szuka urlopów od dzisiaj (dla bieżącego roku) lub od 1 stycznia (dla przyszłego roku). Możesz ręcznie zmienić tę datę, a mała ikona strzałki obok pozwoli Ci szybko wrócić do ustawień domyślnych.</li>
                    <li><strong className="text-slate-800">Twój Budżet:</strong> Podzielony na <em>Pula bazowa</em>, <em>Zaległy</em> i <em>Dodatkowy</em>. Aplikacja na bieżąco odlicza wykorzystane dni i pokazuje, ile jeszcze Ci pozostało.</li>
                    <li><strong className="text-slate-800">Rezerwa UŻ (Urlop na żądanie):</strong> Za pomocą wygodnego suwaka (domyślnie 4 dni) określasz swój bufor bezpieczeństwa. Jeśli zużyjesz tyle dni z ogólnej puli, że naruszysz rezerwę UŻ, system wyświetli pomarańczowe ostrzeżenie.</li>
                 </ul>
               </section>

               <section>
                 <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-800"><Sparkles className="text-emerald-500" size={28}/> 3. Hacki i Okazje Urlopowe (Inteligentny Algorytm)</h3>
                 <p className="text-slate-600 font-medium mb-4"><strong className="text-slate-800">Czym są Hacki?</strong> To automatycznie wyliczone okresy, w których biorąc np. 3 dni urlopu, zyskujesz aż 9 dni wolnych (dzięki połączeniu z weekendami i świętami).</p>
                 <ul className="list-disc pl-5 space-y-3 text-slate-600 font-medium leading-relaxed">
                    <li><strong className="text-slate-800">Inteligentne unikanie "dni przejściowych":</strong> Urlopik Pro analizuje Twoje opcje. Jeśli wzięcie urlopu zostawiłoby 1 lub 2 dni robocze luki do najbliższego weekendu, system to wykryje. Jeżeli masz wystarczająco dużo dni w puli "Limitu na hack", system zaproponuje Ci dłuższą, bardziej opłacalną wersję urlopu, domykając tydzień!</li>
                    <li><strong className="text-slate-800">Mnożnik Zysku (ROI):</strong> Każda karta okazji pokazuje opłacalność (np. Zysk 3.0x oznacza, że za 1 dzień urlopu zyskujesz 3 dni wolnego).</li>
                    <li><strong className="text-slate-800">Filtrowanie:</strong> Listę okazji możesz filtrować za pomocą przycisków na górze: <em>I Półrocze</em>, <em>II Półrocze</em>, <em>☀️ Lato</em> (maj-sierpień), <em>❄️ Zima</em> (listopad-styczeń) lub szukać wyłącznie najdłuższych przerw (<em>Długie 9+ dni</em>).</li>
                 </ul>
               </section>

               <section>
                 <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-800"><CalendarDays className="text-purple-500" size={28}/> 4. Kalendarz Podglądu i Kolory</h3>
                 <p className="text-slate-600 font-medium mb-4">Na dole ekranu znajduje się interaktywny kalendarz. Możesz w nim ręcznie planować ("wyklikiwać") pojedyncze dni.</p>
                 <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-4 shadow-sm">
                   <h4 className="font-bold text-slate-800 mb-4 uppercase tracking-widest text-sm">Legenda kolorów:</h4>
                   <ul className="space-y-4 text-sm font-medium text-slate-700">
                     <li className="flex items-center gap-3"><div className="w-5 h-5 bg-emerald-500 rounded shadow-sm shrink-0"></div> <span><strong>Zielony:</strong> Dzień będący częścią wybranego Hacka (optymalnego mostu urlopowego).</span></li>
                     <li className="flex items-center gap-3"><div className="w-5 h-5 bg-blue-500 rounded shadow-sm shrink-0"></div> <span><strong>Niebieski:</strong> Twój własny, ręcznie zaplanowany dzień urlopu.</span></li>
                     <li className="flex items-center gap-3"><div className="w-5 h-5 bg-slate-300 opacity-70 rounded shadow-sm shrink-0"></div> <span><strong>Wyszarzony (zgaszony):</strong> Dzień urlopu, który już minął (jest w przeszłości). Po najechaniu na niego myszką zobaczysz komunikat "Urlop wykorzystany".</span></li>
                     <li className="flex items-center gap-3"><div className="w-5 h-5 border-2 border-slate-400 border-dashed rounded bg-slate-100 shrink-0"></div> <span><strong>Szary z przerywaną ramką:</strong> Urlop zaplanowany w tym terminie, ale "opłacony" z budżetu innego roku (np. urlop na styczeń przyszłego roku, kliknięty podczas planowania w bieżącym roku). Nie zużywa on obecnego budżetu!</span></li>
                   </ul>
                 </div>
                 <p className="text-slate-600 font-medium leading-relaxed"><strong className="text-slate-800">Zaawansowana funkcja: Rozbijanie Hacków.</strong> Jeśli wybrałeś idealnego Hacka (zielone dni), ale w jeden z tych dni musisz jednak iść do pracy – po prostu kliknij go w kalendarzu! System "rozbije" Hacka, usunie kliknięty dzień z puli (zwracając Ci go do budżetu), a resztę dni zmieni na niebieskie (jako Twoje własne).</p>
               </section>

               <section>
                 <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-800"><Wand2 className="text-rose-500" size={28}/> 5. Tryb Symulacji Transferu (Sandbox)</h3>
                 <p className="text-slate-600 font-medium mb-4">Masz zaplanowany urlop w tym roku, ale zastanawiasz się, czy z niego nie zrezygnować na rzecz dłuższych wakacji w przyszłym roku?</p>
                 <ol className="list-decimal pl-5 space-y-3 text-slate-600 font-medium leading-relaxed">
                    <li>Przełącz tryb na <strong className="text-slate-800">Przyszły rok</strong>.</li>
                    <li>Kliknij fioletowy przycisk <strong className="text-slate-800">🧪 Tryb Symulacji Transferu</strong>.</li>
                    <li>Pojawi się lista Twoich zaplanowanych urlopów z poprzedniego roku. Zaznacz te, z których "udajesz", że rezygnujesz.</li>
                    <li>Licznik dni w przyszłym roku zacznie pulsować na fioletowo, pokazując symulowany zastrzyk dni urlopowych!</li>
                    <li>Jeśli nowy plan Ci się podoba, kliknij <strong className="text-slate-800">Zatwierdź Transfer</strong>. Dni zostaną anulowane w starym roku i przeniesione do "Urlopu zaległego" w nowym roku.</li>
                 </ol>
               </section>

               <section>
                 <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-800"><Save className="text-teal-500" size={28}/> 6. Zapisywanie Planów i Bezpieczeństwo</h3>
                 <p className="text-slate-600 font-medium mb-4">Klikając <strong className="text-slate-800">⚙️ Ustawienia</strong> na górnym pasku, zyskujesz dostęp do zaawansowanych opcji:</p>
                 <ul className="list-disc pl-5 space-y-3 text-slate-600 font-medium leading-relaxed">
                    <li><strong className="text-slate-800">Zapisywanie wariantów:</strong> Możesz zapisać swój aktualny układ dni pod dowolną nazwą (np. "Wersja B - wyjazd w góry") i wczytać go w dowolnym momencie.</li>
                    <li><strong className="text-slate-800">Eksport i Import:</strong> Zrób kopię bezpieczeństwa całego planu pobierając plik `.json`. Możesz go później zaimportować np. na innym urządzeniu.</li>
                    <li><strong className="text-slate-800">Motyw:</strong> Przełączaj się między jasnym a ciemnym wyglądem aplikacji.</li>
                 </ul>
                 <div className="mt-8 p-5 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-4 text-emerald-800">
                   <ShieldCheck size={24} className="shrink-0 text-emerald-500" />
                   <p className="text-base font-medium"><strong>Twoje dane są w 100% bezpieczne.</strong> Aplikacja działa wyłącznie w pamięci Twojej przeglądarki (Local Storage). Żadne dane nie są wysyłane na zewnętrzne serwery.</p>
                 </div>
               </section>
               
               <div className="mt-16 pt-8 border-t-2 border-slate-100 flex justify-center items-center opacity-40">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Palmtree size={20}/>
                    <div className="text-xs font-bold uppercase tracking-widest">Urlopik Pro Universal v5.29.5</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {transferModal.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#1a1a1a] w-full max-w-lg rounded-[20px] shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden scale-in">
            <div className="p-10">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mb-6">
                <RefreshCw size={32} />
              </div>
              <h3 className="text-2xl font-black mb-4 text-slate-800 dark:text-white tracking-tight">Przenieś niewykorzystany urlop</h3>
              <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium mb-8">
                Zauważyliśmy, że w bieżącym roku nie wykorzystałeś <strong>{transferModal.unusedDays} dni</strong> urlopu. 
                Czy chcesz automatycznie przenieść je do budżetu na nowy rok jako urlop zaległy?
              </p>
              <div className="space-y-4">
                <button 
                  onClick={() => {
                    setVacationBudgets(prev => ({...prev, next: {...prev.next, previous: transferModal.unusedDays, transferDone: true}}));
                    localStorage.setItem('urlopik_transfer_prompted_v522', 'true');
                    setTransferModal({ isOpen: false, unusedDays: 0 });
                    setPlanningMode('next');
                    handleResetAnalysisDate('next'); // Dodane
                  }} 
                  className="w-full py-4 text-base font-black text-white bg-blue-500 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-600 active:scale-95 transition-all"
                >
                  Tak, przenieś automatycznie
                </button>
                <button 
                  onClick={() => {
                    localStorage.setItem('urlopik_transfer_prompted_v522', 'true');
                    setTransferModal({ isOpen: false, unusedDays: 0 });
                    setPlanningMode('next');
                    handleResetAnalysisDate('next'); // Dodane
                  }} 
                  className="w-full py-4 text-base font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-colors"
                >
                  Nie, wpiszę to ręcznie
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#1a1a1a] w-full max-w-sm rounded-[20px] shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden scale-in">
            <div className="p-6 sm:p-8"><div className="w-14 h-14 bg-rose-100 dark:bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mb-5"><AlertTriangle size={28} /></div><h3 className="text-3xl font-black mb-3 text-slate-800 dark:text-white tracking-tight leading-tight">{confirmModal.title}</h3><p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{confirmModal.message}</p></div>
            <div className="p-4 sm:p-5 bg-slate-50 dark:bg-[#111] border-t border-slate-100 dark:border-white/5 flex justify-end gap-3"><button onClick={() => setConfirmModal({isOpen: false, title:'', message:'', action:null})} className="px-5 py-2 text-sm font-black text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Zamknij</button>{confirmModal.action && (<button onClick={() => { confirmModal.action(); setConfirmModal({isOpen: false, title:'', message:'', action:null}); }} className="px-6 py-2 text-sm font-black text-white bg-rose-500 rounded-xl shadow-lg shadow-rose-500/30 hover:bg-rose-600 active:scale-95 transition-all">Potwierdź</button>)}</div>
          </div>
        </div>
      )}

      <style>{`
        body { font-family: 'Segoe UI Variable', system-ui, -apple-system, sans-serif; -webkit-font-smoothing: antialiased; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(148, 163, 184, 0.2); border-radius: 10px; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-in { animation: fade-in 0.2s ease-out forwards; }
        @keyframes scale-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .scale-in { animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @media print { body { background: white !important; color: black !important; } @page { margin: 1cm; } .print\\:hidden { display: none !important; } .print\\:bg-white { background-color: white !important; } }
      `}</style>
    </>
  );
}