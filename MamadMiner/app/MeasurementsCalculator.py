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
        # number of edges connected to a node
        # tell you which nodes have the most connections.
        degree_centrality = nx.degree_centrality(self.graph)
        author_degree_centrality = {node: centrality for node, centrality in degree_centrality.items() if isinstance(node, int)}
        file_degree_centrality = {node: centrality for node, centrality in degree_centrality.items() if isinstance(node, str)}
        return author_degree_centrality, file_degree_centrality

    def compute_eigenvector_centrality(self): # influence of a node in a network
        eigenvector_centrality = nx.eigenvector_centrality(self.graph)
        return eigenvector_centrality

    def compute_page_rank(self): # importance of each node
        page_rank = nx.pagerank(self.graph)
        return page_rank