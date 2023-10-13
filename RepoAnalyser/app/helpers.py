from datetime import datetime

def parse_date(date_str):
    if not date_str:
        return None
    year, month, day = map(int, date_str.split(","))
    return datetime(year, month, day)


def get_db_filename(repo_url):
    return 'data/' + repo_url.split('/')[-1] + '.db'