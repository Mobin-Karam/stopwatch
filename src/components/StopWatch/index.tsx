import { memo, useState } from "react";
import Button from "../Button";

const StopWatch = memo(() => {
  const [milisec, setMilisec] = useState(0);
  const [second, setSecond] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [hours, setHours] = useState("00");
  const [intervalId, setIntervalId] = useState(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPause, setIsPause] = useState<boolean>(false);

  if (milisec === 10) {
    if (Number(second) < 9) {
      setSecond("0" + (Number(second) + 1));
    } else {
      setSecond((Number(second) + 1).toString());
    }
    setMilisec(0);
  }
  if (Number(second) === 60) {
    if (Number(minutes) < 9) {
      setMinutes("0" + (Number(minutes) + 1));
    } else {
      setMinutes((Number(minutes) + 1).toString());
    }
    setSecond("00");
  }
  if (Number(minutes) === 60) {
    if (Number(hours) < 9) {
      setHours("0" + (Number(hours) + 1));
    } else {
      setHours((Number(hours) + 1).toString());
    }
    setMinutes("00");
  }

  function onClickStart() {
    if (!intervalId) {
      const newIntervalId = setInterval(() => {
        setMilisec((prev) => prev + 1);
      }, 100);
      setIntervalId(newIntervalId);
      setIsRunning(true);
      setIsPause(false);
    }
  }

  function onClickStop() {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(0);
      setIsPause(true);
    }
  }

  function onClickClear() {
    clearInterval(intervalId);
    setIsRunning(false);
    setIsPause(false);
    setIntervalId(0);
    setMilisec(0);
    setSecond("00");
    setMinutes("00");
    setHours("00");
  }

  function onClickLab() {}

  return (
    <div className="flex flex-col">
      <div className="flex flex-row mb-2 items-end justify-center gap-1">
        <span className="text-white text-6xl font-thin">{hours}:</span>
        <span className="text-white text-6xl font-thin">{minutes}:</span>
        <span
          className={
            isRunning
              ? `text-blue-400 text-6xl font-thin`
              : `text-white text-6xl font-thin`
          }
        >
          {second}.
        </span>
        <span
          className={
            isRunning ? `text-blue-400 text-5xl` : `text-white text-5xl`
          }
        >
          {milisec}
        </span>
      </div>
      <div className="flex items-center justify-between gap-1 w-[350px]">
        <Button
          disabled={false}
          onClickHandle={
            !isRunning ? onClickStart : !isPause ? onClickStop : onClickStart
          }
          buttonName={!isRunning ? "Start" : !isPause ? "Pause" : "Resume"}
          className={
            isRunning
              ? "bg-slate-500 text-lg text-white py-1 w-[140px] rounded-3xl hover:bg-slate-600 transition-all duration-[200] "
              : "bg-blue-500 text-lg text-white py-1 w-[140px] rounded-3xl hover:bg-blue-600 transition-all duration-[200] "
          }
        />
        <Button
          disabled={isRunning ? false : true}
          onClickHandle={isPause ? onClickClear : onClickLab}
          buttonName={isPause ? "Clear" : "Lab"}
          className={
            isPause
              ? `bg-red-500 text-lg text-white py-1 w-[140px] rounded-3xl hover:bg-red-600 transition-all duration-[200]`
              : isRunning
              ? `bg-slate-500 text-lg text-white py-1 w-[140px] rounded-3xl opacity-100 transition-all duration-[200]`
              : `bg-slate-500 text-lg text-white py-1 w-[140px] rounded-3xl opacity-40 transition-all duration-[200]`
          }
        />
      </div>
    </div>
  );
});

export default StopWatch;
