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
      <animated.div style={springs} className="flex h-[100vh] justify-center">
        <Card className="m-auto w-full max-w-md bg-[image:var(--auth-form-background)]">
          <CardHeader className="text-center font-roboto">
            <CardTitle className="font-bold text-xl">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
          <CardContent className="text-center">{form}</CardContent>
          <CardFooter>{bottomLayout}</CardFooter>
        </Card>
      </animated.div>
    );
  }
);
