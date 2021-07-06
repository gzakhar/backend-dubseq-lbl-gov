import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import Aux from '../../../hoc/Aux';
import "./Table.css";


function TableReactExpandable(props) {

	const expandRow = {
		renderer: props.expandRowFunction,
		showExpandColumn: true,
		expandByColumnOnly: true,
		expandHeaderColumnRenderer: ({ isAnyExpands }) => (<div style={{ width: '55px' }}>#</div>),
		// expandColumnRenderer: ({ expanded }) => <div className='btn btn-primary' style={{cursor: 'pointer'}}>{expanded ? '-' : '+'}</div>
		expandColumnRenderer: ({ expanded }) => <div style={{ cursor: 'pointer' }}>{expanded ? '▼' : '▶'}</div>
	};

	return (
		<Aux>
			<h4 style={{ fontWeight: "700", marginBottom: "30px" }}>{props.title}</h4>
			<div style={{ backgroundColor: "white", borderRadius: '1rem' }}>
				{props.content && <BootstrapTable
					keyField={props.keyField}
					data={props.content}
					columns={props.labels}
					bordered={false}
					bootstrap4
					hover
					wrapperClasses="table-responsive"
					expandRow={expandRow}
				/>}
			</div>
		</Aux>
	)
}

export default TableReactExpandable;