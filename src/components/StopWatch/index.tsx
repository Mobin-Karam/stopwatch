/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
import { memo, useState } from 'react'
import Button from '../Button'
import Lab from '../Lab'

const dataLab: any[] = []

const StopWatch = memo((): JSX.Element => {
	const [milisec, setMilisec] = useState(0)
	const [second, setSecond] = useState('00')
	const [minutes, setMinutes] = useState('00')
	const [hours, setHours] = useState('00')
	const [intervalId, setIntervalId] = useState(0)
	const [isRunning, setIsRunning] = useState<boolean>(false)
	const [isPause, setIsPause] = useState<boolean>(false)
	const [isLab, setIsLab] = useState<boolean>(false)

	if (milisec === 10) {
		if (Number(second) < 9) {
			setSecond('0' + (Number(second) + 1))
		} else {
			setSecond((Number(second) + 1).toString())
		}
		setMilisec(0)
	}
	if (Number(second) === 60) {
		if (Number(minutes) < 9) {
			setMinutes('0' + (Number(minutes) + 1))
		} else {
			setMinutes((Number(minutes) + 1).toString())
		}
		setSecond('00')
	}
	if (Number(minutes) === 60) {
		if (Number(hours) < 9) {
			setHours('0' + (Number(hours) + 1))
		} else {
			setHours((Number(hours) + 1).toString())
		}
		setMinutes('00')
	}

	function onClickStart(): void {
		if (!intervalId) {
			const newIntervalId = setInterval(() => {
				setMilisec(prev => prev + 1)
			}, 100)
			setIntervalId(newIntervalId)
			setIsRunning(true)
			setIsPause(false)
		}
	}

	function onClickStop(): void {
		if (intervalId) {
			clearInterval(intervalId)
			setIntervalId(0)
			setIsPause(true)
		}
	}

	function onClickClear(): void {
		clearInterval(intervalId)
		while (dataLab.length > 0) {
			dataLab.pop()
		}
		setIsRunning(false)
		setIsPause(false)
		setIntervalId(0)
		setMilisec(0)
		setSecond('00')
		setMinutes('00')
		setHours('00')
	}

	function onClickLab(): void {
		// setIsLab(true)
		// dataLab.push({
		// 	id: dataLab[dataLab.length - 1]?.id
		// 		? dataLab[dataLab.length - 1].id! + 1
		// 		: 1,
		// 	time:
		// 		dataLab.length === 0
		// 			? `${hours}:${minutes}:${second}.${milisec}`
		// 			: `${hours}:${minutes}:${second}.${milisec}`,
		// })
	}

	return (
		<div className={'max-h-96 overflow-hidden'}>
			<div className="flex flex-col">
				{/* Numbers */}
				<div className="flex flex-row mb-2 items-end justify-center gap-2 w-[350px]">
					<span
						className={
							!isRunning
								? 'text-white text-6xl font-thin'
								: isPause
								? 'text-white text-6xl font-thin'
								: Number(hours) === 0
								? 'text-white text-6xl font-thin'
								: 'text-blue-400 text-6xl font-thin'
						}
					>
						{hours}
					</span>
					<span className="text-6xl text-white font-thin">:</span>
					<span
						className={
							!isRunning
								? 'text-white text-6xl font-thin'
								: isPause
								? 'text-white text-6xl font-thin'
								: Number(minutes) === 0
								? 'text-white text-6xl font-thin'
								: 'text-blue-400 text-6xl font-thin'
						}
					>
						{minutes}
					</span>
					<span className="text-6xl text-white font-thin">:</span>
					<span
						className={
							!isRunning
								? 'text-white text-6xl font-thin'
								: isPause
								? 'text-white text-6xl font-thin'
								: 'text-blue-400 text-6xl font-thin'
						}
					>
						{second}
					</span>
					<span className="text-6xl text-white font-thin">.</span>
					<span
						className={
							!isRunning
								? 'text-white text-5xl'
								: isPause
								? 'text-white text-5xl'
								: 'text-blue-400 text-5xl'
						}
					>
						{milisec}
					</span>
				</div>
				{/* Buttons */}
				<div className="flex items-center justify-between gap-1 w-[350px]">
					<Button
						disabled={false}
						onClickHandle={
							!isRunning ? onClickStart : !isPause ? onClickStop : onClickStart
						}
						buttonName={!isRunning ? 'Start' : !isPause ? 'Pause' : 'Resume'}
						className={
							isRunning
								? 'bg-slate-500 text-lg text-white py-1 w-[140px] rounded-3xl hover:bg-slate-600 transition-all duration-[200] '
								: 'bg-blue-500 text-lg text-white py-1 w-[140px] rounded-3xl hover:bg-blue-600 transition-all duration-[200] '
						}
					/>
					<Button
						disabled={!isRunning}
						onClickHandle={isPause ? onClickClear : onClickLab}
						buttonName={isPause ? 'Clear' : 'Lab'}
						className={
							isPause
								? 'bg-red-500 text-lg text-white py-1 w-[140px] rounded-3xl hover:bg-red-600 transition-all duration-[200]'
								: isRunning
								? 'bg-slate-500 text-lg text-white py-1 w-[140px] rounded-3xl opacity-100 transition-all duration-[200]'
								: 'bg-slate-500 text-lg text-white py-1 w-[140px] rounded-3xl opacity-40 transition-all duration-[200]'
						}
					/>
				</div>
			</div>
			<div className="flex flex-col-reverse mt-4">
				{dataLab.map(p => {
					return <Lab id={p.id} key={p.id} labData={p.time} />
				})}
			</div>
		</div>
	)
})

StopWatch.displayName = 'StopWatch'

export default StopWatch
