import { memo } from "react";
import { useSpring, animated } from "@react-spring/web";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@shared/ui/card";

type AuthLayoutPropsType = {
  title: string;
  description?: string;
  form: React.ReactNode;
  bottomLayout: React.ReactNode;
};

export const AuthFormLayout = memo(
  ({ title, description, form, bottomLayout }: AuthLayoutPropsType) => {
    const springs = useSpring({
      from: { opacity: 0 },
      to: { opacity: 1 },
      delay: 200,
    });
    return (
      <animated.div
        style={springs}
        className="flex flex-col justify-center text-center flex-1"
      >
        <Card className="w-full mx-auto max-w-md bg-(image:--auth-form-background)">
          <CardHeader className="text-center font-roboto">
            <CardTitle className="font-bold text-xl">
              <h1>{title}</h1>
            </CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
          <CardContent className="text-center">{form}</CardContent>
          <CardFooter>{bottomLayout}</CardFooter>
        </Card>

        <span className="text-xs mt-4 max-w-md mx-auto text-gray-500">
          <b className="underline text-gray-600">EngwiAI</b> — приложение для
          запоминания слов и терминов по карточкам. Создавайте коллекции,
          тренируйте перевод, проверяйте орфографию и грамматику с помощью ИИ.
        </span>
      </animated.div>
    );
  },
);
