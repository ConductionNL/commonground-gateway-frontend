import * as React from "react";
import { Control, Controller, FieldValues } from "react-hook-form";
import Select from "react-select";
import { FormFieldGroup } from "./formFieldGroup/formFieldGroup";
import { IFormFieldProps, IReactHookFormProps } from "./types";

interface ISelectProps {
  control: Control<FieldValues, any>;
  options: {
    value: string;
    label: string;
  }[];
}

export const SelectMultiple: React.FC<ISelectProps & IFormFieldProps & IReactHookFormProps> = ({
  name,
  label,
  options,
  errors,
  control,
  validation,
}) => {
  return (
    <FormFieldGroup {...{ name, label, errors }} required={validation?.required}>
      <Controller
        {...{ control, name }}
        rules={validation}
        render={({ field: { onChange, value } }) => {
          return <Select isMulti {...{ options, value, onChange }} className="Select" />;
        }}
      />
    </FormFieldGroup>
  );
};
