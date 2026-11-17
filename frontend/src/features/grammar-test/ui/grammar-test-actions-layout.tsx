type GrammarTestLayoutPropType = {
  children: React.ReactNode;
};

export const GrammarTestActionsLayout = ({
  children,
}: GrammarTestLayoutPropType) => {
  return (
    <div className="mx-auto text-center w-[80%] md:w-[60%] lg:w-[50%]">
      {children}
    </div>
  );
};
