import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, { PaginationListStandalone, PaginationProvider, SizePerPageDropdownStandalone } from 'react-bootstrap-table2-paginator';
import "./Table.css";

import './TableReactPaginated.css'

function TablePaginatedExpand(props) {

	const expandRow = {
		renderer: props.expandRowFunction,
		showExpandColumn: true,
		expandByColumnOnly: true,
		expandHeaderColumnRenderer: () => '#',
		// expandColumnRenderer: ({ expanded }) => (expanded ? '-' : '+')
		expandColumnRenderer: ({ expanded }) => <div style={{ cursor: 'pointer' }}>{expanded ? '▼' : '▶'}</div>
	};

	const options = {
		custom: true,
		totalSize: props.data.length
	};

	return props.data.length !== 0 ?
		(<PaginationProvider pagination={paginationFactory(options)}>
			{({ paginationProps, paginationTableProps }) =>
				<div>
					<div className='d-flex justify-content-between pagination-toggles'>
						<SizePerPageDropdownStandalone
							{...paginationProps}
						/>
						<PaginationListStandalone
							{...paginationProps}
						/>
					</div>
					<BootstrapTable
						keyField={props.keyField}
						data={props.data}
						columns={props.columns}
						bordered={false}
						bootstrap4
						hover
						wrapperClasses="table-responsive"
						expandRow={expandRow}
						{...paginationTableProps}

					/>
				</div>
			}
		</PaginationProvider>)
		: (<h4>Page Loading</h4>)

}

export default TablePaginatedExpand;