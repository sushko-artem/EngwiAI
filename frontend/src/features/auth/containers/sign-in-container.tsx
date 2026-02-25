import { AuthFormLayout, BottomAuthLayout } from "@features/auth";
import { Loader } from "@shared/ui/loader";
import { SignInFormContainer } from "../ui/sign-in-form-container";
import { useSignIn } from "../hooks/useSignIn";

export const SignInContainer = () => {
  const { formik, isLoading } = useSignIn();

  return (
    <>
      {isLoading && <Loader />}
      <AuthFormLayout
        title="ВХОД"
        description="Введите данные, чтобы войти в приложение."
        form={<SignInFormContainer formik={formik} />}
        bottomLayout={
          <BottomAuthLayout
            url="/sign-up"
            linkText="Пройти регистрацию"
            buttonText="Войти с Google"
          />
        }
      />
    </>
  );
};
