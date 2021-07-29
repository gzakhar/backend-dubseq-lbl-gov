import React, { useState, useEffect } from 'react';
import Header from '../../UI/Header/Header';
import Aux from '../../../hoc/Aux';
import axios from 'axios';
import Content from '../../../hoc/Content/Content';
import Footer from '../../UI/Footer/Footer';
import { Link } from 'react-router-dom'
import TableReactPaginated from '../../UI/Table/TablePaginatedExpand';
import { TableTitle } from '../../UI/Titles/Title';


// const libraryIdLink = '/bagseq/libraries/${id}';
const libraryIdLink = '/bagseq/libraries/?';
const experimentIdLink = 'bagseq/libraries/?/experiments/?';

function ExperimentsPage() {
	const [experiments, setExperiments] = useState([]);

	// When change to the query parameters are made, the useEffect hook is executed.
	useEffect(() => {

		let fetchData = async () => {
			// const res = await axios("/api/experiments")
			const res = await axios.post('/v2/api/query/8')
			let links = addLink(res.data, 'condition_name', ['library_id', 'experiment_id'], experimentIdLink)
			links = addLink(links, 'library_name', ['library_id'], libraryIdLink)
			links = links.map((row, indx) => ({ index: indx, ...row }))
			setExperiments(links);
		}

		fetchData();

		// eslint-disable-next-line
	}, []);


	// DESTINATION STRING MUST BE FORMATED CORRECTLY 
	// 'bagseq/libraries/?/experiments/?'
	function addLink(data, destLinkCol, idSrcCol, path) {
		return data.map(e => {
			let newPath = path;
			idSrcCol.forEach(id => {
				newPath = newPath.replace("?", e[id])
			})
			e[destLinkCol] = <Link to={newPath}>{e[destLinkCol]}</Link>;
			return e;
		})
	}

	let labels = [
		{
			dataField: 'condition_name',
			text: 'Condition',
			sort: true
		},
		{
			dataField: 'library_id',
			text: 'Library id',
			sort: true
		},
		{
			dataField: 'library_name',
			text: 'Library name',
			sort: true
		},
		{
			dataField: 'experiment_id',
			text: 'Id',
			sort: true
		},
		{
			dataField: 'itnum',
			text: 'Itnum',
			sort: true
		},
		{
			dataField: 'type',
			text: 'Type',
			sort: true
		},

	]

	function ExpandedInfo(props) {

		const [libs, setLibs] = useState([])

		useEffect(() => {

			let fetchData = async () => {
				let res = await axios.post('/v2/api/query/27',
					{ 'condition_name': props.condition }
				)
				console.log(res.data)
				setLibs(res.data)
			}

			fetchData();
		}, [])


		return (
			libs.length !== 0 ? (
				<div style={{ minHeight: '100px' }}>
					<div>
						Libraries with {<span style={{ fontWeight: '600' }}>{props.row['condition_name'].props.children}.</span>}
						<ul>
							{libs.map(lib => <li><Link to={`organisms/${lib['bagseq_library_id']}`}>{lib['name']}</Link></li>)}
						</ul>
					</div>
				</div>)
				: <div>Loading</div>
		)
	}

	let expandRowFunction = (row, row_ind) => {
		// fetchLibrariesWithCondition(row['Condition'].props.children).then((value) => {
		// 	console.log(value)
		// })

		// let libs = ['lib1', 'lib2']
		return (
			<ExpandedInfo row={row} condition={row['condition_name'].props.children} />
			// <div style={{ minHeight: '100px' }}>
			// 	{/* <div>Other libraries with <span style={{ fontWeight: '600' }}>{row['Condition'].props.children}</span>, are {libs.map(lib => lib)}</div> */}
			// 	<div>Other libraries with <span style={{ fontWeight: '600' }}>{row['Condition'].props.children}</span>, are {libs[row_ind].map(lib => lib)}</div>
			// </div>
		)
	}


	return (
		<Aux>
			<Header title="TablePage" />
			<Content>
				<div className='container' style={{ paddingBottom: "40px" }}>
					<TableTitle title='Experiments' tooltip='Experiments loaded into DubSeq Browser.' />
					<TableReactPaginated data={experiments} keyField={'index'} columns={labels} expandRowFunction={expandRowFunction} />
				</div>
			</Content>
			<Footer />
		</Aux>

	)

}
export default ExperimentsPage;
