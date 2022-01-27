import React, {
  useRef,
  createContext,
  useEffect,
  useContext,
  useState,
} from "react";
import orderBy from "lodash/orderBy";

interface FormFieldItem {
  element: HTMLElement;
  index: number;
}

const FormFieldContext = createContext<FormFieldItem[] | null>(null);
const FormFieldGroupContext = createContext<FormFieldItem[] | null>(null);

export function useFormFieldRef(index: number) {
  const ref = useRef<HTMLInputElement | null>(null);
  const formFieldItems = useContext(FormFieldContext);
  const formFieldGroupItems = useContext(FormFieldGroupContext);
  if (!formFieldItems) {
    throw new Error("FormFocusContextProvider is missing!");
  }

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return undefined;
    }
    // Register the form field item
    const formFieldItem = { element, index };
    formFieldItems.push(formFieldItem);
    formFieldGroupItems?.push(formFieldItem);
    // Listen for 'keydown' events
    const onFieldKeyDown = (event: KeyboardEvent) => {
      // Listen for Enter key, or the "Go" on Android
      if (event.keyCode === 13 && element.tagName !== "SELECT") {
        // Move focus to the next field
        event.preventDefault();
        const orderedFieldItems = orderBy(formFieldItems, "index");
        const currentIndex = orderedFieldItems.indexOf(formFieldItem);
        const nextIndex = currentIndex + 1;
        const nextFieldItem = orderedFieldItems[nextIndex];
        nextFieldItem?.element.focus();
      }
    };

    element.addEventListener("keydown", onFieldKeyDown);

    return () => {
      // Forget this form field item
      const index = formFieldItems.indexOf(formFieldItem);
      formFieldItems.splice(index, 1);
      if (formFieldGroupItems) {
        const indexInGroup = formFieldGroupItems.indexOf(formFieldItem);
        formFieldGroupItems.splice(indexInGroup, 1);
      }
      // Stop listening 'keydown' events
      element.removeEventListener("keydown", onFieldKeyDown);
    };
  }, [index, formFieldItems, formFieldGroupItems]);

  return ref;
}

export function FormFocusContextProvider(props: { children: React.ReactNode }) {
  const { children } = props;
  const [formFieldItems] = useState<FormFieldItem[]>([]);
  return (
    <FormFieldContext.Provider value={formFieldItems}>
      {children}
    </FormFieldContext.Provider>
  );
}

export function FormFocusGroup(props: {
  focused: boolean;
  children: React.ReactNode;
}) {
  const { children, focused } = props;
  const [groupItems] = useState<FormFieldItem[]>([]);

  useEffect(() => {
    if (focused) {
      const [firstItem] = orderBy(groupItems, "index");
      firstItem?.element.focus();
    }
  }, [focused, groupItems]);

  return (
    <FormFieldGroupContext.Provider value={groupItems}>
      {children}
    </FormFieldGroupContext.Provider>
  );
}
