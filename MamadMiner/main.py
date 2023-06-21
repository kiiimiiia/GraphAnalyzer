from collections import defaultdict
import git2net
import os
import sqlite3
import networkx as nx
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

@app.route('/mine_repo', methods=['POST'])
def mine_repo():

    repo_url = request.json.get('url') # Get URL from the POST request body
    date = request.json.get('date') 
    
    sqlite_db_file = clone_and_mine(repo_url)
    
    n, node_info, edge_info = get_graph(sqlite_db_file, date)
    nodes = n.nodes
    edges = {k[1]: {'weight': v['weight'], 'connected_to': k[0]} for k, v in n.edges.items()}

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
    nodes = n.nodes
    edges = {k[1]: {'weight': v['weight'], 'connected_to': k[0]} for k, v in n.edges.items()}

    data = {
        "message": "Repo mined successfully",
        "nodes": nodes,
        "edges": edges
    }

    json_data = json.dumps(data)

    return Response(response=json_data, status=200, mimetype='application/json')

if __name__ == "__main__":
    app.run(debug=True)