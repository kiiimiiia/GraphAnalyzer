

import git2net
import pathpy as pp


def get_author_file_graph(sqlite_db_file, from_date=None, to_date=None):
    t, node_info, edge_info = git2net.get_bipartite_network(sqlite_db_file, time_from=from_date, time_to=to_date)
    n = pp.Network.from_temporal_network(t)
    return n, node_info, edge_info

def get_coediting_graph(sqlite_db_file):
    t, node_info, edge_info = git2net.get_coediting_network(sqlite_db_file)
    n = pp.Network.from_temporal_network(t)
    return n, node_info, edge_info

def get_coauthership_graph(sqlite_db_file):
    t, node_info, edge_info = git2net.get_coauthorship_network(sqlite_db_file)
    return t, node_info, edge_info

def get_line_editing_paths(sqlite_db_file, git_repo_dir, file_paths):
    paths, dag, node_info, edge_info = git2net.get_line_editing_paths(sqlite_db_file,
                                                                      git_repo_dir,
                                                                      file_paths=file_paths)
    return paths, dag, node_info, edge_info
