import { memo } from "react";

type CollectionNamePropType = {
  name: string;
  onChange(value: string): void;
};

export const CollectionName = memo(
  ({ name, onChange }: CollectionNamePropType) => {
    return (
      <div className="flex flex-col align-middle justify-center text-center my-4">
        <h1 className="mb-2 font-comic text-fuchsia-800 text-xl md:text-2xl">
          Имя коллекции:
        </h1>
        <input
          data-testid="collection-name-input"
          value={name}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="off"
          name="name"
          type="text"
          className="self-center block w-[80%] border-b-1 border-b-gray-600 outline-0 text-center focus:border-b-2 font-roboto md:text-xl placeholder:font-jost placeholder:text-red-700/50"
        />
      </div>
    );
  },
);
