import git2net
import os
from os import listdir
import sqlite3
import pandas as pd


# We assume a clone of git2net's repository exists in the folder below following the first tutorial.
git_repo_dir = 'git2net4analysis'

# Here, we specify the database in which we will store the results of the mining process.
sqlite_db_file = 'git2net4analysis.db'

print(os.path.isdir(git_repo_dir))

# Remove database if exists
if os.path.exists(sqlite_db_file):
    os.remove(sqlite_db_file)