import type { FormikContextType } from "formik";
import { InputField, type RegisterSchema } from "@features/auth";
import { Button } from "@shared/ui/button";

type SignUpFormContainerPropType = {
  formik: FormikContextType<RegisterSchema>;
};

export const SignUpFormContainer = ({
  formik,
}: SignUpFormContainerPropType) => {
  const {
    handleSubmit,
    handleBlur,
    handleChange,
    values,
    touched,
    errors,
    status,
    isValid,
    isSubmitting,
  } = formik;
  return (
    <form onSubmit={handleSubmit}>
      <InputField
        type="text"
        name="name"
        id="name"
        label="Имя"
        placeholder="Введите имя"
        value={values.name}
        onBlur={handleBlur}
        onChange={handleChange}
      />
      {touched.name && errors.name ? (
        <div className="text-red-500 text-xs">{errors.name}</div>
      ) : null}
      <InputField
        type="email"
        name="email"
        id="email"
        label="Ваша эл. почта"
        placeholder="Введите почту"
        value={values.email}
        onBlur={handleBlur}
        onChange={handleChange}
      />
      {touched.email && errors.email ? (
        <div data-testid="email-error" className="text-red-500 text-xs">
          {errors.email}
        </div>
      ) : null}
      <InputField
        type="password"
        name="password"
        id="password"
        label="Пароль"
        placeholder="Введите пароль"
        value={values.password}
        onBlur={handleBlur}
        onChange={handleChange}
      />
      {touched.password && errors.password ? (
        <div className="text-red-500 text-xs">{errors.password}</div>
      ) : null}
      <InputField
        type="password"
        name="confirmPassword"
        id="confirmPassword"
        label="Подтвердите пароль"
        placeholder="Подтвердите пароль"
        value={values.confirmPassword}
        onBlur={handleBlur}
        onChange={handleChange}
      />
      {touched.confirmPassword && errors.confirmPassword ? (
        <div className="text-red-500 text-xs">{errors.confirmPassword}</div>
      ) : null}
      {status?.backendError && (
        <div className="text-white text-md mt-4 p-2 bg-red-400 rounded">
          Ошибка! {status.backendError}
        </div>
      )}
      <Button
        className="hover:cursor-pointer mt-6"
        type="submit"
        disabled={!isValid || isSubmitting}
      >
        Зарегистрироваться
      </Button>
    </form>
  );
};
