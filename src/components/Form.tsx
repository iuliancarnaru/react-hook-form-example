import { useForm, useFieldArray, FieldErrors } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useEffect, useState } from "react";

interface FormValues {
  title: string;
  name: string;
  age: number;
  email: string;
  chanel: string;
  social: {
    twitter: string;
    facebook: string;
  };
  address: string[];
  category: string;
  phNumbers: {
    number: string;
  }[];
  dob: Date;
}

const Form = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: {
      errors,
      touchedFields,
      dirtyFields,
      isDirty,
      isValid,
      isSubmitting,
      isSubmitSuccessful,
    },
    watch,
    getValues,
    setValue,
    reset,
    trigger,
  } = useForm<FormValues>({
    defaultValues: {
      title: "mr",
      name: "",
      age: 0,
      email: "",
      chanel: "",
      social: {
        twitter: "",
        facebook: "",
      },
      address: ["", ""],
      category: "",
      phNumbers: [{ number: "" }],
      dob: new Date(),
    },
    mode: "onTouched", // validate as you visit the field and reset errors when change (default is on submit)
    // load saved data
    // defaultValues: async () => {
    //   const response = await fetch(
    //     "https://jsonplaceholder.typicode.com/users/1"
    //   );
    //   const data = await response.json();
    //   return {
    //     name: data?.name,
    //     email: data?.email,
    //     chanel: "Seenit",
    //   };
    // },
  });

  // const { name, ref, onChange, onBlur } = register("name");

  const { fields, append, remove } = useFieldArray({
    name: "phNumbers",
    control,
  });

  const onSubmit = (data: FormValues) => {
    // to have the submitting state delay
    return new Promise((resolve) => {
      setTimeout(() => resolve(data), 3000);
    });
  };

  const onError = (errors: FieldErrors<FormValues>) => {
    // sending report to logging server
    console.log({ errors });
  };

  // watch a specific input for changes
  const watchName = watch("name");

  // watch entire form for changes
  useEffect(() => {
    const subscription = watch((value) => {
      console.log(value);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const handleGetValues = () => {
    console.log("all form values", getValues());
    console.log("specific field value", getValues("title"));
    console.log("multiple field values", getValues(["title", "name"]));
  };

  const handleSetValue = () => {
    setValue("name", "admin", {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  // TOUCH AND DIRTY FIELDS
  // isDirty represents the state of the entire form not a field
  console.log({ touchedFields, dirtyFields, isDirty });

  // submitting state
  console.log({ isSubmitting, isSubmitSuccessful });

  // CHECKBOX STATE
  const [isTwitterChecked, setIsTwitterChecked] = useState(true);
  const [isFacebookChecked, setIsFacebookChecked] = useState(false);

  return (
    <div>
      <h1>Hello {watchName ? watchName : "Anonymous"}</h1>
      <div style={{ display: "flex", gap: "10px" }}>
        <button type="button" onClick={handleGetValues}>
          Get form values
        </button>
        <button type="button" onClick={handleSetValue}>
          Set form values
        </button>
        <button type="button" onClick={() => trigger()}>
          Validate from
        </button>
        <button type="button" onClick={() => trigger("name")}>
          Validate field
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <h3>Please select a title</h3>
        <div className="form-control-radio">
          {/* radio buttons have default value (not checked) */}
          <input {...register("title")} type="radio" id="mr" value="mr" />
          <label htmlFor="mr">Mr</label>

          <input {...register("title")} type="radio" id="miss" value="miss" />
          <label htmlFor="miss">Miss</label>
        </div>
        <div className="form-control">
          <label htmlFor="name">Name</label>
          <input
            {...register("name", {
              required: "Name is required",
              validate: (fieldValue) => {
                return fieldValue !== "admin" || "Enter a different name";
              },
            })}
            type="text"
            id="name"
          />
          <p className="error">{errors.name?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor="age">Age</label>
          <input
            {...register("age", {
              validate: (fieldValue) => {
                return fieldValue > 0 || "Age is required";
              },
              valueAsNumber: true, // by default is string
            })}
            type="number"
            id="age"
          />
          <p className="error">{errors.age?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor="dob">Date of birth</label>
          <input
            {...register("dob", {
              required: "Please enter your date of birth",
              valueAsDate: true,
            })}
            type="date"
            id="dob"
          />
          <p className="error">{errors.dob?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                message: "Invalid email format",
              },
              validate: {
                notAdmin: (fieldValue) => {
                  return (
                    fieldValue !== "admin@example.com" ||
                    "Enter a different email address"
                  );
                },
                notBlackListed: (fieldValue) => {
                  return (
                    !fieldValue.endsWith("baddomain.com") ||
                    "This domain is not supported"
                  );
                },
                emailAvailable: async (fieldValue) => {
                  try {
                    // test email: Sincere@april.biz
                    const resp = await fetch(
                      `https://jsonplaceholder.typicode.com/users?email=${fieldValue}`
                    );
                    const data = await resp.json();
                    return data.length === 0 || "Email already exists";
                  } catch (err) {
                    console.log((err as Error).message);
                  }
                },
              },
            })}
            type="text"
            id="email"
          />
          <p className="error">{errors.email?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="chanel">Chanel</label>
          <input
            {...register("chanel", { required: "Chanel is required" })}
            type="text"
            id="chanel"
          />
          <p className="error">{errors.chanel?.message}</p>
        </div>

        <div className="form-control social">
          <input
            {...register("social.twitter", {
              disabled: watch("chanel") === "", // conditional disable - validation is disabled if the field is disabled
              required: "Select this field", // no need for this (test)
              value: "has-twitter",
              onChange: () => setIsTwitterChecked((checked) => !checked),
            })}
            type="checkbox"
            id="twitter"
            checked={isTwitterChecked}
          />
          <label htmlFor="twitter">Twitter</label>
        </div>

        <div className="form-control social">
          <input
            {...register("social.facebook", {
              value: "has-facebook",
              onChange: () => setIsFacebookChecked((checked) => !checked), // controlled input
            })}
            type="checkbox"
            id="facebook"
            checked={isFacebookChecked}
          />
          <label htmlFor="facebook">Facebook</label>
        </div>

        <div className="form-control">
          <label htmlFor="home-address">Home address</label>
          <input
            {...register("address.0")} // you can't use [0]
            type="text"
            id="home-address"
          />
        </div>
        <div className="form-control">
          <label htmlFor="work-address">Work address</label>
          <input {...register("address.1")} type="text" id="work-address" />
        </div>

        <div className="form-control">
          <select
            {...register("category", {
              validate: (fieldValue) => {
                return fieldValue !== "" || "Please select a category";
              },
            })}
          >
            <option value="">Select...</option>
            <option value="A">Category A</option>
            <option value="B">Category B</option>
          </select>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>List of phone numbers</label>
          <div>
            {fields?.map((field, index) => {
              return (
                <div className="form-control" key={field.id}>
                  <input
                    type="text"
                    {...register(`phNumbers.${index}.number` as const)}
                  />
                  {index > 0 && (
                    <input
                      type="button"
                      value="Remove"
                      onClick={() => remove(index)}
                    />
                  )}
                </div>
              );
            })}
            <input
              style={{ cursor: "pointer" }}
              type="button"
              value="Add phone number"
              onClick={() => append({ number: "" })}
            />
          </div>
        </div>

        {/* <input
          type="submit"
          value={isSubmitting ? "Sending data" : "Submit"}
          disabled={!isDirty || !isValid || isSubmitting}
        /> */}
        <button
          className="submit"
          type="submit"
          style={{
            width: "120px",
            height: "75px",
          }}
          disabled={!isDirty || !isValid || isSubmitting}
        >
          {isSubmitting ? <div className="lds-dual-ring"></div> : "Submit"}
        </button>
      </form>

      <DevTool control={control} />
    </div>
  );
};

export default Form;
