import React, { useEffect, useRef, useState } from 'react';
import Aux from '../../hoc/Aux';
import axios from 'axios';
import FitnessLandscapeD3 from '../D3Components/FitnessLandscapeD3';
import Select from 'react-select'
import AsyncSelect from 'react-select/async'
import { useLocation } from 'react-router-dom';
import downloadSvg from 'svg-crowbar';
import { downloadObjectAsCSV, downloadObjectAsJSON } from '../../helper/helperFunctions';

const range = 10000;
const zoom = 0.2

// HELPER FUNCTIONS.
function findRange({ pos_from, pos_to }) {

	let interval = (pos_to - pos_from) / 2;
	let mid = pos_from + interval;
	let s = Math.round(mid - (range / 2));
	let f = Math.round(mid + (range / 2));
	return { s, f }
}

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
	return new URLSearchParams(useLocation().search);
}

function FitnessGraph() {

	const [data, setData] = useState([])
	const [position, setPosition] = useState({ start: 0, end: 0 })
	const currentGeneId = useRef(null)
	const svgElement = useRef(null)
	const [organisms, setOrganisms] = useState([])
	const [selectedOrganism, setSelectedOrganism] = useState(null)
	const [experiments, setExperiments] = useState([])
	const [selectedExperiment, setSelectedExperiment] = useState(null)
	let location = useLocation();


	useEffect(() => {
		let params = new URLSearchParams(location.search)
		setSelectedOrganism(params.get("genome_id"))
		setSelectedExperiment(params.get("experiment_id"))
		currentGeneId.current = params.get("gene_id")
		if (currentGeneId.current) {
			changeCurrent(currentGeneId.current)
		}

	}, location)

	// Getting organisms.
	useEffect(() => {
		const fetchOrganisms = async () => {
			// let res = await axios('organisms', { baseURL: '/' })
			let res = await axios.post('/v2/api/query/0')
			setOrganisms(res.data)
		}
		fetchOrganisms();
	}, [])

	// Getting extepriments.
	useEffect(() => {
		const fetchExperiment = async () => {
			// let res = await axios(`organisms/${selectedOrganism}/experiments`, { baseURL: '/' })
			let res = await axios.post('/v2/api/query/3', { 'genome_id': selectedOrganism })
			setExperiments(res.data)
		}

		if (organisms.length == 0) return
		fetchExperiment();
	}, [selectedOrganism])

	// used to query genes.
	let getGenes = async (start) => {

		if (experiments.length == 0) return

		try {
			let res = await axios.post(`/v2/api/query/25`, {
				'genome_id': selectedOrganism,
				'gene_name': start
			})

			console.log(res.data)
			return res.data.map(e => ({ value: e['gene_id'], label: e['gene_name'] }))
		} catch (err) {
			console.log(err)
			return []
		}
	}

	// Changing the graph.
	useEffect(() => {

		async function fetchGraphData() {

			let data = { geneData: null, fragmentData: null };

			let res1 = await axios.post('/v2/api/query/22',
				{
					genome_id: parseInt(selectedOrganism),
					exp_id: parseInt(selectedExperiment),
					pos_from: parseInt(position.start),
					pos_to: parseInt(position.end)
				}
			)
			data.geneData = res1.data.map(e => {
				e['posFrom'] = e['pos_from']
				e['posTo'] = e['pos_to']
				return e
			});

			let res2 = await axios.post('/v2/api/query/23', {
				genome_id: parseInt(selectedOrganism),
				exp_id: parseInt(selectedExperiment),
				pos_from: parseInt(position.start),
				pos_to: parseInt(position.end)
			})
			data.fragmentData = res2.data.map(e => {
				e['posFrom'] = e['pos_from']
				e['posTo'] = e['pos_to']
				return e
			});

			setData(data);
		}

		if (!currentGeneId) return
		fetchGraphData()

	}, [position])


	// change the current showing gene_id.
	async function changeCurrent(gene_id) {

		currentGeneId.current = gene_id

		// let res = await axios(`/api/getGenes/${gene_id}`, { baseURL: '/' })
		let res = await axios.post('/v2/api/query/19', { 'gene_id': parseInt(gene_id) })
		let { s, f } = findRange(res.data[0]);

		setPosition({ start: s, end: f })
	}

	async function handleClickDownloadFragmentsCSV() {
		let res = await axios.post('/v2/api/query/26', {
			'library_id': parseInt(selectedOrganism),
			'experiment_id': parseInt(selectedExperiment),
			'frag_start': parseInt(position.start),
			'frag_stop': parseInt(position.end)
		})
		let libraryName = res.data.shift()['name']
		let experimentId = res.data.shift()['itnum']
		downloadObjectAsCSV(res.data, `lib(${libraryName})_experiment(${experimentId})_fragments(${position.start} - ${position.end})`)
	}

	async function handleClickDownloadFragmentsJSON() {
		let res = await axios.post('/v2/api/query/26', {
			'library_id': parseInt(selectedOrganism),
			'experiment_id': parseInt(selectedExperiment),
			'frag_start': parseInt(position.start),
			'frag_stop': parseInt(position.end)
		})
		let libraryName = res.data.shift()['name']
		let experimentId = res.data.shift()['itnum']
		downloadObjectAsJSON(res.data, `lib(${libraryName})_experiment(${experimentId})_fragments(${position.start} - ${position.end})`)
	}


	return (
		<Aux>
			<div className='d-flex justify-content-between align-items-end'>
				<div className={'w-50'}>
					<Select placeholder={"Select Organism"}
						defaultValue={selectedOrganism}
						// value={selectedOrganism}
						options={organisms.map(e => ({ value: e['genome_id'], label: e['name'] }))}
						onChange={e => setSelectedOrganism(e.value)} />
					<Select placeholder={"Select Experiment"}
						defaultValue={selectedExperiment}
						isDisabled={!selectedOrganism}
						options={experiments.map(e => ({ value: e['barseq_experiment_id'], label: e['name'] }))}
						onChange={e => setSelectedExperiment(e.value)} />
					<AsyncSelect placeholder={"Select Genes"}
						isDisabled={!selectedExperiment}
						loadOptions={getGenes}
						onChange={gene => changeCurrent(gene.value)} />
				</div>
				<div className='w-25'>
					<button className='btn'
						onClick={() => changeCurrent(parseInt(currentGeneId.current) - 1)}
						style={{ backgroundColor: "#fa7f72", color: "#ffffff" }} >←</button>
					<button className='btn'
						onClick={() => changeCurrent(parseInt(currentGeneId.current) + 1)}
						style={{ backgroundColor: "#fa7f72", color: "#ffffff" }} >→</button>
				</div>
				<div className='w-25'>
					<button className='btn'
						onClick={() => {
							let shift = (position.end - position.start) * zoom
							setPosition({ start: parseInt(position.start - shift), end: parseInt(position.end + shift) })
						}}
						style={{ backgroundColor: "#0062cc", color: "#ffffff" }} >-</button>
					<button className='btn'
						onClick={() => {
							let shift = (position.end - position.start) * (zoom ** 2)
							setPosition({ start: parseInt(position.start + shift), end: parseInt(position.end - shift) })
						}}
						style={{ backgroundColor: "#0062cc", color: "#ffffff" }} >+</button>
					<button className='btn'
						onClick={() => changeCurrent(currentGeneId.current)}
						style={{ backgroundColor: "#0062cc", color: "#ffffff" }} >Reset</button>
				</div>
				<div>
					<button className='btn btn-info'
						onClick={() => {
							downloadSvg(svgElement.current, 'geneExperimentGenome.svg');
						}}
					>SVG</button>
				</div>

			</div>
			<div id='fitness' style={{ backgroundColor: '#eeeeee', width: '100%', borderRadius: '10px', padding: '5px' }}>
				<FitnessLandscapeD3
					xAxisLable="Position along the genome (bp)"
					yAxisLable="Fragment Fitness Score"
					data={data}
					current={data.geneData ? data.geneData.filter(gene => (gene.gene_id == currentGeneId.current)).shift() : {}}
					handleClickGene={changeCurrent}
					reference={svgElement}
				/>
			</div>
			<br />
			<div className='download'>
				<h2>Downloads</h2>
				<ul style={{ listStyleType: 'disc' }}>
					<li><div style={{ cursor: 'pointer' }} onClick={() => {
						downloadSvg(svgElement.current, 'geneExperimentGenome.svg');
					}}>download picture (SVG)</div></li>
					<li><div style={{ cursor: 'pointer' }} onClick={() => {
						handleClickDownloadFragmentsCSV()
					}}>download fragments (CSV)</div></li>
					<li><div style={{ cursor: 'pointer' }} onClick={() => {
						handleClickDownloadFragmentsJSON()
					}}>download fragments (JSON)</div></li>
				</ul>
			</div>
		</Aux>
	)
}

export default FitnessGraph;