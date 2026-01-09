export const ModalActionButton = ({
  onClick,
  children,
}: {
  onClick(): void;
  children: React.ReactNode;
}) => (
  <div
    onClick={onClick}
    className="w-10 flex cursor-pointer hover:drop-shadow-lg hover:scale-125 transition-all"
  >
    {children}
  </div>
);
