

import git2net
import pathpy as pp
from datetime import datetime

def make_coediting_net(db_filename):
    t, node_info, edge_info = git2net.get_bipartite_network(db_filename)
    n = pp.Network.from_temporal_network(t)
    return (n, node_info, edge_info)


def get_graph(sqlite_db_file):
    n, node_info, edge_info = make_coediting_net(sqlite_db_file)
    return n, node_info, edge_info
    

def get_graph(sqlite_db_file, from_date):
    time_from = datetime(2019, 5, 1)
    t, node_info, edge_info = git2net.get_bipartite_network(sqlite_db_file, time_from=from_date)
    n = pp.Network.from_temporal_network(t)
    return n, node_info, edge_info