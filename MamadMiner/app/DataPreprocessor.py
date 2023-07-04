





class DataPreprocessor:
    def sort(self, nodes, edges):
        # Sort nodes based on 'outweight'
        sorted_nodes = {k: v for k, v in sorted(nodes.items(), key=lambda item: item[1]['outweight'], reverse=True)}

        # Sort edges based on 'weight'
        sorted_edges = {k: v for k, v in sorted(edges.items(), key=lambda item: item[1]['weight'], reverse=True)}

        return sorted_nodes, sorted_edges