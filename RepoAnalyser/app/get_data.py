from .network_sorter import network_sorter
from .measurements_calculator import measurements_calculator
from .analyser import get_graph
import os

preprocessor = network_sorter()

def get_data(sqlite_db_file, from_date=None, to_date=None):
    n, node_info, edge_info = get_graph(sqlite_db_file, from_date, to_date)
    nodes, edges = process_network_data(n)
    measurements = calculate_network_measurements(nodes, edges)
    return nodes, edges, measurements

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
