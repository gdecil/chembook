from flask import json
from os import remove
from indigo import *
from indigo_inchi import *
from indigo_renderer import *
from tempfile import *
from shutil import copyfileobj
import uuid
import psycopg2
import collections
from psycopg2.extensions import SQL_IN
import base64
from TorCfg import *
from bson import json_util
import requests, json
from xml.etree import ElementTree as ET

def renderInd(smile, typeInd):
#         print smile
        indigo = Indigo()
        if typeInd == "rea":
#            print str(smile)
            mol1 = indigo.loadReaction(str(smile))
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
            os.remove(unique_filename)
#             print str1
            
        return str1
    
class ChemLinkD(object):
    def __init__(self):
        global con 

    def get_batch_all(self, batch):        
        try:
            
            sql = 'select cmp_id as "cmp_id" from mar.basic_batch_vw where batch = \'' + batch + '\''          
#             sql = "select * from CEN_USERS where site_code = 'SITE1' and upper(fullname) like upper('%" + name + "%') order by username"          
            my_query = query_db(sql)
#            json_output = json.dumps(my_query)
            if  len(my_query) == 0:  
                js=""
                return js
            
            js ="["
            sql ='select object_definition as "object_definition", name as "name" from chemlinknet.clk_user_object_t where type =\'DB_TABLE\' and enabled = \'Y\''    
            my_query = query_db(sql)
            for s in my_query:
#                print s['object_definition']
                root = ET.fromstring(s['object_definition'])
#                tableName = ET.fromstring(s['object_definition']).find('table/tableName')
                schema = root.attrib['schema']
                tableName = root.attrib['tableName']
                description = root.attrib['description']
                print tableName
                for child in root:
                    print child.tag
                fields = root.findall("./fields/field")
#                 for f in fields:
#                     if f.attrib['selected'] == "1":
#                         print f.attrib['name']
#                 return ""
#                print tableName
                checklist = ['NMR_bms_VW','ADE_CAPRVWHAZGRD', 'BOT_BOTTLES_STRUC_V' , 'ADE_CAPRVWPRICEGRD', 'MDD_MOLS' , 'CHEMO_COMPOUND_STATISTIC_MV' , 'MDD_DATA', 'CCDB_DATA', 'CCDB_MOLECULE','PROVA_MOLS', 'PROVA_DATA', 'HSP90_MOLS', 'HSP90_DATA', 'NEW_DATABASE_MOLS','NEW_DATABASE_DATA','LMWKI_NOTES_VW','BOT_TRANSACTIONS_V','CAP_MAIN_COMPOUND_NEW_VW','GGG_MOLS','HYDRO_VARIAN_BOOKING_VW','mar_patents_vw','ADE_CAPRVWPHYSGRD','MAR_COMPOUND_BINGO_VW','LMWKI_STRUCTURE_NEW_VW','GGG_DATA','BMS_COMPOUNDS_VW','BOT_STRUCTURES_BINGO_VW','KINASE_SEQ_ALIGNED_4CLK_VW']
                
                if tableName not in checklist :
                    fi = ""
                    for f in fields:
                        if f.attrib['selected'] == "1":
                            fi = fi  + f.attrib['name'] + ","
#                             print f.attrib['name']
                
                    sql = 'select ' + fi[:-1] + ' from ' + schema + '.' + tableName + ' where batch =\'' + batch + '\''
                    my_query = query_db(sql)
                    if  len(my_query) > 0: 
                        js = js + '{"tablename":"' + tableName + '", "description":"' + description + '", "data": ' + json.dumps(my_query, default=json_util.default)  + ' },'
                
            js= js[:-1] + "]"            
            return js
            
            sql ='select * from basic_batch_vw where batch = \'CCN1\''    
            my_query = query_db(sql)
            return json.dumps(my_query, default=json_util.default)
            #print my_query
            #===================================================================
            # for s in my_query:
            #     for key in s.keys():
            #         print(key)
            #===================================================================

            return my_query
            
            js ="["
            count = 0
            for s in my_query:
                count = count +1
                js = js + '{"name": "' + str(s[0])  + '" },'
                
            js= js[:-1] + "]"
            
            
            return js
    
        except:
            raise
 
    def get_moleculeImage(self, strId):
        try:     
            sql = "SELECT compound as \"compound\" FROM mar_compound_mol_t r WHERE str_id = " + strId 
            my_query = query_db(sql)
            return renderInd(my_query[0]['compound'], "mol")
    
        except:
            raise   

    def get_stridFromBatch(self, batch):
        try:     
            sql = "SELECT str_id as \"strid\" FROM basic_batch_vw r WHERE batch = '" + batch + "'"
            my_query = query_db(sql)
#            print my_query
            return json.dumps(my_query) 
    
        except:
            raise   

class TornadoSelect(object):
    def __init__(self):
        global con 
        #con = conn
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
    
#     def renderInd(self, smile, typeInd):
# #         print smile
#         indigo = Indigo()
#         if typeInd == "rea":
# #            print str(smile)
#             mol1 = indigo.loadReaction(str(smile))
#         else:
# #             print smile
#             mol1 = indigo.loadMolecule(smile)
#     
#         renderer = IndigoRenderer(indigo);
#         indigo.setOption("render-output-format", "png");
#         indigo.setOption("render-margins", 10, 10);
#         datadir = ""
#             
#         unique_filename= str(uuid.uuid4()) + ".png"
#         renderer.renderToFile(mol1, datadir + unique_filename);
#         
#         with open(datadir + unique_filename, 'rb') as imageFile:
#             str1 = base64.b64encode(imageFile.read())
#             os.remove(unique_filename)
# #             print str1
#             
#         return str1

    def convertMolToSmile(self, mol0, typeInd):
        if type(mol0) is dict: 
            mol = mol0['mol'];
        else:
            dict1 = json.loads(mol0)
            mol = dict1['mol'];
        
#         print smile
        indigo = Indigo()
        if typeInd == "rea":
#            print str(smile)
            mol1 = indigo.loadReaction(str(mol))
        else:
#             print smile
            mol1 = indigo.loadMolecule(mol)
            smile = mol1.canonicalSmiles()
            
        return smile

    def convertMolToInchi(self, mol0, typeInd):
        if type(mol0) is dict: 
            mol = mol0['mol'];
        else:
            dict1 = json.loads(mol0)
            mol = dict1['mol'];
        
#         print smile
        indigo = Indigo()
        indigo_inchi = IndigoInchi(indigo);
        mol1 = indigo.loadMolecule(mol)
        inchi = indigo_inchi.getInchi(mol1)
#             print smile
                    
        return inchi

    def get_experiment(self, notebook, page, enumVal):
        try: 
            if enumVal=="undefined":
                sql="select rxn_scheme_key as \"rxn_scheme_key\", page_key as \"page_key\", fullname as \"fullname\", user_id as \"user_id\", owner_username as \"owner_username\", notebook as \"notebook\", experiment as \"experiment\", to_char(creation_date, 'mm/dd/yyyy') as \"creation_date\", subject as \"subject\", procedure as \"procedure\", page_status as \"page_status\", project_code as \"project_code\", project_alias as \"project_alias\", continued_from_rxn as \"continued_from_rxn\", continued_to_rxn as \"continued_to_rxn\", literature_ref as \"literature_ref\", batch_creator as \"batch_creator\", batch_owner as \"batch_owner\", synth_route_ref as \"synth_route_ref\", yield as \"yield\", issuccessful as \"issuccessful\" from pages_vw where notebook ='" + notebook \
                + "' and experiment  = '" + page + "' and (SYNTH_ROUTE_REF = '' or SYNTH_ROUTE_REF is null)";                    
            else:
                sql = "select * from pages_vw where notebook ='" + notebook \
                + "' and experiment  = '" + page + "' and SYNTH_ROUTE_REF =" + enumVal;
             
            my_query = query_db(sql)
#            print my_query
            json_output = json.dumps(my_query)            
            return json_output
    
        except:
            raise   
        
    def get_experimentTreeview(self, notebook, page, enumVal):
        try: 
            if enumVal=="undefined":
                sql="select user_id as \"user_id\", fullname as \"fullname\", notebook as \"notebook\" from pages_vw where notebook ='" + notebook \
                + "' and experiment  = '" + page + "' and (SYNTH_ROUTE_REF = '' or SYNTH_ROUTE_REF is null)";                    
            else:
                sql = "select user_id as \"user_id\", fullname as \"fullname\", notebook as \"notebook\" from pages_vw where notebook ='" + notebook \
                + "' and experiment  = '" + page + "' and SYNTH_ROUTE_REF =" + enumVal;
             
            my_query = query_db(sql)
            json_output = json.dumps(my_query)            
            js ="["
            count=0
            for s in my_query:
                count = count + 1
                js = js + '{"userid": "' + s['user_id'] + '", "label": "' + s['fullname'] + '", "id": "role' + str(count)+ '", "children" : [{"id" : "' + s['notebook'] + '", "label" : "' + s['notebook'] + '", "notebook" : "' + s['notebook'] + '","collapsed": false, "children" : [{"id": "' + s['notebook'] + '","label": "' + page + '", "collapsed": false}]}], "collapsed": false},'
                
            js= js[:-1] + "]"
            return js    
    
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

    def get_fullnameAng(self):        
        try:
            sql = 'select fullname as "fullname", password as "password" from CEN_USERS where site_code = \'SITE1\' order by username'         
            my_query = query_db(sql)
#            json_output = json.dumps(my_query)
            print my_query
#            print json_output
            js ="["
            count=0
            for s in my_query:
                count = count + 1
                js = js + '{"userid": "' + s['password'] + '", "label": "' + s['fullname'] + '", "id": "role' + str(count) + '", "children" : [], "collapsed": false},'
                
            js= js[:-1] + "]"
            return js    
        except:
            raise

    def get_userByName(self, name):        
        try:
            sql = 'select fullname as "fullname", password as "password"  from CEN_USERS where site_code = \'SITE1\' and upper(fullname) like upper(\'%%' + name + '%%\') order by username'          
#             sql = "select * from CEN_USERS where site_code = 'SITE1' and upper(fullname) like upper('%" + name + "%') order by username"          
            my_query = query_db(sql)
            json_output = json.dumps(my_query)
            if  len(my_query) == 0:  
                js=""
                return js
                
            js ="["
            count = 0
            for s in my_query:
                count = count +1
                a = s['fullname'].split(',')
                js = js + '{"id": "' + s['password'] + '", "firstName": "' + a[0] + \
                '", "lastName": "' + a[1] + '" },'
                
            js= js[:-1] + "]"
            return js
    
        except:
            raise
        
    def get_userById(self, id):        
        try:
            sql = "select * from CEN_USERS where site_code = 'SITE1' and password = '" + id + "'"          
            my_query = query_db(sql)
            json_output = json.dumps(my_query)
            if  len(my_query) == 0:  
                js=""
                return js
                
            js ="["
            count = 0
            for s in my_query:
                count = count +1
                a = s['fullname'].split(',')
                js = js + '{"id": "' + s['password'] + '", "firstName": "' + a[0] + \
                '", "lastName": "' + a[1] + '", "email": "' + s['email'] + '", "status": "' + s['status'] + '" },'
                
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

    def get_usernotebooksbyId(self, id):
        try:
            sql = "select distinct notebook as \"notebook\" from CEN_PAGES where owner_username =(select "  + \
            "username from CEN_USERS where password = '" + id \
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
            sql = "select distinct experiment as \"experiment\" from CEN_PAGES where notebook ='" + notebook + \
            "' order by experiment"  
                    
            my_query = query_db(sql)
            if  len(my_query) > 0:            
                json_output = json.dumps(my_query)
                js ="["
                for s in my_query:
                    js = js + '{"notebook": "' + notebook + '","title": "' + s['experiment'] + '", "isLazy": false },'
                    
                js= js[:-1] + "]"
                return js
            else:
                return '{"title": "No Records", "isLazy": true }'
                
        except:
            raise   
                            
    def get_checkReaEnum(self, notebook, page):
        try:     
            sql="SELECT count(*) as \"count\" FROM cen_reaction_schemes r  " + \
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
            sql = "SELECT bingo.rxnfile(r.native_rxn_sketch) as \"reaction\" FROM cen_reaction_schemes r WHERE RXN_SCHEME_KEY = '" + idReaction + \
            "'"
            my_query = query_db(sql)
#             print my_query[0]['reaction']
            
            return my_query[0]['reaction']
#             return self.renderInd(my_query[0]['reaction'], "rea")
    
        except:
            raise   
                
    def get_reactionImage(self, idReaction):
        try:     
            sql = "SELECT bingo.rxnfile(r.native_rxn_sketch) as \"reaction\" FROM cen_reaction_schemes r WHERE RXN_SCHEME_KEY = '" + idReaction + \
            "'"
            my_query = query_db(sql)
            return renderInd(my_query[0]['reaction'], "rea")
    
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

    def get_toxnet(self, cas):
        try:     
            url="http://toxgate.nlm.nih.gov/cgi-bin/sis/search2/x?dbs+hsdb:" + cas
            print url       
            r=requests.get(url)
            value = ET.fromstring(r.text.replace("<br>", "")).find('TemporaryFile')
            return value.text
    
        except:
            raise   

    def match_reaction(self, rxn):
        try:
            print rxn
            print type(rxn)
#            print rxn['compound']
            if type(rxn) is dict: 
                compound = rxn['compound'];
                c = rxn['cns'];
                o = rxn['searchType'];   
            else:
                dict1 = json.loads(rxn)
                compound = dict1['compound'];
                c = dict1['cns'];
                o = dict1['searchType'];   
                
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
                 "      (SELECT to_char(creation_date, 'DD Mon YYYY HH12:MI:SS') " +\
                 "        FROM cen_pages" +\
                 "       WHERE page_key = r.page_key)" +\
                 "        AS creation_date," +\
                 "      (SELECT subject" +\
                 "        FROM cen_pages" +\
                 "       WHERE page_key = r.page_key)" +\
                 "        AS subject "
            
            if o == 'SSS':            
                sql = sql + " from cen_reaction_schemes r where native_rxn_sketch  @ ('" + compound + "', '')::bingo.rsub"
            elif o =='text':
                tmp = compound.split('-')  
                sql = "select " + \
                 "      (SELECT rxn_scheme_key FROM cen_reaction_schemes WHERE page_key = r.page_key) AS RXN_SCHEME_KEY, " + \
                 "      (SELECT fullname FROM cen_users WHERE username = (SELECT username FROM cen_pages WHERE page_key = r.page_key))  AS username," + \
                 "      (SELECT notebook FROM cen_pages WHERE page_key = r.page_key) AS notebook," + \
                 "      (SELECT experiment FROM cen_pages WHERE page_key = r.page_key) AS page," + \
                 "      (SELECT to_char(creation_date, 'DD Mon YYYY HH12:MI:SS') FROM cen_pages WHERE page_key = r.page_key) AS creation_date," + \
                 "      (SELECT subject FROM cen_pages WHERE page_key = r.page_key) AS subject" + \
                 "      from  cen_pages r where r.experiment = '" + tmp[1] + "' and  r.notebook='" + tmp[0] + "'"
            elif o =='fulltext':
                sql = "select " + \
                 "      (SELECT rxn_scheme_key FROM cen_reaction_schemes WHERE page_key = r.page_key) AS RXN_SCHEME_KEY, " + \
                 "      (SELECT fullname FROM cen_users WHERE username = (SELECT username FROM cen_pages WHERE page_key = r.page_key))  AS username," + \
                 "      (SELECT notebook FROM cen_pages WHERE page_key = r.page_key) AS notebook," + \
                 "      (SELECT experiment FROM cen_pages WHERE page_key = r.page_key) AS page," + \
                 "      (SELECT to_char(creation_date, 'DD Mon YYYY HH12:MI:SS') FROM cen_pages WHERE page_key = r.page_key) AS creation_date," + \
                 "      (SELECT subject FROM cen_pages WHERE page_key = r.page_key) AS subject" + \
                 "      from  cen_pages r where r.page_key in (SELECT p.page_key FROM cen_pages p WHERE upper(p.notebook) LIKE upper('%%" + compound + "%%') or upper(p.username) LIKE upper('%%" + compound + "%%') union SELECT p.page_key FROM cen_pages p WHERE p.username in (select p.username FROM cen_users p WHERE upper(p.username) LIKE upper('%%" + compound + "%%') or upper(p.fullname) LIKE upper('%%" + compound + "%%')) order by 1,2,3)  order by 2,3,4"                    
            else:
                sql = sql + " from cen_reaction_schemes r where native_rxn_sketch  @ ('" + compound + "', '')::bingo.rexact"
            my_query = query_db(sql)
            print my_query
            x = []
            for row in my_query:                
                x.append(dict((k.lower(), v) for k, v in row.iteritems())) 

            if  len(x) > 0:            
                json_output = json.dumps(x)
                return json_output
            else:
                return '{"ret": "0", "isLazy": true }'    
        except: 
            raise
        
#===============================================================================
# def get_reactionI():
#     try:
#         id = request.args.get('idReaction')
#         c = request.args.get('rand')
#  
#         sql = "SELECT bingo.rxnfile(r.native_rxn_sketch) as reaction FROM cen_reaction_schemes r WHERE RXN_SCHEME_KEY = '" + id + "'"
#         my_query = query_db(sql)
# #         print str(my_query)
#         if str(my_query) != '[]':
#             response =renderInd(my_query[0]['reaction'],"rea")
#             response.headers['Content-Type'] = 'image/png'
#             response.headers['Content-Disposition'] = 'attachment; filename=mol.png'
#         else:
#             response = ""
#         return response
# 
#     except TemplateNotFound:
#         abort(404)   
#                 
# def get_projects():
# #     ret = json.dumps('{"ret":"OK"}')
# #     resp = Response(response=ret, status=200, mimetype="application/json")
# #     return resp
# 
# #     json_output = json.dumps('{"NAME":"PR1", "NAME":"PR2"}')   non va bene con js
#     json_output = '[{"NAME":"PR1"}, {"NAME":"PR2"}]'                        
#     return Response(response=json_output, status=200, mimetype="application/json")
# 
# def get_mol_bingo(id):    
#     cursor = conn.cursor()
#     cursor.execute("select bingo.smiles(molb) from compound where id =" + str(id) )  
#     mypic2 = str(cursor.fetchone()[0]) 
#     indigo = Indigo()
#     smile = mypic2;
#     response = renderInd(smile,"mol")
#     
#     response.headers['Content-Type'] = 'image/png'
#     response.headers['Content-Disposition'] = 'attachment; filename=mol.png'
#     return response
# 
# def get_mol_bingo1(id):
#     cursor = conn.cursor()
#     cursor.execute("select bingo.smiles(molb) from compound where id =" + str(id) )
#     mypic2 = str(cursor.fetchone()[0])
#     indigo = Indigo()
#     smile = mypic2;
#     # return smile
#     mol1 = indigo.loadMolecule(smile);
#     mol1.layout();
#     
#     renderer = IndigoRenderer(indigo);
#     indigo.setOption("render-output-format", "png");
#     indigo.setOption("render-margins", 10, 10);
#     if _platform == "Linux-3.13.0-36-generic-i686-with-Ubuntu-14.04-trusty":
#         datadir = ""        
#     elif _platform == "Linux-3.13.0-39-generic-i686-with-Ubuntu-14.04-trusty":
#         datadir = ""        
#     else:
#         datadir = os.environ['OPENSHIFT_DATA_DIR']
#     renderer.renderToFile(mol1, datadir + "mol.png");
#     tempFileObj = NamedTemporaryFile(mode='w+b',suffix='png')
#     pilImage = open(datadir + 'mol.png','rb')
#     copyfileobj(pilImage,tempFileObj)
#     pilImage.close()
#     remove(datadir + 'mol.png')
#     tempFileObj.seek(0,0)
#     response = send_file(tempFileObj)
#     response.headers['Content-Type'] = 'image/png'
#     response.headers['Content-Disposition'] = 'attachment; filename=mol.png'
#     return response
# 
# def view_bingo(id):
#     try:
#         return render_template('bingo.html', id=id)
#     except TemplateNotFound:
#         abort(404)    
#     
#===============================================================================
class User(object):
    def __init__(self,j):
        self.__dict__= json.loads(j)
        