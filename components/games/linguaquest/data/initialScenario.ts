import { Scenario } from '../types';

// This is the hardcoded scenario requested by the user.
// It is structured as a JSON-like object for easy editing.

export const LOST_TOURIST_SCENARIO: Scenario = {
  title: "A Lost Tourist in London",
  description: "You are approached by a confused tourist near a subway station. Help them find their way while being polite.",
  nodes: [
    {
      id: 1,
      characterName: "Alex (Tourist)",
      characterImage: "/games/linguaquest/alex_confused.png", // Cartoon Sprite
      backgroundImage: "/games/linguaquest/bg_london.png", // Cartoon Background
      text: "Excuse me! Sorry to bother you, but I think I am completely lost. Does this train go to the airport?",
      options: [
        {
          text: "No, you're on the wrong side. You need to cross the street.",
          isCorrect: true,
          feedback: "Oh, thank goodness! I would have gone the wrong way. Thank you so much!",
          scoreDelta: 20
        },
        {
          text: "I don't know, look at the map.",
          isCorrect: false,
          feedback: "Uhm... okay. Sorry for asking.",
          scoreDelta: -10
        },
        {
          text: "Yes, get on this one quickly!",
          isCorrect: false,
          feedback: "Are you sure? It says 'City Center' on the sign...",
          scoreDelta: -20
        }
      ]
    },
    {
      id: 2,
      characterName: "Sarah (Local)",
      characterImage: "/games/linguaquest/sarah_base.png",
      backgroundImage: "/games/linguaquest/bg_london.png",
      text: "Since I have to cross the street, is there a ticket machine over there? My card isn't working on this one.",
      options: [
        {
          text: "Buy a new card, yours is probably broken.",
          isCorrect: false,
          feedback: "I just bought it this morning... that's worrying.",
          scoreDelta: -10
        },
        {
          text: "Yes, there is a large ticket office on the other platform that accepts cash.",
          isCorrect: true,
          feedback: "Perfect! I have some cash on me. That saves me.",
          scoreDelta: 20
        },
        {
          text: "Just jump the turnstile, nobody is watching.",
          isCorrect: false,
          feedback: "I... I definitely don't want to get arrested in a foreign country!",
          scoreDelta: -30
        }
      ]
    },
    {
      id: 3,
      characterName: "Mr. Sato (Attendant)",
      characterImage: "/games/linguaquest/sato_base.png",
      backgroundImage: "/games/linguaquest/bg_london.png", // Park/Station transition
      text: "By the way, I'm extremely hungry. Is there a good place to grab a quick sandwich nearby before I catch the train?",
      options: [
        {
          text: "There is a 5-star restaurant two blocks away.",
          isCorrect: false,
          feedback: "Oh, I don't have time for a sit-down meal, I'm in a rush!",
          scoreDelta: 0
        },
        {
          text: "Forget eating, you will miss your flight!",
          isCorrect: false,
          feedback: "I suppose you're right, but I'm starving...",
          scoreDelta: -10
        },
        {
          text: "There's a great bakery right next to the station entrance.",
          isCorrect: true,
          feedback: "That sounds delicious and fast. I'll go there.",
          scoreDelta: 20
        }
      ]
    },
    {
      id: 4,
      characterName: "Rio (Mentor)",
      characterImage: "/games/linguaquest/rio_base.png",
      backgroundImage: "/games/linguaquest/bg_london.png",
      text: "You have been very helpful. One last thing, do you know how long the ride to the airport takes?",
      options: [
        {
          text: "It takes about 45 minutes on the Express line.",
          isCorrect: true,
          feedback: "Okay, I should make it just in time. Thanks!",
          scoreDelta: 20
        },
        {
          text: "Takes forever. You're gonna be late.",
          isCorrect: false,
          feedback: "That's... not very reassuring.",
          scoreDelta: -10
        },
        {
          text: "Maybe 10 minutes?",
          isCorrect: false,
          feedback: "Only 10 minutes? The map looked much further away. Are you sure?",
          scoreDelta: -5
        }
      ]
    },
    {
      id: 5,
      characterName: "Alex (Tourist)",
      characterImage: "/games/linguaquest/alex_confused.png",
      backgroundImage: "/games/linguaquest/bg_london.png",
      text: "Thank you for your kindness stranger! I hope you have a wonderful day.",
      options: [
        {
          text: "Whatever.",
          isCorrect: false,
          feedback: "...",
          scoreDelta: -20
        },
        {
          text: "You too! Safe travels!",
          isCorrect: true,
          feedback: "Goodbye! (The tourist waves happily)",
          scoreDelta: 20
        },
        {
          text: "Don't get lost again.",
          isCorrect: false,
          feedback: "I'll try my best.",
          scoreDelta: 0
        }
      ]
    }
  ]
};