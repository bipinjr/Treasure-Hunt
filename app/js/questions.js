// All game content. Edit freely: `answer` must exactly match one of `choices`.
// Choices are shuffled at runtime, so order here does not matter.

export const ZONES = [
  { id: 'crypt',   name: 'Crypt of Cipher',   domain: 'Data',          accent: '#5b8def' },
  { id: 'forge',   name: 'Forge of Logic',    domain: 'Programming',   accent: '#ff8a3d' },
  { id: 'shields', name: 'Gate of Shields',   domain: 'Cybersecurity', accent: '#3ddc84' },
  { id: 'heart',   name: 'Heart of the Cave', domain: 'AI',            accent: '#c27bff' },
];

// Letters dropped by the 12 enemies (one each)
export const RUNE_WORD = 'CAVERNOFCODE';

export const ENEMIES = [
  // ---- Zone 1: Crypt of Cipher ----
  { zone: 'crypt', name: 'Bone Clerk', sprite: 'skeleton', difficulty: 'easy', variants: [
    { prompt: 'Shift each letter BACK by 3 to decode:  F D W', choices: ['CAT', 'DOG', 'BAT', 'COW'], answer: 'CAT', explain: 'F→C, D→A, W→T' },
    { prompt: 'Shift each letter BACK by 3 to decode:  G R J', choices: ['DOG', 'FOX', 'PIG', 'HEN'], answer: 'DOG', explain: 'G→D, R→O, J→G' },
    { prompt: 'Shift each letter BACK by 1 to decode:  C P Y', choices: ['BOX', 'TOY', 'COW', 'BAG'], answer: 'BOX', explain: 'C→B, P→O, Y→X' },
  ]},
  { zone: 'crypt', name: 'Bit Bat', sprite: 'bat', difficulty: 'easy', variants: [
    { prompt: 'In binary: 1 = 1, 10 = 2, 11 = 3, 100 = 4.\nWhat is 101?', choices: ['5', '6', '4', '101'], answer: '5', explain: '100 is 4, plus 1 = 5' },
    { prompt: 'In binary: 1 = 1, 10 = 2, 11 = 3, 100 = 4.\nWhat is 110?', choices: ['6', '5', '7', '110'], answer: '6', explain: '100 is 4, plus 10 (2) = 6' },
    { prompt: 'Each bulb is ON or OFF. How many different patterns can 3 bulbs make?', choices: ['8', '3', '6', '9'], answer: '8', explain: '2 × 2 × 2 = 8' },
  ]},
  { zone: 'crypt', name: 'Data Wraith', sprite: 'ghost', difficulty: 'medium', variants: [
    { prompt: 'Best way to store the PRICE of a pizza (₹249.50)?', choices: ['Decimal number', 'Text', 'Yes / No', 'Date'], answer: 'Decimal number', explain: 'Prices need decimals and maths' },
    { prompt: 'Best way to store “Has the student paid the fees?”', choices: ['Yes / No', 'Decimal number', 'Text', 'Date'], answer: 'Yes / No', explain: 'Only two possible values: a Boolean' },
    { prompt: 'Which should be stored as TEXT, even though it is made of digits?', choices: ['Mobile number', 'Age', 'Marks', 'Price'], answer: 'Mobile number', explain: 'You never add or multiply phone numbers' },
  ]},
  // ---- Zone 2: Forge of Logic ----
  { zone: 'forge', name: 'Loop Slime', sprite: 'magma', difficulty: 'easy', variants: [
    { prompt: 'x = 2\nRepeat 3 times:  x = x + 2\nWhat is x now?', choices: ['8', '6', '10', '5'], answer: '8', explain: '2 → 4 → 6 → 8' },
    { prompt: 'x = 10\nRepeat 2 times:  x = x − 3\nWhat is x now?', choices: ['4', '7', '1', '13'], answer: '4', explain: '10 → 7 → 4' },
    { prompt: 'score = 1\nRepeat 3 times:  score = score × 2\nWhat is score now?', choices: ['8', '6', '4', '9'], answer: '8', explain: '1 → 2 → 4 → 8' },
  ]},
  { zone: 'forge', name: 'Order Golem', sprite: 'golem', difficulty: 'medium', variants: [
    { prompt: 'Right order to make Maggi?\n1) Add masala  2) Boil water  3) Add noodles  4) Serve', choices: ['2 → 3 → 1 → 4', '1 → 2 → 3 → 4', '3 → 2 → 1 → 4', '2 → 1 → 4 → 3'], answer: '2 → 3 → 1 → 4', explain: 'An algorithm is just steps in the right order' },
    { prompt: 'Right order to pay with UPI?\n1) Enter PIN  2) Open app  3) Enter amount  4) Scan QR', choices: ['2 → 4 → 3 → 1', '4 → 2 → 1 → 3', '2 → 3 → 4 → 1', '1 → 2 → 4 → 3'], answer: '2 → 4 → 3 → 1', explain: 'Open, scan, amount, then PIN last' },
  ]},
  { zone: 'forge', name: 'Bug Beetle', sprite: 'skeleton', palette: 'forge', difficulty: 'hard', variants: [
    { prompt: 'Goal: PASS if marks are 35 or more.\nIF marks > 35 THEN print "PASS"\nWho gets treated WRONG?', choices: ['A student with exactly 35', 'A student with 34', 'A student with 90', 'Nobody'], answer: 'A student with exactly 35', explain: '> should be ≥ ; 35 is left out' },
    { prompt: 'Meant to print 1 to 5:\ni = 1\nWHILE i < 5:  print i,  i = i + 1\nWhat does it actually print?', choices: ['1 2 3 4', '1 2 3 4 5', '0 1 2 3 4', 'Runs forever'], answer: '1 2 3 4', explain: 'It stops when i reaches 5, so 5 is never printed' },
  ]},
  // ---- Zone 3: Gate of Shields ----
  { zone: 'shields', name: 'OTP Imp', sprite: 'bat', palette: 'shields', difficulty: 'easy', variants: [
    { prompt: 'A caller says: “I am from your bank. Tell me the OTP or your card gets blocked.” You…', choices: ['Hang up and call the bank’s official number', 'Share the OTP quickly', 'Share only half the OTP', 'Ask them to SMS you first'], answer: 'Hang up and call the bank’s official number', explain: 'Banks NEVER ask for your OTP' },
    { prompt: 'A stranger on Instagram offers ₹5,000 if you send your Aadhaar photo and an OTP. You…', choices: ['Block and report the account', 'Send it, ₹5,000 is a lot', 'Send only the Aadhaar', 'Ask for ₹10,000'], answer: 'Block and report the account', explain: 'Easy money + OTP = scam' },
  ]},
  { zone: 'shields', name: 'Lock Knight', sprite: 'golem', palette: 'shields', difficulty: 'medium', variants: [
    { prompt: 'Which password is the STRONGEST?', choices: ['Tiger!Mango#River92', 'password123', 'Rahul2007', '12345678'], answer: 'Tiger!Mango#River92', explain: 'Long + mixed symbols + not personal' },
    { prompt: 'Safest Wi-Fi for online banking?', choices: ['Your home Wi-Fi with a password', 'Free airport Wi-Fi', 'An open café Wi-Fi', '“Free_WiFi_5G” from nowhere'], answer: 'Your home Wi-Fi with a password', explain: 'Open networks can be snooped' },
  ]},
  { zone: 'shields', name: 'Phish Phantom', sprite: 'ghost', palette: 'shields', difficulty: 'hard', variants: [
    { prompt: 'Which message is MOST likely a scam?', choices: ['“Parcel held! Pay ₹25 at bit.ly/indpost-fee in 2 hrs”', '“Your Swiggy order is out for delivery”', '“Your electricity bill is ₹840. Pay in the official app”', '“Your class starts at 9 AM tomorrow”'], answer: '“Parcel held! Pay ₹25 at bit.ly/indpost-fee in 2 hrs”', explain: 'Urgency + short link + small fee = classic scam' },
    { prompt: 'Which website link is FAKE?', choices: ['sbi-kyc-update.xyz', 'onlinesbi.sbi', 'www.irctc.co.in', 'www.india.gov.in'], answer: 'sbi-kyc-update.xyz', explain: 'Banks don’t use random .xyz “update” sites' },
  ]},
  // ---- Zone 4: Heart of the Cave ----
  { zone: 'heart', name: 'Cog Sprite', sprite: 'robot', difficulty: 'easy', variants: [
    { prompt: 'Which of these uses AI?', choices: ['Voice assistant (Alexa / Siri)', 'Pocket calculator', 'Light switch', 'Wall clock'], answer: 'Voice assistant (Alexa / Siri)', explain: 'It understands speech and learns patterns' },
    { prompt: 'YouTube suggesting videos you might like is done by…', choices: ['An AI recommendation system', 'Pure luck', 'A person picking for you', 'Your phone’s battery'], answer: 'An AI recommendation system', explain: 'It learns from what you watch' },
  ]},
  { zone: 'heart', name: 'Prompt Golem', sprite: 'golem', palette: 'heart', difficulty: 'medium', variants: [
    { prompt: 'You want an AI to design a fest poster. Which prompt works BEST?', choices: ['“Bright neon-blue poster for a college tech fest with a robot and the title TECH QUEST”', '“poster”', '“make something nice”', '“tech”'], answer: '“Bright neon-blue poster for a college tech fest with a robot and the title TECH QUEST”', explain: 'Specific prompts give specific results' },
    { prompt: 'Best prompt to understand a long chapter quickly?', choices: ['“Summarise this chapter in 5 simple bullet points for a PU student”', '“chapter”', '“tell me everything”', '“do my homework”'], answer: '“Summarise this chapter in 5 simple bullet points for a PU student”', explain: 'Say the format, the length and the audience' },
  ]},
  { zone: 'heart', name: 'Mirage Mind', sprite: 'robot', palette: 'heart', difficulty: 'hard', variants: [
    { prompt: 'Which clue most often gives away an AI-made photo of a person?', choices: ['Extra or melted-looking fingers', 'Good lighting', 'A smiling face', 'A blue sky'], answer: 'Extra or melted-looking fingers', explain: 'Hands, text and ears often look odd in AI images' },
    { prompt: 'An AI chatbot confidently tells you a “fact”. What should you do?', choices: ['Check it with a trusted source', 'Trust it, AI is never wrong', 'Forward it to everyone', 'Ask it to say it louder'], answer: 'Check it with a trusted source', explain: 'AI can “hallucinate”: make things up confidently' },
  ]},
];

export const BOSS = {
  name: 'The Summarizer',
  damage: { easy: 20, medium: 30, hard: 50 },
  pool: {
    easy: [
      { prompt: 'Which one is an INPUT device?', choices: ['Keyboard', 'Monitor', 'Speaker', 'Printer'], answer: 'Keyboard' },
      { prompt: 'What does “www” stand for?', choices: ['World Wide Web', 'Wide World Wifi', 'Web Without Wires', 'World Web Window'], answer: 'World Wide Web' },
      { prompt: 'The 🔒 lock in a browser’s address bar means…', choices: ['The connection is encrypted (HTTPS)', 'The site is a government site', 'The site is free', 'The site is fast'], answer: 'The connection is encrypted (HTTPS)' },
      { prompt: 'ChatGPT is an example of…', choices: ['A generative AI chatbot', 'An antivirus', 'An operating system', 'A web browser'], answer: 'A generative AI chatbot' },
      { prompt: 'Shift each letter BACK by 1:  J D F', choices: ['ICE', 'HAT', 'JOB', 'ACE'], answer: 'ICE' },
      { prompt: 'Binary 11 equals…', choices: ['3', '11', '2', '4'], answer: '3' },
      { prompt: 'Which one is a web browser?', choices: ['Google Chrome', 'Windows', 'WhatsApp', 'Excel'], answer: 'Google Chrome' },
    ],
    medium: [
      { prompt: 'n = 1\nRepeat 4 times:  n = n × 2\nn = ?', choices: ['16', '8', '32', '6'], answer: '16' },
      { prompt: '“Phishing” means…', choices: ['Fake messages that trick you into giving info', 'Catching fish online', 'A fast internet plan', 'A type of virus scan'], answer: 'Fake messages that trick you into giving info' },
      { prompt: 'Odd one out?', choices: ['MS Paint', 'Google Drive', 'Dropbox', 'OneDrive'], answer: 'MS Paint' },
      { prompt: 'How many different 4-digit PINs (0000–9999) exist?', choices: ['10,000', '9,999', '1,000', '4,000'], answer: '10,000' },
      { prompt: 'Two-factor authentication (2FA) adds…', choices: ['A second check, like an OTP', 'A second password field only', 'Faster login', 'A bigger font'], answer: 'A second check, like an OTP' },
      { prompt: 'An AI trained ONLY on cat photos is shown a dog. It will most likely…', choices: ['Call it a cat', 'Say “dog” correctly', 'Refuse to answer', 'Draw the dog'], answer: 'Call it a cat' },
    ],
    hard: [
      { prompt: 'Shift each letter BACK by 2:  E Q F G', choices: ['CODE', 'COPE', 'DOGE', 'CAFE'], answer: 'CODE' },
      { prompt: 'Binary 1010 equals…', choices: ['10', '12', '5', '1010'], answer: '10' },
      { prompt: 'IF age ≥ 18 AND has_licence THEN drive.\nRiya is 19 with no licence. Can she drive?', choices: ['No', 'Yes', 'Only on Sundays', 'Only with a friend'], answer: 'No' },
      { prompt: 'Email from “support@amaz0n-help.com”. The biggest red flag?', choices: ['A zero instead of the letter “o”', 'It says “support”', 'It has a .com', 'It is an email'], answer: 'A zero instead of the letter “o”' },
      { prompt: 'AI “hallucination” means…', choices: ['AI confidently gives made-up information', 'AI sees ghosts', 'AI is overheating', 'AI is sleeping'], answer: 'AI confidently gives made-up information' },
      { prompt: 'Sort 9, 4, 7 by swapping two numbers at a time. Fewest swaps needed?', choices: ['2', '1', '3', '0'], answer: '2' },
    ],
  },
};
