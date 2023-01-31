import React, { useState, useRef, useEffect } from "react";
import { InputGroup } from "react-bootstrap";
import { TimeCategory } from "../../types/Time";

import { TodoOption } from "../../utils/select-input";
import AppGroupedSelectInput from "./AppGroupedSelectInput";

import classes from "./AppSelectInput.module.css";

const AppSelectInput: React.FC<
  React.PropsWithChildren<{
    todo: TodoOption | null;
    todoTitle: string | null;
    onUserManualInput: (todoTitle: string) => void;
    onSelect: (todo: TodoOption | null, category: TimeCategory | null) => void;
  }>
> = ({ onSelect, todo, todoTitle, onUserManualInput }) => {
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
  }, [isManualInputEnabled, todo, todoTitle]);
  useEffect(() => {
    if (!todo && todoTitle) {
      setIsManualInputEnabled(true);
    }
  }, [todo, todoTitle]);
  return (
    <InputGroup className={classes.inputGroup}>
      <input
        ref={staticInputRef}
        placeholder="What are you working on?"
        className="w-100"
        required
        type="text"
        defaultValue={todo ? todo.label : ""}
        onClick={(e) => {
          setFilterValue(e.currentTarget.value);
          editableInputRef!.current!.value = e.currentTarget.value;

          setIsManualInputEnabled(true);
          setShow(!show);
        }}
        onMouseDown={(e) => {}}
        style={{
          display: isManualInputEnabled ? "none" : "inline-block",
        }}
      />
      <input
        ref={editableInputRef}
        placeholder="What are you working on?"
        type="text"
        className={`${classes.todoInput} ${classes.todoInput_second} w-100`}
        onClick={(e) => {
          e.preventDefault();
          setShow(!show);
        }}
        style={{
          display: isManualInputEnabled ? "inline-block" : "none",
        }}
        defaultValue={todoTitle || ""}
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

          const category =
            data.categoryId && data.categoryTitle
              ? {
                  categoryId: data.categoryId,
                  title: data.categoryTitle,
                }
              : null;

          onSelect(data, category);
        }}
        selected={todo}
        show={show}
        filterValue={filterValue}
      />
    </InputGroup>
  );
};

export default AppSelectInput;
