import React, { useRef } from "react";
import { useAppSelector } from "../../hooks/redux";
import useOutsideClick from "../../hooks/useOutsideClick";
import { groupedOptions, TodoOption } from "../../utils/select-input";

import classes from "./AppGroupedSelectInput.module.css";
const AppGroupedSelectInput: React.FC<
  React.PropsWithChildren<{
    show: boolean;
    selected: TodoOption | null;
    onSelect: (todo: TodoOption) => void;
    onClose: () => void;
    filterValue: string;
  }>
> = ({ show, selected, onSelect, onClose, filterValue }) => {
  const wrapperRef = useRef(null);

  const categories = useAppSelector((state) => state.categories.items);

  useOutsideClick(wrapperRef, onClose);

  const options = groupedOptions(categories);
  if (show) {
    return (
      <div ref={wrapperRef} className={classes.box}>
        {options
          .filter((opt) => {
            const todos = opt.options.filter((t) =>
              t.label.toUpperCase().includes(filterValue.toUpperCase())
            );

            return todos.length > 0;
          })
          .map((category, index) => {
            return (
              <div key={category.label + index}>
                <div className={classes.groupStyles}>
                  <span className={classes.groupLabelStyles}>
                    {category.label}
                  </span>
                  <span className={classes.groupBadgeStyles}>
                    {category.options.length}
                  </span>
                </div>
                <ul>
                  {category.options
                    .filter((todo) =>
                      todo.label
                        .toUpperCase()
                        .includes(filterValue.toUpperCase())
                    )
                    .map((todo) => {
                      return (
                        <li
                          key={todo.value}
                          onClick={() => {
                            onClose();
                            onSelect(todo);
                          }}
                        >
                          {todo.label}
                        </li>
                      );
                    })}
                </ul>
              </div>
            );
          })}
      </div>
    );
  }

  return null;
};

export default AppGroupedSelectInput;
