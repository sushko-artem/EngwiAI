import { AuthFormLayout, BottomAuthLayout } from "@features/auth";
import { Loader } from "@shared/ui/loader";
import { SignUpFormContainer } from "../ui/sign-up-form-container";
import { useSignUp } from "../hooks/useSignUp";

export const SignUpContainer = () => {
  const { formik, isLoading } = useSignUp();
  return (
    <>
      {isLoading && <Loader />}
      <AuthFormLayout
        title="РЕГИСТРАЦИЯ"
        form={<SignUpFormContainer formik={formik} />}
        bottomLayout={
          <BottomAuthLayout
            url="/sign-in"
            linkText="Уже регистрировались ранее?"
            buttonText="Регистрация с Google"
          />
        }
      />
    </>
  );
};
