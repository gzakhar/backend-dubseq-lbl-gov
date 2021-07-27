import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Aux from '../../../hoc/Aux';
import Header from '../../UI/Header/Header';
import Footer from '../../UI/Footer/Footer';
import axios from 'axios';
import RadialGraph from '../../Graphs/RadialGraph';
import TableHorizontal from '../../UI/Table/TableHorizontal';
import HorizontalLayout from '../../Layouts/HorizontalLayout';
import Content from '../../../hoc/Content/Content';
import { Link } from 'react-router-dom';
import { PageTitle, TableTitle } from '../../UI/Titles/Title';
import TableReact from '../../UI/Table/TableReact';
import TablePaginatedExpand from '../../UI/Table/TableReactPES';
import { addUID, downloadObjectAsCSV, roundTo } from '../../../helper/helperFunctions';
import CircleLoader from "react-spinners/CircleLoader";

const TOP_EXPERIMENT_THRESHOLD = 4

function GenomeLandingPage() {

	const { id } = useParams();
	const [stats, setStats] = useState(null);
	const [library, setLibrary] = useState([]);
	const [experiments, setExperients] = useState([]);
	const [selectedExperiments, setSelectedExperiments] = useState([]);
	const [topExperimentsThreshold, setTopExperimentsThreshold] = useState(4);
	const [loading, setLoading] = useState(false)

	useEffect(() => {

		const fetchData = async () => {
			// let res1 = await axios(`/api/organisms/${id}/stats`);
			let res1 = await axios.post('/v2/api/query/1', { "genome_id": parseInt(id) })
			setStats(res1.data);

			// let res2 = await axios(`/api/organisms/${id}/libraries`);
			let res2 = await axios.post('/v2/api/query/2', { "genome_id": parseInt(id) })
			res2.data = addLink(res2.data, 'name', ['bagseq_library_id'], `/bagseq/libraries/<>`)
			setLibrary(res2.data);

			// let res3 = await axios(`/api/organisms/${id}/topexperiments`);
			let res3 = await axios.post('/v2/api/query/4', {
				'genome_id': parseInt(id),
				'score_threshold': TOP_EXPERIMENT_THRESHOLD
			})
			res3.data = addLink(res3.data, 'name', ['barseq_experiment_id'], `/bagseq/libraries/${id}/experiments/<>`)
			res3.data = addLink(res3.data, 'gene_name', ['gene_id'], `/genes/<>`)
			res3.data = addUID(res3.data)
			res3.data = res3.data.map(row => ({ ...row, 'max_gene_score': roundTo(row['max_gene_score'], 4) }))
			setExperients(res3.data);
		}

		fetchData();

		// eslint-disable-next-line
	}, [])


	// DESTINATION STRING MUST BE FORMATED CORRECTLY 
	// 'bagseq/libraries/?/experiments/?'
	function addLink(data, destLinkCol, idSrcCol, path) {
		return data.map(e => {
			let newPath = path;
			idSrcCol.forEach(id => {
				newPath = newPath.replace("<>", e[id])
			})
			e[destLinkCol] = <Link to={newPath}>{e[destLinkCol]}</Link>;
			return e;
		})
	}


	let StatsLabels = [
		{
			dataField: 'name',
			text: 'Name'
		},
		{
			dataField: 'genome_id',
			text: 'ID'
		},
		{
			dataField: 'size',
			text: 'Size (kbps)'
		},
		{
			dataField: 'ncbi_taxonomy_id',
			text: 'TaxonomyId'
		},
		{
			dataField: 'phylum',
			text: 'Phylum'
		},
		{
			dataField: 'gene_count',
			text: 'Gene Count'
		},
		{
			dataField: 'experiment_count',
			text: 'Experiment Count'
		},
		{
			dataField: 'condition_count',
			text: 'Condition Count'
		},
	]

	let LibrariesLabels = [
		{
			dataField: 'name',
			text: 'Name',
			sort: true
		},
		{
			dataField: 'bagseq_library_id',
			text: 'Id',
			sort: true
		},
		{
			dataField: 'experiments_count',
			text: 'Experiments',
			sort: true
		},
		{
			dataField: 'fragment_count',
			text: 'Fragments',
			sort: true
		},
	]

	let TopPerformingLabels = [
		{
			dataField: 'name',
			text: 'Name',
			sort: true
		},
		{
			dataField: 'type',
			text: 'Type',
			sort: true
		},
		{
			dataField: 'gene_name',
			text: 'Gene',
			sort: true
		},
		{
			dataField: 'max_gene_score',
			text: 'MaxGeneScore',
			sort: true
		}
	]

	let genomeName = stats ? stats[0]['name'] : ''

	let expandRowFunction = (row, row_ind) => {
		let genome_id = stats[0]['genome_id']
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

	const LinkToHeatMap = () => {

		let genomeId = `?genome_id=${id}`
		let experimentsAndGenes = selectedExperiments.map(row => ('&experiment_ids=' + row['barseq_experiment_id'] + '&gene_ids=' + row['gene_id'])).join('')
		return (
			<Link className={'btn btn-warning'}
				style={{ height: '40px' }}
				to={`/graphs/heatmap/${genomeId}${experimentsAndGenes}`}>HeatMap</Link >
		)
	}


	async function handleDownloadTopExperiments() {
		setLoading(true)
		let res = await axios.post('/v2/api/query/4', {
			'genome_id': parseInt(id),
			'score_threshold': parseInt(topExperimentsThreshold)
		})
		downloadObjectAsCSV(res.data, `topExperiments threchold(${topExperimentsThreshold})`)
		setLoading(false)
	}

	async function handleDownloadAllTopExperiments() {
		setLoading(true)
		let res = await axios.post('/v2/api/query/4', {
			'genome_id': parseInt(id),
			'score_threshold': -1000
		})
		downloadObjectAsCSV(res.data, 'topExperiments all')
		setLoading(false)
	}


	return (
		<Aux>
			<Header title={'GenomeLandingPage'} />
			<Content>
				<div className='container' style={{ paddingBottom: "40px" }}>
					{stats && <PageTitle title={'Organism'} specific={genomeName} />}
					{stats && <HorizontalLayout content={[
						<TableHorizontal content={stats} labels={StatsLabels} title='General Information' />,
						<RadialGraph />
					]} contentWidth={[6, 6]} />}
					<div style={{ marginTop: "50px" }}>
						<TableTitle title='Libraries Created' tooltip={`List of libraries created with ${genomeName}`} />
						<TableReact content={library} keyField='id' labels={LibrariesLabels} />
					</div>

					<div style={{ marginTop: "70px" }}>
						<div className='d-flex justify-content-between'>
							<TableTitle title='Top Experiments Performed' tooltip={`Top experiments performed on ${genomeName} and the gene was activated (score over ${TOP_EXPERIMENT_THRESHOLD}).`} />
							<LinkToHeatMap />
						</div>
						<TablePaginatedExpand setSelectedRows={setSelectedExperiments} selectedRows={selectedExperiments} data={experiments} keyField='uid' columns={TopPerformingLabels} expandRowFunction={expandRowFunction} />
					</div>
					<br />
					<div className='download'>
						<div className='d-flex justify-content-start'>
							<TableTitle title="Download" tooltip={'downlodable data'} />
							<CircleLoader loading={loading} size='30' />
						</div>
						<ul style={{ listStyleType: 'disc' }}>
							<li>
								<span style={{ cursor: 'pointer' }} onClick={handleDownloadTopExperiments}> Experiments with genes scoring above </span>
								<input type='number' min='-10' max='30' value={topExperimentsThreshold} onChange={e => setTopExperimentsThreshold(e.target.value)} />
								.
							</li>
							<li>
								<div style={{ cursor: 'pointer' }} onClick={handleDownloadAllTopExperiments}>All experiments.</div>
							</li>
						</ul>
					</div>
				</div>
			</Content>
			<Footer />
		</Aux>
	)
}

export default GenomeLandingPage;