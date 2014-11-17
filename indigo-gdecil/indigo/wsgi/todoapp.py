from datetime import datetime
from flask import Flask, Response, request, jsonify, flash, url_for, redirect, render_template, abort, json
from flask_sqlalchemy import SQLAlchemy
from flask import send_file
from flask.ext.cors import CORS
from flask.ext.cors import cross_origin

from shutil import copyfileobj
from os import remove
from tempfile import *

from indigo import *
from indigo_renderer import *

import platform
import psycopg2
import bingoCfg
import time

from bingoSelect import *
from bingoInsert import *

app = Flask(__name__)
# app.config['CORS_HEADERS'] = "Content-Type"
# app.config['CORS_RESOURCES'] = {r"*": {"origins": "*"}}
# 
cors = CORS(app)
cors = CORS(app, resources=r'/api/*', headers='Content-Type')
cors = CORS(app, headers='Content-Type')
app.register_blueprint(bingo)
app.register_blueprint(bingoI)
 

_platform = platform.platform()

if _platform == "Linux-3.13.0-36-generic-i686-with-Ubuntu-14.04-trusty":
    a=1
elif _platform == "Linux-3.13.0-39-generic-i686-with-Ubuntu-14.04-trusty":
    a=1
else:
    app.config.from_pyfile('todoapp.cfg')
    
db = SQLAlchemy(app)
 
class Todo(db.Model):
    __tablename__ = 'todos'
    id = db.Column('todo_id', db.Integer, primary_key=True)
    title = db.Column(db.String(60))
    text = db.Column(db.String)
    done = db.Column(db.Boolean)
    pub_date = db.Column(db.DateTime)
 
    def __init__(self, title, text):
        self.title = title
        self.text = text
        self.done = False
        self.pub_date = datetime.utcnow()

@app.route('/messages', methods = ['POST'])
# @cross_origin(headers=['Content-Type'])
def api_message():
    if request.headers['Content-Type'] == 'text/plain':
        return "Text Message: " + request.data

    elif request.headers['Content-Type'] == 'application/json':
        return "JSON Message: " + json.dumps(request.json)

    elif request.headers['Content-Type'] == 'application/octet-stream':
        f = open('./binary', 'wb')
        f.write(request.data)
        f.close()
        return "Binary message written!"
    else:
        return "415 Unsupported Media Type ;)"
    
@app.route("/testView")
def testView():
    ret = '{"data": "JSON string example"}'

    resp = Response(response=ret,
                    status=200,
                    mimetype="application/json")

    return resp

@app.route("/wait/<int:id>")
def wait(id):
    ret = '{"data": "JSON string example"}'
    print id
    time.sleep(id)
    print id
    resp = Response(response=ret,
                    status=200,
                    mimetype="application/json")

    return resp

@app.route('/getMol/<smile>', methods = ['GET'])
def get_mol(smile):
    indigo = Indigo()
    if smile == "":
        smile = "c1ccccc1"
        
    mol1 = indigo.loadMolecule(smile);
    mol1.layout();
    renderer = IndigoRenderer(indigo);
    indigo.setOption("render-output-format", "png");
    indigo.setOption("render-margins", 10, 10);
#    indigo.setOption("render-comment", "N-Hydroxyaniline" + str(task_id))
    if _platform != "Linux-3.13.0-36-generic-i686-with-Ubuntu-14.04-trusty":
        datadir = os.environ['OPENSHIFT_DATA_DIR']
    else:
        datadir = ""
        
    renderer.renderToFile(mol1, datadir + "mol.png");
    
        
    tempFileObj = NamedTemporaryFile(mode='w+b',suffix='png')
    pilImage = open(datadir + 'mol.png','rb')
    copyfileobj(pilImage,tempFileObj)
    pilImage.close()
    remove(datadir + 'mol.png')
    tempFileObj.seek(0,0)
    response = send_file(tempFileObj)
    response.headers['Content-Type'] = 'image/png'
    response.headers['Content-Disposition'] = 'attachment; filename=mol.png'
    return response

@app.route('/new', methods=['GET', 'POST'])
def new():
    if request.method == 'POST':
            todo = Todo(request.form['title'], request.form['text'])
            db.session.add(todo)
            db.session.commit()
            return redirect(url_for('index'))
    return render_template('new.html')
 
@app.route('/view/<smile>', methods=['GET'])
def view(smile):
    return render_template('indigo.html', smile=smile)
#http://localhost:5000/view/!smile=Cc1ccccc1CCCCCC
#http://indigo-gdecil.rhcloud.com//view/!smile=Cc1ccccc1CCCCCC

@app.route('/viewBingo/<id>', methods=['GET'])
def view_bingo(id):
    return render_template('bingo.html', id=id)

@app.route('/ChemBook', methods=['GET'])
def ChemBook():
    return render_template('ChemBook.html')

@app.route('/')
@app.route('/hello')
def index():
    return "http://indigo-gdecil.rhcloud.com/viewBingo/!id=2;   http://indigo-gdecil.rhcloud.com/view/!smile=Cc1ccccc1Br"
 
# if __name__ == '__main__':
#     app.run(debug=True)
    
if __name__ == '__main__':
    app.run(
        host="0.0.0.0",
        port=int("5000"),
        debug=True
    )    