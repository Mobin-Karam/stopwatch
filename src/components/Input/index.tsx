type inputProps = {
  value: number;
  className: string;
};

function Input({ value, className }: inputProps) {
  return (
    <input
      type="text"
      className={className}
      value={value}
      readOnly
    />
  );
}

export default Input;
