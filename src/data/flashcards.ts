import type { Flashcard } from "@/types/learning";

export const flashcards: Flashcard[] = [
  { id: "fc1", moduleId: "pbefg", front: "Was ist der Zweck des Personenbeförderungsgesetzes?", back: "Es regelt die entgeltliche oder geschäftsmäßige Beförderung von Personen mit Verkehrsmitteln wie Taxi und Mietwagen.", arabicHint: "ينظم نقل الأشخاص مقابل أجر بوسائل مثل التاكسي وسيارات الإيجار.", difficulty: "easy" },
  { id: "fc2", moduleId: "rechtliche-grundlagen", front: "Wer erteilt die Konzession für den Taxiverkehr?", back: "Die zuständige Genehmigungsbehörde am Betriebssitz – meist das Ordnungsamt oder die Verkehrsbehörde.", difficulty: "medium" },
  { id: "fc3", moduleId: "pbefg", front: "Was bedeutet die Beförderungspflicht im Taxiverkehr?", back: "Der Taxiunternehmer ist verpflichtet, Fahrgäste zu befördern, wenn die Beförderungsbedingungen erfüllt sind und keine Ausnahme vorliegt.", difficulty: "medium" },
  { id: "fc4", moduleId: "pbefg", front: "Was ist die Mietwagenrückkehrpflicht?", back: "Mietwagen müssen nach Ausführung des Auftrags unverzüglich zum Betriebssitz zurückkehren, sofern kein neuer Auftrag während der Fahrt eingeht.", difficulty: "hard" },
  { id: "fc5", moduleId: "fahrerlaubnisrecht", front: "Welcher Führerschein ist für die Personenbeförderung erforderlich?", back: "Ein Personenbeförderungsschein (P-Schein) zusätzlich zur Klasse B.", difficulty: "easy" },
  { id: "fc6", moduleId: "arbeitsrecht", front: "Wie lange darf ein Taxifahrer maximal am Tag arbeiten?", back: "Gemäß ArbZG grundsätzlich 8 Stunden, verlängerbar auf bis zu 10 Stunden mit entsprechendem Ausgleich.", difficulty: "medium" },
];
