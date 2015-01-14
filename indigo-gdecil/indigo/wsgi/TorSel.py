from flask import json
from os import remove
from indigo import *
from indigo_renderer import *
from tempfile import *
from shutil import copyfileobj
import uuid
import psycopg2
import collections

# from bingoCfg import conn, _platform, query_db
from psycopg2.extensions import SQL_IN
import base64
from TorCfg import *

class TornadoSelect(object):
    def __init__(self):
        global con 
        con = conn
#         con = psycopg2.connect(host='localhost', database='postgres', user='postgres', password='postgres', port=5432)

    def getListpg(self):
        cur = con.cursor()
        sql = """
            SELECT id, username, email, password
            FROM users_user
        """
        cur.execute(sql)
        desc = cur.description
        result = [dict(zip([col[0] for col in desc], row))
                         for row in cur.fetchall()]
    
        cur.close()    
        return result
    
    def renderInd(self, smile, typeInd):
#         print smile
        indigo = Indigo()
        if typeInd == "rea":
            mol1 = indigo.loadReaction(smile)
        else:
#             print smile
            mol1 = indigo.loadMolecule(smile)
    
        renderer = IndigoRenderer(indigo);
        indigo.setOption("render-output-format", "png");
        indigo.setOption("render-margins", 10, 10);
        datadir = ""
            
        unique_filename= str(uuid.uuid4()) + ".png"
    
        renderer.renderToFile(mol1, datadir + unique_filename);
        
        with open(datadir + unique_filename, 'rb') as imageFile:
            str1 = base64.b64encode(imageFile.read())
#             print str1
            
        return str1

    def get_experiment(self, notebook, page, enumVal):
        try: 
            if enumVal=="undefined":
                sql="select * from pages_vw where notebook ='" + notebook \
                + "' and experiment  = '" + page + "' and (SYNTH_ROUTE_REF = '' or SYNTH_ROUTE_REF is null)";                    
            else:
                sql = "select * from pages_vw where notebook ='" + notebook \
                + "' and experiment  = '" + page + "' and SYNTH_ROUTE_REF =" + enumVal;
             
            my_query = query_db(sql)
            json_output = json.dumps(my_query)            
            return json_output
    
        except:
            raise   
        
    def get_fullname(self):        
        try:
            sql = "select fullname from CEN_USERS where site_code = 'SITE1' order by username"          
            my_query = query_db(sql)
            json_output = json.dumps(my_query)
            js ="["
            for s in my_query:
                js = js + '{"title": "' + s['fullname'] + \
                '", "isLazy": true , "icon": "/js/vendor/jquery.dynatree/skin-custom/PersonIcon16.gif"},'
                
            js= js[:-1] + "]"
            return js
    
        except:
            raise

    def get_projects(self):
        json_output = '[{"NAME":"PR1"}, {"NAME":"PR2"}]'                        
        return json_output
    
    def get_usernotebooks(self, userFullname):
        try:
            print userFullname
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
                return js
            else:
                return '{"title": "No Records", "isLazy": true }'
                
        except:
            raise

    def get_pagesnotebooks(self, notebook):
        try:                
            sql = "select distinct experiment  from CEN_PAGES where notebook ='" + notebook + \
            "' order by experiment"  
                    
            my_query = query_db(sql)
            if  len(my_query) > 0:            
                json_output = json.dumps(my_query)
                js ="["
                for s in my_query:
                    js = js + '{"title": "' + s['experiment'] + '", "isLazy": false },'
                    
                js= js[:-1] + "]"
                return js
            else:
                return '{"title": "No Records", "isLazy": true }'
                
        except:
            raise   
                            
    def get_checkReaEnum(self, notebook, page):
        try:     
            sql="SELECT count(*) FROM cen_reaction_schemes r  " + \
                    "    WHERE reaction_type = 'ENUMERATED' and length(r.native_rxn_sketch) > 0  " + \
                    "    and page_key = (select page_key from CEN_PAGES where notebook ='" + notebook + \
                    "'  and experiment  = '" + page + "') ";
                                                    
            my_query = query_db(sql)
            dict = my_query[0]
#             print dict['count']
            return dict['count']
    
        except:
            raise

    def get_reagents(self, notebook, page, enumVal):
        try:                
            if enumVal == "undefined":            
                sql = "select * from batch_lev3_vw where notebook ='" + notebook + \
                "' and experiment  = '" + page + \
                "' and batch_type in ('SOLVENT' , 'REAGENT', 'REACTANT') and SYNTH_ROUTE_REF = ''"  
            else:
                sql = "select * from batch_vw where notebook ='" + notebook + \
                "' and experiment  = '" + page + \
                "' and batch_type in ('SOLVENT' , 'REAGENT', 'REACTANT') and SYNTH_ROUTE_REF =" + enumVal
#             print sql
            my_query = query_db(sql)
            
            x = []
            for row in my_query:                
                x.append(dict((k.upper(), v) for k, v in row.iteritems())) 
#             print x
            if  len(x) > 0:            
                json_output = json.dumps(x)
                return json_output
            else:
                return '{"ret": "0", "isLazy": true }'

                
        except :
            raise
        
    def get_reaction(self, idReaction):
        try:     
            sql = "SELECT bingo.rxnfile(r.native_rxn_sketch) as reaction FROM cen_reaction_schemes r WHERE RXN_SCHEME_KEY = '" + idReaction + \
            "'"
            my_query = query_db(sql)
#             print my_query[0]['reaction']
            
            return my_query[0]['reaction']
#             return self.renderInd(my_query[0]['reaction'], "rea")
    
        except:
            raise   
                
    def get_reactionImage(self, idReaction):
        try:     
            sql = "SELECT bingo.rxnfile(r.native_rxn_sketch) as reaction FROM cen_reaction_schemes r WHERE RXN_SCHEME_KEY = '" + idReaction + \
            "'"
            my_query = query_db(sql)
            return self.renderInd(my_query[0]['reaction'], "rea")
    
        except:
            raise   

    def FromReactionToMolecules(self, rxn):
        try:     
            indigo = Indigo()
            rea = indigo.loadReaction(rxn)
#             print rea
            l =[]
            count =0
            reag = collections.OrderedDict()
            for item in rea.iterateReactants():
                count = count +1
                item.setName("Reactant"+str(count))
                reag['rxn']= item.molfile()
                l.append(reag.copy())

            count =0
            for item in rea.iterateProducts():
                count = count +1
                item.setName("Product"+str(count))
                reag['rxn']= item.molfile()
                l.append(reag.copy())

            return json.dumps(l, sort_keys=False)
    
        except:
            raise   
        
    def GetReagentsIndigo(self, rxn):
        try:     
            indigo = Indigo()
            rea = indigo.loadReaction(rxn)
#             print rea
            l =[]
            count =0
            for item in rea.iterateReactants():
                count = count +1
                reag = collections.OrderedDict()

                reag['id'] = count
                reag['NOTEBOOK']= ""
                reag['EXPERIMENT']=""
                reag['CHEMICAL_NAME']="Reactant" + str(count)
                reag['BATCH_MW_VALUE']=str(item.molecularWeight()).replace(',', '.')
                reag['MOLECULAR_FORMULA']= item.grossFormula()
                reag['BATCH_TYPE']="REAGENT"
                reag['MOLE_VALUE']=""
                reag['MOLE_UNIT_CODE']=""
                reag['PURITY_VALUE']=""
                reag['PURITY_UNIT_CODE']=""
                reag['VOLUME_VALUE']= ""
                reag['VOLUME_UNIT_CODE']= ""
                reag['MOLARITY_VALUE']= ""
                reag['MOLARITY_UNIT_CODE']= ""
                reag['DENSITY_VALUE']= ""
                reag['DENSITY_UNIT_CODE']= ""
                reag['WEIGHT_VALUE']= ""
                reag['WEIGHT_UNIT_CODE']= ""
                reag['CAS_NUMBER']= ""
                reag['USER_HAZARD_COMMENTS']= ""
                reag['COMPOUND']= item.molfile()
                l.append(reag)
#             print l
#             print json.dumps(l, sort_keys=False)
            return json.dumps(l, sort_keys=False)
    
        except:
            raise   

    def GetProductsIndigo(self, rxn):
        try:     
            indigo = Indigo()
            rea = indigo.loadReaction(rxn)
#             print rea
            l =[]
            count =0
            for item in rea.iterateProducts():
                count = count +1
                reag = collections.OrderedDict()

                reag['id'] = count
                reag['NOTEBOOK']= ""
                reag['EXPERIMENT']=""
                reag['CHEMICAL_NAME']="Product" + str(count)
                reag['BATCH_MW_VALUE']=str(item.molecularWeight()).replace(',', '.')
                reag['MOLECULAR_FORMULA']= item.grossFormula()
                reag['BATCH_TYPE']="PRODUCT"
                reag['MOLE_VALUE']=""
                reag['MOLE_UNIT_CODE']=""
                reag['PURITY_VALUE']=""
                reag['PURITY_UNIT_CODE']=""
                reag['VOLUME_VALUE']= ""
                reag['VOLUME_UNIT_CODE']= ""
                reag['MOLARITY_VALUE']= ""
                reag['MOLARITY_UNIT_CODE']= ""
                reag['DENSITY_VALUE']= ""
                reag['DENSITY_UNIT_CODE']= ""
                reag['WEIGHT_VALUE']= ""
                reag['WEIGHT_UNIT_CODE']= ""
                reag['CAS_NUMBER']= ""
                reag['USER_HAZARD_COMMENTS']= ""
                reag['COMPOUND']= item.molfile()
                l.append(reag.copy())
#             print json.dumps(l)
            return json.dumps(l, sort_keys=False)
    
        except:
            raise   
        
    def get_products(self, notebook, page, enumVal):
        try:
            if enumVal == "undefined":            
                sql = "select * from batch_lev3_vw where notebook ='" + notebook + "' and experiment  = '" + page + \
                "' and batch_type in ('PRODUCT' ,'INTENDED' , 'ACTUAL') and SYNTH_ROUTE_REF = ''"  
            else:
                sql = "select * from batch_vw where notebook ='" + notebook + "' and experiment  = '" + page + \
                "' and batch_type in ('PRODUCT' ,'INTENDED' , 'ACTUAL') and SYNTH_ROUTE_REF =" + enumVal
    
            my_query = query_db(sql)
            x = []
            for row in my_query:                
                x.append(dict((k.upper(), v) for k, v in row.iteritems())) 
#             print x
            if  len(x) > 0:            
                json_output = json.dumps(x)
                return json_output
            else:
                return '{"ret": "0", "isLazy": true }'
        except:
            raise

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
                
def get_projects():
#     ret = json.dumps('{"ret":"OK"}')
#     resp = Response(response=ret, status=200, mimetype="application/json")
#     return resp

#     json_output = json.dumps('{"NAME":"PR1", "NAME":"PR2"}')   non va bene con js
    json_output = '[{"NAME":"PR1"}, {"NAME":"PR2"}]'                        
    return Response(response=json_output, status=200, mimetype="application/json")




def get_mol_bingo(id):    
    cursor = conn.cursor()
    cursor.execute("select bingo.smiles(molb) from compound where id =" + str(id) )  
    mypic2 = str(cursor.fetchone()[0]) 
    indigo = Indigo()
    smile = mypic2;
    response = renderInd(smile,"mol")
    
    response.headers['Content-Type'] = 'image/png'
    response.headers['Content-Disposition'] = 'attachment; filename=mol.png'
    return response

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
            
        my_query = query_db(sql)
        json_output = json.dumps(my_query)
        return Response(response=json_output, status=200, mimetype="application/json")

    except TemplateNotFound:
        abort(404)   

def view_bingo(id):
    try:
        return render_template('bingo.html', id=id)
    except TemplateNotFound:
        abort(404)    
    
class User(object):
    def __init__(self,j):
        self.__dict__= json.loads(j)
        