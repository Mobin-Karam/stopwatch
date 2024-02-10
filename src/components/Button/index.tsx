type buttonProps = {
  buttonName: string;
  className: string;
  onClickHandle: () => void;
  disabled: boolean;
};

const Button = ({
  buttonName,
  className,
  onClickHandle,
  disabled = false,
}: buttonProps) => {
  return (
    <button onClick={onClickHandle} className={className} disabled={disabled}>
      {buttonName}
    </button>
  );
};

export default Button;
