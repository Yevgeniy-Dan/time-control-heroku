import React from "react";
import Select from "react-select";
import { useAppSelector } from "../../hooks/redux";
import {
  GroupedOption,
  groupedOptions,
  TodoOption,
} from "../../utils/select-input";

import selectInputClasses from "./AppSelectInput.module.css";

const AppSelectInput: React.FC<React.PropsWithChildren<{}>> = (props) => {
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
    />
  );
};

export default AppSelectInput;
