const fs = require('fs');
const path = require('path');
const localDataPath = path.join(__dirname, '../data');

// Create folder if it doesn't exist
if (!fs.existsSync(localDataPath)) {
  fs.mkdirSync(localDataPath, { recursive: true });
}

const localDb = {
  read(file) {
    const filePath = path.join(localDataPath, `${file}.json`);
    if (!fs.existsSync(filePath)) {
      return this.getDefaultData(file);
    }
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    } catch (err) {
      console.error(`Error reading ${file}.json:`, err);
      return this.getDefaultData(file);
    }
  },

  write(file, data) {
    const filePath = path.join(localDataPath, `${file}.json`);
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (err) {
      console.error(`Error writing to ${file}.json:`, err);
      return false;
    }
  },

  getDefaultData(file) {
    if (file === 'timeline') {
      return [
        {
          id: '1',
          title: 'The First Chapter',
          date: '15 October 2021',
          description: 'The day we first met. Looking into your eyes, I knew my heart had found its home. Every conversation felt like a page in a story I never wanted to end.',
          icon: 'heart',
          photoIndex: 0
        },
        {
          id: '2',
          title: 'First Magic Getaway',
          date: '12 December 2022',
          description: 'Our first trip together. Sharing laughs, watching sunsets, and building memories that defined who we are. It was here that I realized you are my forever adventure.',
          icon: 'compass',
          photoIndex: 1
        },
        {
          id: '3',
          title: 'The Sweet Proposal',
          date: '14 February 2024',
          description: 'Asking you to walk hand-in-hand with me for the rest of our lives. The happiest "Yes" I ever received. You made me the luckiest man in the universe.',
          icon: 'ring',
          photoIndex: 2
        },
        {
          id: '4',
          title: 'Our Beautiful Today',
          date: '18 September 2026',
          description: 'Celebrating you! Today, tomorrow, and for all the birthdays to come. You are my wife, my best friend, and my greatest blessing.',
          icon: 'cake',
          photoIndex: 3
        }
      ];
    }

    if (file === 'reasons') {
      return [
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
    }

    if (file === 'wishes') {
      return [
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
    }

    if (file === 'giftletters') {
      return [
        {
          id: 1,
          title: "To My Beautiful Wife, Aysha",
          photoIndex: 0,
          excerpt: "A message dedicated to the queen of my heart, my lovely wife Bubusai...",
          content: "My Dearest Aysha,\n\nHappy Birthday to the most magnificent, loving, and beautiful woman in the world. From the moment you entered my world, you have filled it with laughter, warmth, and a love I never knew was possible. You are my partner, my confidante, my best friend, and my queen. I am so proud to be your husband and to walk this life beside you. May your birthday be as magical and radiant as you are.\n\nWith all my love,\nYour Hubby ❤️"
        },
        {
          id: 2,
          title: "Our Mingled Story",
          photoIndex: 1,
          excerpt: "Reflecting on our beautiful pictures and the sweet journey we share...",
          content: "To My Lovely Bubusai,\n\nEvery photo in this surprise box is a footprint of our love. Seeing our mingled smiles and the memories we have built makes me realize how blessed I am. From simple coffee runs to major milestones, every second with you is a treasure. I promise to keep making you laugh, capturing our moments, and keeping our story going forever.\n\nAlways and forever yours,\nYour Husband 📸🌹"
        },
        {
          id: 3,
          title: "A Hubby's Special Promise",
          photoIndex: 2,
          excerpt: "My solemn promise to protect your smile and stand by you forever...",
          content: "My Sweet Wife Aysha,\n\nOn this special September 18th, I want to make a promise to you. I promise to hold your hand through every storm, to celebrate your victories, to kiss away your worries, and to cherish you more with each passing day. Your happiness is my life's mission, and your smile is my daily guide. You will always be my number one.\n\nDearest Love,\nYour Husband 💖"
        },
        {
          id: 4,
          title: "Wishing You the Universe",
          photoIndex: 3,
          excerpt: "May this year bring you endless peace, laughter, and blessings...",
          content: "Happy Birthday, My Princess Aysha!\n\nI wish you all the joy, success, and peace that this universe has to offer. You care so selflessly for everyone, and today it is my turn to pamper you. May this birthday mark the start of a year filled with wonderful surprises, dreams realized, and blessings in abundance. I love you to the moon and back!\n\nWith all my heart,\nYour Hubby 🎂✨"
        }
      ];
    }

    if (file === 'photos') {
      return [];
    }

    return [];
  }
};

// Seed local JSON files if they don't exist
if (!fs.existsSync(path.join(localDataPath, 'timeline.json'))) localDb.write('timeline', localDb.getDefaultData('timeline'));
if (!fs.existsSync(path.join(localDataPath, 'reasons.json'))) localDb.write('reasons', localDb.getDefaultData('reasons'));
if (!fs.existsSync(path.join(localDataPath, 'wishes.json'))) localDb.write('wishes', localDb.getDefaultData('wishes'));
if (!fs.existsSync(path.join(localDataPath, 'giftletters.json'))) localDb.write('giftletters', localDb.getDefaultData('giftletters'));
if (!fs.existsSync(path.join(localDataPath, 'photos.json'))) localDb.write('photos', localDb.getDefaultData('photos'));

module.exports = localDb;
