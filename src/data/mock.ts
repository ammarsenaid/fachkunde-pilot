export type Status = "not_started" | "in_progress" | "completed" | "review";

export interface Subtopic {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  readingMinutes: number;
  flashcardCount: number;
  quizCount: number;
  status: Status;
  examRelevance: 1 | 2 | 3;
}

export interface Module {
  id: string;
  number: number;
  title: string;
  description: string;
  icon: string;
  subtopicCount: number;
  estimatedMinutes: number;
  progress: number;
  status: Status;
}

export interface Flashcard {
  id: string;
  moduleId: string;
  front: string;
  back: string;
  arabicHint?: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface QuizQuestion {
  id: string;
  moduleId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  arabicExplanation?: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  category: string;
  definition: string;
  arabic?: string;
}

export const modules: Module[] = [
  { id: "rechtliche-grundlagen", number: 1, title: "Rechtliche Grundlagen", description: "Überblick über die rechtlichen Rahmenbedingungen für Taxi- und Mietwagenunternehmen.", icon: "Scale", subtopicCount: 6, estimatedMinutes: 180, progress: 65, status: "in_progress" },
  { id: "pbefg", number: 2, title: "Personenbeförderungsgesetz", description: "Kernregelungen des PBefG, Genehmigungspflicht und Pflichten des Unternehmers.", icon: "BookOpen", subtopicCount: 8, estimatedMinutes: 240, progress: 30, status: "in_progress" },
  { id: "bokraft", number: 3, title: "BOKraft", description: "Verordnung über den Betrieb von Kraftfahrunternehmen im Personenverkehr.", icon: "FileText", subtopicCount: 5, estimatedMinutes: 150, progress: 0, status: "not_started" },
  { id: "fahrerlaubnisrecht", number: 4, title: "Fahrerlaubnisrecht", description: "Personenbeförderungsschein, Fahrerqualifikation und Eignungsvoraussetzungen.", icon: "IdCard", subtopicCount: 4, estimatedMinutes: 120, progress: 100, status: "completed" },
  { id: "arbeitsrecht", number: 5, title: "Arbeits- und Sozialrecht", description: "Arbeitsverträge, Arbeitszeit, Lenk- und Ruhezeiten, Sozialversicherung.", icon: "Users", subtopicCount: 6, estimatedMinutes: 200, progress: 45, status: "review" },
  { id: "kaufmaennisch", number: 6, title: "Kaufmännische Unternehmensführung", description: "Grundlagen der Betriebsführung, Kalkulation und Personalmanagement.", icon: "Briefcase", subtopicCount: 7, estimatedMinutes: 220, progress: 15, status: "in_progress" },
  { id: "rechnungswesen", number: 7, title: "Rechnungswesen", description: "Buchführung, Bilanz, GuV und betriebliche Auswertungen.", icon: "Calculator", subtopicCount: 6, estimatedMinutes: 210, progress: 0, status: "not_started" },
  { id: "steuern", number: 8, title: "Steuerliche Grundlagen", description: "Umsatzsteuer, Einkommensteuer, Gewerbesteuer für Taxi- und Mietwagenbetriebe.", icon: "Receipt", subtopicCount: 5, estimatedMinutes: 180, progress: 0, status: "not_started" },
  { id: "versicherung", number: 9, title: "Versicherung", description: "Pflichtversicherungen, Haftpflicht, Insassen- und Betriebshaftpflicht.", icon: "Shield", subtopicCount: 4, estimatedMinutes: 120, progress: 0, status: "not_started" },
  { id: "fahrzeugtechnik", number: 10, title: "Fahrzeugtechnik und Betrieb", description: "Fahrzeugausstattung, Wartung, Taxameter, Wegstreckenzähler.", icon: "Wrench", subtopicCount: 5, estimatedMinutes: 160, progress: 20, status: "in_progress" },
  { id: "verkehrsgeographie", number: 11, title: "Verkehrsgeographie / Ortskunde", description: "Ortskunde, Routenplanung, wichtige Punkte und Verkehrswege.", icon: "Map", subtopicCount: 5, estimatedMinutes: 150, progress: 0, status: "not_started" },
  { id: "kundenservice", number: 12, title: "Kundenservice, Sicherheit und Verhalten", description: "Servicequalität, Konfliktmanagement, Sicherheit für Fahrer und Fahrgäste.", icon: "HeartHandshake", subtopicCount: 5, estimatedMinutes: 130, progress: 0, status: "not_started" },
];

export const subtopics: Subtopic[] = [
  { id: "ueberblick-pruefung", moduleId: "rechtliche-grundlagen", title: "Überblick über die Fachkundeprüfung", description: "Aufbau, Inhalte und Ablauf der IHK-Prüfung verstehen.", readingMinutes: 12, flashcardCount: 8, quizCount: 6, status: "completed", examRelevance: 3 },
  { id: "unternehmerpflichten", moduleId: "rechtliche-grundlagen", title: "Unternehmerpflichten", description: "Welche Pflichten ein Taxi- und Mietwagenunternehmer erfüllen muss.", readingMinutes: 15, flashcardCount: 12, quizCount: 8, status: "completed", examRelevance: 3 },
  { id: "genehmigungen", moduleId: "rechtliche-grundlagen", title: "Genehmigungen", description: "Konzession, Genehmigungsverfahren und Voraussetzungen.", readingMinutes: 18, flashcardCount: 14, quizCount: 10, status: "in_progress", examRelevance: 3 },
  { id: "betriebsfuehrung", moduleId: "rechtliche-grundlagen", title: "Betriebsführung", description: "Leitung, Verantwortung und Organisation des Betriebs.", readingMinutes: 14, flashcardCount: 10, quizCount: 7, status: "in_progress", examRelevance: 2 },
  { id: "aufbewahrungspflichten", moduleId: "rechtliche-grundlagen", title: "Aufbewahrungspflichten", description: "Welche Unterlagen wie lange aufbewahrt werden müssen.", readingMinutes: 10, flashcardCount: 8, quizCount: 5, status: "not_started", examRelevance: 2 },
  { id: "behoerden-kontrollen", moduleId: "rechtliche-grundlagen", title: "Behörden und Kontrollen", description: "Zuständige Behörden und Ablauf von Betriebskontrollen.", readingMinutes: 12, flashcardCount: 9, quizCount: 6, status: "not_started", examRelevance: 2 },
  // PBefG samples
  { id: "pbefg-zweck", moduleId: "pbefg", title: "Zweck und Geltungsbereich des PBefG", description: "Wofür gilt das PBefG und welche Verkehre werden erfasst.", readingMinutes: 10, flashcardCount: 8, quizCount: 5, status: "completed", examRelevance: 3 },
  { id: "pbefg-genehmigung", moduleId: "pbefg", title: "Genehmigungspflicht §2 PBefG", description: "Genehmigungspflichtige Verkehre und Ausnahmen.", readingMinutes: 14, flashcardCount: 10, quizCount: 7, status: "in_progress", examRelevance: 3 },
  { id: "pbefg-taxiverkehr", moduleId: "pbefg", title: "Taxiverkehr §47 PBefG", description: "Besonderheiten Taxiverkehr: Bereitstellung, Tarif, Beförderungspflicht.", readingMinutes: 16, flashcardCount: 12, quizCount: 9, status: "not_started", examRelevance: 3 },
];

export const flashcards: Flashcard[] = [
  { id: "fc1", moduleId: "pbefg", front: "Was ist der Zweck des Personenbeförderungsgesetzes?", back: "Es regelt die entgeltliche oder geschäftsmäßige Beförderung von Personen mit Verkehrsmitteln wie Taxi und Mietwagen.", arabicHint: "ينظم نقل الأشخاص مقابل أجر بوسائل مثل التاكسي وسيارات الإيجار.", difficulty: "easy" },
  { id: "fc2", moduleId: "rechtliche-grundlagen", front: "Wer erteilt die Konzession für den Taxiverkehr?", back: "Die zuständige Genehmigungsbehörde am Betriebssitz – meist das Ordnungsamt oder die Verkehrsbehörde.", difficulty: "medium" },
  { id: "fc3", moduleId: "pbefg", front: "Was bedeutet die Beförderungspflicht im Taxiverkehr?", back: "Der Taxiunternehmer ist verpflichtet, Fahrgäste zu befördern, wenn die Beförderungsbedingungen erfüllt sind und keine Ausnahme vorliegt.", difficulty: "medium" },
  { id: "fc4", moduleId: "pbefg", front: "Was ist die Mietwagenrückkehrpflicht?", back: "Mietwagen müssen nach Ausführung des Auftrags unverzüglich zum Betriebssitz zurückkehren, sofern kein neuer Auftrag während der Fahrt eingeht.", difficulty: "hard" },
  { id: "fc5", moduleId: "fahrerlaubnisrecht", front: "Welcher Führerschein ist für die Personenbeförderung erforderlich?", back: "Ein Personenbeförderungsschein (P-Schein) zusätzlich zur Klasse B.", difficulty: "easy" },
  { id: "fc6", moduleId: "arbeitsrecht", front: "Wie lange darf ein Taxifahrer maximal am Tag arbeiten?", back: "Gemäß ArbZG grundsätzlich 8 Stunden, verlängerbar auf bis zu 10 Stunden mit entsprechendem Ausgleich.", difficulty: "medium" },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1", moduleId: "pbefg",
    question: "Welches Gesetz regelt die entgeltliche Personenbeförderung mit Taxi und Mietwagen in Deutschland?",
    options: ["StVO – Straßenverkehrsordnung", "PBefG – Personenbeförderungsgesetz", "BOKraft", "GüKG"],
    correctIndex: 1,
    explanation: "Das Personenbeförderungsgesetz (PBefG) ist das zentrale Gesetz für die entgeltliche Personenbeförderung im Straßenverkehr.",
    arabicExplanation: "قانون نقل الأشخاص (PBefG) هو القانون المركزي لنقل الأشخاص مقابل أجر."
  },
  {
    id: "q2", moduleId: "pbefg",
    question: "Wer ist Adressat der Beförderungspflicht im Taxiverkehr?",
    options: ["Der Fahrer", "Der Unternehmer", "Die Genehmigungsbehörde", "Der Fahrgast"],
    correctIndex: 1,
    explanation: "Die Beförderungspflicht trifft den Taxiunternehmer als Inhaber der Genehmigung."
  },
  {
    id: "q3", moduleId: "rechtliche-grundlagen",
    question: "Wie lange müssen geschäftliche Unterlagen wie Rechnungen grundsätzlich aufbewahrt werden?",
    options: ["2 Jahre", "5 Jahre", "10 Jahre", "Unbegrenzt"],
    correctIndex: 2,
    explanation: "Rechnungen und Buchungsbelege unterliegen einer 10-jährigen Aufbewahrungsfrist nach HGB und AO."
  },
  {
    id: "q4", moduleId: "pbefg",
    question: "Was gilt für Mietwagen nach Auftragsende?",
    options: [
      "Sie dürfen frei auf der Straße auf Fahrgäste warten",
      "Sie müssen unverzüglich zum Betriebssitz zurückkehren",
      "Sie dürfen am Taxistand stehen",
      "Sie dürfen Werbung betreiben"
    ],
    correctIndex: 1,
    explanation: "Die Rückkehrpflicht gem. § 49 Abs. 4 PBefG verpflichtet Mietwagen zur Rückkehr an den Betriebssitz."
  },
];

export const glossary: GlossaryTerm[] = [
  { id: "g1", term: "Genehmigung", category: "Recht", definition: "Behördliche Erlaubnis zum Betrieb eines Verkehrs nach PBefG.", arabic: "إذن رسمي من السلطات لتشغيل خدمة النقل وفقًا لقانون PBefG." },
  { id: "g2", term: "Konzession", category: "Recht", definition: "Im Sprachgebrauch synonym für die PBefG-Genehmigung im Taxi- und Mietwagenverkehr.", arabic: "مرادف للإذن وفقًا لقانون PBefG في خدمات التاكسي والإيجار." },
  { id: "g3", term: "Betriebssitz", category: "Betrieb", definition: "Ort, von dem aus das Unternehmen geleitet wird und an dem Mietwagen nach Auftragsende zurückkehren müssen." },
  { id: "g4", term: "Unternehmerpflicht", category: "Recht", definition: "Gesamtheit aller gesetzlichen Pflichten, die ein Verkehrsunternehmer erfüllen muss." },
  { id: "g5", term: "Beförderungspflicht", category: "Taxi", definition: "Pflicht des Taxiunternehmers, Fahrgäste innerhalb des Pflichtfahrgebiets zu befördern.", arabic: "التزام مالك سيارة الأجرة بنقل الركاب داخل منطقة الخدمة." },
  { id: "g6", term: "Tarifpflicht", category: "Taxi", definition: "Pflicht zur Anwendung der behördlich festgesetzten Beförderungsentgelte." },
  { id: "g7", term: "BOKraft", category: "Recht", definition: "Verordnung über den Betrieb von Kraftfahrunternehmen im Personenverkehr." },
  { id: "g8", term: "Mietwagenrückkehrpflicht", category: "Mietwagen", definition: "Verpflichtung des Mietwagens, nach Ausführung des Auftrags zum Betriebssitz zurückzukehren." },
];

export const navigationItems = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Module", href: "/module", icon: "BookOpen" },
  { label: "Flashcards", href: "/flashcards", icon: "Layers" },
  { label: "Prüfung", href: "/pruefung", icon: "GraduationCap" },
  { label: "Lernplan", href: "/lernplan", icon: "Calendar" },
  { label: "Glossar", href: "/glossar", icon: "BookMarked" },
  { label: "Notizen", href: "/notizen", icon: "Bookmark" },
  { label: "Admin", href: "/admin", icon: "Settings" },
] as const;
