import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { getErrorMessage, isFetchBaseQueryError } from "@shared/api";
import { AuthSchema, useLoginMutation } from "@features/auth";

export const useSignIn = () => {
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const formik = useFormik<AuthSchema>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: AuthSchema,
    onSubmit: async (data: AuthSchema) => {
      try {
        await login(data).unwrap();
        navigate("/dashboard", { replace: true });
      } catch (error) {
        if (isFetchBaseQueryError(error) && error.status === 401) {
          const errorData = error.data as {
            message: string;
            error?: string;
            statusCode: number;
          };
          if (errorData.error) {
            formik.setErrors({ [errorData.error]: errorData.message });
          } else {
            const message = errorData.message || "";
            if (message.includes("email")) {
              formik.setErrors({ email: message });
            } else if (message.includes("пароль")) {
              formik.setErrors({ password: message });
            } else {
              formik.setStatus({ backendError: message });
            }
          }
        } else {
          formik.setStatus({
            backendError: getErrorMessage(error),
          });
        }
      }
    },
  });

  return {
    isLoading,
    formik,
  };
};
