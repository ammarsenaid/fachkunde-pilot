import type { Subtopic } from "@/types/learning";

export const subtopics: Subtopic[] = [
  { id: "ueberblick-pruefung", moduleId: "rechtliche-grundlagen", title: "Überblick über die Fachkundeprüfung", description: "Aufbau, Inhalte und Ablauf der IHK-Prüfung verstehen.", readingMinutes: 12, flashcardCount: 8, quizCount: 6, status: "completed", examRelevance: 3 },
  { id: "unternehmerpflichten", moduleId: "rechtliche-grundlagen", title: "Unternehmerpflichten", description: "Welche Pflichten ein Taxi- und Mietwagenunternehmer erfüllen muss.", readingMinutes: 15, flashcardCount: 12, quizCount: 8, status: "completed", examRelevance: 3 },
  { id: "genehmigungen", moduleId: "rechtliche-grundlagen", title: "Genehmigungen", description: "Konzession, Genehmigungsverfahren und Voraussetzungen.", readingMinutes: 18, flashcardCount: 14, quizCount: 10, status: "in_progress", examRelevance: 3 },
  { id: "betriebsfuehrung", moduleId: "rechtliche-grundlagen", title: "Betriebsführung", description: "Leitung, Verantwortung und Organisation des Betriebs.", readingMinutes: 14, flashcardCount: 10, quizCount: 7, status: "in_progress", examRelevance: 2 },
  { id: "aufbewahrungspflichten", moduleId: "rechtliche-grundlagen", title: "Aufbewahrungspflichten", description: "Welche Unterlagen wie lange aufbewahrt werden müssen.", readingMinutes: 10, flashcardCount: 8, quizCount: 5, status: "not_started", examRelevance: 2 },
  { id: "behoerden-kontrollen", moduleId: "rechtliche-grundlagen", title: "Behörden und Kontrollen", description: "Zuständige Behörden und Ablauf von Betriebskontrollen.", readingMinutes: 12, flashcardCount: 9, quizCount: 6, status: "not_started", examRelevance: 2 },
  { id: "pbefg-zweck", moduleId: "pbefg", title: "Zweck und Geltungsbereich des PBefG", description: "Wofür gilt das PBefG und welche Verkehre werden erfasst.", readingMinutes: 10, flashcardCount: 8, quizCount: 5, status: "completed", examRelevance: 3 },
  { id: "pbefg-genehmigung", moduleId: "pbefg", title: "Genehmigungspflicht §2 PBefG", description: "Genehmigungspflichtige Verkehre und Ausnahmen.", readingMinutes: 14, flashcardCount: 10, quizCount: 7, status: "in_progress", examRelevance: 3 },
  { id: "pbefg-taxiverkehr", moduleId: "pbefg", title: "Taxiverkehr §47 PBefG", description: "Besonderheiten Taxiverkehr: Bereitstellung, Tarif, Beförderungspflicht.", readingMinutes: 16, flashcardCount: 12, quizCount: 9, status: "not_started", examRelevance: 3 },
];
