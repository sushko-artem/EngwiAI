import { Howl } from "howler";

export const sounds = {
  correct: new Howl({
    src: ["/sounds/correct_sound.mp3"],
    volume: 0.4,
    preload: true,
  }),
  incorrect: new Howl({
    src: ["/sounds/incorrect_sound.mp3"],
    volume: 0.4,
    preload: true,
  }),
};

export type SoundNameType = keyof typeof sounds;

export const SOUND_GROUP = {
  spellTest: ["correct", "incorrect"] as SoundNameType[],
};
