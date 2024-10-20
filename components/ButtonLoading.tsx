import React, {
  ForwardRefExoticComponent,
  ReactElement,
  RefAttributes,
} from "react";
import { Button, ButtonProps } from "./ui/button"; // Assuming ButtonProps is defined here
import { ReloadIcon } from "@radix-ui/react-icons";

// Define the ButtonLoading component with proper inheritance from ButtonProps
type ButtonLoadingProps = ButtonProps & {
  loading?: boolean;
  icon?: ReactElement;
  children: React.ReactNode;
};

// Create the ButtonLoading component using ForwardRefExoticComponent
const ButtonLoading: ForwardRefExoticComponent<
  ButtonLoadingProps & RefAttributes<HTMLButtonElement>
> = React.forwardRef<HTMLButtonElement, ButtonLoadingProps>(
  ({ loading, icon, children, ...props }, ref) => {
    return (
      <Button {...props} ref={ref} disabled={loading} className="btn">
        {loading ? (
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
        ) : icon ? (
          React.cloneElement(icon, { className: "mr-2 h-4 w-4" })
        ) : null}
        {loading ? "Please wait" : children}
      </Button>
    );
  },
);

// Add displayName for the component
ButtonLoading.displayName = "ButtonLoading";

export default ButtonLoading;
