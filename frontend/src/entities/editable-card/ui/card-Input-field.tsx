import { memo } from "react";
import TextareaAutosize from "react-textarea-autosize";

type CardInputFieldPropsType = {
  name: string;
  text: string;
  onChange(value: string, field: string): void;
};

export const CardInputField = memo(
  ({ name, text, onChange }: CardInputFieldPropsType) => {
    return (
      <TextareaAutosize
        name={name}
        value={text}
        onChange={(e) => onChange(e.target.value, name)}
        className="border-b-1 border-b-gray-600 outline-0 text-center focus:border-b-2 font-roboto my-2 w-full resize-none overflow-y-auto"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(233,220,230,0.2) transparent",
        }}
        minRows={1}
        maxRows={4}
        maxLength={250}
        autoComplete="off"
      />
    );
  }
);
