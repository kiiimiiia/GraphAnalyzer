from datetime import datetime

def parse_date(date_str):
    if not date_str:
        return None
    year, month, day = map(int, date_str.split(","))
    return datetime(year, month, day)

def get_folder_name(repo_url):
    return repo_url.split('/')[-1].replace('.git', '')

def get_db_filename(repo_folder_name):
    return repo_folder_name.split('/')[-1] + '.db'