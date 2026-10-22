// All game content. Quiz items: `answer` must exactly match one of `choices` (shuffled at runtime).
// Activity items have a `type`; see js/activities.js for each type's fields.

// `guide` is shown when a player enters the zone: short tips for its challenges.
export const ZONES = [
  { id: 'crypt',   name: 'Crypt of Cipher',   domain: 'Data',          accent: '#5b8def', guide: [
    'Code words: move each letter back. D → C, B → A.',
    'Bulbs: each bulb has a value. Light the ones that add up to the target.',
    'Phone numbers are text. Prices are numbers. Fees paid? is Yes/No.',
  ]},
  { id: 'forge',   name: 'Forge of Logic',    domain: 'Programming',   accent: '#ff8a3d', guide: [
    'Robot coder: add arrow moves, then press Run. Avoid the 🧱 walls!',
    'Repeat 3 times = do it 3 times. Track the number as it changes.',
    'IF … ELSE: only one side happens.',
  ]},
  { id: 'shields', name: 'Gate of Shields',   domain: 'Cybersecurity', accent: '#3ddc84', guide: [
    'Nobody real asks for your OTP, PIN or CVV.',
    'Prize + hurry + strange link = scam.',
    'Check website names letter by letter: amaz0n is not amazon.',
  ]},
  { id: 'heart',   name: 'Heart of the Cave', domain: 'AI',            accent: '#c27bff', guide: [
    'AI learns from lots of examples.',
    'Good prompts are specific: what, for whom, what style.',
    'AI can be wrong. Check important facts.',
  ]},
];

export const BOSS_GUIDE = [
  'The Summarizer has 100 HP.',
  'Pick Easy (20), Medium (30) or Hard (50) damage for each question.',
  'Wrong = +10 sec and no damage.',
];
export const BONUS_GUIDE = [
  'Bonus chest! Get it right: 20 seconds OFF your time and ⭐⭐.',
  'Wrong costs nothing. You can also skip it.',
];

// Letters dropped by the 24 monsters (one each); bonus chests drop none
export const RUNE_WORD = 'TECHQUESTCAVERNOFCODEBCA';
export const BONUS_SEC = 20;

// Activities (type: bits | order | type | robot | sort) are hands-on; plain items are quick quiz questions.
export const ENEMIES = [
  // ---- Zone 1: Crypt of Cipher ----
  { zone: 'crypt', name: 'Bone Clerk', sprite: 'skeleton', difficulty: 'easy', variants: [
    { type: 'type', alphabet: true, prompt: 'Move each letter back by 1:  D B U', answer: 'CAT', explain: 'D→C, B→A, U→T' },
    { type: 'type', alphabet: true, prompt: 'Move each letter back by 1:  E P H', answer: 'DOG', explain: 'E→D, P→O, H→G' },
    { type: 'type', alphabet: true, prompt: 'Move each letter back by 1:  C P Y', answer: 'BOX', explain: 'C→B, P→O, Y→X' },
  ]},
  { zone: 'crypt', name: 'Bit Bat', sprite: 'bat', difficulty: 'easy', variants: [
    { type: 'bits', prompt: 'Light bulbs that add up to 5', bits: [8, 4, 2, 1], target: 5, explain: '4 + 1 = 5. That is 0101 in binary!' },
    { type: 'bits', prompt: 'Light bulbs that add up to 6', bits: [8, 4, 2, 1], target: 6, explain: '4 + 2 = 6. That is 0110 in binary!' },
    { type: 'bits', prompt: 'Light bulbs that add up to 9', bits: [8, 4, 2, 1], target: 9, explain: '8 + 1 = 9. That is 1001 in binary!' },
  ]},
  { zone: 'crypt', name: 'Data Wraith', sprite: 'ghost', difficulty: 'easy', variants: [
    { type: 'shoot', prompt: 'Shoot what we save as TEXT!', good: ['Phone number', 'Your name', 'Email'], bad: ['Price', 'Age', 'Marks', 'Temperature'], explain: 'You never do maths with phone numbers or names' },
    { type: 'shoot', prompt: 'Shoot what we save as NUMBERS!', good: ['Price', 'Marks', 'Age'], bad: ['Name', 'Email', 'Phone number', 'City'], explain: 'Numbers are things you add or compare' },
  ]},
  { zone: 'crypt', name: 'Byte Spider', sprite: 'bat', palette: 'heart', difficulty: 'medium', variants: [
    { type: 'order', prompt: 'Smallest file to biggest 📦', items: ['A text message', 'A photo', 'A song', 'A full movie'], explain: 'Video takes the most space' },
    { type: 'order', prompt: 'Smallest to biggest storage 📦', items: ['KB', 'MB', 'GB', 'TB'], explain: 'Kilo < Mega < Giga < Tera' },
  ]},
  { zone: 'crypt', name: 'Number Ghoul', sprite: 'ghost', difficulty: 'medium', variants: [
    { prompt: 'A=1, B=2, C=3 …  3 · 1 · 20 = ?', choices: ['CAT', 'BAT', 'CAR', 'COT'], answer: 'CAT', explain: '3=C, 1=A, 20=T' },
    { prompt: 'A=1, B=2, C=3 …  2 · 1 · 7 = ?', choices: ['BAG', 'BIG', 'BAD', 'BEG'], answer: 'BAG', explain: '2=B, 1=A, 7=G' },
  ]},
  { zone: 'crypt', name: 'Cipher Lich', sprite: 'skeleton', palette: 'heart', difficulty: 'hard', guardian: true, variants: [
    { type: 'bits', prompt: 'Five bulbs now! Make 21', bits: [16, 8, 4, 2, 1], target: 21, explain: '16 + 4 + 1 = 21 → 10101' },
    { type: 'bits', prompt: 'Five bulbs now! Make 26', bits: [16, 8, 4, 2, 1], target: 26, explain: '16 + 8 + 2 = 26 → 11010' },
  ]},
  { zone: 'crypt', name: 'Crypt Chest', sprite: 'chestBody', bonus: true, difficulty: 'hard', variants: [
    { type: 'type', alphabet: true, prompt: 'Move each letter back by 2:  E Q F G', answer: 'CODE', explain: 'E→C, Q→O, F→D, G→E' },
    { type: 'type', alphabet: true, prompt: 'Move each letter back by 1:  H B N F', answer: 'GAME', explain: 'H→G, B→A, N→M, F→E' },
  ]},

  // ---- Zone 2: Forge of Logic ----
  { zone: 'forge', name: 'Loop Slime', sprite: 'magma', difficulty: 'easy', variants: [
    { type: 'drive', prompt: 'Race through the maths gates!', gates: [
      { q: 'x = 2, add 2 three times', lanes: ['6', '8', '10'], answer: '8' },
      { q: '5, doubled', lanes: ['10', '7', '25'], answer: '10' },
      { q: '10 − 3 − 3', lanes: ['4', '7', '1'], answer: '4' },
    ], explain: 'Loops repeat the same step' },
    { type: 'drive', prompt: 'Race through the maths gates!', gates: [
      { q: 'x = 1, double it 3 times', lanes: ['6', '8', '3'], answer: '8' },
      { q: '3 + 3 + 3', lanes: ['9', '6', '33'], answer: '9' },
      { q: '20, halve it twice', lanes: ['10', '5', '2'], answer: '5' },
    ], explain: 'Loops repeat the same step' },
  ]},
  { zone: 'forge', name: 'Order Golem', sprite: 'golem', difficulty: 'easy', variants: [
    { type: 'order', prompt: 'Make Maggi 🍜', items: ['Boil water', 'Add noodles', 'Add masala', 'Serve'], explain: 'An algorithm is steps in the right order' },
    { type: 'order', prompt: 'Pay with UPI 📱', items: ['Open the app', 'Scan the QR', 'Type the amount', 'Enter PIN'], explain: 'PIN always comes last' },
  ]},
  { zone: 'forge', name: 'Rookie Bot', sprite: 'robot', palette: 'forge', difficulty: 'medium', variants: [
    { type: 'robot', prompt: 'Get the robot to the ⭐', size: 4, start: [0, 3], goal: [3, 0], walls: [[1, 2], [2, 1], [1, 0]], max: 8, explain: 'Programs are just steps a computer follows' },
    { type: 'robot', prompt: 'Get the robot to the ⭐', size: 4, start: [0, 0], goal: [3, 3], walls: [[1, 0], [1, 1], [3, 1], [2, 3]], max: 8, explain: 'Programs are just steps a computer follows' },
  ]},
  { zone: 'forge', name: 'Branch Goblin', sprite: 'magma', palette: 'shields', difficulty: 'medium', variants: [
    { prompt: 'IF raining → umbrella. ELSE → cap. It is sunny 😎', choices: ['Cap', 'Umbrella', 'Both', 'Nothing'], answer: 'Cap', explain: 'Not raining, so ELSE happens' },
    { prompt: 'IF marks ≥ 90 → "A". ELSE → "B". Marks = 89', choices: ['B', 'A', 'A and B', 'None'], answer: 'B', explain: '89 is less than 90' },
  ]},
  { zone: 'forge', name: 'Maze Wyrm', sprite: 'golem', palette: 'forge', difficulty: 'medium', variants: [
    { type: 'robot', prompt: 'Bigger maze! Reach the ⭐', size: 5, start: [2, 4], goal: [2, 0], walls: [[1, 2], [2, 2], [3, 2], [0, 1]], max: 10, explain: 'Plan the path before you press Run' },
    { type: 'robot', prompt: 'Bigger maze! Reach the ⭐', size: 5, start: [0, 4], goal: [4, 4], walls: [[1, 4], [1, 3], [3, 4], [3, 3], [3, 1]], max: 10, explain: 'Plan the path before you press Run' },
  ]},
  { zone: 'forge', name: 'Forge Titan', sprite: 'golem', palette: 'forge', difficulty: 'hard', guardian: true, variants: [
    { prompt: 'IF age ≥ 18 → "Can vote". ELSE → "Too young". Riya is 17. Output?', choices: ['Too young', 'Can vote', 'Both', 'Nothing'], answer: 'Too young', explain: '17 is less than 18' },
    { prompt: 'x = 3. Repeat 2 times: double x. x = ?', choices: ['12', '6', '9', '5'], answer: '12', explain: '3 → 6 → 12' },
  ]},
  { zone: 'forge', name: 'Forge Chest', sprite: 'chestBody', bonus: true, difficulty: 'hard', variants: [
    { type: 'robot', prompt: 'Master maze! Reach the ⭐', size: 5, start: [0, 0], goal: [4, 4], walls: [[1, 0], [1, 1], [1, 2], [3, 4], [3, 3], [3, 2], [2, 4]], max: 12, explain: 'Great coding!' },
    { type: 'robot', prompt: 'Master maze! Reach the ⭐', size: 5, start: [4, 0], goal: [0, 4], walls: [[3, 0], [3, 1], [1, 1], [1, 2], [1, 3], [3, 3], [2, 4]], max: 12, explain: 'Great coding!' },
  ]},

  // ---- Zone 3: Gate of Shields ----
  { zone: 'shields', name: 'OTP Imp', sprite: 'bat', palette: 'shields', difficulty: 'easy', labels: ['Safe', 'Scam'], variants: [
    { type: 'sort', prompt: 'Safe or scam?', labels: ['Safe', 'Scam'], items: [['Caller wants your OTP', 'Scam'], ['Mom sends a selfie', 'Safe'], ['"You won an iPhone! Click now"', 'Scam'], ['Teacher shares the timetable', 'Safe']], explain: 'Prizes and OTP requests are red flags' },
    { type: 'sort', prompt: 'Safe or scam?', labels: ['Safe', 'Scam'], items: [['"Pay ₹25 or parcel is lost"', 'Scam'], ['Swiggy: order is on the way', 'Safe'], ['Stranger: "send your Aadhaar"', 'Scam'], ['Friend: "see you at 5"', 'Safe']], explain: 'Hurry + money + stranger = scam' },
  ]},
  { zone: 'shields', name: 'Prize Mimic', sprite: 'ghost', palette: 'forge', difficulty: 'easy', variants: [
    { type: 'shoot', prompt: 'Shoot the SCAM messages! 🚨', good: ['Win an iPhone now!', 'Share your OTP', 'Pay ₹25 or lose parcel', 'KYC expired, click here'], bad: ['Class at 9 AM', 'Happy birthday!', 'Order delivered', 'See you at 5'], explain: 'Prizes, OTPs and hurry = scam' },
    { type: 'shoot', prompt: 'Shoot the SCAM messages! 🚨', good: ['Free recharge, click!', 'Send Aadhaar photo', 'Your SIM blocks today', 'Lottery: pay ₹99'], bad: ['Mom: lunch is ready', 'Exam on Monday', 'Swiggy is on the way', 'Good morning!'], explain: 'Prizes, OTPs and hurry = scam' },
  ]},
  { zone: 'shields', name: 'Lock Knight', sprite: 'golem', palette: 'shields', difficulty: 'medium', variants: [
    { type: 'order', prompt: 'Weakest to strongest password 🔒', items: ['1234', 'rahul2007', 'Rahul@2007', 'Tiger!Mango#River92'], explain: 'Longer + mixed = stronger' },
    { type: 'order', prompt: 'Weakest to strongest password 🔒', items: ['abc', 'abc123', 'Abc@123', 'purple-tiger-eats-42-mangoes'], explain: 'Long passphrases are the strongest' },
  ]},
  { zone: 'shields', name: 'Patch Warden', sprite: 'robot', palette: 'shields', difficulty: 'medium', variants: [
    { type: 'shoot', prompt: 'Shoot only the STRONG passwords! 💪', good: ['T!ger#Mango92', 'purple-cat-eats-42-dosas', 'R@inyDay#2026'], bad: ['123456', 'password', 'rahul2007', 'qwerty'], explain: 'Long + mixed symbols = strong' },
    { type: 'shoot', prompt: 'Shoot only the STRONG passwords! 💪', good: ['Bl#eSky!Rocket7', 'my-dog-loves-90-idlis', 'K@rnataka#Tq26'], bad: ['111111', 'iloveyou', 'abc123', 'priya2008'], explain: 'Long + mixed symbols = strong' },
  ]},
  { zone: 'shields', name: 'Phish Phantom', sprite: 'ghost', palette: 'shields', difficulty: 'hard', variants: [
    { type: 'sort', prompt: 'Real website or fake?', labels: ['Real', 'Fake'], items: [['sbi.co.in', 'Real'], ['sbi-kyc-update.xyz', 'Fake'], ['amaz0n-offers.com', 'Fake'], ['irctc.co.in', 'Real']], explain: 'Look for odd endings and swapped letters' },
    { type: 'sort', prompt: 'Real website or fake?', labels: ['Real', 'Fake'], items: [['india.gov.in', 'Real'], ['paytm-refund.top', 'Fake'], ['flipkart.com', 'Real'], ['g00gle-login.net', 'Fake']], explain: 'Look for odd endings and swapped letters' },
  ]},
  { zone: 'shields', name: 'Gatekeeper Wraith', sprite: 'ghost', palette: 'shields', difficulty: 'hard', guardian: true, variants: [
    { prompt: 'Which UPI request is a scam?', choices: ['"Enter PIN to RECEIVE ₹500"', '"Enter PIN to PAY the shop"', '"Scan the shop QR"', '"Check the name first"'], answer: '"Enter PIN to RECEIVE ₹500"', explain: 'You never need a PIN to receive money' },
    { prompt: 'A site wants OTP + CVV to "check your age". It is…', choices: ['A scam', 'Normal', 'A government rule', 'Safe if it looks nice'], answer: 'A scam', explain: 'No age check needs your OTP' },
  ]},
  { zone: 'shields', name: 'Shield Chest', sprite: 'chestBody', bonus: true, difficulty: 'hard', variants: [
    { type: 'type', prompt: 'Unscramble the danger word:  S U R I V', answer: 'VIRUS', explain: 'A virus is a harmful program' },
    { type: 'type', prompt: 'Unscramble the danger word:  K A H C E R', answer: 'HACKER', explain: 'Strong passwords keep hackers out' },
  ]},

  // ---- Zone 4: Heart of the Cave ----
  { zone: 'heart', name: 'Map Sprite', sprite: 'bat', palette: 'heart', difficulty: 'easy', variants: [
    { type: 'sort', prompt: 'Uses AI or not?', labels: ['Not AI', 'AI'], items: [['Face unlock', 'AI'], ['Calculator', 'Not AI'], ['YouTube suggestions', 'AI'], ['Light switch', 'Not AI']], explain: 'AI learns patterns from data' },
    { type: 'sort', prompt: 'Uses AI or not?', labels: ['Not AI', 'AI'], items: [['Google Maps traffic', 'AI'], ['Wall clock', 'Not AI'], ['Instagram filters', 'AI'], ['Torch light', 'Not AI']], explain: 'AI learns patterns from data' },
  ]},
  { zone: 'heart', name: 'Data Hydra', sprite: 'magma', palette: 'heart', difficulty: 'easy', variants: [
    { type: 'drive', prompt: 'Race through the AI gates!', gates: [
      { q: 'Which one uses AI?', lanes: ['Calculator', 'Alexa', 'Torch'], answer: 'Alexa' },
      { q: 'AI learns from…', lanes: ['Luck', 'Magic', 'Data'], answer: 'Data' },
      { q: 'A deepfake is a…', lanes: ['Fake video', 'Deep pool', 'Big file'], answer: 'Fake video' },
    ], explain: 'AI = patterns learned from data' },
    { type: 'drive', prompt: 'Race through the AI gates!', gates: [
      { q: 'Face unlock uses…', lanes: ['AI', 'A key', 'Bluetooth'], answer: 'AI' },
      { q: 'Better prompt?', lanes: ['"poster"', '"neon fest poster"', '"nice"'], answer: '"neon fest poster"' },
      { q: 'AI can be…', lanes: ['Never wrong', 'Wrong sometimes', 'Alive'], answer: 'Wrong sometimes' },
    ], explain: 'AI = patterns learned from data' },
  ]},
  { zone: 'heart', name: 'Prompt Golem', sprite: 'golem', palette: 'heart', difficulty: 'medium', variants: [
    { prompt: 'Best prompt for a fest poster? 🎨', choices: ['"Neon poster, robot, title TECH QUEST"', '"poster"', '"something nice"', '"tech"'], answer: '"Neon poster, robot, title TECH QUEST"', explain: 'Specific prompts give better results' },
    { prompt: 'Best prompt to study a chapter? 📚', choices: ['"Summarise in 5 simple points"', '"chapter"', '"tell me everything"', '"do my homework"'], answer: '"Summarise in 5 simple points"', explain: 'Say the format and the length' },
  ]},
  { zone: 'heart', name: 'Mirage Mind', sprite: 'robot', palette: 'heart', difficulty: 'medium', variants: [
    { type: 'sort', prompt: 'Is it a sign of an AI-made photo?', labels: ['Normal', 'AI sign'], items: [['Six fingers on a hand', 'AI sign'], ['Natural shadows', 'Normal'], ['Melted, unreadable text', 'AI sign'], ['Clear faces of real friends', 'Normal']], explain: 'Hands and text often look odd in AI images' },
    { type: 'sort', prompt: 'Is it a sign of an AI-made photo?', labels: ['Normal', 'AI sign'], items: [['Earrings that do not match', 'AI sign'], ['A real place you know', 'Normal'], ['Too-smooth plastic skin', 'AI sign'], ['Normal blurry background', 'Normal']], explain: 'Look closely at small details' },
  ]},
  { zone: 'heart', name: 'Train Bot', sprite: 'robot', palette: 'heart', difficulty: 'medium', variants: [
    { type: 'order', prompt: 'Teach an AI to spot cats 🐱', items: ['Collect cat photos', 'Tell it which are cats', 'Let it practise', 'Test it on new photos'], explain: 'AI learns from examples, then gets tested' },
    { type: 'order', prompt: 'How a chatbot answers 💬', items: ['You type a question', 'AI reads it', 'It predicts words', 'Answer appears'], explain: 'Chatbots predict the next words' },
  ]},
  { zone: 'heart', name: 'Deepfake Djinn', sprite: 'robot', palette: 'heart', difficulty: 'hard', guardian: true, variants: [
    { prompt: 'A chatbot tells you a "fact" that sounds wrong. You…', choices: ['Check a trusted source', 'Believe it', 'Share it everywhere', 'Argue with it'], answer: 'Check a trusted source', explain: 'AI can be confidently wrong' },
    { prompt: 'A "deepfake" is…', choices: ['A fake AI video or voice', 'A deep pool', 'A broken file', 'A strong password'], answer: 'A fake AI video or voice', explain: 'Check the source of shocking videos' },
  ]},
  { zone: 'heart', name: 'Heart Chest', sprite: 'chestBody', bonus: true, difficulty: 'hard', variants: [
    { type: 'bits', prompt: 'Computers think in bits! Make 29', bits: [16, 8, 4, 2, 1], target: 29, explain: '16 + 8 + 4 + 1 = 29 → 11101' },
    { type: 'bits', prompt: 'Computers think in bits! Make 18', bits: [16, 8, 4, 2, 1], target: 18, explain: '16 + 2 = 18 → 10010' },
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
      { prompt: 'Which one is safest to post online?', choices: ['Your favourite movie', 'Your OTP', 'Your home address', 'Your ATM PIN'], answer: 'Your favourite movie' },
      { prompt: 'Two-factor authentication (2FA) adds…', choices: ['A second check, like an OTP', 'A second password field only', 'Faster login', 'A bigger font'], answer: 'A second check, like an OTP' },
      { prompt: 'An AI trained ONLY on cat photos is shown a dog. It will most likely…', choices: ['Call it a cat', 'Say “dog” correctly', 'Refuse to answer', 'Draw the dog'], answer: 'Call it a cat' },
    ],
    hard: [
      { prompt: 'Shift each letter BACK by 2:  E Q F G', choices: ['CODE', 'COPE', 'DOGE', 'CAFE'], answer: 'CODE' },
      { prompt: 'Computers store everything using only…', choices: ['0 and 1', 'A to Z', '1 to 10', 'Colours'], answer: '0 and 1' },
      { prompt: 'IF age ≥ 18 AND has_licence THEN drive.\nRiya is 19 with no licence. Can she drive?', choices: ['No', 'Yes', 'Only on Sundays', 'Only with a friend'], answer: 'No' },
      { prompt: 'Email from “support@amaz0n-help.com”. The biggest red flag?', choices: ['A zero instead of the letter “o”', 'It says “support”', 'It has a .com', 'It is an email'], answer: 'A zero instead of the letter “o”' },
      { prompt: 'AI “hallucination” means…', choices: ['AI confidently gives made-up information', 'AI sees ghosts', 'AI is overheating', 'AI is sleeping'], answer: 'AI confidently gives made-up information' },
      { prompt: 'Which file is the biggest?', choices: ['A 2-hour movie', 'A photo', 'A text message', 'A song'], answer: 'A 2-hour movie' },
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
