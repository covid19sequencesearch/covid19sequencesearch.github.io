import React, {Component} from 'react';
import {store} from "app.jsx";
import * as actionCreators from 'actions/actions';
import {connect} from "react-redux";
import ReactGA from 'react-ga';
import JSZip from 'jszip';

class Filter extends Component {
  onFilterSubmit(event) {
    event.preventDefault();
    const state = store.getState();
    if (state.filter) {
      store.dispatch(actionCreators.onFilterResult());
    }
  }

  onFilterReset(event) {
    event.preventDefault();
    const state = store.getState();
    if (state.sequence) {
      store.dispatch(actionCreators.onClearResult());
      store.dispatch(actionCreators.onSubmit(state.sequence, this.props.databases));
    }
  }

  filterClickTrack(value){
    const trackingID = this.props.customStyle && this.props.customStyle.trackingID ? this.props.customStyle.trackingID : "";
    trackingID ? ReactGA.initialize(trackingID) : '';
    trackingID ? ReactGA.event({ category: 'filter', action: 'click', label: value }) : '';
  }

  onDownload() {
    // create sequence folder
    let zip = new JSZip();
    let FileSaver = require('file-saver');
    let sequenceFolder = zip.folder("sequences");

    // create text file with the results
    let textData = "Query: " + this.props.sequence + "\n" + "\n" +
      "Number of hits: " + this.props.downloadEntries.length + "\n" + "\n" +
      this.props.downloadEntries.map((entry, index) => (
        ">> " + entry.rnacentral_id + " " + entry.description + "\n" +
        "E-value: " + entry.e_value.toExponential() + "\t" +
        "Identity: " +  `${parseFloat(entry.identity).toFixed(2)}%` + "\t" +
        "Query coverage: " + `${parseFloat(entry.query_coverage).toFixed(2)}%` + "\t" +
        "Gaps: " + `${parseFloat(entry.gaps).toFixed(2)}%` + "\n" + "\n" +
        "Alignment: " + "\n" + entry.alignment + "\n" + "\n" + "\n"
      ))
    textData = textData.replace(/,>>/g, '>>')
    let textfile = new Blob([textData], {type: 'text/plain'})
    sequenceFolder.file('similar-sequences.txt', textfile)

    // create json file with the results
    let jsonData = {
      "query": this.props.sequence,
      "hits": this.props.downloadEntries.length,
      "results": [
        this.props.downloadEntries.map((entry, index) => (
          {
            "description": entry.description,
            "e-value": entry.e_value.toExponential(),
            "identity": `${parseFloat(entry.identity).toFixed(2)}%`,
            "query_coverage": `${parseFloat(entry.query_coverage).toFixed(2)}%`,
            "gaps": `${parseFloat(entry.gaps).toFixed(2)}%`,
            "alignment": entry.alignment
          }
        ))
      ]
    }
    let jsonFile = new Blob([JSON.stringify(jsonData)], {type: 'application/json'});
    sequenceFolder.file('similar-sequences.json', jsonFile)

    // get current date/time
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + ' ' + time;

    // create json file with metadata
    let dataPackage = {
      "homepage": "https://covid19sequencesearch.github.io/",
      "jobId": this.props.jobId,
      "title": "Betacoronavirus sequence similarity search results",
      "description": "The search found " + this.props.downloadEntries.length + " similar sequences. covid19sequencesearch.github.io is produced and maintained by the RNAcentral team at EMBL-EBI.",
      "version": "1.1",
      "download_date": dateTime,
      "sources": [{
        "name": "NCBI BLAST database",
        "web": "https://www.ncbi.nlm.nih.gov"
      }],
      "resources": [
        {
          "name": "similar-sequences",
          "path": "sequences/similar-sequences.txt",
          "description": "Results file in text format",
          "format": "txt",
          "mediatype": "text/txt",
          "encoding": "ASCII",
        },
        {
          "name": "similar-sequences",
          "path": "sequences/similar-sequences.json",
          "description": "Results file in JSON format",
          "format": "json",
          "mediatype": "application/json",
          "encoding": "ASCII",
        }
      ],
      "maintainers": [{
        "name": "RNAcentral",
        "web": "https://rnacentral.org"
      }],
      "datapackage_version": "1.0",
    }
    let dataPackageFile = new Blob([JSON.stringify(dataPackage)], {type: 'application/json'});
    zip.file('datapackage.json', dataPackageFile)

    // download zip file
    zip.generateAsync({type:"blob"}).then(function(content) {
      FileSaver.saveAs(content, "data.zip");
    });
  }

  render() {
    const fixCss = this.props.customStyle && this.props.customStyle.fixCss && this.props.customStyle.fixCss === "true" ? "1.5rem" : "";

    return (
      <div className="row" key={`filter-div`}>
        <div className="col-sm-4">
          <form onSubmit={(e) => this.onFilterSubmit(e)} onReset={(e) => this.onFilterReset(e)}>
            <div className="input-group">
              <input className="form-control" style={{fontSize: fixCss}} type="text" value={this.props.filter} onChange={(e) => this.props.onFilterChange(e)} placeholder="Text search within results"/>
              <button type="submit" onClick={() => this.filterClickTrack('filter')} className={`btn btn-outline-secondary ${!this.props.filter && "disabled"}`} style={{fontSize: fixCss}}>Filter</button>
              <button type="reset" onClick={() => this.filterClickTrack('clear')} className={`btn btn-outline-secondary ${!this.props.filter && "disabled"}`} style={{fontSize: fixCss}}>Clear</button>
            </div>
          </form>
        </div>
        <div className="col-sm-3">
          <select className="form-select" style={{fontSize: fixCss}} value={this.props.sortingOrder} onChange={this.props.onSort}>
            <option value="e_value">Sort by E-value (min to max) - default</option>
            <option value="-e_value">Sort by E-value (max to min)</option>
            <option value="-identity">Sort by Identity (max to min)</option>
            <option value="identity">Sort by Identity: (min to max)</option>
            <option value="-query_coverage">Sort by Query coverage: (max to min)</option>
            <option value="query_coverage">Sort by Query coverage: (min to max)</option>
            <option value="-target_coverage">Sort by Target coverage: (max to min)</option>
            <option value="target_coverage">Sort by Target coverage: (min to max)</option>
          </select>
        </div>
        <div className="col-sm-5">
          <button className="btn btn-outline-secondary mr-1" style={{fontSize: fixCss}} onClick={this.props.onToggleAlignmentsCollapsed}>{this.props.alignmentsCollapsed ? 'Show alignments' : 'Hide alignments'}</button>
          <button className="btn btn-outline-secondary mr-1" style={{fontSize: fixCss}} onClick={this.props.onToggleDetailsCollapsed}>{this.props.detailsCollapsed ? 'Show details' : 'Hide details'}</button>
          <button className="btn btn-outline-secondary" style={{fontSize: fixCss}} onClick={() => this.onDownload()} disabled={this.props.downloadStatus === "success" ? "" : "disabled"}>{this.props.downloadStatus === "success" ? "Download" : <span><span className={`spinner-border ${fixCss ? '' : 'spinner-border-sm'}`} role="status" aria-hidden="true"></span> Loading</span>}</button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    alignmentsCollapsed: state.alignmentsCollapsed,
    detailsCollapsed: state.detailsCollapsed,
    filter: state.filter,
    jobId: state.jobId,
    sequence: state.sequence,
    downloadStatus: state.downloadStatus,
    downloadEntries: state.downloadEntries,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onToggleAlignmentsCollapsed: () => dispatch({ type: 'TOGGLE_ALIGNMENTS_COLLAPSED' }),
    onToggleDetailsCollapsed: () => dispatch({ type: 'TOGGLE_DETAILS_COLLAPSED' }),
    onSort: (event) => dispatch(actionCreators.onSort(event)),
    onFilterChange: (event) => dispatch(actionCreators.onFilterChange(event)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Filter);
