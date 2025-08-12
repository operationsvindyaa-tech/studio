
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FilePenLine } from "lucide-react";

type SyllabusLevel = {
  title: string;
  modules: string[];
};

type CourseSyllabus = {
  beginner: SyllabusLevel;
  intermediate: SyllabusLevel;
  advanced: SyllabusLevel;
};

type SyllabusData = {
  [course: string]: CourseSyllabus;
};

const syllabusData: SyllabusData = {
  "Bharatanatyam": {
    beginner: {
      title: "Beginner Level (Levels 1-3)",
      modules: [
        "Level 1: Introduction to Bharatanatyam, Namaskaram, Basic Postures (Araimandi), Thattadavu series.",
        "Level 2: Nattadavu series, Introduction to Asamyuta Hastas (Single Hand Gestures), Basic theory.",
        "Level 3: Kudithu Mettadavu, Sarikkal Adavu, Introduction to Samyuta Hastas (Double Hand Gestures), Pushpanjali.",
      ],
    },
    intermediate: {
      title: "Intermediate Level (Levels 4-6)",
      modules: [
        "Level 4: Mei Adavu, Alarippu (Tisra Eka Talam), Introduction to Pada Bhedas (Feet movements).",
        "Level 5: Jathiswaram (Ragamalika, Adi Talam), Shiro Bhedas (Head movements), Drishti Bhedas (Eye movements).",
        "Level 6: Shabdam (exploring storytelling), Introduction to Abhinaya (facial expressions), small Keertanams.",
      ],
    },
    advanced: {
      title: "Advanced Level (Levels 7-9)",
      modules: [
        "Level 7: Introduction to Varnam (the centerpiece of the repertoire), complex rhythmic patterns.",
        "Level 8: Padams and Javalis (focus on expressive and emotive dance), Devaranama.",
        "Level 9: Thillana (pure, abstract dance), Ashtapadi, preparation for Arangetram (debut performance).",
      ],
    },
  },
  "Vocal Carnatic": {
    beginner: {
      title: "Beginner Level - Sarali Varisai",
      modules: ["Introduction to Sapta Swaras", "Sarali Varisai", "Janta Varisai", "Dhattu Varisai"],
    },
    intermediate: {
      title: "Intermediate Level - Geethams & Swarajathis",
      modules: ["Pillari Geethams", "Sanchari Geethams", "Simple Swarajathis", "Introduction to Alankaram"],
    },
    advanced: {
      title: "Advanced Level - Varnams & Krithis",
      modules: ["Adi Tala Varnams", "Ata Tala Varnams", "Simple Krithis of Tyagaraja", "Kalpana Swarams"],
    },
  },
  "Guitar": {
    beginner: {
      title: "Beginner Level - Basics",
      modules: ["Anatomy of the Guitar", "Tuning and Basic Posture", "Major and Minor Chords", "Simple Strumming Patterns"],
    },
    intermediate: {
      title: "Intermediate Level - Fingerstyle & Scales",
      modules: ["Introduction to Fingerpicking", "Barre Chords", "Major and Minor Pentatonic Scales", "Reading Tabs"],
    },
    advanced: {
      title: "Advanced Level - Music Theory & Improvisation",
      modules: ["Advanced Chord Voicings", "Modes and Arpeggios", "Soloing and Improvisation Techniques", "Composition Basics"],
    },
  },
  "Keyboard": {
    beginner: {
      title: "Beginner Level - Foundations",
      modules: ["Introduction to the Keyboard", "Proper Finger Placement (C Position)", "Reading Treble and Bass Clefs", "Simple Melodies with Right Hand", "Basic Major Chords"],
    },
    intermediate: {
      title: "Intermediate Level - Coordination & Theory",
      modules: ["Playing with Both Hands", "Major and Minor Scales", "Chord Inversions", "Introduction to Sight-Reading", "Playing Simple Pop Songs"],
    },
    advanced: {
      title: "Advanced Level - Artistry & Performance",
      modules: ["Advanced Music Theory", "Complex Rhythms and Syncopation", "Improvisation and Soloing", "Playing Different Genres (Jazz, Classical)", "Performance Techniques"],
    },
  },
   "Piano": {
    beginner: {
      title: "Beginner Level - Foundations",
      modules: [
        "Introduction to the Piano: Posture and Hand Position",
        "Learning the Keys: Identifying Notes on the Keyboard",
        "Basic Music Theory: Staff, Clefs, and Note Values",
        "Playing Simple Melodies and C Major Scale",
      ],
    },
    intermediate: {
      title: "Intermediate Level - Building Technique",
      modules: [
        "All Major and Minor Scales (One Octave)",
        "Introduction to Chords and Inversions",
        "Sight-Reading Simple Pieces",
        "Playing with Both Hands: Coordination Exercises",
      ],
    },
    advanced: {
      title: "Advanced Level - Musical Artistry",
      modules: [
        "Advanced Repertoire: Sonatas and Preludes",
        "Understanding Musical Expression: Dynamics and Articulation",
        "Introduction to Different Styles: Classical, Jazz, and Pop",
        "Advanced Music Theory and Improvisation",
      ],
    },
  },
   "Western Dance": {
    beginner: {
      title: "Beginner Level - Foundational Rhythms",
      modules: [
        "Introduction to Hip Hop: Basic grooves, bounce, and rock.",
        "Introduction to Jazz: Basic positions, simple turns, and short combinations.",
        "Rhythm and Timing: Learning to count music and stay on beat.",
        "Simple Choreography: Learning and performing a short, basic routine.",
      ],
    },
    intermediate: {
      title: "Intermediate Level - Technique & Style",
      modules: [
        "Body Isolations and Control: Developing control over different body parts.",
        "Introduction to Contemporary and Lyrical styles.",
        "Complex Choreography: Learning longer and more intricate dance sequences.",
        "Introduction to Freestyle: Basic concepts of improvisation.",
      ],
    },
    advanced: {
      title: "Advanced Level - Performance & Artistry",
      modules: [
        "Advanced Choreography: Mastering complex, professional-level routines.",
        "Performance Skills: Stage presence, expression, and connecting with an audience.",
        "Freestyle and Improvisation: Developing a personal style and creating on the spot.",
        "Musicality: Interpreting music through movement and dynamics.",
      ],
    },
  },
  "Yoga": {
    beginner: {
      title: "Beginner Level - Foundations",
      modules: ["Surya Namaskar (Sun Salutation)", "Basic Asanas (Poses)", "Pranayama (Breathing) Basics", "Introduction to Meditation"],
    },
    intermediate: {
      title: "Intermediate Level - Vinyasa Flow",
      modules: ["Vinyasa Sequencing", "Advanced Asanas", "Bandhas (Energy Locks)", "Deeper Meditation Techniques"],
    },
    advanced: {
      title: "Advanced Level - Ashtanga & Philosophy",
      modules: ["Full Ashtanga Primary Series", "Advanced Pranayama", "Yoga Sutras of Patanjali", "Teaching Methodology"],
    },
  },
  "Karate": {
    beginner: {
      title: "Beginner Belts (White & Yellow)",
      modules: ["White Belt (10th Kyu): Basic Stances (Zenkutsu-dachi), Straight Punch (Choku-zuki), Age-uke (Rising Block)", "Yellow Belt (9th Kyu): Heian Shodan Kata, Gedan Barai (Downward Block), Mae Geri (Front Kick)"],
    },
    intermediate: {
      title: "Intermediate Belts (Orange, Green, Blue)",
      modules: ["Orange Belt (8th Kyu): Heian Nidan Kata, Shuto-uke (Knife-hand Block)", "Green Belt (7th Kyu): Heian Sandan Kata, Yoko Geri (Side Kick)", "Blue Belt (6th Kyu): Heian Yondan Kata, Empi Uchi (Elbow Strike)"],
    },
    advanced: {
      title: "Advanced Belts (Brown & Black)",
      modules: ["Brown Belt (3rd-1st Kyu): Heian Godan, Tekki Shodan, Bassai Dai Katas, Introduction to Kumite (Sparring)", "Black Belt (1st Dan+): Advanced Katas (Kanku Dai, Enpi), Bunkai (Kata Application), Advanced Sparring Techniques"],
    },
  },
   "Kalaripayattu": {
    beginner: {
      title: "Beginner Level - Meithari (Body Conditioning)",
      modules: [
        "Kalugal (Leg Exercises): Basic kicks and leg swings.",
        "Kaikuththippayattu (Hand Exercises): Punches and blocks.",
        "Meippayattu (Body Exercises): Full-body sequences to improve flexibility and stamina.",
        "Chuvadukal (Basic Stances and Steps).",
      ],
    },
    intermediate: {
      title: "Intermediate Level - Kolthari (Wooden Weapons)",
      modules: [
        "Kettukari (Long Staff): Basic staff rotations and strikes.",
        "Cheruvadi (Short Staff): Close-range combat techniques.",
        "Otta (Curved Staff): Advanced techniques with the S-shaped weapon.",
        "Introduction to unarmed combat forms.",
      ],
    },
    advanced: {
      title: "Advanced Level - Ankathari & Verumkai (Metal Weapons & Bare-handed Combat)",
      modules: [
        "Valum Parichayum (Sword and Shield): The art of sword fighting.",
        "Urumi (Flexible Sword): Techniques for wielding the dangerous flexible sword.",
        "Verumkai Prayogam (Bare-handed Combat): Locks, throws, and pressure point attacks.",
        "Marma Chikitsa (Knowledge of Vital Points).",
      ],
    },
  },
};

const courseNames = Object.keys(syllabusData);

export default function SyllabusPage() {
  const [selectedCourse, setSelectedCourse] = useState<string>(courseNames[0]);

  const currentSyllabus = syllabusData[selectedCourse];

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle className="flex items-center gap-2">
                    <FilePenLine className="h-6 w-6" />
                    Syllabus Management
                </CardTitle>
                <CardDescription>
                    View and manage the syllabus for each course and level.
                </CardDescription>
            </div>
            <div className="w-64">
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                        {courseNames.map((course) => (
                            <SelectItem key={course} value={course}>{course}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        {currentSyllabus ? (
          <Accordion type="single" collapsible defaultValue="beginner" className="w-full">
            <AccordionItem value="beginner">
              <AccordionTrigger className="text-lg font-semibold">{currentSyllabus.beginner.title}</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc space-y-2 pl-6">
                  {currentSyllabus.beginner.modules.map((module, index) => (
                    <li key={index}>{module}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="intermediate">
              <AccordionTrigger className="text-lg font-semibold">{currentSyllabus.intermediate.title}</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc space-y-2 pl-6">
                  {currentSyllabus.intermediate.modules.map((module, index) => (
                    <li key={index}>{module}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="advanced">
              <AccordionTrigger className="text-lg font-semibold">{currentSyllabus.advanced.title}</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc space-y-2 pl-6">
                  {currentSyllabus.advanced.modules.map((module, index) => (
                    <li key={index}>{module}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : (
            <div className="text-center text-muted-foreground py-10">
                <p>No syllabus data available for {selectedCourse}.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
