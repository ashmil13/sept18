export const DEFAULT_TIMELINE = [
  {
    id: "1",
    title: "The First Chapter",
    date: "15 October 2021",
    description: "The day we first met. Looking into your eyes, I knew my heart had found its home. Every conversation felt like a page in a story I never wanted to end.",
    icon: "heart",
    photoIndex: 0
  },
  {
    id: "2",
    title: "First Magic Getaway",
    date: "12 December 2022",
    description: "Our first trip together. Sharing laughs, watching sunsets, and building memories that defined who we are. It was here that I realized you are my forever adventure.",
    icon: "compass",
    photoIndex: 1
  },
  {
    id: "3",
    title: "The Sweet Proposal",
    date: "14 February 2024",
    description: "Asking you to walk hand-in-hand with me for the rest of our lives. The happiest \"Yes\" I ever received. You made me the luckiest man in the universe.",
    icon: "ring",
    photoIndex: 2
  },
  {
    id: "4",
    title: "Our Beautiful Today",
    date: "18 September 2026",
    description: "Celebrating you! Today, tomorrow, and for all the birthdays to come. You are my wife, my best friend, and my greatest blessing.",
    icon: "cake",
    photoIndex: 3
  }
];

export const DEFAULT_REASONS = [
  { id: 1, title: 'Your Pure Smile', description: 'The way your entire face lights up when you laugh. It instantly chases away any darkness in my day.', icon: 'smile' },
  { id: 2, title: 'Your Kind Heart', description: 'You care so selflessly for everyone around you. Your compassion makes the world a warmer, gentler place.', icon: 'heart-handshake' },
  { id: 3, title: 'Your Loving Comfort', description: 'The feeling of home when you hold my hand or hug me after a long day. In your arms, I am always safe.', icon: 'home' },
  { id: 4, title: 'Your Brilliant Mind', description: 'Your wisdom, creativity, and the beautiful way you see and understand the world. You inspire me to grow.', icon: 'brain' },
  { id: 5, title: 'Your Soft Voice', description: 'Hearing your voice is my favorite sound. It brings a peace to my mind that nothing else can replicate.', icon: 'music' },
  { id: 6, title: 'Your Playful Soul', description: 'The inside jokes we share and the silly things we do when it’s just the two of us. We are kids at heart together.', icon: 'sparkles' },
  { id: 7, title: 'How You Support Me', description: 'Believing in me even when I doubt myself. You are my biggest cheerleader and my solid rock.', icon: 'shield' },
  { id: 8, title: 'Your Endless Grace', description: 'The elegance and strength you show in handling life\'s challenges. You walk with beauty and dignity.', icon: 'crown' },
  { id: 9, title: 'Your Passion for Life', description: 'The way you get excited about the little things—a beautiful sunset, a hot coffee, or a cozy evening.', icon: 'sun' },
  { id: 10, title: 'You Are Simply You', description: 'Because you are my soulmate, my partner, and the love of my life. I love you for exactly who you are.', icon: 'gift' }
];

export const DEFAULT_WISHES = [
  {
    id: '1',
    name: 'Your Hubby ❤️',
    message: 'Happy Birthday, my love! You are my life, my happiness, and my entire world. Celebrating you today is my greatest joy. I love you to the moon and back!',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: '2',
    name: 'Your Secret Admirer 😉',
    message: 'To the girl who stole my heart and makes me smile every single day: wishing you the most magical birthday filled with surprises, pampering, and endless love!',
    createdAt: new Date(Date.now() - 60000 * 15).toISOString()
  }
];

export const getWishes = () => {
  const local = localStorage.getItem('ayshu_wishes');
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      return DEFAULT_WISHES;
    }
  }
  localStorage.setItem('ayshu_wishes', JSON.stringify(DEFAULT_WISHES));
  return DEFAULT_WISHES;
};

export const saveWish = (name, message) => {
  const wishes = getWishes();
  const newWish = {
    id: Date.now().toString(),
    name,
    message,
    createdAt: new Date().toISOString()
  };
  const updated = [newWish, ...wishes];
  localStorage.setItem('ayshu_wishes', JSON.stringify(updated));
  return newWish;
};
