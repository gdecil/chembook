from flask import Blueprint, render_template, abort, Response,request, json
from jinja2 import TemplateNotFound
from os import remove
from indigo import *
from indigo_renderer import *
from flask import send_file
from tempfile import *
from shutil import copyfileobj
import psycopg2
from bingoCfg import conn, _platform, query_db
from flask.ext.cors import cross_origin

bingo = Blueprint('bingo', __name__, template_folder='templates')

@bingo.route('/Reaction.asmx/CheckReactionsEnumerated', methods = ['GET','POST'])
def get_checkReaEnum():
    try:
        if request.method == 'POST':
            ret1 = request.get_json(force=True, silent=True, cache=False)
            j = json.loads(ret1)    
            notebook = j['notebook'];
            page = j['page'];
        else:
            notebook = request.args.get('notebook')
            page = request.args.get('page')
 
        sql="SELECT count(*) FROM cen_reaction_schemes r  " + \
                "    WHERE reaction_type = 'ENUMERATED' and length(r.native_rxn_sketch) > 0  " + \
                "    and page_key = (select page_key from CEN_PAGES where notebook ='" + notebook + \
                "'  and experiment  = '" + page + "') ";
                
         
        my_query = query_db(sql)
        print my_query
        json_output = json.dumps(my_query)
        ret = json.loads(json_output) 
        ob = tuple(map(tuple, ret))
        print ob.count
        return ob.count
#         return Response(response=json_output, status=200, mimetype="application/json")

    except TemplateNotFound:
        abort(404) 
        
@bingo.route('/Reaction.asmx/GetExperiment', methods = ['GET','POST'])
def get_experiment():
#     ret = json.dumps('{"ret":"OK"}')
#     resp = Response(response=ret, status=200, mimetype="application/json")
#     return resp
    try:
#         return Response(response=json.dumps('{"ret":"post ok"}'), status=200, mimetype="application/json")
        if request.method == 'POST':
#             return Response(response=json.dumps('{"ret":"post ok"}'), status=200, mimetype="application/json")
            ret1 = request.get_json(force=True, silent=True, cache=False)
            j = json.loads(ret1)    
            notebook = j['notebook'];
            page = j['page'];
            enumVal = j['enumVal'];   
        else:
            notebook = request.args.get('notebook')
            page = request.args.get('page')
            enumVal = request.args.get('enumVal')
#             return Response(response=json.dumps('{"ret":"' + notebook + page + enumVal + '"}'), status=200, mimetype="application/json")
 
#         cursor = conn.cursor()
        if enumVal=="undefined":
            sql="select * from pages_vw where notebook ='" + notebook \
            + "' and experiment  = '" + page + "' and SYNTH_ROUTE_REF is null";                    
        else:
            sql = "select * from pages_vw where notebook ='" + notebook \
            + "' and experiment  = '" + page + "' and SYNTH_ROUTE_REF =" + enumVal;
         
#         print sql        
#         cursor.execute(sql)
#         json_output = json.dumps(cursor.fetchall())
        my_query = query_db(sql)

        json_output = json.dumps(my_query)
        
        return Response(response=json_output, status=200, mimetype="application/json")

    except TemplateNotFound:
        abort(404)   
        
@bingo.route('/Reaction.asmx/GetUsersFullname', methods = ['GET','POST'])
def get_fullname():
    try:
        sql = "select fullname from CEN_USERS where site_code = 'SITE1' order by username"          
        my_query = query_db(sql)
        json_output = json.dumps(my_query)
#         u = User('{"fullname": "Caldarelli, Marina"}')
#         print u.fullname
        js ="["
        for s in my_query:
#             print s
#             print s['fullname']
            js = js + '{"title": "' + s['fullname'] + \
            '", "isLazy": true , "icon": "/js/vendor/jquery.dynatree/skin-custom/PersonIcon16.gif"},'
            
        js= js[:-1] + "]"
        return Response(response=js, status=200, mimetype="application/json")

    except TemplateNotFound:
        abort(404)

@bingo.route('/Reaction.asmx/GetUserNotebooks', methods = ['GET','POST'])
def get_usernotebooks():
    try:
        if request.method == 'POST':
            ret1 = request.get_json(force=True, silent=True, cache=False)
            j = json.loads(ret1)    
            userFullname = j['userFullname'];
        else:
            userFullname = request.args.get('userFullname')
            
        sql = "select distinct notebook from CEN_PAGES where owner_username =(select "  + \
        "username from CEN_USERS where fullname = '" + userFullname \
        + "' and site_code = 'SITE1') order by notebook"          
        my_query = query_db(sql)
        if  len(my_query) > 0:            
            json_output = json.dumps(my_query)
            js ="["
            for s in my_query:
                js = js + '{"title": "' + s['notebook'] + '", "isLazy": true },'
                
            js= js[:-1] + "]"
            return Response(response=js, status=200, mimetype="application/json")
        else:
            return Response(response='{"title": "No Records", "isLazy": true }', status=200, mimetype="application/json")
            
    except TemplateNotFound:
        abort(404)

@bingo.route('/getMolBingo/<int:id>', methods = ['GET'])
def get_mol_bingo(id):    
    cursor = conn.cursor()
    cursor.execute("select bingo.smiles(molb) from compound where id =" + str(id) )  
    mypic2 = str(cursor.fetchone()[0]) 

    indigo = Indigo()
    smile = mypic2;
#    return smile
    mol1 = indigo.loadMolecule(smile);
    mol1.layout();
    renderer = IndigoRenderer(indigo);
    indigo.setOption("render-output-format", "png");
    indigo.setOption("render-margins", 10, 10);
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

@bingo.route('/Reaction.asmx/getProjects', methods = ['GET','POST'])
def get_projects():
#     ret = json.dumps('{"ret":"OK"}')
#     resp = Response(response=ret, status=200, mimetype="application/json")
#     return resp

#     json_output = json.dumps('{"NAME":"PR1", "NAME":"PR2"}')   non va bene con js
    json_output = '[{"NAME":"PR1"}, {"NAME":"PR2"}]'                        
    return Response(response=json_output, status=200, mimetype="application/json")

@bingo.route('/viewBingo/<id>', methods=['GET'])
def view_bingo(id):
    try:
        return render_template('bingo.html', id=id)
    except TemplateNotFound:
        abort(404)    

class User(object):
    def __init__(self,j):
        self.__dict__= json.loads(j)
        