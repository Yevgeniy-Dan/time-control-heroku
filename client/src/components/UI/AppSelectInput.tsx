import React from "react";
import Select from "react-select";
import { useAppSelector } from "../../hooks/redux";
import { TimeCategory, TimeTodo } from "../../models/time-range";
import {
  GroupedOption,
  groupedOptions,
  TodoOption,
} from "../../utils/select-input";

import selectInputClasses from "./AppSelectInput.module.css";

const AppSelectInput: React.FC<
  React.PropsWithChildren<{
    onChange: (todo: TimeTodo | null, category: TimeCategory | null) => void;
  }>
> = ({ onChange }) => {
  const categories = useAppSelector((state) => state.categories.items);

  const formatGroupLabel = (data: GroupedOption) => (
    <div className={selectInputClasses.groupStyles}>
      <span>{data.label}</span>
      <span className={selectInputClasses.groupBadgeStyles}>
        {data.options.length}
      </span>
    </div>
  );

  return (
    <Select<TodoOption, false, GroupedOption>
      options={groupedOptions(categories)}
      formatGroupLabel={formatGroupLabel}
      placeholder="Desciption"
      className={selectInputClasses.select}
      onChange={(c) => {
        const todo = {
          todoId: c!.value,
          title: c!.label,
        };
        const category = c?.categoryId && {
          categoryId: c.categoryId,
          title: c.categoryTitle,
        };

        onChange(todo || null, category || null);
      }}
    />
  );
};

export default AppSelectInput;
