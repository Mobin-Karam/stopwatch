import { memo, useState } from "react";
import Button from "../Button";
import Input from "../Input";

const StopWatch = memo(() => {
  const [milisec, setMilisec] = useState(0);
  const [second, setSecond] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [intervalId, setIntervalId] = useState(0);

  if (milisec === 10) {
    setSecond(second + 1);
    setMilisec(0);
  }
  if (second === 60) {
    setMinutes(minutes + 1);
    setSecond(0);
  }
  if (minutes === 60) {
    setHours(hours + 1);
    setMinutes(0);
  }

  function onClickStart() {
    if (!intervalId) {
      const newIntervalId = setInterval(() => {
        setMilisec((prev) => prev + 1);
      }, 100);
      setIntervalId(newIntervalId);
    }
  }

  function onClickStop() {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(0);
    }
  }
  function onClickClear() {
    clearInterval(intervalId);
    setIntervalId(0);
    setMilisec(0);
    setSecond(0);
    setMinutes(0);
    setHours(0);
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-row mb-2 justify-center gap-1">
        <Input
          className={
            "w-16 text-5xl text-center text-purple-200 bg-purple-900 border-purple-950 border-2 rounded-lg"
          }
          value={hours}
        />
        <Input
          className={
            "w-16 text-5xl text-center text-purple-200 bg-purple-900 border-purple-950 border-2 rounded-lg"
          }
          value={minutes}
        />
        <Input
          className={
            "w-16 text-5xl text-center text-purple-200 bg-purple-900 border-purple-950 border-2 rounded-lg"
          }
          value={second}
        />
        <Input
          className={
            "w-10 text-2xl text-center text-purple-200 bg-purple-900 border-purple-950 border-2 rounded-lg"
          }
          value={milisec}
        />
      </div>
      <div className="flex items-center justify-center gap-1 w-full">
        <Button
          disabled={false}
          onClickHandle={onClickStart}
          buttonName={"Start"}
          className={
            "bg-green-800 text-white py-1 px-4 rounded-lg hover:bg-green-700 transition-all duration-[200] "
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
});

export default StopWatch;
