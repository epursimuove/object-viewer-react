import type { RefObject } from "react";

export const createFocusEnablerForSection = (
    detailsSectionRef: RefObject<HTMLDetailsElement | null>,
    formElementRef: RefObject<HTMLTextAreaElement | HTMLInputElement | null>
) => {
    const detailsElement = detailsSectionRef.current;
    const formElement = formElementRef.current;

    if (detailsElement && formElement) {
        const handleToggle = () => {
            if (detailsElement.open) {
                formElement.focus();
            }
        };

        detailsElement.addEventListener("toggle", handleToggle);

        // Cleanup on component unmount.
        return () => {
            detailsElement.removeEventListener("toggle", handleToggle);
        };
    }
};
