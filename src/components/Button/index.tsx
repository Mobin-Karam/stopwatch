interface ButtonProps {
  buttonName: string;
  className: string;
  onClickHandle: () => void;
  disabled?: boolean;
}

const Button = ({
  buttonName,
  className,
  onClickHandle,
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClickHandle}
      className={className}
      disabled={disabled}
    >
      {buttonName}
    </button>
  );
};

export default Button;
