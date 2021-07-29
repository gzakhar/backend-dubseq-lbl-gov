import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Aux from '../../../hoc/Aux';
import Header from '../../UI/Header/Header';
import Footer from '../../UI/Footer/Footer';
import axios from 'axios';
import TableHorizontal from '../../UI/Table/TableHorizontal';
import HorizontalLayout from '../../Layouts/HorizontalLayout';
import Content from '../../../hoc/Content/Content';
import { PageTitle, TableTitle } from '../../UI/Titles/Title';
import TablePaginatedExpand from '../../UI/Table/TablePaginatedExpand';
import TableReactPaginated from '../../UI/Table/TableReactPaginated';
import CircleLoader from "react-spinners/CircleLoader";
import { downloadObjectAsCSV } from '../../../helper/helperFunctions';
import '../../UI/List/List.css'

function BagSeqLandingPage() {

	const { id } = useParams();
	const [stats, setStats] = useState(null);
	const [experiments, setExperients] = useState([]);
	const [topPerformingGenes, setTopPerformingGenes] = useState([]);
	const [histData, setHistData] = useState(null);
	const [loading, setLoading] = useState(false)
	const [topExperimentsThreshold, setTopExperimentsThreshold] = useState(4)

	useEffect(() => {

		async function fetchData() {
			// let res1 = await axios.get(`/api/libraries/${id}/stats`);
			let res1 = await axios.post('/v2/api/query/16', { 'library_id': parseInt(id) })
			setStats(res1.data);
			// let res2 = await axios.get(`/api/libraries/${id}/experiments`);
			let res2 = await axios.post('/v2/api/query/17', {
				'library_id': parseInt(id),
				'score_threshold': 4
			})
			res2.data = addLink(res2.data, 'itnum', ['experiment_id'], '/bagseq/libraries/${id}/experiments/${id_experiment}')
			setExperients(res2.data);

			// let res3 = await axios.get(`/api/libraries/${id}/highscoregenes`);
			let res3 = await axios.post('/v2/api/query/13', { 'library_id': parseInt(id) })
			res3.data = res3.data.map((row, index) => ({
				'uid': index,
				...row
			}))
			res3.data.forEach(row => row['gene_name'] = <Link to={`/genes/${row['gene_id']}`}> {row['gene_name']} </Link>)
			setTopPerformingGenes(res3.data);

			// Histogram
			// let res4 = await axios(`/api/libraries/${id}/experiments/1/graphs`);
			// setHistData(res4.data);
		}

		fetchData();
		console.log("Update");

		// eslint-disable-next-line
	}, [])

	function addLink(data, LinkCol, idCol, path) {
		console.warn("WARNIGN: Using eval is NOT SAFE, Change this code")
		return data.map(e => {
			// eslint-disable-next-line
			let id_experiment = e[idCol];
			let newPath = eval('`' + path + '`');
			e[LinkCol] = <Link to={newPath}>{e[LinkCol]}</Link>;
			return e;
		})
	}


	let StatsLabels = [
		{
			dataField: 'name',
			text: 'Name',
		},
		{
			dataField: 'bagseq_library_id',
			text: 'Library ID',
		},
		{
			dataField: 'host_genome_name',
			text: 'Host Genome Name',
		},
		{
			dataField: 'host_genome_id',
			text: 'Host Genome ID',
		},
		{
			dataField: 'fragment_count',
			text: 'Fragment Count',
		},
		{
			dataField: 'experiment_count',
			text: 'Experiment Count',
		},
		{
			dataField: 'condition_count',
			text: 'Condition Count',
		}
	]

	let ExperimentLabels = [
		{
			dataField: 'condition_name',
			text: 'Condition',
			sort: true
		},
		{
			dataField: 'high_scoring_genes',
			text: 'High Scoring Genes',
			sort: true
		},
		{
			dataField: 'itnum',
			text: 'itnum',
			sort: true
		},
		{
			dataField: 'experiment_id',
			text: 'Experiment Id',
			sort: true
		},
	]

	let TopPerformingLabels = [
		{
			dataField: 'gene_name',
			text: 'Gene Name',
			sort: true
		},
		{
			dataField: 'score',
			text: 'Gene Score',
			sort: true
		},
		{
			dataField: 'name',
			text: 'Condition',
			sort: true
		},
	]

	let expandRow = (row, row_id) => {

		let genome_id = id
		let experiment_id = row['barseq_experiment_id']
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

	async function handleDownloadExperimentHighScoringGenes() {
		setLoading(true)
		let res = await axios.post('/v2/api/query/17', {
			'library_id': parseInt(id),
			'score_threshold': parseInt(topExperimentsThreshold)
		})
		downloadObjectAsCSV(res.data, `top_experiments_gene_score_threshold(${topExperimentsThreshold})`)
		setLoading(false)
	}

	async function handleDownloadAllExperimentHighScoringGenes() {
		setLoading(true)
		let res = await axios.post('/v2/api/query/17', {
			'library_id': parseInt(id),
			'score_threshold': -10000
		})
		downloadObjectAsCSV(res.data, `all_experiments_gene_score_threshold(${topExperimentsThreshold})`)
		setLoading(false)
	}

	async function handleDownloadTopPerformingGenes() {
		setLoading(true)
		let res = await axios.post('/v2/api/query/13', { 'library_id': parseInt(id) })
		res.data = res.data.map(row => {
			delete row['gene_id']
			return row
		})
		downloadObjectAsCSV(res.data, 'topPerformingGenesAndExperiments')
		setLoading(false)
	}


	return (
		<Aux>
			<Header title='Library LandingPage' />
			<Content>
				<div className='container'>
					{stats && <PageTitle title='Dub-seq Library' specific={stats[0]['name']} />}
					{stats && <HorizontalLayout content={[
						<TableHorizontal content={stats} labels={StatsLabels} title='General Information' />,
					]} contentWidth={[6, 6]} />}
					<br />
					<TableTitle title='Experiments high scoring genes' tooltip='genes scored above 4.' />
					<TableReactPaginated data={experiments} keyField='experiment id' columns={ExperimentLabels} />
					<br />
					<TableTitle title='Top Performing Genes' tooltip='Best scoring Genes in this library and the experiment in which the gene scored highest.' />
					<TablePaginatedExpand data={topPerformingGenes} keyField='uid' columns={TopPerformingLabels} expandRowFunction={expandRow} />
					<br />
					<div className='download'>
						<div className='d-flex justify-content-start'>
							<TableTitle title="Download" tooltip={'downlodable data'} />
							<CircleLoader loading={loading} size={30} />
						</div>
						<ul>
							<li>
								<span onClick={handleDownloadExperimentHighScoringGenes}>Experiments high scoring genes </span>
								<input type='number' min='-10' max='30' value={topExperimentsThreshold} onChange={e => setTopExperimentsThreshold(e.target.value)} />
								.
							</li>
							<li>
								<div onClick={handleDownloadAllExperimentHighScoringGenes}>All experiments high scoring genes.</div>
							</li>
							<li>
								<span onClick={handleDownloadTopPerformingGenes}>Top performing genes.</span>
							</li>
						</ul>
					</div>
				</div>
			</Content>
			<Footer />
		</Aux>
	)
}

export default BagSeqLandingPage;