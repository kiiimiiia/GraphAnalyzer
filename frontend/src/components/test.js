import React, { useState } from 'react';
import cytoscape from 'cytoscape';

function test() {
  const [text, setText] = useState('');
  const [cy, setCy] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const elements = parseText(text);

    if (cy) {
      cy.destroy();
    }

    const newCy = cytoscape({
      elements,
      container: document.getElementById('cy'),
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#666',
            'label': 'data(id)'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle'
          }
        }
      ],
      layout: {
        name: 'grid',
        rows: 1
      }
    });
    setCy(newCy);
  };

  const parseText = (inputText) => {
    const elements = [];
    const lines = inputText.split('\n');
    for (let line of lines) {
      const parts = line.split('->');
      if (parts.length === 2) {
        const source = parts[0].trim();
        const target = parts[1].trim();
        elements.push({ data: { id: source }, group: 'nodes' });
        elements.push({ data: { id: target }, group: 'nodes' });
        elements.push({ data: { id: source + target, source, target }, group: 'edges' });
      }
    }
    return elements;
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <textarea value={text} onChange={(e) => setText(e.target.value)} />
        <button type="submit">Submit</button>
      </form>
      <div id="cy" style={{ width: '800px', height: '600px' }}></div>
    </div>
  );
}

export default test;
