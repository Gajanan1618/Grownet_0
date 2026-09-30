export const MANDI_RATES = [
  { crop: 'Bhindi (Okra)', price: 38, unit: 'kg' },
  { crop: 'Tamatar (Tomato)', price: 32, unit: 'kg' },
  { crop: 'Pyaaz (Onion)', price: 22, unit: 'kg' },
  { crop: 'Gehun (Wheat)', price: 2180, unit: 'quintal' },
]

export const CHAT_CONTACTS = [
  {
    id: 1,
    name: 'Ramesh Bhai',
    emoji: '👨🏽‍🌾',
    online: true,
    location: 'Sarjapur, 3km',
    tag: 'organic',
    unread: 2,
    seed: [
      { from: 'them', type: 'text', text: 'Bhai, bhindi 20kg taiyaar. Taazi todi, keetnashak mukt.' },
      { from: 'me', type: 'payment', amount: 700, text: 'Payment bheja: ₹700' },
      { from: 'them', type: 'catalog', items: ['🥦 Bhindi 20kg', '🌿 Dhaniya 5kg'], text: 'Yeh dekho hamara catalog:' },
      { from: 'them', type: 'text', text: 'Halki baarish ka andaza hai, jaldi delivery kar dunga.' },
    ],
  },
  {
    id: 2,
    name: 'Kanta Devi',
    emoji: '👩🏽‍🌾',
    online: false,
    location: 'Nagaur, 12km',
    tag: 'dairy',
    unread: 0,
    seed: [
      { from: 'them', type: 'text', text: 'Doodh ka kya bhav hai aaj?' },
      { from: 'me', type: 'text', text: '₹52 per litre chal raha hai.' },
      { from: 'them', type: 'text', text: 'Theek hai, 10 litre kal subah bhej dungi.' },
    ],
  },
  {
    id: 3,
    name: 'Gurjant Singh',
    emoji: '👨🏽‍🍳',
    online: true,
    location: 'Ludhiana, 8km',
    tag: 'wholesale',
    unread: 1,
    seed: [
      { from: 'them', type: 'text', text: 'Tamatar 50kg ke liye ₹2800 chahiye bhai.' },
      { from: 'me', type: 'payment', amount: 2800, text: 'Bhej raha hoon abhi.' },
      { from: 'them', type: 'text', text: 'Shukriya! Aaj shaam tak deliver kar denge.' },
    ],
  },
  {
    id: 4,
    name: 'FPO Sakhi',
    emoji: '🏢',
    online: false,
    location: 'Pune FPO Center',
    tag: 'fpo',
    unread: 0,
    seed: [
      { from: 'them', type: 'text', text: 'Subsidy wale beej aa gaye, jaldi apply karo.' },
      { from: 'them', type: 'catalog', items: ['🌾 Gehun beej', '🫘 Chana beej', '🌻 Sarson beej'], text: 'Teen variety available hain:' },
    ],
  },
]
