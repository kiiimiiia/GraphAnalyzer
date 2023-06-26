import networkx as nx

class MeasurementsCalculator:
    def __init__(self, nodes, edges):
        self.nodes = nodes
        self.edges = edges
        self.graph = self._build_graph()

    def _build_graph(self):
        G = nx.DiGraph()
        G.add_nodes_from(self.nodes.keys())
        for key, value in self.edges.items():
            G.add_edge(value['connected_to'], key, weight=value['weight'])
        return G

    def compute_degree_centrality(self):
        degree_centrality = nx.degree_centrality(self.graph)
        author_degree_centrality = {node: centrality for node, centrality in degree_centrality.items() if isinstance(node, int)}
        file_degree_centrality = {node: centrality for node, centrality in degree_centrality.items() if isinstance(node, str)}
        return author_degree_centrality, file_degree_centrality


