type ModalActionPropType = {
  content: string;
  onClick(): void;
};

export const FlashModalAction = ({ content, onClick }: ModalActionPropType) => {
  return (
    <div
      onClick={onClick}
      className="border-2 rounded-md bg-amber-100 p-1 text-center hover:cursor-pointer font-comic active:bg-amber-200 transition-all"
    >
      {content}
    </div>
  );
};
