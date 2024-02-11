interface labProps {
	labData: string
	id: number
}

const Lab = ({ labData, id }: labProps): JSX.Element => {
	return (
		<>
			<div className="flex flex-row justify-between w-full p-2 bg-slate-400 mt-2 rounded-xl">
				<div className="">{labData}</div>
				<div className="">Lab {id}</div>
			</div>
		</>
	)
}

export default Lab
