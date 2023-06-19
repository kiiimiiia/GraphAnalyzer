

from git2net4analysis import git2net
import pathpy as pp

def make_coediting_net(db_filename):
    t, node_info, edge_info = git2net.get_bipartite_network(db_filename)
    n = pp.Network.from_temporal_network(t)
    return (n, node_info, edge_info)


def get_graph(sqlite_db_file):
    n, node_info, edge_info = make_coediting_net(sqlite_db_file)
    return n, node_info, edge_info
    
    