
class DataPreprocessor:
    def sort(self, nodes, edges):
        # Sort nodes based on 'outweight'
        sorted_nodes = {k: v for k, v in sorted(nodes.items(), key=lambda item: item[1]['outweight'], reverse=True)}

        # Sort edges based on 'weight'
        sorted_edges = {k: v for k, v in sorted(edges.items(), key=lambda item: item[1]['weight'], reverse=True)}

        return sorted_nodes, sorted_edges

    # def sort_by_date(self, nodes):
    #     # Assuming 'first_contribution_date' and 'creation_date' are keys in the value dictionary of nodes
    #     sorted_authors = {k: v for k, v in sorted(nodes['authors'].items(),
    #                                               key=lambda item: datetime.strptime(item[1]['first_contribution_date'],
    #                                                                                  '%Y-%m-%d'), reverse=True)}
    #     sorted_files = {k: v for k, v in sorted(nodes['files'].items(),
    #                                             key=lambda item: datetime.strptime(item[1]['creation_date'],
    #                                                                                '%Y-%m-%d'), reverse=True)}
    #
    #     return sorted_authors, sorted_files