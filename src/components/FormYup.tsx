import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { DevTool } from "@hookform/devtools";

const schema = yup.object({
  username: yup.string().required("Username is required"),
  email: yup
    .string()
    .email("Email format is not valid")
    .required("Email is required"),
  chanel: yup.string().required("Chanel is required"),
});

interface FormValues {
  username: string;
  email: string;
  chanel: string;
}

const FormYup = () => {
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormValues>({
    defaultValues: {
      username: "",
      email: "",
      chanel: "",
    },
    resolver: yupResolver(schema),
    mode: "onTouched",
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (
    <div>
      <h2>Yup validation</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-control">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            {...register("username")}
            aria-invalid={errors.username ? "true" : "false"}
          />
          <p className="error" role="alert">
            {errors.username?.message}
          </p>
        </div>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            {...register("email")}
            aria-invalid={errors.email ? "true" : "false"}
          />
          <p className="error" role="alert">
            {errors.email?.message}
          </p>
        </div>
        <div className="form-control">
          <label htmlFor="chanel">Chanel</label>
          <input
            type="text"
            id="chanel"
            {...register("chanel")}
            aria-invalid={errors.chanel ? "true" : "false"}
          />
          <p className="error" role="alert">
            {errors.chanel?.message}
          </p>
        </div>
        <input type="submit" value="Submit" />
      </form>
      <DevTool control={control} />
    </div>
  );
};

export default FormYup;
