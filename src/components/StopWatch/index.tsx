import { useState } from "react";
import Button from "../Button";
import Input from "../Input";

const StopWatch = () => {
  const [second, setSecond] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [hours, setHours] = useState("00");

  let intervalId: number;

  // Start Button
  function onClickStart() {
    intervalId = setInterval(() => {
      setSecond((p) => p + 1);
    }, 1000);
  }

  if (second === "60") {
    setSecond("00");
    setMinutes(minutes + 1);
  }

  if (minutes === "60") {
    setMinutes("00");
    setHours(hours + 1);
  }

  // Stop Button
  function onClickStop() {}
  // Clear Button
  function onClickClear() {
    clearInterval(intervalId);
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-row mb-2">
        <Input value={hours} />
        <Input value={minutes} />
        <Input value={second} />
      </div>
      <div className="flex justify-between">
        <Button
          disabled={false}
          onClickHandle={onClickStart}
          buttonName={"Start"}
          className={
            "bg-green-800 text-white py-1 px-4 rounded-lg hover:bg-green-700 transition-all duration-[200]"
          }
        />
        <Button
          disabled={false}
          onClickHandle={onClickClear}
          buttonName={"Clear"}
          className={`bg-blue-800 text-white py-1 px-4 rounded-lg hover:bg-blue-700 transition-all duration-[200]`}
        />
        <Button
          disabled={false}
          onClickHandle={onClickStop}
          buttonName={"Stop"}
          className={`bg-red-800 text-white py-1 px-4 rounded-lg hover:bg-red-700 transition-all duration-[200]`}
        />
      </div>
    </div>
  );
};

export default StopWatch;
