import React from 'react';
import Aux from '../../../hoc/Aux';


const RenderRow = (props) => {
	return props.keys.map((key, index) => (
		<td key={index}>{props.data[key]}</td>
	))
}

const Table = (props) => {


	function getKeys(obj) {
		return Object.keys(obj)
	}

	function getHeaders(obj) {

		return getKeys(obj[0])
			.map((key, index) => (
				<th key={key}>{key}</th>
			))
	}

	function getRowsData(content) {
		var items = content;
		var keys = getKeys(content[0]);
		return items.map((row, index) => (
			<tr key={index}>
				<RenderRow data={row} keys={keys} />
				{props.onClick && <td><button className='btn btn-success'onClick={(() => props.onClick(index))}>see more</button></td>}
			</tr>
		))
	}

	return (
		<Aux>
			<h4>{props.title}</h4>
			<table className='table table-hover' style={{backgroundColor: 'rgba(255, 255, 255, 0.4)'}}>
				<thead>
					<tr>{props.content == null ? [] : getHeaders(props.content) }
						{props.onClick && <th>LandingPage</th>}
					</tr>
				</thead>
				<tbody>
					{props.content == null ? [] : getRowsData(props.content)}
				</tbody>
			</table>
		</Aux >
	)

}

export default Table;