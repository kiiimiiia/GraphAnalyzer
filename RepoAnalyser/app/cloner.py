
from collections import Counter
import sqlite3
import git2net
import os
from git import Repo
import pandas as pd
import shutil
import stat

def clone_and_mine(repo_full_url):
    # Clone the repository
    repo_folder = repo_full_url.split('/')[-1].replace('.git', '')
    sqlite_db_file = repo_folder.split('/')[-1] + '.db'

    mode = stat.S_IRWXU | stat.S_IRWXG | stat.S_IRWXO  # This gives all permissions to all users
    
    if os.path.exists(sqlite_db_file):
        return sqlite_db_file
        os.chmod(sqlite_db_file, mode)
        os.remove(sqlite_db_file)
    if os.path.exists(repo_folder):
        os.chmod(repo_folder, mode)
        shutil.rmtree(repo_folder)

    Repo.clone_from(repo_full_url, repo_folder)

    git2net.mine_git_repo(repo_folder, sqlite_db_file)
    disambiguate_aliases(sqlite_db_file)
    return sqlite_db_file

def disambiguate_aliases(db_filename):
    git2net.disambiguate_aliases_db(db_filename)

    with sqlite3.connect(db_filename) as con:
        authors = pd.read_sql("""SELECT author_name, author_email, author_id FROM commits""", con)

    Counter(['{} --- {}, <{}>'.format(row.author_id, row.author_name, row.author_email)
             for idx, row in authors.iterrows()])