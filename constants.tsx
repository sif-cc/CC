
import { Module, SubSectionItem } from './types';

export const EDUCATIONAL_MODULES: Module[] = Array.from({ length: 8 }).map((_, mIdx) => {
  const isHSC = mIdx === 0;
  const isCC = mIdx === 1;
  const isSSC = mIdx === 2;
  const isDiploma = mIdx === 3;
  const isDUET = mIdx === 4;
  const isEnglish = mIdx === 5;
  
  let title = `Section ${mIdx + 1}: [Pending]`;
  if (isHSC) title = "HSC";
  else if (isCC) title = "CC";
  else if (isSSC) title = "SSC";
  else if (isDiploma) title = "Diploma (2nd Semester)";
  else if (isDUET) title = "DUET";
  else if (isEnglish) title = "English";

  const description = isHSC 
    ? "Comprehensive preparation for the HSC. Master core subjects with modular lessons, past papers, and expert analysis."
    : isCC
    ? "Central Core curriculum module. Access fundamental learning paths and specialized unit-based instruction."
    : isSSC
    ? "Secondary School Certificate curriculum. Foundation-level modules across key scientific and humanities disciplines."
    : isDiploma
    ? "Specialized polytechnic curriculum for the 2nd semester. Advanced technical modules for engineering and technology students."
    : isDUET
    ? "Elite admission preparation for Dhaka University of Engineering & Technology. Intensive modules for engineering aspirants."
    : isEnglish
    ? "Global language mastery. From core grammar and literature to advanced communication and test preparation."
    : `Global knowledge node for Section ${mIdx + 1}. Comprehensive analysis and modular synthesized learning tracks await your instruction.`;

  return {
    id: `m${mIdx + 1}`,
    title,
    description,
    icon: ['🎓', '🔬', '📚', '⚙️', '🏛️', '📝', '📓', '🔬'][mIdx],
    color: ['bg-blue-600', 'bg-emerald-500', 'bg-amber-600', 'bg-violet-600', 'bg-rose-600', 'bg-sky-600', 'bg-cyan-500', 'bg-purple-500'][mIdx],
    subSections: Array.from({ length: isHSC ? 3 : (isCC ? 2 : (isSSC ? 3 : (isDiploma ? 6 : (isDUET ? 5 : (isEnglish ? 10 : 3))))) }).map((_, ssIdx) => {
      const isFirstSub = ssIdx === 0;
      const isSecondSub = ssIdx === 1;
      const isThirdSub = ssIdx === 2;
      
      let subTitle = `Unit ${mIdx + 1}.${ssIdx + 1}`;
      if (isHSC) {
        if (isFirstSub) subTitle = "Mathematics";
        else if (isSecondSub) subTitle = "Physics";
        else if (isThirdSub) subTitle = "Chemistry";
      } else if (isCC) {
        subTitle = `${ssIdx + 1}`;
      } else if (isSSC) {
        if (isFirstSub) subTitle = "Mathematics";
        else if (isSecondSub) subTitle = "Physics";
        else if (isThirdSub) subTitle = "Chemistry";
      } else if (isDiploma) {
        const diplomaSubs = ["Mathematics-2", "Physics-2", "Communicative English", "Computer Application", "Engineering Drawing", "Electronics"];
        subTitle = diplomaSubs[ssIdx] || `Diploma Unit ${ssIdx + 1}`;
      } else if (isDUET) {
        const duetSubs = ["Mathematics", "Physics", "Chemistry", "English", "Civil Engineering"];
        subTitle = duetSubs[ssIdx] || `DUET Prep ${ssIdx + 1}`;
      } else if (isEnglish) {
        const englishSubs = [
          "Grammar Fundamentals", "Advanced Vocabulary", "Creative Writing", 
          "Literature Analysis", "Spoken English", "Academic Reading", 
          "IELTS Preparation", "Business Communication", "Phonetics & Pronunciation", "Poetry & Drama"
        ];
        subTitle = englishSubs[ssIdx] || `English Module ${ssIdx + 1}`;
      }

      return {
        id: `ss${mIdx + 1}-${ssIdx + 1}`,
        title: subTitle,
        description: `Core curriculum segment focused on specialized modular data within this academic domain.`,
        duration: `${(ssIdx + 1) * 20} mins`,
        type: (['reading', 'video', 'lab', 'quiz'] as const)[Math.floor(Math.random() * 4)],
        difficulty: (['Beginner', 'Intermediate', 'Advanced'] as const)[ssIdx % 3],
        sections: Array.from({ length: (isHSC && (ssIdx >= 0 && ssIdx <= 2)) ? 2 : 1 }).map((_, secIdx) => {
          let sectionTitle = `Section ${secIdx + 1}: General`;
          const isMathematicsBranch = isHSC && ssIdx === 0;
          const isPhysicsBranch = isHSC && ssIdx === 1;
          const isChemistryBranch = isHSC && ssIdx === 2;
          
          if (isMathematicsBranch) {
            if (secIdx === 0) sectionTitle = "Math 1st paper";
            if (secIdx === 1) sectionTitle = "Math 2nd paper";
          } else if (isPhysicsBranch) {
            if (secIdx === 0) sectionTitle = "Physics 1st paper";
            if (secIdx === 1) sectionTitle = "Physics 2nd paper";
          } else if (isChemistryBranch) {
            if (secIdx === 0) sectionTitle = "Chemistry 1st paper";
            if (secIdx === 1) sectionTitle = "Chemistry 2nd paper";
          } else if (isCC) {
            if (ssIdx === 0) sectionTitle = "science";
            if (ssIdx === 1) sectionTitle = "Science";
          } else if (isSSC) {
             if (isFirstSub) sectionTitle = "Mathematics Core";
             if (isSecondSub) sectionTitle = "Secondary Physics Principles";
             if (isThirdSub) sectionTitle = "Secondary Chemistry Basics";
          } else if (isDiploma || isDUET || isEnglish) {
             sectionTitle = `${subTitle} Core`;
          }

          return {
            id: `sec-${mIdx}-${ssIdx}-${secIdx}`,
            title: sectionTitle,
            description: `Core educational materials and specialized modules.`,
            chapters: Array.from({ length: 5 }).map((_, chIdx) => {
              let chapterTitle = `Chapter ${chIdx + 1}: [Awaiting Chapter Name]`;
              const isVectorChapter = isPhysicsBranch && secIdx === 0 && chIdx === 1;
              const isCurrentElectricityChapter = isPhysicsBranch && secIdx === 1 && chIdx === 2;
              const isMatrixChapter = isMathematicsBranch && secIdx === 0 && chIdx === 0;

              if (isMathematicsBranch) {
                if (secIdx === 0) {
                  if (chIdx === 0) chapterTitle = "Matrix and Determinants";
                  else chapterTitle = ["Vectors", "Straight Lines", "Circles", "Differentiation", "Integration"][chIdx] || `Chapter ${chIdx + 1}`;
                } else {
                  chapterTitle = ["Complex Numbers", "Polynomials", "Trigonometric Equations", "Inverse Trig Functions", "Statics"][chIdx] || `Advanced Topic ${chIdx + 1}`;
                }
              } else if (isPhysicsBranch) {
                if (secIdx === 0) {
                  chapterTitle = ["Physical World & Measurement", "Vector", "Newtonian Mechanics", "Work, Energy & Power", "Gravity"][chIdx];
                } else {
                  chapterTitle = ["Thermodynamics", "Static Electricity", "Current Electricity", "Magnetic Effect of Current", "Atomic Model & Nuclear Physics"][chIdx];
                }
              } else if (isCC) {
                const prefix = ssIdx === 0 ? "science" : "Science";
                chapterTitle = `${prefix} Module ${chIdx + 1}: Foundational Core`;
              } else if (isSSC) {
                const topics = isFirstSub 
                  ? ["Sets & Functions", "Algebraic Expressions", "Logarithms", "Geometry", "Trigonometry"] 
                  : isSecondSub 
                  ? ["Physical Quantities & Measurement", "Motion", "Force", "Work, Power & Energy", "States of Matter & Pressure"]
                  : ["Concepts of Chemistry", "States of Matter", "Structure of Matter", "Periodic Table", "Chemical Bonds"];
                chapterTitle = topics[chIdx] || `SSC Chapter ${chIdx + 1}`;
              } else if (isDiploma) {
                const diplomaTopics: Record<number, string[]> = {
                  0: ["Calculus Differential", "Calculus Integral", "Analytical Geometry", "Probability", "Statistics"],
                  1: ["Heat and Thermodynamics", "Optics", "Modern Physics", "Waves", "Acoustics"],
                  2: ["Grammar Fundamentals", "Technical Writing", "Listening Skills", "Speaking Skills", "Comprehension"],
                  3: ["Word Processing", "Spreadsheet", "Presentation Software", "Database Basics", "Internet & Security"],
                  4: ["Geometric Construction", "Projection Theory", "Isometric Drawing", "Orthographic Projection", "CAD Basics"],
                  5: ["Semiconductors", "Diodes & Rectifiers", "Transistors", "Operational Amplifiers", "Digital Logic"]
                };
                chapterTitle = diplomaTopics[ssIdx]?.[chIdx] || `Diploma Topic ${chIdx + 1}`;
              } else if (isDUET) {
                const duetTopics: Record<number, string[]> = {
                  0: ["Trigonometry", "Coordinate Geometry", "Differentiation", "Integration", "Vector Analysis"],
                  1: ["Heat & Thermodynamics", "Static & Current Electricity", "Light & Optics", "Magnetism", "Modern Physics"],
                  2: ["Atomic Structure", "Chemical Bonding", "Organic Chemistry", "Acid-Base Chemistry", "Electrochemistry"],
                  3: ["Functional Grammar", "Sentence Correction", "Vocabulary & Synonyms", "Translation", "Paragraph Writing"],
                  4: ["Applied Mechanics", "Strength of Materials", "Civil Engineering Materials", "Surveying", "Building Construction"]
                };
                chapterTitle = duetTopics[ssIdx]?.[chIdx] || `DUET Intensive ${chIdx + 1}`;
              } else if (isEnglish) {
                const englishTopics: Record<number, string[]> = {
                  0: ["Parts of Speech", "Tense Mastery", "Sentence Transformation", "Voice Change", "Clauses & Phrases"],
                  1: ["Root Words", "Synonyms & Antonyms", "Idioms & Phrases", "Contextual Usage", "Academic Jargon"],
                  2: ["Narrative Techniques", "Style & Tone", "Story Arc Development", "Character Building", "Essay Structures"],
                  3: ["Critical Theory", "Historical Context", "Literary Devices", "Prose Analysis", "Thematic Studies"],
                  4: ["Fluency Drills", "Public Speaking", "Debating Skills", "Presentation Delivery", "Listening Comprehension"],
                  5: ["Scanning & Skimming", "Inference Skills", "Summary Writing", "Data Interpretation", "Article Analysis"],
                  6: ["Reading Module", "Listening Module", "Writing Module", "Speaking Module", "Full Mock Analysis"],
                  7: ["Email Etiquette", "Report Writing", "Negotiation Skills", "Meeting Minutes", "Corporate Communication"],
                  8: ["Vowel & Consonant Sounds", "Syllable Stress", "Intonation Patterns", "Connected Speech", "IPA Transcription"],
                  9: ["Meter & Rhythm", "Dramatic Monologues", "Shakespearean Studies", "Modern Drama", "Poetic Form"]
                };
                chapterTitle = englishTopics[ssIdx]?.[chIdx] || `English Chapter ${chIdx + 1}`;
              }

              const items: SubSectionItem[] = [];

              // First Item: Main Video / Playlist
              items.push({ 
                id: `i-${mIdx}-${ssIdx}-${secIdx}-${chIdx}-1`, 
                title: isMatrixChapter 
                  ? "Matrix" 
                  : isVectorChapter || isCurrentElectricityChapter
                  ? `${isVectorChapter ? 'Vector' : 'Current Electricity'} Playlist`
                  : `Video Lecture`, 
                status: 'Ready', 
                type: 'video',
                url: isMatrixChapter 
                  ? "https://www.youtube.com/watch?v=0oGJTQCy4cQ&list=PLi5giWKc4eO1G8oX3ft8ZuLQr4Y4idgng" 
                  : isVectorChapter
                  ? "https://www.youtube.com/watch?v=jcxrIPlZuuE&list=PLmNRfZA0yjQsrhqNh5lfMMI7kfevIXW_f"
                  : isCurrentElectricityChapter
                  ? "https://www.youtube.com/watch?v=V9X8F6v8S6M&list=PLmNRfZA0yjQsMv5Dsk95A3G4mH0O-Yh8q"
                  : undefined
              });

              // Second Item: Practice Book (renamed globally from Note Sheet)
              items.push({ 
                id: `i-${mIdx}-${ssIdx}-${secIdx}-${chIdx}-2`, 
                title: `Practice book`, 
                status: 'Ready', 
                type: 'reading',
                url: isVectorChapter 
                  ? 'https://drive.google.com/file/d/19R00v7jM9KFMUc2WEFb7N218dAjYfzLZ/view?usp=drive_link'
                  : isCurrentElectricityChapter
                  ? 'https://drive.google.com/file/d/1jTIIL1G5fOK-xJTR8kV2G33eF525w8lf/view?usp=sharing'
                  : undefined
              });

              // Conditional Items
              if (!isVectorChapter && !isCurrentElectricityChapter) {
                items.push({ 
                  id: `i-${mIdx}-${ssIdx}-${secIdx}-${chIdx}-4`, 
                  title: isMatrixChapter ? "Determinants" : `Solved Problems`, 
                  status: 'Ready', 
                  type: 'video',
                  url: isMatrixChapter ? "https://www.youtube.com/watch?v=OU9sWHk_dlw&list=PLbjngCJMSuvr1Jmf7kGCs6-NzqrRvr_Vy" : undefined
                });
                
                items.push({ 
                  id: `i-${mIdx}-${ssIdx}-${secIdx}-${chIdx}-3`, 
                  title: `Assessment`, 
                  status: 'Locked', 
                  type: 'quiz' 
                });
              }

              return {
                id: `ch-${mIdx}-${ssIdx}-${secIdx}-${chIdx}`,
                title: chapterTitle,
                description: `Detailed analysis of ${chapterTitle} core principles and methodologies.`,
                items
              };
            })
          };
        })
      };
    })
  };
});

export const INITIAL_PLAYLISTS = [
  {
    id: 'p1',
    title: 'HSC Physics - Vector Series',
    url: 'https://www.youtube.com/watch?v=jcxrIPlZuuE&list=PLmNRfZA0yjQsrhqNh5lfMMI7kfevIXW_f',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'p2',
    title: 'Matrix & Determinants - Part 1',
    url: 'https://www.youtube.com/watch?v=0oGJTQCy4cQ&list=PLi5giWKc4eO1G8oX3ft8ZuLQr4Y4idgng',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'p3',
    title: 'Matrix & Determinants - Part 2',
    url: 'https://www.youtube.com/watch?v=OU9sWHk_dlw&list=PLbjngCJMSuvr1Jmf7kGCs6-NzqrRvr_Vy',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=800'
  }
];
