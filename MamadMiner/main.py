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
    edges = {k[1]: {'weight': v['weight'], 'connected_to': k[0]} for k, v in dict(n.edges).items()}

    data = {
        "message": "Repo mined successfully",
        "nodes": nodes,
        "edges": edges
    }
    
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True)