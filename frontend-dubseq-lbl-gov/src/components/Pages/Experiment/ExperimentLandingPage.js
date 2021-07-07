import React, { useEffect, useState } from 'react'
import Aux from '../../../hoc/Aux';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import TableHorizontal from '../../UI/Table/TableHorizontal';
import Header from '../../UI/Header/Header';
import Content from '../../../hoc/Content/Content';
import Footer from '../../UI/Footer/Footer';
import { PageTitle, TableTitle } from '../../UI/Titles/Title';
import TableReact from '../../UI/Table/TableReact';
import TablePaginatedExpand from '../../UI/Table/TablePaginatedExpand';
import { roundTo } from '../../../helper/helperFunctions';


function ExperiemntLandingPage() {

	const { id, id_experiment } = useParams();
	const [stats, setStats] = useState(null);
	const [genes, setGenes] = useState([]);
	const [fragments, setFragments] = useState([]);

	useEffect(() => {
		async function fetchData() {
			// let res1 = await axios(`/libraries/${id}/experiments/${id_experiment}/stats`);
			let res1 = await axios.post('/v2/api/query/10', { "library_id": parseInt(id), "experiment_id": parseInt(id_experiment) })
			setStats(res1.data);

			// let res2 = await axios(`/libraries/${id}/experiments/${id_experiment}/genes`);
			let res2 = await axios.post('/v2/api/query/11', { "library_id": parseInt(id), "experiment_id": parseInt(id_experiment) })
			res2 = addLink(res2.data, 'gene_name', ['gene_id'], '/genes/?')
			res2 = res2.map(row => ({ ...row, 'score': roundTo(row['score'], 4) }))
			setGenes(res2);

			// let res3 = await axios(`/libraries/${id}/experiments/${id_experiment}/fragments`);
			// let res3 = await axios.post('/v2/api/query/12', {"library_id": id, "experiment_id": id_experiment})
			// setFragments(res3.data);
		}
		fetchData();
	}, [])

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

	let StatsLabels = [
		{
			dataField: 'name',
			text: 'Name',
		},
		{
			dataField: 'barseq_experiment_id',
			text: 'Experiment Id',
		},
		{
			dataField: 'itnum',
			text: 'ITnum',
		},
		{
			dataField: 'gene_count',
			text: 'Gene Count',
		},
		{
			dataField: 'fragment_count',
			text: 'Fragment Count',
		},
		{
			dataField: 'library_name',
			text: 'Library Name',
		},
		{
			dataField: 'genome_name',
			text: 'Genome Name',
		},
	]

	let topScoringGensLabels = [
		{
			dataField: 'gene_name',
			text: 'Name',
			sort: true
		},
		{
			dataField: 'gene_id',
			text: 'Gene ID',
			sort: true
		},
		{
			dataField: 'score',
			text: 'Gene Score',
			sort: true
		}
	]

	let topScoringFragments = [
		{
			dataField: 'barcode',
			text: 'Barcode',
			sort: true
		},
		{
			dataField: 'fragment id',
			text: 'Fragments Id',
			sort: true
		},
		{
			dataField: 'average score',
			text: 'Average Score',
			sort: true
		}
	]

	let expandRowFunction = (row, row_ind) => {
		let genome_id = stats[0]['genome_id']
		let experiment_id = stats[0]['barseq_experiment_id']
		let gene_id = row['gene_id']
		return (
			<div style={{ minHeight: '100px' }}>
				<Link className='btn btn-primary'
					to={`/graphs/fitness/?genome_id=${genome_id}&experiment_id=${experiment_id}&gene_id=${gene_id}`}>
					Fitness Graphs
				</Link>
			</div>
		)
	}

	return (
		<Aux>
			<Header title='Experiment LandingPage' />
			<Content>
				<div className='container'>
					{stats && <PageTitle title='Experiment' specific={stats[0]['name']} />}
					{stats && <TableHorizontal content={stats} labels={StatsLabels} title="General Information" />}
					<br />
					
					<TableTitle title='Top gene scores' tooltip='Top scoring genes in this experiment.' />
					<TablePaginatedExpand data={genes} keyField={'gene_id'} columns={topScoringGensLabels} expandRowFunction={expandRowFunction} />
					<br />
					{/* {fragments && <TableReact content={fragments} keyField='fragment id' labels={topScoringFragments} title="Top Scoring Fragments" />} */}
				</div>
			</Content>
			<Footer />
		</Aux>
	)

}

export default ExperiemntLandingPage;