import { memo, type ComponentProps } from "react";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";

type InputFieldPropType = ComponentProps<typeof Input> & {
  label: string;
  id: string;
};

export const InputField = memo(
  ({ label, id, ...props }: InputFieldPropType) => (
    <div className="mt-3">
      <Label className="px-1 text-[1rem] font-jost" htmlFor={id}>
        {label}
      </Label>
      <Input
        className="placeholder:text-xs px-1 mt-1"
        autoComplete="true"
        id={id}
        {...props}
      />
    </div>
  )
);
