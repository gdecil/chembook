from flask import json
from os import remove
from indigo import *
from indigo_renderer import *
from tempfile import *
from shutil import copyfileobj
import uuid
import psycopg2
from bingoCfg import conn, _platform, query_db
from psycopg2.extensions import SQL_IN
import base64

class TornadoInsert(object):
    def __init__(self):
        global con 
        con = TorCfg.con
