import type { LearningModule } from "@/types/learning";

export const modules: LearningModule[] = [
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
