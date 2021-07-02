import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import Chart from "react-apexcharts";
import axios from 'axios';
import { color } from 'd3';
import { useLocation } from 'react-router-dom';


function HeatMap() {

	const [data, setData] = useState([])
	const [organisms, setOrganisms] = useState([]);
	const [selectedOrganism, setSelectedOrganism] = useState(null)
	const [experiments, setExperiments] = useState([])
	const [selectedExperiments, setSelectedExperiment] = useState([])
	const [selectedGenes, setSelectedGenes] = useState([])
	let location = useLocation();

	async function fetchHeatMapData() {
		let res = await axios.post(`/api/heatmap/${selectedOrganism}`, {
			geneIds: selectedGenes,
			experimentIds: selectedExperiments
		})
		console.log(res.data)
		let series = {}
		res.data.forEach((d) => {
			// if column does not exist
			if (!series[d['condition_name']]) {
				series[d['condition_name']] = []
			}
			// if the column already exists add a row
			let arr = series[d['condition_name']]
			arr.push({
				x: d['gene_name'] ? d['gene_name'] : d['locus_tag'],
				y: Math.round(d['score'] * 1000) / 1000
			})

		})

		// console.log(series)

		let array = []
		Object.keys(series).forEach((columnName) => array.push({ name: columnName, data: series[columnName] }))

		setData(array)
	}

	useEffect(() => {
		
		let params = new URLSearchParams(location.search)
		setSelectedOrganism(Number(params.get("genome_id")))
		setSelectedExperiment(params.getAll("experiment_ids").map(d => Number(d)))
		setSelectedGenes(params.getAll("gene_ids").map(d => Number(d)))

	}, [])

	useEffect(() => {

		console.log(selectedOrganism)
		console.log(selectedExperiments)
		console.log(selectedGenes)

		if (selectedOrganism == null || selectedExperiments.length == 0 || selectedGenes.length == 0) return

		fetchHeatMapData()
	}, [selectedExperiments, selectedGenes, location])

	// Getting organisms.
	useEffect(() => {
		const fetchOrganisms = async () => {
			let res = await axios.post('/v2/api/query/0')
			setOrganisms(res.data)
		}
		fetchOrganisms();
	}, [])

	// Getting extepriments.
	useEffect(() => {
		if (!selectedOrganism) return
		const fetchExperiment = async () => {
			let res = await axios.post('/v2/api/query/3', { 'genome_id': selectedOrganism })
			// console.log(res.data)
			setExperiments(res.data)
		}

		if (organisms.length == 0) return
		fetchExperiment();
	}, [selectedOrganism])

	// used to query genes.
	let getGenes = async (start) => {

		if (!selectedOrganism) return

		try {
			// let res = await axios(`organisms/${selectedOrganism}/genes/${start.toLowerCase()}`)
			let res = await axios(`/api/organisms/${parseInt(selectedOrganism)}/genes/${start.toLowerCase()}`)
			console.log(res.data)
			return res.data.map(e => ({ value: e['gene_id'], label: e['name'] }))
		} catch (err) {
			console.log(err)
			return []
		}
	}

	return (
		<div>
			<Select placeholder={"Select Organism"}
				options={organisms.map(e => ({ value: e['genome_id'], label: e['name'] }))}
				onChange={e => setSelectedOrganism(e.value)} />
			<Select placeholder={"Select Experiment"}
				isDisabled={!selectedOrganism}
				isMulti={true}
				options={experiments.map(e => ({ value: e['barseq_experiment_id'], label: e['name'] }))}
				onChange={d => setSelectedExperiment(d.map(row => row['value']))} />
			<AsyncSelect placeholder={"Select Genes"}
				isDisabled={!selectedOrganism}
				isMulti={true}
				loadOptions={getGenes}
				onChange={d => setSelectedGenes(d.map(row => row['value']))} />
			<Chart
				options={{
					plotOptions: {
						heatmap: {
							// colors: ["#00A100"]
							colorScale: {
								min: -7,
								max: 16,
								ranges: [{
									from: -7,
									to: 0,
									color: '#a10000',
									name: 'negative'
								}, {
									from: 0,
									to: 4,
									color: '#9c9c00',
									name: 'low'
								}, {
									from: 4,
									to: 16,
									color: '#00A100',
									name: 'high'
								}
								]
							}
						}
					}
				}}
				series={data}
				type="heatmap"
				width="75%"
			/>
		</div>
	)
}

export default HeatMap;