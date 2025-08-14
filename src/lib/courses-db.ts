// This is a simple in-memory "database" for demonstration purposes.
// In a real application, you would use a proper database like Firestore, PostgreSQL, etc.

const initialCourses = [
  { id: 1, title: "Bharatanatyam", instructor: "Smt. Vani Ramesh", students: 45, duration: "Ongoing", level: "All Levels", image: "https://placehold.co/600x400.png", dataAiHint: "bharatanatyam dance", fees: 2500, paymentOptions: "Monthly" },
  { id: 2, title: "Vocal Carnatic", instructor: "Vid. Shankar Mahadevan", students: 60, duration: "Ongoing", level: "All Levels", image: "https://placehold.co/600x400.png", dataAiHint: "carnatic music", fees: 3000, paymentOptions: "Monthly" },
  { id: 3, title: "Guitar", instructor: "Mr. Alex Johnson", students: 75, duration: "12 weeks", level: "Beginner", image: "https://placehold.co/600x400.png", dataAiHint: "acoustic guitar", fees: 4000, paymentOptions: "Quarterly" },
  { id: 4, title: "Keyboard", instructor: "Mr. Richard Clayderman", students: 55, duration: "16 weeks", level: "Intermediate", image: "https://placehold.co/600x400.png", dataAiHint: "music keyboard", fees: 4500, paymentOptions: "Quarterly" },
  { id: 5, title: "Piano", instructor: "Mr. Beethoven Jr.", students: 30, duration: "Ongoing", level: "Advanced", image: "https://placehold.co/600x400.png", dataAiHint: "grand piano", fees: 15000, paymentOptions: "Half Yearly" },
  { id: 6, title: "Drums", instructor: "Mr. Ringo Starr", students: 40, duration: "10 weeks", level: "All Levels", image: "https://placehold.co/600x400.png", dataAiHint: "drum kit", fees: 3500, paymentOptions: "Monthly" },
  { id: 7, title: "Violin", instructor: "Ms. Vanessa Mae", students: 25, duration: "Ongoing", level: "Intermediate", image: "https://placehold.co/600x400.png", dataAiHint: "violin instrument", fees: 6000, paymentOptions: "Quarterly" },
  { id: 8, title: "Western Dance", instructor: "Mr. Prabhu Deva", students: 110, duration: "8 weeks", level: "Beginner", image: "https://placehold.co/600x400.png", dataAiHint: "hiphop dance", fees: 3000, paymentOptions: "Monthly" },
  { id: 9, title: "Zumba", instructor: "Ms. Gina Grant", students: 150, duration: "4 weeks", level: "All Levels", image: "https://placehold.co/600x400.png", dataAiHint: "zumba fitness", fees: 2000, paymentOptions: "Monthly" },
  { id: 10, title: "Gymnastics", instructor: "Ms. Nadia Comaneci", students: 35, duration: "Ongoing", level: "Advanced", image: "https://placehold.co/600x400.png", dataAiHint: "gymnastics sport", fees: 12000, paymentOptions: "Annually" },
  { id: 11, title: "Yoga", instructor: "Yogi Adityanath", students: 200, duration: "Ongoing", level: "All Levels", image: "https://placehold.co/600x400.png", dataAiHint: "yoga meditation", fees: 1800, paymentOptions: "Monthly" },
  { id: 12, title: "Karate", instructor: "Sensei Morio Higaonna", students: 90, duration: "Ongoing", level: "All Levels", image: "https://placehold.co/600x400.png", dataAiHint: "karate kick", fees: 1700, paymentOptions: "Monthly" },
  { id: 13, title: "Kalaripayattu", instructor: "Gurukkal Meenakshi Amma", students: 50, duration: "Ongoing", level: "Advanced", image: "https://placehold.co/600x400.png", dataAiHint: "kalaripayattu martialart", fees: 8000, paymentOptions: "Half Yearly" },
  { id: 14, title: "Art & Craft", instructor: "Ms. Frida Kahlo", students: 120, duration: "12 weeks", level: "Beginner", image: "https://placehold.co/600x400.png", dataAiHint: "art supplies", fees: 2200, paymentOptions: "Quarterly" },
]

export type Course = typeof initialCourses[0];

let courses: Course[] = [...initialCourses];

export const getCourses = async (): Promise<Course[]> => {
  // In a real db, this would be an async call
  return Promise.resolve(courses);
};

export const updateCourses = (newCourses: Course[]) => {
    courses = newCourses;
}
