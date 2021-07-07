import ReactTooltip from 'react-tooltip';
import { v4 as uuid } from 'uuid';

export const PageTitle = (props) => (
	<h1 style={{
		margin: '25px 0px 50px 0px',
		paddingBottom: '10px',
		borderBottom: 'solid 1px #bbbbbb'
	}}>
		<span style={{ fontWeight: 600, color: '#272727' }}>{props.title}</span>
		{' - '}
		<span style={{
			color: '#fa7f72',
			fontWeight: 500
		}}>
			{props.specific}
		</span>
	</h1>
)

export const TableTitle = (props) => {

	const uid = uuid()

	return (
		<span style={{ cursor: 'help', color: '#272727' }}>
			<a data-tip data-for={uid} >
				<h4 style={{ fontWeight: '700', marginBottom: '30px' }}>
					{props.title}
				</h4>
			</a>
			<ReactTooltip id={uid}>
				<div style={{maxWidth: '200px'}}>
					<p>{props.tooltip}</p>
				</div>
			</ ReactTooltip>
		</span>
	)
}