// All game content. Edit freely: `answer` must exactly match one of `choices`.
// Choices are shuffled at runtime, so order here does not matter.

// `guide` is shown when a player enters the zone: short tips for solving its questions.
export const ZONES = [
  { id: 'crypt',   name: 'Crypt of Cipher',   domain: 'Data',          accent: '#5b8def', guide: [
    'Shift cipher: move each letter back in the alphabet. D → C → B → A.',
    'Binary places are worth 8, 4, 2, 1. Add the places that have a 1: 101 = 4 + 1 = 5.',
    'Data types: numbers you do maths with, text for names and phone numbers, Yes/No for true or false.',
  ]},
  { id: 'forge',   name: 'Forge of Logic',    domain: 'Programming',   accent: '#ff8a3d', guide: [
    'Run the code in your head one line at a time. Keep track of each value as it changes.',
    '“Repeat 3 times” means do the indented line 3 times, in order.',
    'IF … ELSE: only one of the two branches runs. Check the condition carefully (> is not ≥).',
  ]},
  { id: 'shields', name: 'Gate of Shields',   domain: 'Cybersecurity', accent: '#3ddc84', guide: [
    'Nobody genuine ever asks for your OTP, PIN or CVV. Not the bank, not the police, not a delivery agent.',
    'Urgency + a strange link + a prize or a small fee = scam.',
    'Long, unique passwords beat short clever ones. Check website names letter by letter.',
  ]},
  { id: 'heart',   name: 'Heart of the Cave', domain: 'AI',            accent: '#c27bff', guide: [
    'AI learns patterns from lots of examples. Bad or one-sided examples make bad AI.',
    'Good prompts say what you want, for whom, and in what format.',
    'AI can be confidently wrong. Always check important facts with a trusted source.',
  ]},
];

export const BOSS_GUIDE = [
  'The Summarizer has 100 HP and asks questions from all four zones.',
  'Before each question, pick Easy (20 damage), Medium (30) or Hard (50).',
  'A wrong answer adds +10 sec and deals no damage. Hard ends the fight fastest if you are sure.',
];
export const BONUS_GUIDE = [
  'Each zone ends with a bonus chest. Answer right and 20 seconds come OFF your time.',
  'A wrong answer costs nothing. You can also skip it.',
  'Bonuses decide close races, so they are worth a try!',
];

// Letters dropped by the 24 monsters (one each); bonus chests drop none
export const RUNE_WORD = 'TECHQUESTCAVERNOFCODEBCA';
export const BONUS_SEC = 20;

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
  { zone: 'crypt', name: 'Byte Spider', sprite: 'bat', palette: 'heart', difficulty: 'medium', variants: [
    { prompt: 'Which one can store the MOST data?', choices: ['1 TB', '1 GB', '1 MB', '1 KB'], answer: '1 TB', explain: 'KB < MB < GB < TB, each about 1000× bigger' },
    { prompt: 'Which is the SMALLEST unit of data?', choices: ['Bit', 'Byte', 'Kilobyte', 'Megabyte'], answer: 'Bit', explain: 'A bit is a single 0 or 1; 8 bits make a byte' },
  ]},
  { zone: 'crypt', name: 'Number Ghoul', sprite: 'ghost', difficulty: 'medium', variants: [
    { prompt: 'A = 1, B = 2, C = 3 … Z = 26.\nWhat does 3 - 1 - 20 spell?', choices: ['CAT', 'BAT', 'CAR', 'COT'], answer: 'CAT', explain: '3 = C, 1 = A, 20 = T' },
    { prompt: 'A = 1, B = 2, C = 3 … Z = 26.\nWhat does 2 - 1 - 7 spell?', choices: ['BAG', 'BIG', 'BAD', 'BEG'], answer: 'BAG', explain: '2 = B, 1 = A, 7 = G' },
  ]},
  { zone: 'crypt', name: 'Cipher Lich', sprite: 'skeleton', palette: 'heart', difficulty: 'hard', guardian: true, variants: [
    { prompt: 'In a secret code every letter is replaced by the NEXT letter (A → B).\nThe code word is  I B Q Q Z.  What is the real word?', choices: ['HAPPY', 'HIPPO', 'JOLLY', 'HAPPEN'], answer: 'HAPPY', explain: 'Move each letter back by one' },
    { prompt: 'In a secret code every letter is replaced by the NEXT letter (A → B).\nThe code word is  D P E F.  What is the real word?', choices: ['CODE', 'COPE', 'DOPE', 'CAFE'], answer: 'CODE', explain: 'D→C, P→O, E→D, F→E' },
  ]},
  { zone: 'crypt', name: 'Crypt Chest', sprite: 'chestBody', bonus: true, difficulty: 'hard', variants: [
    { prompt: 'Binary places are 8, 4, 2, 1.\nWhat is 1111 in normal numbers?', choices: ['15', '1111', '16', '4'], answer: '15', explain: '8 + 4 + 2 + 1 = 15' },
    { prompt: 'A 2 GB movie is cut into 500 MB parts. How many parts? (1 GB = 1000 MB)', choices: ['4', '2', '5', '40'], answer: '4', explain: '2000 MB ÷ 500 MB = 4' },
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
  { zone: 'forge', name: 'Branch Goblin', sprite: 'magma', palette: 'shields', difficulty: 'medium', variants: [
    { prompt: 'IF it is raining THEN take an umbrella\nELSE wear a cap.\nToday it is sunny. You…', choices: ['Wear a cap', 'Take an umbrella', 'Do both', 'Stay home'], answer: 'Wear a cap', explain: 'The condition is false, so the ELSE branch runs' },
    { prompt: 'IF marks ≥ 90 THEN grade = "A"\nELSE grade = "B".\nMarks = 89. Grade?', choices: ['B', 'A', 'A and B', 'Nothing'], answer: 'B', explain: '89 is not ≥ 90, so ELSE runs' },
  ]},
  { zone: 'forge', name: 'Loop Wyrm', sprite: 'golem', palette: 'forge', difficulty: 'medium', variants: [
    { prompt: 'total = 0\nFor each n in [2, 3, 5]:  total = total + n\ntotal = ?', choices: ['10', '5', '30', '235'], answer: '10', explain: '0 + 2 + 3 + 5 = 10' },
    { prompt: 'For i = 1 to 4:  print i × i\nWhat is the LAST number printed?', choices: ['16', '4', '8', '10'], answer: '16', explain: 'Prints 1, 4, 9, 16' },
  ]},
  { zone: 'forge', name: 'Forge Titan', sprite: 'golem', palette: 'forge', difficulty: 'hard', guardian: true, variants: [
    { prompt: 'a = 5, b = 3\na = a + b\nb = a − b\na = a − b\nWhat are a and b now?', choices: ['a = 3, b = 5', 'a = 5, b = 3', 'a = 8, b = 5', 'a = 8, b = 3'], answer: 'a = 3, b = 5', explain: 'a=8, b=5, a=3: the values swapped!' },
    { prompt: 'count = 0\nRepeat 3 times:\n    Repeat 2 times:  count = count + 1\ncount = ?', choices: ['6', '5', '3', '2'], answer: '6', explain: 'The inner line runs 3 × 2 = 6 times' },
  ]},
  { zone: 'forge', name: 'Forge Chest', sprite: 'chestBody', bonus: true, difficulty: 'hard', variants: [
    { prompt: 'Robot: Forward 2, Turn right, Forward 2, Turn right, Forward 2, Turn right, Forward 2.\nWhat shape did it draw?', choices: ['Square', 'Triangle', 'Circle', 'Straight line'], answer: 'Square', explain: 'Four equal sides with right-angle turns' },
    { prompt: 'Which step is missing?\n1) Go to ATM  2) Insert card  3) ______  4) Take cash', choices: ['Enter PIN and amount', 'Take card out', 'Go home', 'Print receipt'], answer: 'Enter PIN and amount', explain: 'Algorithms break if a step is missing' },
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
  { zone: 'shields', name: 'Prize Mimic', sprite: 'ghost', palette: 'forge', difficulty: 'easy', variants: [
    { prompt: 'WhatsApp message: “You WON an iPhone 15! Click here to claim in 10 minutes.” You…', choices: ['Ignore and delete it', 'Click fast before time runs out', 'Forward it to friends', 'Reply with your address'], answer: 'Ignore and delete it', explain: 'Prize + urgency + link = scam' },
    { prompt: 'A stranger with no photo and 0 friends sends you a friend request. Best move?', choices: ['Ignore it', 'Accept and share your number', 'Accept and send photos', 'Ask for their password'], answer: 'Ignore it', explain: 'Fake accounts are used for scams' },
  ]},
  { zone: 'shields', name: 'Patch Warden', sprite: 'robot', palette: 'shields', difficulty: 'medium', variants: [
    { prompt: 'Your phone asks to install a security update. Updates usually…', choices: ['Fix security holes', 'Steal your data', 'Delete your photos', 'Make the phone slower forever'], answer: 'Fix security holes', explain: 'Updates patch weaknesses hackers use' },
    { prompt: 'Safest way to remember many different passwords?', choices: ['A password manager app', 'A sticky note on the screen', 'Same password everywhere', 'Your name + 123'], answer: 'A password manager app', explain: 'It stores strong unique passwords securely' },
  ]},
  { zone: 'shields', name: 'Gatekeeper Wraith', sprite: 'ghost', palette: 'shields', difficulty: 'hard', guardian: true, variants: [
    { prompt: 'Which UPI request is a SCAM sign?', choices: ['“Enter your PIN to RECEIVE ₹500”', '“Enter your PIN to PAY ₹500 at the shop”', '“Scan the shop’s QR code to pay”', '“Check the name before you pay”'], answer: '“Enter your PIN to RECEIVE ₹500”', explain: 'You never need a PIN to receive money' },
    { prompt: 'A website asks for your Aadhaar, an OTP and your card CVV just to “verify your age”. This is…', choices: ['A scam (phishing)', 'Normal age check', 'A government rule', 'Safe if the site looks nice'], answer: 'A scam (phishing)', explain: 'No age check needs your OTP or CVV' },
  ]},
  { zone: 'shields', name: 'Shield Chest', sprite: 'chestBody', bonus: true, difficulty: 'hard', variants: [
    { prompt: 'Which password would take the LONGEST to crack?', choices: ['purple-tiger-eats-42-mangoes', 'P@ss1', 'qwerty', 'Admin123'], answer: 'purple-tiger-eats-42-mangoes', explain: 'Length matters most: long passphrases are very strong' },
    { prompt: 'You used Gmail on a cyber café computer. Before leaving you should…', choices: ['Log out and close the browser', 'Just close the tab', 'Leave it open for the next person', 'Turn off the monitor'], answer: 'Log out and close the browser', explain: 'Otherwise the next person is inside your account' },
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
  { zone: 'heart', name: 'Map Sprite', sprite: 'bat', palette: 'heart', difficulty: 'easy', variants: [
    { prompt: 'Google Maps predicting a traffic jam ahead is done using…', choices: ['AI learning from lots of trip data', 'A person watching every road', 'Pure guessing', 'The weather report'], answer: 'AI learning from lots of trip data', explain: 'It spots patterns in millions of journeys' },
    { prompt: 'Unlocking your phone with your face is an example of…', choices: ['AI face recognition', 'A calculator', 'A password', 'Bluetooth'], answer: 'AI face recognition', explain: 'The phone learned what your face looks like' },
  ]},
  { zone: 'heart', name: 'Data Hydra', sprite: 'magma', palette: 'heart', difficulty: 'medium', variants: [
    { prompt: 'To teach an AI to recognise mangoes, you mostly need…', choices: ['Many labelled photos of mangoes', 'One very clear mango photo', 'A mango-shaped computer', 'A faster internet connection'], answer: 'Many labelled photos of mangoes', explain: 'AI learns from lots of examples' },
    { prompt: 'Which task is AI BEST at today?', choices: ['Sorting thousands of photos quickly', 'Deciding what is fair', 'Comforting a sad friend', 'Knowing how you feel inside'], answer: 'Sorting thousands of photos quickly', explain: 'Fast pattern-matching is AI’s strength' },
  ]},
  { zone: 'heart', name: 'Deepfake Djinn', sprite: 'robot', palette: 'heart', difficulty: 'hard', guardian: true, variants: [
    { prompt: 'An AI hiring tool trained on old data rejects most women. This problem is called…', choices: ['Bias in AI', 'A virus', 'Slow internet', 'A hardware fault'], answer: 'Bias in AI', explain: 'Unfair data makes unfair AI' },
    { prompt: 'A “deepfake” is…', choices: ['A fake video or voice made by AI to look real', 'A very deep swimming pool', 'A broken file', 'A strong password'], answer: 'A fake video or voice made by AI to look real', explain: 'Always check the source of shocking videos' },
  ]},
  { zone: 'heart', name: 'Heart Chest', sprite: 'chestBody', bonus: true, difficulty: 'hard', variants: [
    { prompt: 'Chatbots like ChatGPT write answers by predicting the next…', choices: ['Word (piece of text)', 'Picture', 'Website', 'Phone number'], answer: 'Word (piece of text)', explain: 'They predict text one small piece at a time' },
    { prompt: 'Which one is NOT using AI?', choices: ['A calculator adding 2 + 2', 'A spam filter in Gmail', 'A voice assistant', 'Netflix recommendations'], answer: 'A calculator adding 2 + 2', explain: 'Fixed rules, no learning from data' },
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

// Practice run: separate warm-up questions so practising never leaks the real ones
export const PRACTICE = {
  word: 'BCA',
  enemies: [
    { zone: 'crypt', name: 'Training Dummy', sprite: 'skeleton', difficulty: 'easy', variants: [
      { prompt: 'Shift each letter BACK by 1 to decode:  B C D', choices: ['ABC', 'BCD', 'CDE', 'XYZ'], answer: 'ABC', explain: 'B→A, C→B, D→C' },
    ]},
    { zone: 'forge', name: 'Practice Slime', sprite: 'magma', difficulty: 'easy', variants: [
      { prompt: 'x = 1\nRepeat 2 times:  x = x + 1\nWhat is x now?', choices: ['3', '2', '4', '1'], answer: '3', explain: '1 → 2 → 3' },
    ]},
    { zone: 'shields', name: 'Rookie Bat', sprite: 'bat', palette: 'shields', difficulty: 'easy', variants: [
      { prompt: 'Which one is SAFE to share in public?', choices: ['Your favourite movie', 'Your OTP', 'Your ATM PIN', 'Your password'], answer: 'Your favourite movie', explain: 'Never share OTPs, PINs or passwords' },
    ]},
  ],
  boss: {
    easy: [
      { prompt: 'Which one is an OUTPUT device?', choices: ['Monitor', 'Keyboard', 'Mouse', 'Microphone'], answer: 'Monitor' },
      { prompt: 'Which app is used to send messages?', choices: ['WhatsApp', 'Calculator', 'Camera', 'Clock'], answer: 'WhatsApp' },
    ],
    medium: [
      { prompt: 'Binary 10 equals…', choices: ['2', '10', '1', '3'], answer: '2' },
      { prompt: 'A strong password should be…', choices: ['Long and mixed', 'Your name', '123456', 'Your birthday'], answer: 'Long and mixed' },
    ],
    hard: [
      { prompt: 'Shift each letter BACK by 1:  D B U', choices: ['CAT', 'DOG', 'BAT', 'CUT'], answer: 'CAT' },
      { prompt: 'n = 3\nRepeat 2 times:  n = n × 2\nn = ?', choices: ['12', '6', '9', '8'], answer: '12' },
    ],
  },
};
