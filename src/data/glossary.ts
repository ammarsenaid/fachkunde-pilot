import type { GlossaryTerm } from "@/types/learning";

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
