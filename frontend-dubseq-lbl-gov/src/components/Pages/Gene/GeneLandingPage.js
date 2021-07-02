import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios'
import Header from '../../UI/Header/Header';
import Content from '../../../hoc/Content/Content';
import Aux from '../../../hoc/Aux';
import Title from '../../UI/Title/Title';
import TableHorizontal from '../../UI/Table/TableHorizontal';
import Footer from '../../UI/Footer/Footer';
import { Link } from 'react-router-dom';
import TableReactPaginated from '../../UI/Table/TableReactPaginated';
import TablePaginatedExpand from '../../UI/Table/TablePaginatedExpand';

function GeneLandingPage() {

	const { id } = useParams()
	const [genes, setGenes] = useState([])
	const [stats, setStats] = useState(null)
	const [experiments, setExperiments] = useState([])
	const [fragmenExperiments, setFragmentExperiments] = useState([])


	useEffect(() => {

		let fetchData = async () => {

			// let res1 = await axios(`/api/getGenes/${id}`)
			let res1 = await axios.post('/v2/api/query/19', { "gene_id": parseInt(id) })
			setStats(res1.data)

			// let res2 = await axios(`/api/getTopGeneExperiments/${id}`)
			let res2 = await axios.post('/v2/api/query/21', { "gene_id": parseInt(id) })
			res2 = addLink(res2.data, 'name', ['barseq_experiment_id'], '/bagseq/libraries/1/experiments/?')
			setExperiments(res2)

			// let res3 = await axios(`/api/getGeneFragmentsExperiments/${id}`)
			let res3 = await axios.post('/v2/api/query/20', { "gene_id": parseInt(id) })
			res3 = addLink(res3.data, 'name', ['barseq_experiment_id'], '/bagseq/libraries/1/experiments/?')
			setFragmentExperiments(res3)
		}

		fetchData()
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
			dataField: 'gene_id',
			text: 'ID'
		},
		{
			dataField: 'name',
			text: 'Name'
		},
		{
			dataField: 'locus_tag',
			text: 'Locus Tag'
		},
		{
			dataField: 'pos_from',
			text: 'Position From'
		},
		{
			dataField: 'pos_to',
			text: 'Position To'
		},
		{
			dataField: 'strand',
			text: 'Strand'
		},
		{
			dataField: 'product',
			text: 'Product'
		},
		{
			dataField: 'fragment_coverage',
			text: 'Fragment Coverage'
		},
	]

	let ExperimentLabels = [
		{
			dataField: 'name',
			text: 'Condition',
			sort: true
		},
		{
			dataField: 'type',
			text: 'Type',
			sort: true
		},
		{
			dataField: 'barseq_experiment_id',
			text: 'ID',
			sort: true
		},
		{
			dataField: 'score_cnnls',
			text: 'Score',
			sort: true
		}
	]

	let FragmentExperiments = [
		{
			dataField: 'name',
			text: 'Name',
			sort: true
		},
		{
			dataField: 'barseq_experiment_id',
			text: 'ID',
			sort: true
		},
		{
			dataField: 'type',
			text: 'Type',
			sort: true
		},
		{
			dataField: 'barcode',
			text: 'Barcode',
			sort: true
		},
		{
			dataField: 'bagseq_fragment_id',
			text: 'FragID',
			sort: true
		},
		{
			dataField: 'score',
			text: 'Score',
			sort: true
		}
	]

	let GeneCoverageLabels = [
		{
			dataField: 'bagseq_fragment_id',
			text: 'ID',
			sort: true
		},
		{
			dataField: 'barcode',
			text: 'Barcode',
			sort: true
		},
		{
			dataField: 'score',
			text: 'Score',
			sort: true
		}
	]

	let expandRowFunction = (row, row_ind) => {
		let genome_id = row['bagseq_library_id']
		let experiment_id = row['barseq_experiment_id']
		let gene_id = stats[0]['gene_id']
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
			<Header title='Genes' />
			<Content>
				<div className='container'>
					{stats && <Title title='Gene' specific={stats[0]['name']} />}
					{stats && <TableHorizontal content={stats} labels={StatsLabels} title="General Information" />}
					<br />
					<h4 style={{ fontWeight: "700", marginBottom: "30px" }}>Experiments</h4>
					<TablePaginatedExpand data={experiments} keyField="name" columns={ExperimentLabels} expandRowFunction={expandRowFunction} />
					<br />
					<h4 style={{ fontWeight: "700", marginBottom: "30px" }}>Fragment Experiments</h4>
					<TableReactPaginated data={fragmenExperiments} keyField="barcode" columns={FragmentExperiments} />
					<br />
				</div>
			</Content>
			<Footer />
		</Aux>
	)
}

export default GeneLandingPage;