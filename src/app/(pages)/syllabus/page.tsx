
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
      title: "Beginner Level - Adavus",
      modules: ["Thattadavu", "Nattadavu", "Kudithu Mettadavu", "Sarikkal Adavu", "Mei Adavu"],
    },
    intermediate: {
      title: "Intermediate Level - Alarippu & Jathiswaram",
      modules: ["Alarippu in Tisra Eka talam", "Jathiswaram in Ragamalika", "Introduction to Abhinaya", "Small Keertanams"],
    },
    advanced: {
      title: "Advanced Level - Varnam & Padam",
      modules: ["Complex Varnam compositions", "Padams and Javalis", "Thillana", "Stage performance techniques"],
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
