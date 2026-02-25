import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useRegisterMutation, RegisterSchema } from "@features/auth";
import { getErrorMessage, isFetchBaseQueryError } from "@shared/api";

export const useSignUp = () => {
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();
  const formik = useFormik<RegisterSchema>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: RegisterSchema,
    onSubmit: async (data: RegisterSchema) => {
      const user = {
        name: data.name,
        email: data.email,
        password: data.password,
      };
      try {
        await register(user).unwrap();
        navigate("/sign-in", { replace: true });
      } catch (error) {
        if (isFetchBaseQueryError(error) && error.status === 409) {
          formik.setErrors({ email: getErrorMessage(error) });
        } else {
          formik.setStatus({
            backendError: getErrorMessage(error),
          });
        }
      }
    },
  });
  return {
    formik,
    isLoading,
  };
};
