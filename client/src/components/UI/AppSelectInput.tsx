import React, { useState, useRef, useEffect } from "react";
import { InputGroup } from "react-bootstrap";

import { TimeCategory } from "../../models/time-range";
import { TodoOption } from "../../utils/select-input";
import AppGroupedSelectInput from "./AppGroupedSelectInput";

import classes from "./AppSelectInput.module.css";

const AppSelectInput: React.FC<
  React.PropsWithChildren<{
    todo: TodoOption | null;
    onUserManualInput: (todoTitle: string) => void;
    onSelect: (todo: TodoOption | null, category: TimeCategory | null) => void;
  }>
> = ({ onSelect, todo, onUserManualInput }) => {
  const staticInputRef = useRef<HTMLInputElement>(null);
  const editableInputRef = useRef<HTMLInputElement>(null);

  const [isManualInputEnabled, setIsManualInputEnabled] =
    useState<boolean>(false);

  const [filterValue, setFilterValue] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isManualInputEnabled) {
      editableInputRef!.current!.focus();
    }
  }, [isManualInputEnabled]);

  return (
    <InputGroup className={classes.inputGroup}>
      <input
        ref={staticInputRef}
        className="w-100"
        required
        type="text"
        onClick={(e) => {
          setFilterValue(e.currentTarget.value);
          editableInputRef!.current!.value = e.currentTarget.value;

          setIsManualInputEnabled(true);
          setShow(!show);
        }}
        style={{
          display: isManualInputEnabled ? "none" : "inline-block",
        }}
      />
      <input
        ref={editableInputRef}
        type="text"
        className={`${classes.todoInput} ${classes.todoInput_second} w-100`}
        onClick={(e) => {
          e.preventDefault();
          setShow(!show);
        }}
        style={{
          display: isManualInputEnabled ? "inline-block" : "none",
        }}
        defaultValue=""
        onChange={(e) => {
          onUserManualInput(e.target.value);
          setFilterValue(e.target.value);
        }}
      />
      <AppGroupedSelectInput
        onClose={() => setShow(false)}
        onSelect={(data) => {
          staticInputRef!.current!.value = data.label;
          setIsManualInputEnabled(false);
          onSelect(data, {
            categoryId: data.categoryId,
            title: data.categoryTitle,
          });
        }}
        selected={todo}
        show={show}
        filterValue={filterValue}
      />
    </InputGroup>
  );
};

export default AppSelectInput;
