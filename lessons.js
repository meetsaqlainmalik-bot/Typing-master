/* ============================================================
   Typing Master Pro - Course Lessons (12 lessons, TM style)
   Home row -> full keyboard progression
   ============================================================ */

const LESSONS = [
  {
    id: 1,
    title: "Home Row Basics",
    keys: "a s d f  j k l ;",
    desc: "Asli finger positioning seekhein",
    chunks: [
      "asdf jkl; asdf jkl;",
      "fff jjj fff jjj",
      "fff jjj fff jjj ddd kkk",
      "aaa sss ddd fff",
      ";;; lll kkk jjj",
      "fff jjj ddd kkk sss lll aaa ;;;",
      "asdf jkl; asdf jkl; asdf jkl;",
      "adj ;lk adj ;lk",
      "add all ask lads fall",
      "salad flask glad sad",
      "a lad; a fall; a flask",
      "dad asks lads; all fall"
    ]
  },
  {
    id: 2,
    title: "Home Row Expansion",
    keys: "g h (reach fingers)",
    desc: "G aur H keys - index finger reach",
    chunks: [
      "ghg hgh ghg hgh",
      "ffg jjh ffg jjh",
      "fgf jhj fgf jhj",
      "ggg hhh ggg hhh",
      "flag hash glad lash",
      "half hash gala shall",
      "glass half lads gash",
      "hag has hassle flask",
      "dad has a flask; a lad has a flag",
      "all half glass; a glad lad shall ask",
      "hashtag flash glass half gala",
      "shag haggis hassle gash hash"
    ]
  },
  {
    id: 3,
    title: "Top Row Left",
    keys: "q w e r t",
    desc: "Left hand top row - qwert",
    chunks: [
      "qwerty qwert qwert qwer",
      "qqq www eee rrr ttt",
      "qwer rewq qwer rewq",
      "wet wetter retweet tree",
      "weft tweet fetter queer",
      "red tree twee fee tree",
      "fretrequete wrt wert",
      "were free tree green",
      "a red tree; three green trees",
      "we try to get free water",
      "the weather is rather wet",
      "the quiet writer wrote a report"
    ]
  },
  {
    id: 4,
    title: "Top Row Right",
    keys: "y u i o p",
    desc: "Right hand top row - yuiop",
    chunks: [
      "yuiop yuop yuop yui",
      "yyy uuu iii ooo ppp",
      "yuiop poiuy yuiop poiuy",
      "you up your pipe",
      "poppy purity your pure",
      "proof hippo purple puree",
      "oil your loop your hoop",
      "you prove my point",
      "put your paper in your pipe",
      "you type your report properly",
      "my poor purple puppy",
      "you play your music properly"
    ]
  },
  {
    id: 5,
    title: "Top Row Full",
    keys: "qwerty uiop",
    desc: "Dono hath - full top row",
    chunks: [
      "qwertyuiop qwertyuiop",
      "pout quiet report type",
      "querty power quiet report",
      "put your typewriter properly",
      "write your own report",
      "your type report quality",
      "wire your pretty typewriter",
      "we type quickly with power",
      "the pretty quiet writer writes",
      "your report type quality power",
      "wire type power quietly report",
      "they put your report quietly"
    ]
  },
  {
    id: 6,
    title: "Bottom Row Left",
    keys: "z x c v b",
    desc: "Left hand bottom row",
    chunks: [
      "zxcvb zxcvb zxcvb",
      "zzz xxx ccc vvv bbb",
      "zxcvb bcxvz zxcvb bcxvz",
      "zip vex box canvas",
      "boxy zebra cubic verbal",
      "zip code canvas box",
      "buzz vex cab zip",
      "cubic verbal box zip",
      "a vexing zip code box",
      "the big zebra cub vexes",
      "bundle the canvas box",
      "buzz about the zip code"
    ]
  },
  {
    id: 7,
    title: "Bottom Row Right",
    keys: "n m , . /",
    desc: "Right hand bottom row + punctuation",
    chunks: [
      "nm,./ nm,./ nm,./",
      "nnn mmm ,,, ... ???",
      "man, moon, more.",
      "menu money mom, man.",
      "common money menu, man",
      "your name, my name.",
      "can we meet? yes, we can.",
      "look, mom! i made it.",
      "we can meet at 5 p.m.",
      "no, not now, maybe later.",
      "bring me my menu, please?",
      "the moon is beautiful, isn't it?"
    ]
  },
  {
    id: 8,
    title: "Bottom Row Full",
    keys: "zxcvb nm,./",
    desc: "Full bottom row + punctuation",
    chunks: [
      "zxcvbnm,./ zxcvbnm",
      "zoom in, move on. /ok",
      "lazy morning, cozy cabin.",
      "my amazing vacation, next week.",
      "come, let's explore, now!",
      "we zoom into the amazing canyon.",
      "move it! /ok? now, please.",
      "the lazy cat moved quickly.",
      "amazing! cozy cabin, next month.",
      "i can move mountains, you know.",
      "can you explain the confusion?",
      "everything is amazing, isn't it?"
    ]
  },
  {
    id: 9,
    title: "Capital Letters",
    keys: "Shift + letters",
    desc: "Shift key se capital letters",
    chunks: [
      "The Quick Brown Fox",
      "Jumped Over The Lazy Dog",
      "Pakistan Is My Country",
      "Lahore Karachi Islamabad",
      "My Name Is Ali Khan",
      "I Love My City Lahore",
      "The Sun Rises In East",
      "He Wrote A Letter Today",
      "Mr Khan Went To Market",
      "January February March April",
      "English Hindi Urdu Punjabi",
      "Monday Tuesday Wednesday Thursday"
    ]
  },
  {
    id: 10,
    title: "Common Words",
    keys: "the, and, for, are...",
    desc: "Sabse zyada istemal hone wale alfaaz",
    chunks: [
      "the and for are but not you all",
      "can had her was one our out",
      "the quick way to learn typing",
      "you can type faster every day",
      "and the best way is practice",
      "but not everyone types the same",
      "for all the time you spend typing",
      "are you ready to improve your skills",
      "the more you practice the better",
      "you will find it easier each day",
      "all of us can learn to type fast",
      "but it takes time and patience"
    ]
  },
  {
    id: 11,
    title: "Punctuation & Symbols",
    keys: "! ? , . ; ' \" - ( )",
    desc: "Punctuation marks practice",
    chunks: [
      "\"Hello,\" she said. \"How are you?\"",
      "I'm fine, thanks! And you?",
      "He said, \"It's 5 o'clock.\"",
      "Wait... what? Really?! Wow!",
      "The (quick) brown fox - yes!",
      "Is this Mr. Khan's book? Yes.",
      "It costs $10 (ten dollars).",
      "Email: ali@example.com; Phone: 0300",
      "Rock & roll, jazz, and blues...",
      "Don't stop; keep going! (You can)",
      "A: What's your name? B: I'm Ahmed.",
      "The year 2024 was great, wasn't it?"
    ]
  },
  {
    id: 12,
    title: "Numbers & Advanced",
    keys: "1 2 3 4 5 6 7 8 9 0",
    desc: "Number row + mixed text",
    chunks: [
      "1234567890 0987654321",
      "I have 3 cats and 5 dogs.",
      "Room 45, Floor 12, Building 7",
      "Order #4567 costs Rs. 1,250.",
      "Call me at 3 p.m. on 25th Dec.",
      "9 out of 10 people type faster.",
      "The speed was 65 WPM today!",
      "I scored 98% in my 12th exam.",
      "Page 42, Line 7, Word 15.",
      "April 14, 2024 was a great day.",
      "Mixing 123 with abc and !@#.",
      "Final score: 85% accuracy, 40 WPM!"
    ]
  }
];

/* ============ DRILL GENERATORS ============ */

// Home row keys for easy drills
const HOME_ROW = "asdfjkl;gh";

const DRILL_WORDS = {
  easy: [
    "add", "ask", "dad", "fall", "flag", "flash", "flask", "gala", "glad",
    "gash", "half", "hag", "hash", "lad", "lads", "lash", "salad", "sad",
    "all", "a", "has", "shall", "shall", "ask", "dad", "gala", "glass",
    "had", "has", "jab", "lag", "lash", "sag", "alas", "flak", "dag"
  ],
  medium: [
    "the", "and", "for", "are", "but", "not", "you", "all", "can", "had",
    "her", "was", "one", "our", "out", "day", "get", "has", "him", "his",
    "how", "man", "new", "now", "old", "see", "two", "way", "who", "boy",
    "did", "its", "let", "put", "say", "she", "too", "use", "type", "word",
    "free", "good", "help", "keep", "learn", "make", "practice", "quick",
    "right", "skill", "small", "start", "study", "test", "time", "work"
  ],
  hard: [
    "ability", "absolute", "academic", "accident", "activity", "actually",
    "addition", "adventure", "afternoon", "agreement", "almost", "although",
    "ambulance", "analysis", "announce", "anything", "apparent", "approach",
    "argument", "beautiful", "beginning", "believed", "benefit", "between",
    "business", "calculate", "california", "candidate", "carefully",
    "certainly", "champion", "character", "children", "choose", "citizen",
    "clearly", "collect", "college", "combination", "comfortable",
    "commercial", "committee", "community", "company", "compare", "compete",
    "complex", "computer", "concern", "condition", "conference", "consider",
    "continue", "contract", "contrast", "convenient", "corporate",
    "daughter", "decision", "decrease", "demonstrate", "department",
    "describe", "designed", "development", "difference", "difficult",
    "discovered", "distance", "distribution", "district", "divide",
    "education", "eight", "electric", "elements", "employees", "england",
    "english", "enjoy", "enough", "environment", "equipment", "especially",
    "establish", "evening", "every", "everyone", "everything", "evidence",
    "exactly", "excellent", "exercise", "expect", "experience", "explain",
    "express", "factor", "family", "favorite", "february", "feeling",
    "festival", "finally", "financial", "following", "foreign", "forever",
    "forward", "friend", "function", "general", "generally", "gold",
    "government", "great", "green", "ground", "group", "grow", "happened",
    "hardly", "healthy", "height", "helpful", "himself", "history",
    "hospital", "however", "human", "hundred", "imagine", "immediately",
    "important", "improve", "include", "including", "increase", "indeed",
    "industry", "influence", "information", "inside", "instead", "interest",
    "international", "involve", "January", "language", "large", "later",
    "laugh", "learning", "least", "leave", "legal", "length", "letter",
    "level", "library", "likely", "listen", "little", "living", "local",
    "machine", "manager", "married", "material", "matter", "maybe", "meaning",
    "measure", "medical", "meeting", "member", "memory", "method", "middle",
    "military", "million", "minister", "minor", "minute", "modern", "morning",
    "mother", "mountain", "movement", "music", "national", "natural",
    "nature", "nearly", "necessary", "needed", "neighbor", "network",
    "never", "notice", "nothing", "notice", "number", "object", "observe",
    "obtain", "office", "officer", "official", "often", "operating",
    "opinion", "opportunity", "order", "organization", "otherwise",
    "outside", "package", "parent", "particular", "partner", "passage",
    "patient", "pattern", "payment", "people", "perhaps", "period",
    "personal", "phrase", "physical", "picture", "planning", "pleasant",
    "pleasure", "pocket", "police", "policy", "political", "popular",
    "population", "position", "possible", "powerful", "practice", "prepare",
    "present", "president", "pressure", "pretty", "prevent", "previous",
    "prince", "prison", "private", "problem", "procedure", "process",
    "produce", "product", "professional", "professor", "program", "project",
    "promise", "proof", "proper", "protect", "provide", "public", "purpose",
    "quality", "quarter", "question", "quickly", "quietly", "radio", "raise",
    "range", "rather", "reality", "realize", "reason", "receive", "recent",
    "recognize", "record", "reflect", "region", "relationship", "religion",
    "remain", "remember", "remove", "repeat", "replace", "reply", "report",
    "represent", "republic", "require", "research", "resource", "respond",
    "result", "return", "reveal", "review", "right", "routine", "satisfy",
    "science", "section", "security", "sense", "sentence", "separate",
    "serious", "serve", "service", "several", "shoulder", "signal",
    "significant", "similar", "simple", "simply", "situation", "society",
    "soldier", "solution", "somebody", "someone", "something", "sometimes",
    "special", "specific", "speech", "standard", "statement", "station",
    "strategy", "structure", "student", "subject", "suddenly", "suggest",
    "support", "suppose", "surface", "system", "teacher", "technical",
    "technique", "technology", "television", "temperature", "themselves",
    "therefore", "thought", "thousand", "through", "together", "tomorrow",
    "tongue", "tonight", "toward", "traffic", "training", "travel",
    "treasure", "treatment", "triangle", "trouble", "turn", "twelve",
    "twenty", "understand", "unit", "university", "unless", "until",
    "usually", "variety", "various", "vehicle", "village", "visit",
    "voice", "waiting", "walking", "warm", "watch", "water", "wealth",
    "weather", "weekend", "welcome", "welfare", "western", "whatever",
    "whisper", "whistle", "whole", "whose", "willing", "window", "winter",
    "wonder", "wooden", "worker", "world", "worry", "worth", "would",
    "write", "wrong", "yellow", "yesterday", "young"
  ]
};

// Common English sentences
const SENTENCES = [
  "The quick brown fox jumps over the lazy dog.",
  "A journey of a thousand miles begins with a single step.",
  "Practice makes a man perfect.",
  "The best way to predict the future is to create it.",
  "In the middle of difficulty lies opportunity.",
  "It does not matter how slowly you go as long as you do not stop.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The only way to do great work is to love what you do.",
  "Life is what happens when you are busy making other plans.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "In three words I can sum up everything I have learned about life: it goes on.",
  "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.",
  "The mind is everything. What you think you become.",
  "An unexamined life is not worth living.",
  "Be the change that you wish to see in the world.",
  "However difficult life may seem, there is always something you can do and succeed at.",
  "You have the right to work, but never to the fruit of work.",
  "When you judge another, you do not define them, you define yourself.",
  "The greatest glory in living lies not in never falling, but in rising every time we fall.",
  "Injustice anywhere is a threat to justice everywhere.",
  "Darkness cannot drive out darkness; only light can do that. Hate cannot drive out hate; only love can do that.",
  "Our lives begin to end the day we become silent about things that matter.",
  "The only thing we have to fear is fear itself.",
  "Ask not what your country can do for you, ask what you can do for your country.",
  "I have a dream that my four little children will one day live in a nation where they will not be judged by the color of their skin but by the content of their character.",
  "The world will not be destroyed by those who do evil, but by those who watch them without doing anything.",
  "Not all those who wander are lost.",
  "It is our choices, Harry, that show what we truly are, far more than our abilities.",
  "Happiness can be found, even in the darkest of times, if one only remembers to turn on the light.",
  "Words are, in my not so humble opinion, our most inexhaustible source of magic.",
  "It takes a great deal of bravery to stand up to our enemies, but just as much to stand up to our friends.",
  "Do not pity the dead, Harry. Pity the living, and above all, those who live without love.",
  "The stories we love best live in us forever.",
  "It is impossible to live without failing at something, unless you live so cautiously that you might as well not have lived at all.",
  "Whether you think you can or you think you cannot, you are right.",
  "The only impossible journey is the one you never begin.",
  "Act as if what you do makes a difference. It does.",
  "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
  "Keep your face always toward the sunshine, and shadows will fall behind you.",
  "The way to get started is to quit talking and begin doing.",
  "It is not the strongest of the species that survives, nor the most intelligent, but the one most responsive to change."
];

// Famous quotes (longer passages)
const QUOTES = [
  "The future belongs to those who believe in the beauty of their dreams. Every moment is a fresh beginning, and every day presents us with new opportunities to grow and learn.",
  "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful in whatever you choose to pursue in life.",
  "In the end, it is not the years in your life that count. It is the life in your years. Live each day as if it were your last, and one day you will be right.",
  "The greatest glory in living lies not in never falling, but in rising every time we fall. The only way to achieve the impossible is to believe it is possible.",
  "Life is like riding a bicycle. To keep your balance, you must keep moving forward. The only true wisdom is in knowing you know nothing.",
  "Do not go where the path may lead, go instead where there is no path and leave a trail. In the middle of every difficulty lies opportunity.",
  "Strive not to be a success, but rather to be of value. You can use up grief living in the past, or you can use up grief living in the present.",
  "The best time to plant a tree was twenty years ago. The second best time is now. A river cuts through rock not because of its power but its persistence."
];

// Number-heavy practice
const NUMBERS_DRILL = [
  "1234567890 0987654321 1122334455 9988776655",
  "Order number 45678, total Rs. 12,500.00",
  "Phone: 0300-1234567, Alt: 0321-9876543",
  "In 2024, we grew by 45% and reached 1,250 customers.",
  "Room 45, Floor 12, Building 7, Sector F-8",
  "Call me at 3:45 p.m. on December 25th, 2024.",
  "9 out of 10 experts agree: practice daily for best results.",
  "Speed: 65 WPM, Accuracy: 98%, Time: 45 minutes",
  "Page 42, Line 7, Paragraph 15, Word count: 350",
  "April 14, 2024 | 08:30 AM | Ticket #AB12345 | Seat 27B",
  "Invoice #2024-0567 | Date: 15/03/2024 | Amount: Rs. 45,750.50",
  "The ratio is 3:5, the percentage is 75%, and the total is 1,024."
];

// Punctuation-heavy practice
const PUNCTUATION_DRILL = [
  "\"Hello,\" she said. \"How are you today?\"",
  "I'm fine, thanks! And you? I'm doing great, honestly.",
  "Wait... what? Really?! Wow! That's amazing!",
  "The (quick) brown fox - yes, really! - jumped over the lazy dog.",
  "Is this Mr. Khan's book? Yes, it is. It's his favorite.",
  "Don't stop; keep going! You're doing great.",
  "A: What's your name? B: I'm Ahmed. Nice to meet you!",
  "Email: ali@example.com; Phone: 0300-1234567; Address: Lahore.",
  "Rock & roll, jazz, and blues are my favorite genres...",
  "The year 2024 was great, wasn't it? Yes, it certainly was!",
  "He said: \"It's 5 o'clock. Let's go home.\" I agreed.",
  "Cost: $10 (ten dollars). Discount: 15%. Final: $8.50."
];

/* ============ WORD LISTS BY DIFFICULTY ============ */
const ALL_WORDS = {
  easy: DRILL_WORDS.easy,
  medium: DRILL_WORDS.medium,
  hard: DRILL_WORDS.hard
};
