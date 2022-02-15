import { useEffect } from "react";

/**
 * Make the main browser window unscrollable while the parameter is true.
 */
export default function useDisableWindowScroll(disableScroll: boolean) {
  useEffect(() => {
    const { classList } = document.body;
    if (disableScroll) {
      classList.add("overflow-hidden");
    } else {
      classList.remove("overflow-hidden");
    }
  }, [disableScroll]);
}
