import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Card from './card.jsx';
import JSONSchemaForm from '../../lib/js/react-jsonschema-form';

export default class editToCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 1,
      dataJSON: {},
      mode: "col7",
      publishing: false,
      schemaJSON: undefined,
      fetchingData: true,
      optionalConfigJSON: {},
      optionalConfigSchemaJSON: undefined,
      uiSchemaJSON: {}
    }
    this.toggleMode = this.toggleMode.bind(this);
  }

  exportData() {
    let getDataObj = {
      step: this.state.step,
      dataJSON: this.state.dataJSON,
      schemaJSON: this.state.schemaJSON,
      optionalConfigJSON: this.state.optionalConfigJSON,
      optionalConfigSchemaJSON: this.state.optionalConfigSchemaJSON
    }
    getDataObj["name"] = getDataObj.dataJSON.data.title.substr(0,225); // Reduces the name to ensure the slug does not get too long
    return getDataObj;
  }

  componentDidMount() {
    // get sample json data based on type i.e string or object.
    if (this.state.fetchingData){
      axios.all([
        axios.get(this.props.dataURL),
        axios.get(this.props.schemaURL),
        axios.get(this.props.optionalConfigURL),
        axios.get(this.props.optionalConfigSchemaURL),
        axios.get(this.props.uiSchemaURL)
      ])
      .then(axios.spread((card, schema, opt_config, opt_config_schema, uiSchema, linkSources) => {
        let stateVars = {
          fetchingData: false,
          dataJSON: card.data,
          schemaJSON: schema.data,
          optionalConfigJSON: opt_config.data,
          optionalConfigSchemaJSON: opt_config_schema.data,
          uiSchemaJSON: uiSchema.data
        };

        this.setState(stateVars);
      }));
    }
  }

  onChangeHandler({formData}) {
    switch (this.state.step) {
      case 1:
        this.setState((prevState, prop) => {
          // Manipulate dataJSON
          let dataJSON = prevState.dataJSON;
          dataJSON.data.title = formData; 
          
          return {
            dataJSON: dataJSON
          }
        })
        break;
      case 2:
        this.setState((prevState, prop) => {
          // Manipulate dataJSON
          let dataJSON = prevState.dataJSON;
          dataJSON.data.Overview = formData;
          return {
            dataJSON: dataJSON
          }
        })
        break;
      case 3:
        this.setState((prevState, prop) => {
          // Manipulate dataJSON
          let dataJSON = prevState.dataJSON;
          dataJSON.data.Details = formData;
          return {
            dataJSON: dataJSON
          }
        })
        break;  
      case 4:
        this.setState((prevState, prop) => {
          // Manipulate dataJSON
          let dataJSON = prevState.dataJSON;
          dataJSON.data.Narrative = formData;
          return {
            dataJSON: dataJSON
          }
        })
        break;
      case 5:
        this.setState((prevState, prop) => {
          // Manipulate dataJSON
          let dataJSON = prevState.dataJSON;
          dataJSON.data.Sources = formData;
          return {
            dataJSON: dataJSON
          }
        })
        break;
       case 6:
        this.setState((prevState,prop)=>{
          let dataJSON = prevState.dataJSON;
          dataJSON.data.explore_url = formData;
          return{
            dataJSON : dataJSON
          }
        })
        break;   
    }
  }

  onSubmitHandler({formData}) {
    switch(this.state.step) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        this.setState((prevStep,prop)=>{ step: ++prevStep.step });
        break;
      case 6:
        if (typeof this.props.onPublishCallback === "function") {
          let dataJSON = this.state.dataJSON;
          dataJSON.data.section = dataJSON.data.title;
          this.setState({ publishing: true, dataJSON: dataJSON });
          let publishCallback = this.props.onPublishCallback();
          publishCallback.then((message) => {
            this.setState({ publishing: false });
          });
        }
        break;
    }
  }


  renderSEO() {
    let d = this.state.dataJSON.data;

    let blockquote_string = `<h1>${d.title}</h1>`;
    // Create blockqoute string.
    blockqoute_string += `<p>${d.Overview.reasons}</p>`;
    blockqoute_string += `<p>${d.Overview.village}</p>`;
    blockqoute_string += `<p>${d.Overview.district}</p>`;
    blockqoute_string += `<p>${d.Overview.sector}</p>`;
    blockqoute_string += `<p>${d.Overview.province}</p>`;
    blockqoute_string += `<p>${d.Overview.noHouseholds}</p>`;
    blockqoute_string += `<p>${d.Overview.investment}</p>`;
    blockqoute_string += `<p>${d.Overview.landArea}</p>`;
    blockqoute_string += `<p>${d.Overview.startYear}</p>`;
    blockqoute_string += `<p>${d.Details.parties.state}</p>`;
    blockqoute_string += `<p>${d.Details.parties.corporate}</p>`;
    blockqoute_string += `<p>${d.Details.parties.local}</p>`;
    blockqoute_string += `<p>${d.Details.parties.others}</p>`;
    blockqoute_string += `<p>${d.Details.landtype}</p>`;
    blockqoute_string += `<p>${d.Details.commanLandtype}</p>`;
    blockqoute_string += `<p>${d.Details.HRViolation}</p>`;
    blockqoute_string += `<p>${d.Narrative}</p>`;
    blockqoute_string += `<a>${d.Sources.links}</a>`;
    blockqoute_string += `<a>${d.Sources.sources}</a>`;
    let seo_blockquote = '<blockquote>' + blockquote_string + '</blockquote>'
    return seo_blockquote;
  }

  renderSchemaJSON() {
    let schema;
    switch(this.state.step){
      case 1:
        return this.state.schemaJSON.properties.data.properties.title;
        break;
      // Add more schemas...
      case 2:
        return this.state.schemaJSON.properties.data.properties.overview;
        break;
      case 3:
        return this.state.schemaJSON.properties.data.properties.details;
        break;  
      case 4:
        return this.state.schemaJSON.properties.data.properties.narrative;
        break;
      case 5:
        return this.state.schemaJSON.properties.data.properties.sources;
        break;
      case 6:
        return this.state.schemaJSON.properties.data.properties.explore_url;   
    }
  }

  renderFormData() {

    switch(this.state.step) {
      case 1:
        return this.state.dataJSON.data.title;
        break;
      // Other form data.
      case 2:
        let overview = this.state.dataJSON.data.Overview;
        overview.noHouseholds = parseInt(overview.noHouseholds);
        overview.investment = parseFloat(overview.investment);
        overview.landArea = parseFloat(overview.landArea); 
        return overview;
        break;
      case 3:
        return this.state.dataJSON.data.Details;
        break;
      case 4:
        return this.state.dataJSON.data.Narrative;
        break;    
      case 5: 
        return this.state.dataJSON.data.Sources;
        break;
      case 6:
        return this.state.dataJSON.data.explore_url;
        break;    
    }
  }

  showLinkText() {
    switch(this.state.step) {
      case 1:
        return '';
        break;
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
        return '< Back';
        break;
    }
  }

  showButtonText() {
    switch(this.state.step) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        return 'Next';
        break;
      case 6:
        return 'Publish';
        break;
    }
  }

  getUISchemaJSON() {
    switch (this.state.step) {
      case 1:
        return this.state.uiSchemaJSON.data.title;
        break;
      case 2:
        return this.state.uiSchemaJSON.data.overview;
        break;
      case 3:
        return this.state.uiSchemaJSON.data.details;
        break;
      case 4:
        return this.state.uiSchemaJSON.data.narrative;
        break;
      case 5:
        return this.state.uiSchemaJSON.data.sources;
        break;
      case 6:
        return this.state.uiSchemaJSON.data.explore_url;
        break;    
      default:
        return {};
        break;
    }
  }

  onPrevHandler() {
    let prev_step = --this.state.step;
    this.setState({
      step: prev_step
    });
  }

  toggleMode(e) {
    let element = e.target.closest('a'),
      mode = element.getAttribute('data-mode');

    this.setState((prevState, props) => {
      let newMode;
      if (mode !== prevState.mode) {
        newMode = mode;
      } else {
        newMode = prevState.mode
      }

      return {
        mode: newMode
      }
    })
  }

  render() {
    if (this.state.fetchingData) {
      return(<div>Loading</div>)
    } else {
      return (
        <div className="proto-container">
          <div className="ui grid form-layout">
            <div className="row">
              <div className="four wide column proto-card-form protograph-scroll-form">
                <div>
                  <div className="section-title-text">Fill the form</div>
                  <div className="ui label proto-pull-right">
                    To Land Conflict Watch
                  </div>
                </div>
                <JSONSchemaForm schema={this.renderSchemaJSON()}
                  onSubmit={((e) => this.onSubmitHandler(e))}
                  onChange={((e) => this.onChangeHandler(e))}
                  uiSchema={this.getUISchemaJSON()}
                  formData={this.renderFormData()}>
                  <br/>
                  <a id="protograph-prev-link" className={`${this.state.publishing ? 'protograph-disable' : ''}`} onClick={((e) => this.onPrevHandler(e))}>{this.showLinkText()} </a>
                  <button type="submit" className={`${this.state.publishing ? 'ui primary loading disabled button' : ''} default-button protograph-primary-button`}>{this.showButtonText()}</button>
                </JSONSchemaForm>
              </div>
              <div className="twelve wide column proto-card-preview proto-share-card-div">
                <div className="protograph-menu-container">
                  <div className="ui compact menu">
                    <a className={`item ${this.state.mode === 'col7' ? 'active' : ''}`}
                      data-mode='col7'
                      onClick={this.toggleMode}
                    >
                      col-7
                    </a>
                    <a className={`item ${this.state.mode === 'col4' ? 'active' : ''}`}
                      data-mode='col4'
                      onClick={this.toggleMode}
                    >
                      col-4
                    </a>
                    <a className={`item ${this.state.mode === 'col3' ? 'active' : ''}`}
                      data-mode='col3'
                      onClick={this.toggleMode}
                    >
                      col-3
                    </a>
                  </div>
                </div>
                <div className="protograph-app-holder">
                  <Card
                    mode={this.state.mode}
                    dataJSON={this.state.dataJSON}
                    schemaJSON={this.state.schemaJSON}
                    optionalConfigJSON={this.state.optionalConfigJSON}
                    optionalConfigSchemaJSON={this.state.optionalConfigSchemaJSON}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}
