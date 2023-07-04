from datetime import datetime

from MamadMiner.app.DataPreprocessor import DataPreprocessor
from app.MeasurementsCalculator import MeasurementsCalculator
from app.analyser import get_graph
from app.cloner import clone_and_mine
import flask
from flask import Flask, jsonify, request
import json
from flask import Flask, request, Response
import json

app = Flask(__name__)

nodes = []
edges = []
preprocessor = DataPreprocessor()

@app.route('/mine_repo', methods=['POST','GET'])
def mine_repo():

    repo_url = request.headers.get('url') # Get URL from the POST request headers
    date = request.headers.get('date') 
    
    sqlite_db_file = clone_and_mine(repo_url)
    
    n, node_info, edge_info = get_graph(sqlite_db_file, date)
    raw_nodes = n.nodes
    raw_edges = {k[1]: {'weight': v['weight'], 'connected_to': k[0]} for k, v in n.edges.items()}
    nodes, edges = preprocessor.sort(raw_nodes, raw_edges)

    data = {
        "message": "Repo mined successfully",
        "nodes": nodes,
        "edges": edges
    }
    
    json_data = json.dumps(data)

    return Response(response=json_data, status=200, mimetype='application/json')

@app.route('/mine_repo_with_date', methods=['POST'])
def mine_repo_with_date():
    repo_url = request.headers.get('url') # Get URL from the POST request headers
    date = request.headers.get('from_date') # Get date from the POST request headers

    year, month, day = map(int, date.split(","))
    from_date = datetime(year, month, day)

    # Check if date is provided
    if date is None:
        return jsonify({"message": "Please provide a date in your request."}), 400

    sqlite_db_file = clone_and_mine(repo_url)

    n, node_info, edge_info = get_graph(sqlite_db_file, from_date)
    raw_nodes = n.nodes
    raw_edges = {k[1]: {'weight': v['weight'], 'connected_to': k[0]} for k, v in n.edges.items()}
    nodes, edges = preprocessor.sort(raw_nodes, raw_edges)

    calculator = MeasurementsCalculator(nodes, edges)
    author_degree_centrality, file_degree_centrality = calculator.compute_degree_centrality()
    # betweenness_centrality = calculator.compute_betweenness_centrality()
    # closeness_centrality = calculator.compute_closeness_centrality()
    # eigenvector_centrality = calculator.compute_eigenvector_centrality()
    # page_rank = calculator.compute_page_rank()
    # clustering_coefficient = calculator.compute_clustering_coefficient()

    measurements = {
        "author_degree_centrality": author_degree_centrality,
        "file_degree_centrality": file_degree_centrality,
        # "betweenness_centrality": betweenness_centrality,
        # "closeness_centrality": closeness_centrality,
        # "eigenvector_centrality": eigenvector_centrality,
        # "page_rank": page_rank,
        # "clustering_coefficient": clustering_coefficient
    }

    data = {
        "message": "Repo mined successfully",
        "nodes": nodes,
        "edges": edges,
        "measurements": measurements
    }

    json_data = json.dumps(data)

    return Response(response=json_data, status=200, mimetype='application/json')

if __name__ == "__main__":
    app.run(port=8000, debug=True)

    # flask --app main.py --debug run