type inputProps = {
  value: string;
};

function Input({ value }: inputProps) {
  return (
    <input
      type="text"
      className="w-16 text-5xl text-center mr-1 text-purple-200 bg-purple-900 border-purple-950 border-2 rounded-lg"
      value={value}
      readOnly
    />
  );
}

export default Input;
