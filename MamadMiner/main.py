from datetime import datetime
import os
import pickle
from app.DataPreprocessor import DataPreprocessor
from app.MeasurementsCalculator import MeasurementsCalculator
from app.analyser import get_graph
from app.cloner import clone_and_mine
from flask import Flask, jsonify, request, Response
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/mine_repo": {"origins": "http://localhost:3000"}})
preprocessor = DataPreprocessor()

def get_data(sqlite_db_file, from_date=None):
    n, node_info, edge_info = get_graph(sqlite_db_file, from_date)
    raw_nodes = n.nodes
    raw_edges = {k[1]: {'weight': v['weight'], 'connected_to': k[0]} for k, v in n.edges.items()}
    nodes, edges = preprocessor.sort(raw_nodes, raw_edges)
    calculator = MeasurementsCalculator(nodes, edges)
    
    author_degree_centrality = calculator.compute_author_degree_centrality()
    author_degree_centrality_sorted = dict(sorted(author_degree_centrality.items(), key=lambda item: item[1], reverse=True))

    file_degree_centrality = calculator.compute_file_degree_centrality()
    file_degree_centrality_sorted = dict(sorted(file_degree_centrality.items(), key=lambda item: item[1], reverse=True))

    page_rank = calculator.compute_page_rank()
    page_rank_sorted = dict(sorted(page_rank.items(), key=lambda item: item[1], reverse=True))

    measurements = {
        "author_degree_centrality": author_degree_centrality_sorted,
        "file_degree_centrality": file_degree_centrality_sorted,
        "page_rank": page_rank_sorted,
    }
    return nodes, edges, measurements



@app.route('/mine_repo', methods=['POST','GET'])
def mine_repo():
    repo_url = request.headers.get('url') # Get URL from the POST request headers
    date = request.headers.get('date') 
    sqlite_db_file = 'data/' + repo_url.split('/')[-1] + '.db'

    if not os.path.isfile(sqlite_db_file):
        sqlite_db_file = clone_and_mine(repo_url)

    nodes, edges, measurements = get_data(sqlite_db_file, date)

    data = {
        "message": "Repo mined successfully",
        "nodes": nodes,
        "edges": edges,
        "measurements": measurements
    }
    
    json_data = json.dumps(data)
    return Response(response=json_data, status=200, mimetype='application/json')

@app.route('/mine_repo_with_date', methods=['POST'])
def mine_repo_with_date():
    repo_url = request.headers.get('url') # Get URL from the POST request headers
    date = request.headers.get('from_date') # Get date from the POST request headers
    year, month, day = map(int, date.split(","))
    from_date = datetime(year, month, day)
    sqlite_db_file = 'data/' + repo_url.split('/')[-1] + '.db'

    if not os.path.isfile(sqlite_db_file):
        sqlite_db_file = clone_and_mine(repo_url)

    nodes, edges, measurements = get_data(sqlite_db_file, from_date)

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
