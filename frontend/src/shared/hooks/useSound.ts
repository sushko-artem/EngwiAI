import { useCallback, useEffect, useState } from "react";
import {
  sounds,
  type SoundNameType,
  SOUND_GROUP,
} from "shared/constants/sounds";

export type SoundGroupType = keyof typeof SOUND_GROUP;

export const useSound = () => {
  const [mutedGroup, setMutedGroup] = useState<Set<SoundGroupType>>(new Set());

  useEffect(() => {
    Object.values(sounds).forEach((sound) => sound.mute(false));
    setMutedGroup(new Set());
  }, []);

  const play = useCallback((type: SoundNameType) => {
    sounds[type].play();
  }, []);

  const toggleGroup = useCallback((group: SoundGroupType) => {
    setMutedGroup((prev) => {
      const newMuted = new Set(prev);
      if (newMuted.has(group)) {
        newMuted.delete(group);
        SOUND_GROUP[group].forEach((name) => sounds[name].mute(false));
      } else {
        newMuted.add(group);
        SOUND_GROUP[group].forEach((name) => sounds[name].mute(true));
      }
      return newMuted;
    });
  }, []);

  const isGroupMuted = useCallback(
    (group: SoundGroupType) => {
      return mutedGroup.has(group);
    },
    [mutedGroup],
  );

  const muteAll = useCallback(() => {
    Object.values(sounds).forEach((sound) => sound.mute(true));
    setMutedGroup(new Set(Object.keys(SOUND_GROUP) as SoundGroupType[]));
  }, []);

  const unMuteAll = useCallback(() => {
    Object.values(sounds).forEach((sound) => sound.mute(false));
    setMutedGroup(new Set());
  }, []);

  return {
    play,
    toggleGroup,
    isGroupMuted,
    muteAll,
    unMuteAll,
  };
};
