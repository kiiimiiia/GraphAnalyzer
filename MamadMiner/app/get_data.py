from .data_processor import data_processor
from .measurements_calculator import measurements_calculator
from .analyser import get_graph
import os

preprocessor = data_processor()


def get_data(sqlite_db_file, from_date=None):
    n, node_info, edge_info = get_graph(sqlite_db_file, from_date)
    raw_nodes = n.nodes
    raw_edges = {k[1]: {'weight': v['weight'], 'connected_to': k[0]} for k, v in n.edges.items()}
    nodes, edges = preprocessor.sort(raw_nodes, raw_edges)
    calculator = measurements_calculator(nodes, edges)
    
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


