import { ReactNode, useEffect, useState } from "react";
import {
  useForm,
  useWatch,
  useFormState,
  Control,
  UseFormRegister,
  RegisterOptions,
} from "react-hook-form";

let renderCount = 0;

const Controller = ({
  control,
  register,
  name,
  rules,
  render,
}: {
  control: Control<FormValues, unknown>;
  register: UseFormRegister<FormValues>;
  name: keyof FormValues;
  rules: RegisterOptions<FormValues, keyof FormValues>;
  render: (props: any) => ReactNode;
}) => {
  const value = useWatch({
    control,
    name,
  });

  const { errors } = useFormState({
    control,
    name,
  });

  const props = register(name, rules);

  return render({
    value,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
      props.onChange({
        target: {
          name,
          value: event.target.value,
        },
      }),
    onBlur: props.onBlur,
    name: props.name,
    errors,
  });
};

const Input = (props: any) => {
  const [value, setValue] = useState(props.value || "");

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  return (
    <>
      <input
        name={props.name}
        onChange={(e) => {
          setValue(e.target.value);
          props.onChange && props.onChange(e);
        }}
        value={value}
      />
      <p>{props.errors[props.name]?.message}</p>
    </>
  );
};

interface FormValues {
  firstName: string;
  lastName: string;
  address: string;
}

export default function FormWithController() {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
    },
  });
  const [submittedVal, setSubmittedVal] = useState<FormValues>();
  const onSubmit = (data: FormValues) => {
    console.log(data);
    setSubmittedVal(data);
  };
  renderCount++;

  useEffect(() => {
    setTimeout(() => {
      setValue("firstName", "test");
    }, 1000);
  }, [setValue]);

  console.log(errors);
  console.log(renderCount);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("firstName")} placeholder="First Name" />

        <Controller
          {...{
            control,
            register,
            name: "lastName",
            rules: {
              required: "Please enter last name",
            },
            render: (props) => <Input {...props} />,
          }}
        />

        <Controller
          {...{
            control,
            register,
            name: "address",
            rules: {
              required: "Please enter address",
            },
            render: (props) => <Input {...props} />,
          }}
        />

        <input type="submit" />
      </form>
      {submittedVal && (
        <div>
          Submitted Data:
          <br />
          {JSON.stringify(submittedVal)}
        </div>
      )}
    </div>
  );
}
