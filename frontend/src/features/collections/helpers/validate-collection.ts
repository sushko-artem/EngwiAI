import type { EditableCollectionType } from "@features/collections/model";

type ValidationResult = {
  isValid: boolean;
  errorMessage?: string;
};

export const validateCollection = (
  collection: EditableCollectionType | null,
  existingNames: string[],
): ValidationResult => {
  if (!collection) {
    return { isValid: false };
  }

  if (!collection.cards.length) {
    return {
      isValid: false,
      errorMessage: "Коллекция пустая! Добавьте карточку!",
    };
  }

  if (
    !collection.name.trim() ||
    collection.cards.some(
      (card) => !card.word?.trim() || !card.translation?.trim(),
    )
  ) {
    return {
      isValid: false,
      errorMessage: "Все поля должны быть заполнены!",
    };
  }

  if (existingNames.includes(collection.name.trim())) {
    return {
      isValid: false,
      errorMessage: "Коллекция с таким именем уже существует!",
    };
  }

  return {
    isValid: true,
  };
};
