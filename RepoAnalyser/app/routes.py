from datetime import datetime
from flask import Blueprint, blueprints, jsonify, request, Response
from .get_data import get_data
from .cloner import clone_and_mine
import os
import json

blueprint = Blueprint('routes', __name__)

@blueprint.route('/mine_repo', methods=['POST','GET'])
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

@blueprint.route('/mine_repo_with_date', methods=['POST'])
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
