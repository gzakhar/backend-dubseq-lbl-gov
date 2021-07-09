import React, { useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, { PaginationListStandalone, PaginationProvider, SizePerPageDropdownStandalone } from 'react-bootstrap-table2-paginator';
import "./Table.css";

import './TableReactPaginated.css'

function TableReactPES(props) {

	const expandRow = {
		renderer: props.expandRowFunction,
		showExpandColumn: true,
		expandByColumnOnly: true,
		expandHeaderColumnRenderer: () => '#',
		expandColumnRenderer: ({ expanded }) => <div style={{ cursor: 'pointer' }}>{expanded ? '▼' : '▶'}</div>
	};

	const options = {
		custom: true,
		totalSize: props.data.length
	};

	const selectRow = {
		mode: 'checkbox',
		clickToSelect: true,
		selectColumnPosition: 'right',
		onSelect: handleSelectRow,
		onSelectAll: handSelectAll
	};

	function handleSelectRow(row, isSelect) {
		if (isSelect) {
			props.setSelectedRows([...props.selectedRows, row])
		} else {
			props.setSelectedRows(props.selectedRows.filter(r => r['uid'] != row['uid']))
		}
	}

	function handSelectAll(isSelect) {
		if (isSelect) {
			props.setSelectedRows(props.data)
		} else {
			props.setSelectedRows([])
		}
	}

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
						selectRow={selectRow}
					/>
				</div>
			}
		</PaginationProvider>)
		: (<h4>Page Loading</h4>)

}

export default TableReactPES;