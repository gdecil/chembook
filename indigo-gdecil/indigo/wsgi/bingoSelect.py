from flask import Blueprint, render_template, abort, Response,request, json
from jinja2 import TemplateNotFound
from os import remove
from indigo import *
from indigo_renderer import *
from flask import send_file
from tempfile import *
from shutil import copyfileobj
import uuid
import psycopg2
from bingoCfg import conn, _platform, query_db
from flask.ext.cors import cross_origin
from psycopg2.extensions import SQL_IN

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
        dict = my_query[0]
#         print dict['count']
        return Response(response=str(dict['count']), status=200, mimetype="application/json")

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
            + "' and experiment  = '" + page + "' and (SYNTH_ROUTE_REF = '' or SYNTH_ROUTE_REF is null)";                    
        else:
            sql = "select * from pages_vw where notebook ='" + notebook \
            + "' and experiment  = '" + page + "' and SYNTH_ROUTE_REF =" + enumVal;
         
#         print sql        
#         cursor.execute(sql)
#         json_output = json.dumps(cursor.fetchall())
        my_query = query_db(sql)
#         print enumVal
        json_output = json.dumps(my_query)
        
        return Response(response=json_output, status=200, mimetype="application/json")

    except TemplateNotFound:
        abort(404)   
        
@bingo.route('/Reaction.asmx/GetPagesNotebook', methods = ['GET','POST'])
def get_pagesnotebooks():
    try:
        if request.method == 'POST':
            ret1 = request.get_json(force=True, silent=True, cache=False)
            j = json.loads(ret1)    
            notebook = j['notebook'];
        else:
            notebook = request.args.get('notebook')
            
        sql = "select distinct experiment  from CEN_PAGES where notebook ='" + notebook + \
        "' order by experiment"  
                
        my_query = query_db(sql)
        if  len(my_query) > 0:            
            json_output = json.dumps(my_query)
            js ="["
            for s in my_query:
                js = js + '{"title": "' + s['experiment'] + '", "isLazy": false },'
                
            js= js[:-1] + "]"
            return Response(response=js, status=200, mimetype="application/json")
        else:
            return Response(response='{"title": "No Records", "isLazy": true }', status=200, mimetype="application/json")
            
    except TemplateNotFound:
        abort(404)
        
@bingo.route('/Reaction.asmx/GetProducts', methods = ['GET','POST'])
def get_products():
    try:
        if request.method == 'POST':
            ret1 = request.get_json(force=True, silent=True, cache=False)
            j = json.loads(ret1)    
            notebook = j['notebook'];
            page = j['page'];
            enumVal = j['enumVal'];   
        else:
            notebook = request.args.get('notebook')
            page = request.args.get('page')
            enumVal = request.args.get('enumVal')
            
        if enumVal == "undefined":            
            sql = "select * from batch_lev3_vw where notebook ='" + notebook + "' and experiment  = '" + page + \
            "' and batch_type in ('PRODUCT' ,'INTENDED' , 'ACTUAL') and SYNTH_ROUTE_REF is null"  
        else:
            sql = "select * from batch_vw where notebook ='" + notebook + "' and experiment  = '" + page + \
            "' and batch_type in ('PRODUCT' ,'INTENDED' , 'ACTUAL') and SYNTH_ROUTE_REF =" + enumVal

        my_query = query_db(sql)
        
        if  len(my_query) > 0:            
            json_output = json.dumps(my_query)
            return Response(response=json_output, status=200, mimetype="application/json")
        else:
            return Response(response='{"ret": "0", "isLazy": true }', status=200, mimetype="application/json")
            
    except TemplateNotFound:
        abort(404)

@bingo.route('/Reaction.asmx/GetReaction', methods = ['GET','POST'])
def get_reaction():
    try:
        if request.method == 'POST':
            ret1 = request.get_json(force=True, silent=True, cache=False)
            j = json.loads(ret1)    
            id = j['reactionId'];
            c = j['cns'];
            o = j['outType'];   
        else:
            id = request.args.get('reactionId')
            c = request.args.get('cns')
            o = request.args.get('outType')
 
        sql = "SELECT bingo.rxnfile(r.native_rxn_sketch) as reaction FROM cen_reaction_schemes r WHERE RXN_SCHEME_KEY = '" + id + "'"
        my_query = query_db(sql)

        json_output = json.dumps(my_query)
        return Response(response=json_output, status=200, mimetype="application/json")

    except TemplateNotFound:
        abort(404)   

@bingo.route('/GetReaction.ashx', methods = ['GET'])
def get_reactionI():
    try:
        id = request.args.get('idReaction')
        c = request.args.get('rand')
 
        sql = "SELECT bingo.rxnfile(r.native_rxn_sketch) as reaction FROM cen_reaction_schemes r WHERE RXN_SCHEME_KEY = '" + id + "'"
        my_query = query_db(sql)
#         print str(my_query)
        if str(my_query) != '[]':
            response =renderInd(my_query[0]['reaction'],"rea")
            response.headers['Content-Type'] = 'image/png'
            response.headers['Content-Disposition'] = 'attachment; filename=mol.png'
        else:
            response = ""
        return response

    except TemplateNotFound:
        abort(404)   

@bingo.route('/Reaction.asmx/GetReagents', methods = ['GET','POST'])
def get_reagents():
    try:
        if request.method == 'POST':
            ret1 = request.get_json(force=True, silent=True, cache=False)
            j = json.loads(ret1)    
            notebook = j['notebook'];
            page = j['page'];
            enumVal = j['enumVal'];   
        else:
            notebook = request.args.get('notebook')
            page = request.args.get('page')
            enumVal = request.args.get('enumVal')
            
        if enumVal == "undefined":            
            sql = "select * from batch_lev3_vw where notebook ='" + notebook + "' and experiment  = '" + page + \
            "' and batch_type in ('SOLVENT' , 'REAGENT', 'REACTANT') and SYNTH_ROUTE_REF is null"  
        else:
            sql = "select * from batch_vw where notebook ='" + notebook + "' and experiment  = '" + page + \
            "' and batch_type in ('SOLVENT' , 'REAGENT', 'REACTANT') and SYNTH_ROUTE_REF =" + enumVal

        my_query = query_db(sql)
        
        if  len(my_query) > 0:            
            json_output = json.dumps(my_query)
            return Response(response=json_output, status=200, mimetype="application/json")
        else:
            return Response(response='{"ret": "0", "isLazy": true }', status=200, mimetype="application/json")
            
    except TemplateNotFound:
        abort(404)
                
@bingo.route('/Reaction.asmx/getProjects', methods = ['GET','POST'])
def get_projects():
#     ret = json.dumps('{"ret":"OK"}')
#     resp = Response(response=ret, status=200, mimetype="application/json")
#     return resp

#     json_output = json.dumps('{"NAME":"PR1", "NAME":"PR2"}')   non va bene con js
    json_output = '[{"NAME":"PR1"}, {"NAME":"PR2"}]'                        
    return Response(response=json_output, status=200, mimetype="application/json")

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

@bingo.route('/getMolBingo/<int:id>', methods = ['GET'])
def get_mol_bingo(id):    
    cursor = conn.cursor()
    cursor.execute("select bingo.smiles(molb) from compound where id =" + str(id) )  
    mypic2 = str(cursor.fetchone()[0]) 
    indigo = Indigo()
    smile = mypic2;
#    return smile
#     mol1.layout()
    
#     renderer = IndigoRenderer(indigo);
#     indigo.setOption("render-output-format", "png");
#     indigo.setOption("render-margins", 10, 10);
#     if _platform == "Linux-3.13.0-36-generic-i686-with-Ubuntu-14.04-trusty":
#         datadir = ""        
#     elif _platform == "Linux-3.13.0-37-generic-i686-with-Ubuntu-14.04-trusty":
#         datadir = ""        
#     else:
#         datadir = os.environ['OPENSHIFT_DATA_DIR']
#         
#     print datadir + "mol.png"         
#     renderer.renderToFile(mol1, datadir + "mol.png");
#         
#     tempFileObj = NamedTemporaryFile(mode='w+b',suffix='png')
#     pilImage = open(datadir + 'mol.png','rb')
#     copyfileobj(pilImage,tempFileObj)
#     pilImage.close()
#     remove(datadir + 'mol.png')
#     tempFileObj.seek(0,0)
#     response = send_file(tempFileObj)

    response = renderInd(smile,"mol")
    
    response.headers['Content-Type'] = 'image/png'
    response.headers['Content-Disposition'] = 'attachment; filename=mol.png'
    return response

@bingo.route('/getMolBingo1/<int:id>', methods = ['GET'])
def get_mol_bingo1(id):
    cursor = conn.cursor()
    cursor.execute("select bingo.smiles(molb) from compound where id =" + str(id) )
    mypic2 = str(cursor.fetchone()[0])
    indigo = Indigo()
    smile = mypic2;
    # return smile
    mol1 = indigo.loadMolecule(smile);
    mol1.layout();
    
    renderer = IndigoRenderer(indigo);
    indigo.setOption("render-output-format", "png");
    indigo.setOption("render-margins", 10, 10);
    if _platform == "Linux-3.13.0-36-generic-i686-with-Ubuntu-14.04-trusty":
        datadir = ""        
    elif _platform == "Linux-3.13.0-39-generic-i686-with-Ubuntu-14.04-trusty":
        datadir = ""        
    else:
        datadir = os.environ['OPENSHIFT_DATA_DIR']
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

@bingo.route('/Reaction.asmx/MatchBingoReaction', methods = ['GET','POST'])
def match_reaction():
    try:
        if request.method == 'POST':
            ret1 = request.get_json(force=True, silent=True, cache=False)
            j = json.loads(ret1)    
            compound = j['compound'];
            c = j['cns'];
            o = j['searchType'];   
        else:
            compound = request.args.get('compound')
            c = request.args.get('cns')
            o = request.args.get('searchType')
            
        sql ="SELECT RXN_SCHEME_KEY, " + \
             "      (SELECT fullname " +\
             "        FROM cen_users" +\
             "       WHERE username = (SELECT username" +\
             "                           FROM cen_pages" +\
             "                          WHERE page_key = r.page_key))" +\
             "        AS username," +\
             "      (SELECT notebook" +\
             "        FROM cen_pages" +\
             "       WHERE page_key = r.page_key)" +\
             "        AS notebook," +\
             "      (SELECT experiment" +\
             "        FROM cen_pages" +\
             "       WHERE page_key = r.page_key)" +\
             "        AS page," +\
             "      (SELECT creation_date" +\
             "        FROM cen_pages" +\
             "       WHERE page_key = r.page_key)" +\
             "        AS creation_date," +\
             "      (SELECT subject" +\
             "        FROM cen_pages" +\
             "       WHERE page_key = r.page_key)" +\
             "        AS subject "
        
        if o == 'SSS':            
            sql = sql + " from cen_reaction_schemes r where native_rxn_sketch  @ ('" + compound + "', '')::bingo.rsub"
        else:
            sql = sql + " from cen_reaction_schemes r where native_rxn_sketch  @ ('" + compound + "', '')::bingo.rexact"
            
        print sql
        my_query = query_db(sql)

        json_output = json.dumps(my_query)
        return Response(response=json_output, status=200, mimetype="application/json")

    except TemplateNotFound:
        abort(404)   

@bingo.route('/viewBingo/<id>', methods=['GET'])
def view_bingo(id):
    try:
        return render_template('bingo.html', id=id)
    except TemplateNotFound:
        abort(404)    

def renderInd(smile, typeInd):
    indigo = Indigo()
    if typeInd == "rea":
        mol1 = indigo.loadReaction(smile)
    else:
        mol1 = indigo.loadMolecule(smile)

    renderer = IndigoRenderer(indigo);
    indigo.setOption("render-output-format", "png");
    indigo.setOption("render-margins", 10, 10);
    if _platform == "Linux-3.13.0-36-generic-i686-with-Ubuntu-14.04-trusty":
        datadir = ""        
    elif _platform == "Linux-3.13.0-39-generic-i686-with-Ubuntu-14.04-trusty":
        datadir = ""        
    else:
        datadir = os.environ['OPENSHIFT_DATA_DIR']
        
    unique_filename= str(uuid.uuid4()) + ".png"

    renderer.renderToFile(mol1, datadir + unique_filename);
        
    tempFileObj = NamedTemporaryFile(mode='w+b',suffix='png')
    pilImage = open(datadir + unique_filename,'rb')
    copyfileobj(pilImage,tempFileObj)
    pilImage.close()
    remove(datadir + unique_filename)
    tempFileObj.seek(0,0)
    response = send_file(tempFileObj)
    return response

#     unique_filename= uuid.uuid4()
#     unique_filename= "mol.png"
#     print mol1
#      + ".png"
    
class User(object):
    def __init__(self,j):
        self.__dict__= json.loads(j)
        