
-- ============ MODULES ============
CREATE TABLE public.modules (
  id text PRIMARY KEY,
  number integer NOT NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'BookOpen',
  estimated_minutes integer NOT NULL DEFAULT 0,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "modules read all auth" ON public.modules FOR SELECT TO authenticated USING (true);
CREATE POLICY "modules admin write" ON public.modules FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_modules_updated BEFORE UPDATE ON public.modules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ SUBTOPICS ============
CREATE TABLE public.subtopics (
  id text PRIMARY KEY,
  module_id text NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  reading_minutes integer NOT NULL DEFAULT 10,
  exam_relevance integer NOT NULL DEFAULT 2 CHECK (exam_relevance BETWEEN 1 AND 3),
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_subtopics_module ON public.subtopics(module_id);
ALTER TABLE public.subtopics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subtopics read all auth" ON public.subtopics FOR SELECT TO authenticated USING (true);
CREATE POLICY "subtopics admin write" ON public.subtopics FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_subtopics_updated BEFORE UPDATE ON public.subtopics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ FLASHCARDS ============
CREATE TABLE public.flashcards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id text NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  subtopic_id text REFERENCES public.subtopics(id) ON DELETE SET NULL,
  front text NOT NULL,
  back text NOT NULL,
  arabic_hint text,
  difficulty text NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy','medium','hard')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_flashcards_module ON public.flashcards(module_id);
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "flashcards read all auth" ON public.flashcards FOR SELECT TO authenticated USING (true);
CREATE POLICY "flashcards admin write" ON public.flashcards FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_flashcards_updated BEFORE UPDATE ON public.flashcards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ QUIZ QUESTIONS ============
CREATE TABLE public.quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id text NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  subtopic_id text REFERENCES public.subtopics(id) ON DELETE SET NULL,
  question text NOT NULL,
  options jsonb NOT NULL DEFAULT '[]'::jsonb,
  correct_index integer NOT NULL DEFAULT 0,
  explanation text NOT NULL DEFAULT '',
  arabic_explanation text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_quiz_module ON public.quiz_questions(module_id);
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quiz read all auth" ON public.quiz_questions FOR SELECT TO authenticated USING (true);
CREATE POLICY "quiz admin write" ON public.quiz_questions FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_quiz_updated BEFORE UPDATE ON public.quiz_questions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ GLOSSARY ============
CREATE TABLE public.glossary_terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  term text NOT NULL,
  category text NOT NULL DEFAULT 'Allgemein',
  definition text NOT NULL,
  arabic text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.glossary_terms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "glossary read all auth" ON public.glossary_terms FOR SELECT TO authenticated USING (true);
CREATE POLICY "glossary admin write" ON public.glossary_terms FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_glossary_updated BEFORE UPDATE ON public.glossary_terms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ SEED MODULES ============
INSERT INTO public.modules (id, number, title, description, icon, estimated_minutes, position) VALUES
  ('rechtliche-grundlagen',1,'Rechtliche Grundlagen','Überblick über die rechtlichen Rahmenbedingungen für Taxi- und Mietwagenunternehmen.','Scale',180,1),
  ('pbefg',2,'Personenbeförderungsgesetz','Kernregelungen des PBefG, Genehmigungspflicht und Pflichten des Unternehmers.','BookOpen',240,2),
  ('bokraft',3,'BOKraft','Verordnung über den Betrieb von Kraftfahrunternehmen im Personenverkehr.','FileText',150,3),
  ('fahrerlaubnisrecht',4,'Fahrerlaubnisrecht','Personenbeförderungsschein, Fahrerqualifikation und Eignungsvoraussetzungen.','IdCard',120,4),
  ('arbeitsrecht',5,'Arbeits- und Sozialrecht','Arbeitsverträge, Arbeitszeit, Lenk- und Ruhezeiten, Sozialversicherung.','Users',200,5),
  ('kaufmaennisch',6,'Kaufmännische Unternehmensführung','Grundlagen der Betriebsführung, Kalkulation und Personalmanagement.','Briefcase',220,6),
  ('rechnungswesen',7,'Rechnungswesen','Buchführung, Bilanz, GuV und betriebliche Auswertungen.','Calculator',210,7),
  ('steuern',8,'Steuerliche Grundlagen','Umsatzsteuer, Einkommensteuer, Gewerbesteuer für Taxi- und Mietwagenbetriebe.','Receipt',180,8),
  ('versicherung',9,'Versicherung','Pflichtversicherungen, Haftpflicht, Insassen- und Betriebshaftpflicht.','Shield',120,9),
  ('fahrzeugtechnik',10,'Fahrzeugtechnik und Betrieb','Fahrzeugausstattung, Wartung, Taxameter, Wegstreckenzähler.','Wrench',160,10),
  ('verkehrsgeographie',11,'Verkehrsgeographie / Ortskunde','Ortskunde, Routenplanung, wichtige Punkte und Verkehrswege.','Map',150,11),
  ('kundenservice',12,'Kundenservice, Sicherheit und Verhalten','Servicequalität, Konfliktmanagement, Sicherheit für Fahrer und Fahrgäste.','HeartHandshake',130,12);

-- ============ SEED SUBTOPICS ============
INSERT INTO public.subtopics (id, module_id, title, description, reading_minutes, exam_relevance, position) VALUES
  ('ueberblick-pruefung','rechtliche-grundlagen','Überblick über die Fachkundeprüfung','Aufbau, Inhalte und Ablauf der IHK-Prüfung verstehen.',12,3,1),
  ('unternehmerpflichten','rechtliche-grundlagen','Unternehmerpflichten','Welche Pflichten ein Taxi- und Mietwagenunternehmer erfüllen muss.',15,3,2),
  ('genehmigungen','rechtliche-grundlagen','Genehmigungen','Konzession, Genehmigungsverfahren und Voraussetzungen.',18,3,3),
  ('betriebsfuehrung','rechtliche-grundlagen','Betriebsführung','Leitung, Verantwortung und Organisation des Betriebs.',14,2,4),
  ('aufbewahrungspflichten','rechtliche-grundlagen','Aufbewahrungspflichten','Welche Unterlagen wie lange aufbewahrt werden müssen.',10,2,5),
  ('behoerden-kontrollen','rechtliche-grundlagen','Behörden und Kontrollen','Zuständige Behörden und Ablauf von Betriebskontrollen.',12,2,6),
  ('pbefg-zweck','pbefg','Zweck und Geltungsbereich des PBefG','Wofür gilt das PBefG und welche Verkehre werden erfasst.',10,3,1),
  ('pbefg-genehmigung','pbefg','Genehmigungspflicht §2 PBefG','Genehmigungspflichtige Verkehre und Ausnahmen.',14,3,2),
  ('pbefg-taxiverkehr','pbefg','Taxiverkehr §47 PBefG','Besonderheiten Taxiverkehr: Bereitstellung, Tarif, Beförderungspflicht.',16,3,3);

-- ============ SEED FLASHCARDS ============
INSERT INTO public.flashcards (module_id, front, back, arabic_hint, difficulty) VALUES
  ('pbefg','Was ist der Zweck des Personenbeförderungsgesetzes?','Es regelt die entgeltliche oder geschäftsmäßige Beförderung von Personen mit Verkehrsmitteln wie Taxi und Mietwagen.','ينظم نقل الأشخاص مقابل أجر بوسائل مثل التاكسي وسيارات الإيجار.','easy'),
  ('rechtliche-grundlagen','Wer erteilt die Konzession für den Taxiverkehr?','Die zuständige Genehmigungsbehörde am Betriebssitz – meist das Ordnungsamt oder die Verkehrsbehörde.',NULL,'medium'),
  ('pbefg','Was bedeutet die Beförderungspflicht im Taxiverkehr?','Der Taxiunternehmer ist verpflichtet, Fahrgäste zu befördern, wenn die Beförderungsbedingungen erfüllt sind und keine Ausnahme vorliegt.',NULL,'medium'),
  ('pbefg','Was ist die Mietwagenrückkehrpflicht?','Mietwagen müssen nach Ausführung des Auftrags unverzüglich zum Betriebssitz zurückkehren, sofern kein neuer Auftrag während der Fahrt eingeht.',NULL,'hard'),
  ('fahrerlaubnisrecht','Welcher Führerschein ist für die Personenbeförderung erforderlich?','Ein Personenbeförderungsschein (P-Schein) zusätzlich zur Klasse B.',NULL,'easy'),
  ('arbeitsrecht','Wie lange darf ein Taxifahrer maximal am Tag arbeiten?','Gemäß ArbZG grundsätzlich 8 Stunden, verlängerbar auf bis zu 10 Stunden mit entsprechendem Ausgleich.',NULL,'medium');

-- ============ SEED QUIZ QUESTIONS ============
INSERT INTO public.quiz_questions (module_id, question, options, correct_index, explanation, arabic_explanation) VALUES
  ('pbefg','Welches Gesetz regelt die entgeltliche Personenbeförderung mit Taxi und Mietwagen in Deutschland?',
    '["StVO – Straßenverkehrsordnung","PBefG – Personenbeförderungsgesetz","BOKraft","GüKG"]'::jsonb, 1,
    'Das Personenbeförderungsgesetz (PBefG) ist das zentrale Gesetz für die entgeltliche Personenbeförderung im Straßenverkehr.',
    'قانون نقل الأشخاص (PBefG) هو القانون المركزي لنقل الأشخاص مقابل أجر.'),
  ('pbefg','Wer ist Adressat der Beförderungspflicht im Taxiverkehr?',
    '["Der Fahrer","Der Unternehmer","Die Genehmigungsbehörde","Der Fahrgast"]'::jsonb, 1,
    'Die Beförderungspflicht trifft den Taxiunternehmer als Inhaber der Genehmigung.', NULL),
  ('rechtliche-grundlagen','Wie lange müssen geschäftliche Unterlagen wie Rechnungen grundsätzlich aufbewahrt werden?',
    '["2 Jahre","5 Jahre","10 Jahre","Unbegrenzt"]'::jsonb, 2,
    'Rechnungen und Buchungsbelege unterliegen einer 10-jährigen Aufbewahrungsfrist nach HGB und AO.', NULL),
  ('pbefg','Was gilt für Mietwagen nach Auftragsende?',
    '["Sie dürfen frei auf der Straße auf Fahrgäste warten","Sie müssen unverzüglich zum Betriebssitz zurückkehren","Sie dürfen am Taxistand stehen","Sie dürfen Werbung betreiben"]'::jsonb, 1,
    'Die Rückkehrpflicht gem. § 49 Abs. 4 PBefG verpflichtet Mietwagen zur Rückkehr an den Betriebssitz.', NULL);

-- ============ SEED GLOSSARY ============
INSERT INTO public.glossary_terms (term, category, definition, arabic) VALUES
  ('Genehmigung','Recht','Behördliche Erlaubnis zum Betrieb eines Verkehrs nach PBefG.','إذن رسمي من السلطات لتشغيل خدمة النقل وفقًا لقانون PBefG.'),
  ('Konzession','Recht','Im Sprachgebrauch synonym für die PBefG-Genehmigung im Taxi- und Mietwagenverkehr.','مرادف للإذن وفقًا لقانون PBefG في خدمات التاكسي والإيجار.'),
  ('Betriebssitz','Betrieb','Ort, von dem aus das Unternehmen geleitet wird und an dem Mietwagen nach Auftragsende zurückkehren müssen.',NULL),
  ('Unternehmerpflicht','Recht','Gesamtheit aller gesetzlichen Pflichten, die ein Verkehrsunternehmer erfüllen muss.',NULL),
  ('Beförderungspflicht','Taxi','Pflicht des Taxiunternehmers, Fahrgäste innerhalb des Pflichtfahrgebiets zu befördern.','التزام مالك سيارة الأجرة بنقل الركاب داخل منطقة الخدمة.'),
  ('Tarifpflicht','Taxi','Pflicht zur Anwendung der behördlich festgesetzten Beförderungsentgelte.',NULL),
  ('BOKraft','Recht','Verordnung über den Betrieb von Kraftfahrunternehmen im Personenverkehr.',NULL),
  ('Mietwagenrückkehrpflicht','Mietwagen','Verpflichtung des Mietwagens, nach Ausführung des Auftrags zum Betriebssitz zurückzukehren.',NULL);
