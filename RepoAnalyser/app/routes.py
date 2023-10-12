from datetime import datetime
from flask import Blueprint, blueprints, jsonify, request, Response
from .get_data import get_data
from .cloner import clone_and_mine
from .helpers import parse_date, get_db_filename
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
    repo_url = request.headers.get('url')

    from_date_str = request.headers.get('fromdate')
    to_date_str = request.headers.get('todate')

    # Check for missing dates
    if not from_date_str or not to_date_str:
        return jsonify(message="Both from_date and to_date headers are required!"), 400

    from_date = parse_date(from_date_str)
    to_date = parse_date(to_date_str)

    sqlite_db_file = get_db_filename(repo_url)

    # Clone and mine repository if it hasn't been processed yet
    if not os.path.isfile(sqlite_db_file):
        sqlite_db_file = clone_and_mine(repo_url)

    if not os.path.isfile(sqlite_db_file):
        return jsonify(message="Error processing repo"), 500

    nodes, edges, measurements = get_data(sqlite_db_file, from_date, to_date)

    data = {
        "message": "Repo mined successfully",
        "nodes": nodes,
        "edges": edges,
        "measurements": measurements
    }

    json_data = json.dumps(data)
    return Response(response=json_data, status=200, mimetype='application/json')
