from flask import json
from os import remove
from indigo import *
from indigo_renderer import *
from tempfile import *
from shutil import copyfileobj
import uuid
import psycopg2
# from bingoCfg import conn, _platform, query_db
from psycopg2.extensions import SQL_IN
import base64
from TorCfg import *
from tornado import escape
from utility import *

class TornadoInsert(object):
    def __init__(self):
        global con 
        con = conn

    def insert_detail(self, request):
        print request
        j=request
#         dict = escape.json_decode(request)
#         print dict
#         j = json.loads(request)
        v_detail = j['detail']['OWNER_USERNAME'];

        cursor = conn.cursor()
        sql = "SELECT COUNT (NOTEBOOK) FROM CEN_NOTEBOOKS WHERE NOTEBOOK = '" + \
                       j['detail']['NOTEBOOK'] + "'" 
                       
        my_query = query_db(sql)
        c = my_query[0]['count']
            
    #     print c
    
        if str(c) == '0':
            cursor.execute("""INSERT INTO CEN_NOTEBOOKS (SITE_CODE, USERNAME, NOTEBOOK, STATUS, XML_METADATA, LAST_MODIFIED) 
                VALUES ('SITE1', '""" + j['detail']['OWNER_USERNAME']  + """', '""" + j['detail']['NOTEBOOK'] + \
                """', 'OPEN', xml('<?xml version="1.0" encoding="UTF-8"?><Notebook_Properties/>'),
                LOCALTIMESTAMP)""")
    
        sql = "SELECT page_key FROM cen_pages WHERE notebook ='" + \
                j['detail']['NOTEBOOK']  + "' AND experiment = '" + j['detail']['EXPERIMENT']  +"'" 
                       
        my_query = query_db(sql)
        countExp = my_query[0]
        
        if len(countExp) ==1:
            resp = countExp
            return resp
        
        id = id_generator(40)
        yieldd = j['detail']['YIELD']
        if  yieldd == "":
             yieldd = '0'
            
        cursor.execute("""INSERT INTO CEN_PAGES (page_key,
                                               SITE_CODE,
                                               NOTEBOOK,
                                               EXPERIMENT,
                                               USERNAME,
                                               OWNER_USERNAME,
                                               LOOK_N_FEEL,
                                               PAGE_STATUS,
                                               CREATION_DATE,
                                               MODIFIED_DATE,
                                               XML_METADATA,
                                               PROCEDURE,
                                               PAGE_VERSION,
                                               LATEST_VERSION,
                                               TA_CODE,
                                               PROJECT_CODE,
                                               LITERATURE_REF,
                                               SUBJECT,
                                               MIGRATED_TO_PCEN,
                                               BATCH_OWNER,
                                               BATCH_CREATOR,
                                               NBK_REF_VERSION,
                                               VERSION,
                                               YIELD,
                                               ISSUCCESSFUL)
              VALUES ('""" + id +"""',
                      'SITE1',
                      '""" + j['detail']['NOTEBOOK']  +"""',
                      '""" + j['detail']['EXPERIMENT'] +"""',
                      '""" + j['detail']['OWNER_USERNAME']  +"""',
                      '""" + j['detail']['OWNER_USERNAME']  +"""',
                      'MED-CHEM',
                      'OPEN',
                      LOCALTIMESTAMP,
                      LOCALTIMESTAMP,
                      xml('<?xml version="1.0" encoding="UTF-8"?><Page_Properties><Meta_Data><Archive_Date/><Signature_Url/><Table_Properties/><Ussi_Key>0</Ussi_Key><Auto_Calc_On>true</Auto_Calc_On><Cen_Version></Cen_Version><Completion_Date></Completion_Date><Continued_From_Rxn> </Continued_From_Rxn><Continued_To_Rxn> </Continued_To_Rxn><Project_Alias> </Project_Alias><DSP><Comments/><Description/><Procedure_Width>0</Procedure_Width><designUsers/><ScreenPanels/><Scale><Calculated>true</Calculated><Default_Value>0.0</Default_Value><Unit><Code></Code><Description></Description></Unit><Value>0</Value></Scale><PrototypeLeasdIDs/><DesignSite/><DesignCreationDate></DesignCreationDate><PID/><SummaryPID>null</SummaryPID><VrxnID/></DSP><ConceptionKeyWords/><ConceptorNames/></Meta_Data></Page_Properties>'),
                      'procedure',
                      1,
                      'Y',
                      'XX',
                      '""" + j['detail']['PROJECT_CODE'] +"""',
                      '""" + j['detail']['LITERATURE_REF'] +"""',
                      '""" + j['detail']['SUBJECT'] +"""',
                      'N',
                      '""" + j['detail']['OWNER_USERNAME']  +"""',
                      '""" + j['detail']['OWNER_USERNAME']  +"""',
                      '""" + j['detail']['NOTEBOOK']  + "-" + j['detail']['EXPERIMENT'] + "-1" + """',
                      1,
                      '""" + yieldd + """',
                      '""" + j['detail']['ISSUCCESSFUL'] + """')""")
        
    #                   '""" + j['detail']['YIELD'] + """',
    
        ret = json.dumps('{"ret":"' + id + '"}')
        resp = ret
    
        conn.commit()
        return resp

    def update_detail(self, id, request):
        cursor = conn.cursor()
        cursor.execute("""update CEN_PAGES page_key,
                                               SITE_CODE,
                                               NOTEBOOK,
                                               EXPERIMENT,
                                               USERNAME,
                                               OWNER_USERNAME,
                                               LOOK_N_FEEL,
                                               PAGE_STATUS,
                                               CREATION_DATE,
                                               MODIFIED_DATE,
                                               XML_METADATA,
                                               PROCEDURE,
                                               PAGE_VERSION,
                                               LATEST_VERSION,
                                               TA_CODE,
                                               PROJECT_CODE,
                                               LITERATURE_REF,
                                               SUBJECT,
                                               MIGRATED_TO_PCEN,
                                               BATCH_OWNER,
                                               BATCH_CREATOR,
                                               NBK_REF_VERSION,
                                               VERSION,
                                               YIELD,
                                               ISSUCCESSFUL)
              VALUES ('""" + id +"""',
                      'SITE1',
                      '""" + j['detail']['NOTEBOOK']  +"""',
                      '""" + j['detail']['EXPERIMENT'] +"""',
                      '""" + j['detail']['OWNER_USERNAME']  +"""',
                      '""" + j['detail']['OWNER_USERNAME']  +"""',
                      'MED-CHEM',
                      'OPEN',
                      LOCALTIMESTAMP,
                      LOCALTIMESTAMP,
                      xml('<?xml version="1.0" encoding="UTF-8"?><Page_Properties><Meta_Data><Archive_Date/><Signature_Url/><Table_Properties/><Ussi_Key>0</Ussi_Key><Auto_Calc_On>true</Auto_Calc_On><Cen_Version></Cen_Version><Completion_Date></Completion_Date><Continued_From_Rxn> </Continued_From_Rxn><Continued_To_Rxn> </Continued_To_Rxn><Project_Alias> </Project_Alias><DSP><Comments/><Description/><Procedure_Width>0</Procedure_Width><designUsers/><ScreenPanels/><Scale><Calculated>true</Calculated><Default_Value>0.0</Default_Value><Unit><Code></Code><Description></Description></Unit><Value>0</Value></Scale><PrototypeLeasdIDs/><DesignSite/><DesignCreationDate></DesignCreationDate><PID/><SummaryPID>null</SummaryPID><VrxnID/></DSP><ConceptionKeyWords/><ConceptorNames/></Meta_Data></Page_Properties>'),
                      'procedure',
                      1,
                      'Y',
                      'XX',
                      '""" + j['detail']['PROJECT_CODE'] +"""',
                      '""" + j['detail']['LITERATURE_REF'] +"""',
                      '""" + j['detail']['SUBJECT'] +"""',
                      'N',
                      '""" + j['detail']['OWNER_USERNAME']  +"""',
                      '""" + j['detail']['OWNER_USERNAME']  +"""',
                      '""" + j['detail']['NOTEBOOK']  + "-" + j['detail']['EXPERIMENT'] + "-1" + """',
                      1,
                      '""" + yieldd + """',
                      '""" + j['detail']['ISSUCCESSFUL'] + """')""")        
        conn.commit()
        return '1'

def insert_reactionP(): 
    ret1 = request.get_json(force=True, silent=True, cache=False)
    j = json.loads(ret1)    
    v_struct = j['struct'];
    v_pageKey = j['pageKey'];
    v_structType = j['structType'];    
    v_nRea = j['nRea'];
    if len(v_struct) < 120:
        return Response(response=json.dumps('{"ret":"Empty Reaction"}'), status=200, mimetype="application/json")
    id = insert_reaction(v_pageKey,v_structType,v_nRea)
    return Response(response=json.dumps('{"ret":"' + id + '"}'), status=200, mimetype="application/json")
    
def insert_reaction(v_pageKey,v_struct, v_structType,v_nRea): 
    id = id_generator(40)
    if v_nRea == None:
        v_nRea = ''
        
    cursor = conn.cursor()
    cursor.execute("""INSERT INTO CEN_REACTION_SCHEMES (RXN_SCHEME_KEY,
                                                      PAGE_KEY,
                                                      REACTION_TYPE,
                                                      XML_METADATA,
                                                      SYNTH_ROUTE_REF,
                                                      VERSION,
                                                      LAST_MODIFIED)
          VALUES ('""" + id +"""',
                  '""" + v_pageKey +"""',
                  '""" + v_structType +"""',
                  xml('<?xml version="1.0" encoding="UTF-8"?><Reaction_Properties><Meta_Data></Meta_Data></Reaction_Properties>'),
                  '""" + v_nRea +"""',
                  0,
                  LOCALTIMESTAMP)""")
                  
# INSERT INTO compound values(2, bingo.compactmolecule('c1ccccc1', false)); 

    cursor.execute("""UPDATE cen_reaction_schemes
         SET native_rxn_sketch = BINGO.COMPACTREACTION ('""" + v_struct +"""', true)
       WHERE RXN_SCHEME_KEY = '""" + id +"""'""")
    
    conn.commit()                     
    return id

def insert_page():
    ret = json.dumps('{"ret":"OK"}')
    resp = Response(response=ret, status=200, mimetype="application/json")
    return resp
    
    ret1 = request.get_json(force=True, silent=True, cache=False)
    j = json.loads(ret1)    
    v_notebook = j['NOTEBOOK'];
    v_owner_username = j['OWNER_USERNAME'];
    v_experiment = j['EXPERIMENT'];

    cursor = conn.cursor()
    cursor.execute("SELECT COUNT (notebook) FROM cen_notebooks WHERE notebook = '" + v_notebook +"'" )  
    mypic2 = str(cursor.fetchone()[0]) 
    if mypic2 == '0':
        cursor.execute("""INSERT INTO CEN_NOTEBOOKS (SITE_CODE, USERNAME, NOTEBOOK, STATUS, XML_METADATA, LAST_MODIFIED) 
            VALUES ('SITE1', '""" + v_owner_username + """', '""" + v_notebook + """', 'OPEN', xml('<?xml version="1.0" encoding="UTF-8"?><Notebook_Properties/>'),
            LOCALTIMESTAMP)""")
        
    cursor.execute("SELECT COUNT (notebook) FROM cen_pages WHERE notebook ='" + 
                   v_notebook + "' AND experiment = '" + v_experiment +"'")  
    countExp = str(cursor.fetchone()[0]) 

    if countExp ==1:
        resp = Response(response=json.dumps('{"ret":"-1"}'), status=200, mimetype="application/json")
        return resp
    
    id = id_generator(40)
    
    cursor.execute("""INSERT INTO CEN_PAGES (page_key,
                                           SITE_CODE,
                                           NOTEBOOK,
                                           EXPERIMENT,
                                           USERNAME,
                                           OWNER_USERNAME,
                                           LOOK_N_FEEL,
                                           PAGE_STATUS,
                                           CREATION_DATE,
                                           MODIFIED_DATE,
                                           XML_METADATA,
                                           PROCEDURE,
                                           PAGE_VERSION,
                                           LATEST_VERSION,
                                           TA_CODE,
                                           PROJECT_CODE,
                                           LITERATURE_REF,
                                           SUBJECT,
                                           MIGRATED_TO_PCEN,
                                           BATCH_OWNER,
                                           BATCH_CREATOR,
                                           NBK_REF_VERSION,
                                           VERSION,
                                           YIELD,
                                           ISSUCCESSFUL)
          VALUES ('""" + id +"""',
                  'SITE1',
                  '""" + v_notebook +"""',
                  '""" + v_experiment +"""',
                  '""" + v_owner_username +"""',
                  '""" + v_owner_username +"""',
                  'MED-CHEM',
                  'OPEN',
                  LOCALTIMESTAMP,
                  LOCALTIMESTAMP,
                  xml('<?xml version="1.0" encoding="UTF-8"?><Page_Properties><Meta_Data><Archive_Date/><Signature_Url/><Table_Properties/><Ussi_Key>0</Ussi_Key><Auto_Calc_On>true</Auto_Calc_On><Cen_Version></Cen_Version><Completion_Date></Completion_Date><Continued_From_Rxn> </Continued_From_Rxn><Continued_To_Rxn> </Continued_To_Rxn><Project_Alias> </Project_Alias><DSP><Comments/><Description/><Procedure_Width>0</Procedure_Width><designUsers/><ScreenPanels/><Scale><Calculated>true</Calculated><Default_Value>0.0</Default_Value><Unit><Code></Code><Description></Description></Unit><Value>0</Value></Scale><PrototypeLeasdIDs/><DesignSite/><DesignCreationDate></DesignCreationDate><PID/><SummaryPID>null</SummaryPID><VrxnID/></DSP><ConceptionKeyWords/><ConceptorNames/></Meta_Data></Page_Properties>'),
                  '""" + j['workup'] +"""',
                  1,
                  'Y',
                  '""" + j['TH'] +"""',
                  '""" + j['PROJECT_CODE'] +"""',
                  '""" + j['LITERATURE_REF'] +"""',
                  '""" + j['SUBJECT'] +"""',
                  'N',
                  '""" + v_owner_username +"""',
                  '""" + v_owner_username +"""',
                  '""" + v_notebook + "-" + v_experiment + "-1" + """',
                  1,
                  '""" + j['YIELD'] +"""',
                  '""" + j['ISSUCCESSFUL'] +"""')""")
    
    ret = json.dumps('{"ret":"' + id + '"}')
    resp = Response(response=ret, status=200, mimetype="application/json")

    conn.commit()
    return resp
     
def insert_pageG(data):
    try:
        json = data        
        return json
#         return jsonify(json)
    except TemplateNotFound:
        abort(404)
        
def insert_for():
#     print(request.json)m
#     ret = json.dumps(request.json)     
    #ret = '{"data": "JSON string example"}'

#     resp = Response(response=ret, status=200, mimetype="application/json")
    return request.form['fname']

def update_schema(): 
    ret1 = request.get_json(force=True, silent=True, cache=False)
    j = json.loads(ret1)    
    v_struct = j['rxn'];
    notebook = j['notebook'];
    page = j['page'];
    enumVal = j['enumVal'];   
    if len(v_struct) < 120:
        return Response(response=json.dumps('{"ret":"Empty Reaction"}'), status=200, mimetype="application/json")
    
    if (enumVal =='' or enumVal =='undefined'):
        sql = "select RXN_SCHEME_KEY,  PAGE_KEY from PAGES_VW where NOTEBOOK = '" + notebook + \
        "' and EXPERIMENT = '" + page + "'"
    else:
        sql = "select RXN_SCHEME_KEY , PAGE_KEY from PAGES_VW where NOTEBOOK = '" + notebook + \
        "' and EXPERIMENT = '" + page + "' and SYNTH_ROUTE_REF = " + enumVal 
    
    my_query = query_db(sql)
    dict = my_query[0]
#     print dict
#     print dict['page_key']
#     return ""

    
#     sql = "SELECT coalesce(RXN_SCHEME_KEY, 'true') into isNull  from PAGES_VW where NOTEBOOK = '" + notebook + \
#         "' and EXPERIMENT = '" + page + "'"
    
    if dict['rxn_scheme_key']== None:
        id = insert_reaction (dict['page_key'] ,v_struct , 'INTENDED', None)
    else:
        print dict['rxn_scheme_key']
        cursor = conn.cursor()    
        cursor.execute("""UPDATE cen_reaction_schemes
             SET native_rxn_sketch = BINGO.COMPACTREACTION ('""" + v_struct +"""', true)
               WHERE RXN_SCHEME_KEY = '""" + dict['rxn_scheme_key'] +"""'""")
        id =dict['rxn_scheme_key']
        conn.commit()                     

    
    return Response(response=json.dumps('{"ret":"' + id + '"}'), status=200, mimetype="application/json")