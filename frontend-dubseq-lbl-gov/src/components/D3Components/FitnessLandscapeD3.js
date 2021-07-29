import React, { useEffect, useRef } from 'react';
import Aux from '../../hoc/Aux';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { max, min } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import './FitnessGraph.css'

const margin = { top: 100, right: 20, bottom: 50, left: 50 };

let graphWidth = 0;
let graphHeight = 0;

const totalGraphWidth = 1000
const totalGraphHeight = 600

let minGenePos;
let maxGenePos;

function round(number, to) {

	number = Math.floor(number * Math.pow(10, to))
	return number / Math.pow(10, to)
}

function FitnessLandscapeD3(props) {

	const initialized = useRef(false);

	useEffect(() => {
		if (initialized.current) {
			updateGraph();
		} else {
			initialize();
			initialized.current = true;
		}
		// eslint-disable-next-line
	}, [props.data])

	function initialize() {

		graphWidth = totalGraphWidth - margin.left - margin.right;
		graphHeight = totalGraphHeight - margin.top - margin.bottom;

		let svg = select('.canvas')

		let defs = svg.append('defs')
		defs.append('marker')
			.attr('id', 'arrowGray')
			.attr('viewBox', '0 0 5 5')
			.attr('refX', 5)
			.attr('refY', 2.5)
			.attr('markerWidth', 5)
			.attr('markerHeight', 3)
			.attr('orient', 'auto-start-reverse')
			.append('path')
			.attr('d', 'M0,0L5,2.5L0,5')
			.attr('stroke', 'gray')
			.style('fill', 'gray');
		defs.append('marker')
			.attr('id', 'arrowRed')
			.attr('viewBox', '0 0 5 5')
			.attr('refX', 5)
			.attr('refY', 2.5)
			.attr('markerWidth', 5)
			.attr('markerHeight', 3)
			.attr('orient', 'auto-start-reverse')
			.append('path')
			.attr('d', 'M0,0L5,2.5L0,5')
			.attr('stroke', 'red')
			.style('fill', 'red');


		svg.append('g')
			.attr('class', 'geneChart')
			.attr('width', graphWidth)
			.attr('height', margin.top)
			.attr('transform', `translate(${margin.left}, 50)`);

		let lables = svg.append('g')
			.attr('width', graphWidth)
			.attr('height', graphHeight)
			.attr('transform', `translate(${margin.left}, ${margin.top})`);

		svg.append('g')
			.attr('class', 'fragmentChart')
			.attr('width', graphWidth)
			.attr('height', graphHeight)
			.attr('transform', `translate(${margin.left}, ${margin.top})`);

		lables.append('g')
			.attr('class', 'xAxisGroup')
			.attr('transform', `translate(0, ${graphHeight})`);

		lables.append('g')
			.attr('class', 'yAxisGroup')
			.attr('transfrom', `translate(${graphWidth}, 0)`);

		lables.append("text")
			.attr("transform", `translate(${graphWidth / 2}, ${graphHeight + margin.bottom - 5})`)
			.attr('class', 'label')
			.style('fill', '#181818')
			.style('font-weight', '300')
			.text(props.xAxisLable);

		lables.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 0 - margin.left)
			.attr("x", 0 - (graphHeight / 2))
			.attr("dy", "1em")
			.attr('class', 'label')
			.style('fill', '#181818')
			.style('font-weight', '300')
			.text(props.yAxisLable);

	}

	function colorFrags(posFrom, posTo) {
		if ((posTo > props.current.pos_to) && (posFrom < props.current.pos_from)) {
			return "blue"
		}
		return 'gray'
	}

	function colorGenes(name) {
		if (name == props.current.name) {
			return 'red'
		}
		return 'gray'
	}

	function drawFragments(fragmentChart, xScale, yScale) {
		// Removing all from unused remove selection
		fragmentChart.selectAll('.fragment_line').remove();

		// Adding fragments
		fragmentChart.selectAll('line')
			.data(props.data.fragmentData)
			.enter()
			.append('line')
			.attr('class', 'fragment_line')
			.attr('x1', d => xScale(d.posFrom))
			.attr('x2', d => xScale(d.posTo))
			.attr('y1', d => yScale(d.score))
			.attr('y2', d => yScale(d.score))
			.style('stroke', d => colorFrags(d.posFrom, d.posTo))
			.style('stroke-width', 2)
			.on('mouseover', handleMouseOverFragment)
			.on('mouseout', handleMouseOffFragment)

	}

	function handleMouseOverFragment(d, i) {

		select(this)
			.style('stroke-width', 4)

		// TODO make the id of dot labels more unique
		select(this.parentNode).append('text')
			.attr('id', "fragment_label")
			.attr('x', this.getAttribute('x1'))
			.attr('y', this.getAttribute('y1') - 5)
			.text(`${i['pos_from']} - ${i['pos_to']} (bp)`)
	}

	function handleMouseOffFragment(d, i) {

		select(this)
			.style('stroke-width', 2)

		select('#fragment_label').remove()
	}


	function updateGraph() {

		minGenePos = min(props.data.fragmentData, d => d.posFrom);
		maxGenePos = max(props.data.fragmentData, d => d.posTo);

		// eslint-disable-next-line
		let minScore = min(props.data.fragmentData, d => d.score);
		// eslint-disable-next-line
		let maxScore = max(props.data.fragmentData, d => d.score);

		let xScale = scaleLinear()
			.domain([minGenePos, maxGenePos])
			.range([0, graphWidth]);

		let maxFragScore = props.data.fragmentData.map(row => row['score']).reduce((0, (f, s) => (f > s ? f : s)), 0)
		// HardCode the minimum and the maximum of possible fragment scores.
		let yScale = scaleLinear()
			.domain([-5, maxFragScore > 12 ? maxFragScore + 2 : 12])
			.range([graphHeight, 0]);

		// Suggest the number of ticks with axis().ticks(#)
		let xAxis = axisBottom(xScale).ticks(10);
		select('.xAxisGroup').call(xAxis);
		let yAxis = axisLeft(yScale);
		select('.yAxisGroup').call(yAxis);

		let fragmentChart = select('.fragmentChart');

		drawFragments(fragmentChart, xScale, yScale)

		let geneChart = select('.geneChart')

		// Remove all children of the 'g' being updated
		geneChart.selectAll('g').remove();

		// Adding blocks to hold gene and names
		geneChart.selectAll('g')
			.data(props.data.geneData)
			.enter()
			.append('g')
			.attr('class', 'geneTag')
			.attr('width', d => (xScale(d.posTo) - xScale(d.posFrom)))
			.attr('transform', d => `translate(${xScale(d.posFrom)}, 0)`)
			.style('cursor', 'pointer')
			.on('mouseover', function () {
				select(this).style('font-weight', 600)
			})
			.on('mouseout', function () {
				select(this).style('font-weight', 400)
			})
			.on('click', (i, d) => props.handleClickGene(d['gene_id']));


		// adding gene lines
		geneChart.selectAll('.geneTag')
			.append('line')
			.attr('x1', 2)
			.attr('x2', d => (xScale(d.posTo) - xScale(d.posFrom) - 2))
			.style('stroke', d => colorGenes(d.name))
			.style('stroke-width', 2)
			.attr('marker-start', d => ((d.strand === '+') ? '' : (d.name == props.current.name ? 'url(#arrowRed)' : 'url(#arrowGray)')))
			.attr('marker-end', d => ((d.strand === '-') ? '' : (d.name == props.current.name ? 'url(#arrowRed)' : 'url(#arrowGray)')));

		// adding gene name
		geneChart.selectAll('.geneTag')
			.append('text')
			.attr('transform', d => `translate(${(xScale(d.posTo) - xScale(d.posFrom)) / 2 - 15}, -5 )`)
			// .attr('transform', 'rotate(-45)')
			.attr('y', -3)
			.attr("text-anchor", 'start')
			.attr("alignment-baseline", 'ideographic')
			.text(d => d.name);

		// remove genetags that are no longer in selection 
		geneChart.selectAll('g')
			.data(props.data.geneData)
			.exit()
			.remove();

		fragmentChart.selectAll('.gene_score').remove();

		if (props.current) {
			fragmentChart.selectAll('.gene_score')
				.data([props.current])
				.enter()
				.append('line')
				.attr('class', 'gene_score')
				.attr('x1', xScale(minGenePos))
				.attr('x2', xScale(maxGenePos))
				.attr('y1', d => yScale(d.score_cnnls))
				.attr('y2', d => yScale(d.score_cnnls))
				.style('stroke', 'red')
				.style('stroke-width', 2)
				.style('stroke-dasharray', '5, 10')
		}

		fragmentChart.select('#currentGeneLabel').remove()

		let currentGeneLabel = fragmentChart.append('g')
			.attr('id', 'currentGeneLabel')
			.attr('transform', `translate(20, ${maxFragScore < 6 ? 10 : maxFragScore - 30})`)

		// currentGeneLabel.append('rect')
		// 	.attr('height', 40)
		// 	.attr('width', 300)
		// 	.attr('rx', 2)
		// 	.attr('ry', 2)
		// 	.style('stroke-width', 1)
		// 	.style('stroke', 'black')
		// 	.style('fill', 'none')

		if (props.current) {

			currentGeneLabel.append('text')
				.attr('y', 20)
				.attr('x', 10)
				.text(`Regression gene score ${props.current.name} = ${round(props.current.score_cnnls, 2)}`)
		}
	}



	return (
		<Aux>
			<svg ref={props.reference} className='canvas' viewBox={`0 0 ${totalGraphWidth} ${totalGraphHeight}`} />
		</Aux>
	)
}

export default FitnessLandscapeD3;