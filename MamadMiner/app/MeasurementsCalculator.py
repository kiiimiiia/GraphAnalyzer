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

    def compute_betweenness_centrality(self):
        betweenness_centrality = nx.betweenness_centrality(self.graph)
        return betweenness_centrality

    def compute_closeness_centrality(self):
        closeness_centrality = nx.closeness_centrality(self.graph)
        return closeness_centrality

    def compute_eigenvector_centrality(self):
        eigenvector_centrality = nx.eigenvector_centrality(self.graph)
        return eigenvector_centrality

    def compute_page_rank(self):
        page_rank = nx.pagerank(self.graph)
        return page_rank

    def compute_clustering_coefficient(self):
        clustering_coefficient = nx.clustering(self.graph)
        return clustering_coefficient
