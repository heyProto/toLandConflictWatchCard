import React from 'react';
import ReactDOM from 'react-dom';
import Card from './src/js/card.jsx';

window.ProtoGraph = window.ProtoGraph || {};
window.ProtoGraph.Card = window.ProtoGraph.Card || {};


ProtoGraph.Card.toRecordLandConflict = function() {
    this.cardType = 'Land Conflict Watch';
}

ProtoGraph.Card.toRecordLandConflict.prototype.init = function(options) {
    this.options = options;
}

ProtoGraph.Card.toRecordLandConflict.prototype.getData = function(data) {
    return this.containerInstance.exportData();
}

ProtoGraph.Card.toRecordLandConflict.prototype.renderCol7 = function(data) {
    this.mode = 'col7';
    this.render();
}
ProtoGraph.Card.toRecordLandConflict.prototype.renderCol4 = function(data) {
    this.mode = 'col4';
    this.render();
}

ProtoGraph.Card.toRecordLandConflict.prototype.renderScreenshot = function(data) {
    this.mode = 'screenshot';
    this.render();
}

ProtoGraph.Card.toRecordLandConflict.prototype.render = function() {
   ReactDOM.render(
    <Card
      dataURL={this.options.data_url}
      selector={this.options.selector}
      clickCallback={this.options.onClickCallback}
      mode={this.mode}
      ref={(e) => {
        this.containerInstance = this.containerInstance || e;
      }} />,
    this.options.selector);
}