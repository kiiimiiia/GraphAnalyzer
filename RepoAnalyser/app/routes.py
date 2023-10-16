from datetime import datetime
from flask import Blueprint, blueprints, jsonify, request, Response
from .get_data import get_author_file_data, get_coediting_network_data, get_first_last_commit_dates, get_coauthership_graph, get_line_editing_path_data
from .cloner import clone_and_mine
from .helpers import parse_date, get_folder_name, get_db_filename
import os
import json

blueprint = Blueprint('routes', __name__)

@blueprint.route('/mine_repo', methods=['GET'])
def mine_repo():
    repo_url = request.headers.get('url')
    date = request.headers.get('date')
    repo_folder_name = get_folder_name(repo_url)
    sqlite_db_file = get_db_filename(repo_folder_name)

    if not os.path.isfile(sqlite_db_file):
        sqlite_db_file = clone_and_mine(repo_url)

    nodes, edges, measurements = get_author_file_data(sqlite_db_file, date)

    repo_local_path = os.path.join(os.getcwd(), repo_folder_name)
    first_commit_date, last_commit_date = get_first_last_commit_dates(repo_local_path)

    data = {
        "message": "Repo mined successfully",
        "nodes": nodes,
        "edges": edges,
        "measurements": measurements,
        "first_commit_date": first_commit_date,
        "last_commit_date": last_commit_date
    }
    
    json_data = json.dumps(data)
    return Response(response=json_data, status=200, mimetype='application/json')


@blueprint.route('/mine_repo_with_date', methods=['GET'])
def mine_repo_with_date():
    repo_url = request.headers.get('url')
    from_date_str = request.headers.get('fromdate')
    to_date_str = request.headers.get('todate')

    # Check for missing dates
    if not from_date_str or not to_date_str:
        return jsonify(message="Both from_date and to_date headers are required!"), 400

    from_date = parse_date(from_date_str)
    to_date = parse_date(to_date_str)

    repo_folder_name = get_folder_name(repo_url)
    repo_local_path = os.path.join(os.getcwd(), repo_folder_name)
    sqlite_db_file = get_db_filename(repo_folder_name)
    first_commit_date, last_commit_date = get_first_last_commit_dates(repo_local_path)

    # Clone and mine repository if it hasn't been processed yet
    if not os.path.isfile(sqlite_db_file):
        sqlite_db_file = clone_and_mine(repo_url)

    if not os.path.isfile(sqlite_db_file):
        return jsonify(message="Error processing repo"), 500

    nodes, edges, measurements = get_author_file_data(sqlite_db_file, from_date, to_date)

    data = {
        "message": "Repo mined successfully",
        "nodes": nodes,
        "edges": edges,
        "measurements": measurements,
        "first_commit_date": first_commit_date,
        "last_commit_date": last_commit_date
    }

    json_data = json.dumps(data)
    return Response(response=json_data, status=200, mimetype='application/json')


@blueprint.route('/get_coediting_network', methods=['GET'])
def coediting_network():
    repo_url = request.headers.get('url')

    repo_folder_name = get_folder_name(repo_url)
    sqlite_db_file = get_db_filename(repo_folder_name)

    # Check if SQLite file exists
    if not os.path.isfile(sqlite_db_file):
        return jsonify(message="Repo not mined yet. Please mine the repo first."), 404

    nodes, edges, measurements = get_coediting_network_data(sqlite_db_file)

    data = {
        "message": "Co-editing network fetched successfully",
        "nodes": nodes,
        "edges": edges,
        "measurements": measurements,
    }

    json_data = json.dumps(data)
    return Response(response=json_data, status=200, mimetype='application/json')

@blueprint.route('/get_coauthorship_network', methods=['GET'])
def coauthorship_network():
    repo_url = request.headers.get('url')

    repo_folder_name = get_folder_name(repo_url)
    sqlite_db_file = get_db_filename(repo_folder_name)

    # Check if SQLite file exists
    if not os.path.isfile(sqlite_db_file):
        return jsonify(message="Repo not mined yet. Please mine the repo first."), 404

    nodes, edges, measurements = get_coauthership_graph(sqlite_db_file)

    data = {
        "message": "Co-authorship network fetched successfully",
        "nodes": nodes,
        "edges": edges,
        "measurements": measurements,
    }

    json_data = json.dumps(data)
    return Response(response=json_data, status=200, mimetype='application/json')

@blueprint.route('/get_line_editing_paths', methods=['GET'])
def line_editing_paths():
    repo_url = request.headers.get('url')
    file_paths = request.headers.get('file_paths')

    repo_folder_name = get_folder_name(repo_url)
    sqlite_db_file = get_db_filename(repo_folder_name)

    # Check if SQLite file exists
    if not os.path.isfile(sqlite_db_file):
        return jsonify(message="Repo not mined yet. Please mine the repo first."), 404

    dag_data = get_line_editing_path_data(sqlite_db_file, repo_folder_name, ['setup.py'])

    data = {
        "message": "line editing network fetched successfully",
        "dag_data": dag_data,
    }

    json_data = json.dumps(data)
    return Response(response=json_data, status=200, mimetype='application/json')