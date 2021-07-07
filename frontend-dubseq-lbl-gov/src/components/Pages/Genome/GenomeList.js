import React, { useState, useEffect } from 'react';
import Header from '../../UI/Header/Header';
import Aux from '../../../hoc/Aux';
import axios from 'axios';
import Table from '../../UI/Table/Table';
import Content from '../../../hoc/Content/Content';
import Footer from '../../UI/Footer/Footer';
import { Link } from 'react-router-dom';
import TableReactExpandable from '../../UI/Table/TableReactExpandable';
import { downloadObjectAsCSV, downloadObjectAsJSON, downloadObjectAsJson, jsonToCsv } from '../../../helper/helperFunctions';
import { TableTitle } from '../../UI/Titles/Title';

const NCBI_TAXONOMY_ID_BROWSER = 'https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id='

function GenomeList() {

	const [genomeList, setGenomeList] = useState(null);

	useEffect(() => {

		async function fetchData() {
			// https://docs.google.com/spreadsheets/d/1OJNuSJz9_057EFYK5IbSUbV0dIMaY7Po3cnTlkhTdq4/edit#gid=0
			let res = await axios.post('v2/api/query/0')
			res.data = res.data.map(e => {
				e['link'] = <Link to={`/organisms/${e.genome_id}`}>See More</Link>;
				e['ncbi_taxonomy_id'] =
					<a
						href={`${NCBI_TAXONOMY_ID_BROWSER}${e.ncbi_taxonomy_id}`}
						target="_blank">
						{e.ncbi_taxonomy_id}
					</a>
				return e;
			})
			setGenomeList(res.data);
		}

		fetchData();
		console.log('Update');

		// eslint-disable-next-line
	}, [])

	const lables = [
		{
			dataField: 'genome_id',
			text: 'ID',
			sort: true
		}, {
			dataField: 'name',
			text: 'Name',
			sort: true
		}, {
			dataField: 'size',
			text: 'Size (kbps)',
			sort: true
		}, {
			dataField: 'ncbi_taxonomy_id',
			text: 'Taxonomy ID',
			sort: true
		}, {
			dataField: 'phylum',
			text: 'Phylum',
			sort: true
		}, {
			dataField: 'count',
			text: 'Count',
			sort: true
		}, {
			dataField: 'library_count',
			text: 'Library count',
			sort: true
		}, {
			dataField: 'experiment_count',
			text: 'Experiment count',
			sort: true
		}, {
			dataField: 'link',
			text: 'Link',
			sort: true
		}
	]

	async function handleDownloadGenomeCSV(genomeId, genomeName) {
		let res = await axios.post('/v2/api/query/1', { 'genome_id': genomeId })
		downloadObjectAsCSV(res.data, `${genomeName}-genome`)
	}

	async function handleDownloadGenomeJSON(genomeId, genomeName) {
		let res = await axios.post('/v2/api/query/1', { 'genome_id': genomeId })
		downloadObjectAsJSON(res.data, `${genomeName}-genome`)
	}


	let expandRowFunction = (row, row_ind) => {
		return (
			<table style={{width: '100%'}}>
				<tr>
					<th>Download</th>
					<th>Heat-map</th>
					<th>Fitness</th>
				</tr>
				<tr>
					<td><button className='btn btn-success' onClick={() => handleDownloadGenomeCSV(row['genome_id'], row['name'])}> CSV </button> </td>
					<td><Link to={`/graphs/heatmap/?genome_id=${row['genome_id']}`} className='btn btn-primary'>Heat-map</Link></td>
					<td><Link to={`/graphs/fitness/?genome_id=${row['genome_id']}`} className='btn btn-warning'>Fitness</Link></td>
				</tr>
				<tr>
				<td><button className='btn btn-success' onClick={() => handleDownloadGenomeJSON(row['genome_id'], row['name'])}> JSON </button> </td>
				</tr>
			</table>
		)
	}


	return (
		<Aux>
			<Header title="TablePage" />
			<Content>
				<div className='container'>
					<TableTitle title='Organisms' tooltip='A list of Organisms that are available on this website'/>
					<TableReactExpandable keyField='genome_id' content={genomeList} labels={lables} expandRowFunction={expandRowFunction} />
				</div>
			</Content>
			<Footer />
		</Aux>
	)

}



export default GenomeList;
