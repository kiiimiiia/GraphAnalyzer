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

app = Flask(__name__)

nodes = []
edges = []

@app.route('/mine_repo', methods=['POST'])
def mine_repo():

    repo_url = request.json.get('url') # Get URL from the POST request body
    
    sqlite_db_file = clone_and_mine(repo_url)
    
    n, node_info, edge_info = get_graph(sqlite_db_file)
    nodes = n.nodes
    edges = json.dumps(n.edges)

    response_data = {
        'nodes': nodes,
        'edges': edges
    }

    return jsonify(
    {"message": "Repo mined successfully",
     "nodes": nodes,
     "edges": edges}
    )


if __name__ == "__main__":
    app.run(debug=True)