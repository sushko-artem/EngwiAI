import { Howl } from "howler";
import { useCallback } from "react";

const sounds = {
  correct: new Howl({ src: ["/sounds/correct_sound.mp3"] }),
  incorrect: new Howl({ src: ["/sounds/incorrect_sound.mp3"] }),
};

type PlaySoundType = keyof typeof sounds;

export const useSound = () => {
  const play = useCallback((type: PlaySoundType) => {
    sounds[type].play();
  }, []);

  return {
    play,
  };
};
