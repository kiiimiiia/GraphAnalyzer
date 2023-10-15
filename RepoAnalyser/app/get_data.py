from .network_sorter import network_sorter
from .measurements_calculator import measurements_calculator
from .analyser import get_author_file_graph, get_coediting_graph
import os
from git import Repo
import pathpy as pp

preprocessor = network_sorter()

def get_author_file_data(sqlite_db_file, from_date=None, to_date=None):
    n, node_info, edge_info = get_author_file_graph(sqlite_db_file, from_date, to_date)
    nodes, edges = process_network_data(n)
    measurements = calculate_network_measurements(nodes, edges)
    return nodes, edges, measurements

def get_coediting_network_data(sqlite_db_file):
    n, node_info, edge_info = get_coediting_graph(sqlite_db_file)
    nodes, edges = process_network_data(n)
    measurements = calculate_network_measurements(nodes, edges)
    return nodes, edges, measurements

def get_first_last_commit_dates(repo_folder):
    # Create a Repo object for the already cloned repository
    repo = Repo(repo_folder)

    # Get a list of all commits on the 'master' branch (you can change this to 'main' if needed)
    commits = list(repo.iter_commits('main'))

    # Return the date of the first and last commit
    first_commit_date = commits[-1].committed_datetime.strftime('%Y-%m-%d')
    last_commit_date = commits[0].committed_datetime.strftime('%Y-%m-%d')

    return first_commit_date, last_commit_date

def process_network_data(n):
    raw_nodes = n.nodes
    raw_edges = {k[1]: {'weight': v['weight'], 'connected_to': k[0]} for k, v in n.edges.items()}
    return preprocessor.sort(raw_nodes, raw_edges)

def calculate_network_measurements(nodes, edges):
    calculator = measurements_calculator(nodes, edges)
    author_degree_centrality_sorted = sort_dictionary(calculator.compute_author_degree_centrality())
    file_degree_centrality_sorted = sort_dictionary(calculator.compute_file_degree_centrality())
    page_rank_sorted = sort_dictionary(calculator.compute_page_rank())

    measurements = {
        "author_degree_centrality": author_degree_centrality_sorted,
        "file_degree_centrality": file_degree_centrality_sorted,
        "page_rank": page_rank_sorted,
    }
    return measurements

def sort_dictionary(d):
    return dict(sorted(d.items(), key=lambda item: item[1], reverse=True))
