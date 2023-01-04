import React, { useRef } from "react";
import { Badge } from "react-bootstrap";
import { useAppSelector } from "../../hooks/redux";
import useOutsideClick from "../../hooks/useOutsideClick";
import CategoryModel from "../../models/category";

import badgeClasses from "./AppBadge.module.css";
import categoryClasses from "./SelectCategory.module.css";

const SelectCategory: React.FC<
  React.PropsWithChildren<{
    show: boolean;
    selected: CategoryModel | null;
    onSelect: (c: CategoryModel) => void;
    onClose: () => void;
  }>
> = ({ show, selected, onSelect, onClose }) => {
  const categories = useAppSelector((state) => state.categories);
  const wrapperRef = useRef(null);

  useOutsideClick(wrapperRef, onClose);
  if (show)
    return (
      <div ref={wrapperRef} className={categoryClasses.categoryBox}>
        <ul>
          {categories.items.map((c) => {
            return (
              <li
                key={c._id}
                onClick={() => {
                  onClose();
                  onSelect(c);
                }}
              >
                <Badge
                  className={`${badgeClasses.categoryBadge} ${
                    categoryClasses.categoryBadge
                  } ${selected?._id === c._id && categoryClasses.selected}`}
                >
                  {c.title}
                </Badge>
              </li>
            );
          })}
        </ul>
      </div>
    );

  return null;
};

export default SelectCategory;
