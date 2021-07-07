import React from 'react';
import Aux from '../../../hoc/Aux';
import classes from './Table.module.css';



const TableHorizontal = (props) => {

	function getKeys(obj) {
		return Object.keys(obj);
	}

	function renderRow(labels, data) {

		return labels.map((label, i) => (
			<tr key={i}>
				<th style={{color: '#272727'}}>{label['text']}</th>
				<td>{data[label['dataField']]}</td>
			</tr>))

	}

	return (
		<Aux>
			<h4 className={classes.table_title}>{props.title}</h4>
			<div className={classes.table_background}>
				<table className='table table-hover'>
					<tbody>
						{props.content && renderRow(props.labels, props.content[0])}
					</tbody>
				</table>
			</div>
		</Aux >
	)

}

export default TableHorizontal;