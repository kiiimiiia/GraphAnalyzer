
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

    Repo.clone_from(repo_full_url, repo_folder)

    # Remove database if exists
    if os.path.exists(sqlite_db_file):
        os.remove(sqlite_db_file)

    git2net.mine_git_repo(repo_full_url, sqlite_db_file)
    disambiguate_aliases(sqlite_db_file)
    return sqlite_db_file

def disambiguate_aliases(db_filename):
    git2net.disambiguate_aliases_db(db_filename)

    with sqlite3.connect(db_filename) as con:
        authors = pd.read_sql("""SELECT author_name, author_email, author_id FROM commits""", con)

    Counter(['{} --- {}, <{}>'.format(row.author_id, row.author_name, row.author_email)
             for idx, row in authors.iterrows()])