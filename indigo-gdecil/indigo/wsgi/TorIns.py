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
#         print request
#         print request['detail'][0];
        j=request
#         dict = escape.json_decode(request)
        print j['detail'][0]['OWNER_USERNAME'];
        v_detail = j['detail'][0]['OWNER_USERNAME'];
        
        cursor = conn.cursor()
        sql = "SELECT COUNT (NOTEBOOK) as \"count\" FROM CEN_NOTEBOOKS WHERE NOTEBOOK = '" + \
                       j['detail'][0]['NOTEBOOK'] + "'" 
                       
        my_query = query_db(sql)
        
        c = my_query[0]['count']
            
        print str(c);
    
        if str(c) == '0':
            sql = """INSERT INTO CEN_NOTEBOOKS (SITE_CODE, USERNAME, NOTEBOOK, STATUS, XML_METADATA, LAST_MODIFIED) 
                VALUES ('SITE1', '""" + j['detail'][0]['OWNER_USERNAME']  + """', '""" + j['detail'][0]['NOTEBOOK'] + \
                """', 'OPEN', xml('<?xml version="1.0" encoding="UTF-8"?><Notebook_Properties/>'),
                LOCALTIMESTAMP)""";
            print sql;
            cursor.execute(sql)
        else:
            print 'ugo';
    
        sql = "SELECT page_key as \"page_key\" FROM cen_pages WHERE notebook ='" + \
                j['detail'][0]['NOTEBOOK']  + "' AND experiment = '" + j['detail'][0]['EXPERIMENT']  +"'" 
        
        my_query = query_db(sql)
        countExp = len(my_query)
        
        if countExp ==1:
            resp = self.update_detail(my_query[0]['page_key'], j)
            return resp
        
        id = id_generator(40)
        yieldd = j['detail'][0]['YIELD']
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
                      '""" + j['detail'][0]['NOTEBOOK']  +"""',
                      '""" + j['detail'][0]['EXPERIMENT'] +"""',
                      '""" + j['detail'][0]['OWNER_USERNAME']  +"""',
                      '""" + j['detail'][0]['OWNER_USERNAME']  +"""',
                      'MED-CHEM',
                      'OPEN',
                      LOCALTIMESTAMP,
                      LOCALTIMESTAMP,
                      xml('<?xml version="1.0" encoding="UTF-8"?><Page_Properties><Meta_Data><Archive_Date/><Signature_Url/><Table_Properties/><Ussi_Key>0</Ussi_Key><Auto_Calc_On>true</Auto_Calc_On><Cen_Version></Cen_Version><Completion_Date></Completion_Date><Continued_From_Rxn> </Continued_From_Rxn><Continued_To_Rxn> </Continued_To_Rxn><Project_Alias> </Project_Alias><DSP><Comments/><Description/><Procedure_Width>0</Procedure_Width><designUsers/><ScreenPanels/><Scale><Calculated>true</Calculated><Default_Value>0.0</Default_Value><Unit><Code></Code><Description></Description></Unit><Value>0</Value></Scale><PrototypeLeasdIDs/><DesignSite/><DesignCreationDate></DesignCreationDate><PID/><SummaryPID>null</SummaryPID><VrxnID/></DSP><ConceptionKeyWords/><ConceptorNames/></Meta_Data></Page_Properties>'),
                      'procedure',
                      1,
                      'Y',
                      'XX',
                      '""" + j['detail'][0]['PROJECT_CODE'] +"""',
                      '""" + j['detail'][0]['LITERATURE_REF'] +"""',
                      '""" + j['detail'][0]['SUBJECT'] +"""',
                      'N',
                      '""" + j['detail'][0]['OWNER_USERNAME']  +"""',
                      '""" + j['detail'][0]['OWNER_USERNAME']  +"""',
                      '""" + j['detail'][0]['NOTEBOOK']  + "-" + j['detail'][0]['EXPERIMENT'] + "-1" + """',
                      1,
                      '""" + yieldd  + """',
                      '""" + j['detail'][0]['ISSUCCESSFUL'] + """')""")
        
    #                   '""" + j['detail'][0]['YIELD'] + """',
    
        ret = json.dumps('{"ret":"' + id + '"}')
        resp = ret
    
        conn.commit()
        return resp

    def insert_batches(self, batches, pageKey, username, notebook, page):
        print batches
#         print batches[0]['CHEMICAL_NAME']
        
        v_nr = len(batches)
#         print len(batches)owner_username
        if  v_nr < 1:
            return 'No batches to register'

        for item in batches:
#             print item['CHEMICAL_NAME']
#             print item['BATCH_MW_VALUE'] + item['CAS_NUMBER']
#             return ""
            batchKey = id_generator(40)
            structKey = id_generator(40)
            sql = "SELECT page_key FROM cen_pages WHERE notebook ='" + notebook + \
            "' and EXPERIMENT = '" + page + "'"
            
            my_query = query_db(sql)
            pageKey = my_query[0]['page_key']
            
            cursor = conn.cursor()
            sql = """INSERT INTO CEN_STRUCTURES 
                ( STRUCT_KEY,
                  PAGE_KEY,
                  XML_METADATA,
                  CHEMICAL_NAME,
                  MOLECULAR_WEIGHT,
                  BOILING_PT_VALUE,
                  BOILING_PT_UNIT_CODE,
                  MELTING_PT_VALUE,
                  MELTING_PT_UNIT_CODE,
                  CREATED_BY_NOTEBOOK,
                  EXACT_MASS,
                  CAS_NUMBER,
                  USER_HAZARD_COMMENTS,
                  VERSION,
                  VIRTUAL_COMPOUND_ID,
                  LAST_MODIFIED)
                VALUES ('""" + structKey +"""',
                        '""" + pageKey + """',
                        xml('<?xml version="1.0" encoding="UTF-8"?><Structure_Properties>   <Meta_Data>   </Meta_Data></Structure_Properties>'),
                        '""" + item['CHEMICAL_NAME'] + """',
                        '""" + item['BATCH_MW_VALUE'] + """',
                        0,
                        'C',
                        0,
                        'C',
                        'N',
                        0,
                        '""" + item['CAS_NUMBER'] + """',
                        '""" + item['CHEMICAL_NAME'] + """',
                        0,
                       '""" + str(item['id']) + """',                  
                        LOCALTIMESTAMP )"""
#             print sql
            cursor.execute(sql)
#         return "1"

            sql = """INSERT INTO CEN_BATCHES (
                       BATCH_KEY,
                       PAGE_KEY,
                       BATCH_NUMBER,
                       STRUCT_KEY,
                       XML_METADATA,
                       STEP_KEY,
                       BATCH_TYPE,
                       MOLECULAR_FORMULA,
                       SALT_CODE,
                       SALT_EQUIVS,
                       LIST_KEY,
                       BATCH_MW_VALUE,
                       BATCH_MW_UNIT_CODE,
                       BATCH_MW_IS_CALC,
                       BATCH_MW_SIG_DIGITS,
                       BATCH_MW_SIG_DIGITS_SET,
                       BATCH_MW_USER_PREF_FIGS,
                       IS_LIMITING,
                       AUTO_CALC,
                       SYNTHSZD_BY,
                       INTD_ADDITION_ORDER,
                       IS_CHLORACNEGEN,
                       TESTED_FOR_CHLORACNEGEN,
                       VERSION,
                       LAST_MODIFIED)
                VALUES ('""" + batchKey +"""',
                        '""" + pageKey + """',
                        '""" + str(item['id']) + """',
                        '""" + structKey +"""',
                        xml('<?xml version="1.0" encoding="UTF-8"?><Batch_Properties><Meta_Data><Owner></Owner><Comments></Comments><Container_Barcode></Container_Barcode><Stoich_Comments></Stoich_Comments><Stoic_Label>null</Stoic_Label><Reactants_For_Product></Reactants_For_Product><Analytical_Purity_List></Analytical_Purity_List><Precursors></Precursors><Analytical_Comment></Analytical_Comment><Screen_Panels></Screen_Panels><Enumeration_Sequence>0</Enumeration_Sequence></Meta_Data></Batch_Properties>'),
                        NULL,
                        '""" + item['BATCH_TYPE'] + """',
                        '""" + item['MOLECULAR_FORMULA'] + """',
                        '00',
                        0,
                        NULL,
                        '""" + str(item['BATCH_MW_VALUE']) + """',
                        'SCAL',
                        'Y',
                        3,
                        'Y',
                        -1,
                        'N',
                        'Y',
                        '""" + username + """',
                        0,
                        'N',
                        'Y',
                        0,
                        LOCALTIMESTAMP ) """

            cursor.execute(sql)
#             print type(item['PURITY_UNIT_CODE'])
            sql = """INSERT INTO CEN_BATCH_AMOUNTS (
                BATCH_KEY,
                PAGE_KEY,
                WEIGHT_VALUE,
                WEIGHT_UNIT_CODE,
                THEO_WT_VALUE,
                THEO_WT_UNIT_CODE,
                THEO_YLD_PCNT_VALUE,
                VOLUME_VALUE,
                VOLUME_UNIT_CODE,
                MOLARITY_VALUE,
                MOLARITY_UNIT_CODE,
                MOLE_VALUE,
                MOLE_UNIT_CODE,
                DENSITY_VALUE,
                DENSITY_UNIT_CODE,
                PURITY_VALUE,
                PURITY_UNIT_CODE,
                VERSION,
                LAST_MODIFIED)
           VALUES (
                '""" + batchKey +"""',
                '""" + pageKey + """',
                """ + item['BATCH_MW_VALUE'] + """,
                0,
                0,
                0,
                0,
                """ + str(int(item['VOLUME_VALUE'] or 0)) + """,
                """ + str(int(item['VOLUME_UNIT_CODE'] or 0)) + """,
                """ + str(int(item['MOLARITY_VALUE'] or 0)) + """,
                """ + str(int(item['MOLARITY_UNIT_CODE'] or 0)) + """,
                """ + str(int(item['MOLE_VALUE'] or 0)) + """,
                """ + str(int(item['MOLE_UNIT_CODE'] or 0)) + """,
                """ + str(int(item['DENSITY_VALUE'] or 0)) + """,
                """ + str(int(item['DENSITY_UNIT_CODE'] or 0)) + """,
                """ + str(int(item['PURITY_VALUE'] or 0)) + """,
                """ + str(int(item['PURITY_UNIT_CODE'] or 0)) + """,
                   0,
                   LOCALTIMESTAMP) """
#             print sql
#             return "ci"
            cursor.execute(sql)
            
        return "1"
      
    def update_detail(self, id, j):
        yieldd = j['detail'][0]['YIELD']
        if  not yieldd :
             yieldd = '0'
                    
        cursor = conn.cursor()
        try:
            cursor.execute("""update CEN_PAGES set 
                                    TA_CODE= 'XX',
                                    PROJECT_CODE ='""" + j['detail'][0]['PROJECT_CODE'] +"""',
                                    LITERATURE_REF='""" + j['detail'][0]['LITERATURE_REF'] +"""',
                                    SUBJECT ='""" + j['detail'][0]['SUBJECT'] +"""',
                                    YIELD='""" + yieldd  + """',
                                    ISSUCCESSFUL = '""" + j['detail'][0]['ISSUCCESSFUL'] + """'
                                where page_key = '""" + id + """'""")

            if db=='ora':
                sql = "UPDATE CEN_PAGES SET XML_METADATA = UPDATEXML (XML_METADATA, '/Page_Properties/Meta_Data/Continued_From_Rxn/text()',' " + j['detail'][0]['CONTINUED_FROM_RXN'] + "') WHERE page_key ='" + id + "'"
                print sql
                cursor.execute(sql)
                sql = "UPDATE CEN_PAGES SET XML_METADATA = UPDATEXML (XML_METADATA, '/Page_Properties/Meta_Data/Continued_From_Rxn/text()',' " + j['detail'][0]['CONTINUED_FROM_RXN'] + "') WHERE page_key ='" + id + "'"
                print sql
                cursor.execute(sql)
                sql = "UPDATE CEN_PAGES SET XML_METADATA = UPDATEXML (XML_METADATA, '/Page_Properties/Meta_Data/Project_Alias/text()',' " + j['detail'][0]['PROJECT_ALIAS'] + "') WHERE page_key ='" + id + "'"
                print sql
                cursor.execute(sql)
            conn.commit()
        except:
            conn.rollback()
            raise
        return '1'

    def update_schema(self, rxn, notebook, page, enumVal): 
        v_struct = rxn
        if len(v_struct) < 120:
            return '{"ret":"Empty Reaction"}'
        
        if (enumVal =='' or enumVal =='undefined'):
            sql = "select RXN_SCHEME_KEY \"rxn_scheme_key\",  PAGE_KEY \"page_key\" from PAGES_VW where NOTEBOOK = '" + notebook + \
            "' and EXPERIMENT = '" + page + "'"
        else:
            sql = "select RXN_SCHEME_KEY \"rxn_scheme_key\", PAGE_KEY \"page_key\" from PAGES_VW where NOTEBOOK = '" + notebook + \
            "' and EXPERIMENT = '" + page + "' and SYNTH_ROUTE_REF = " + enumVal 
        
        my_query = query_db(sql)
        dict = my_query[0]
        
        if dict['rxn_scheme_key']== None:
            id = insert_reaction (dict['page_key'] ,v_struct , 'INTENDED', None)
        else:
            print dict['rxn_scheme_key']
            cursor = conn.cursor()
            if db=='ora':
                sql ="UPDATE cen_reaction_schemes SET native_rxn_sketch = BINGO.COMPACTREACTION ('" + v_struct + "', 1) WHERE RXN_SCHEME_KEY = '" + dict['rxn_scheme_key'] + "'"
                cursor.execute(sql)
            else:
                sql ="UPDATE cen_reaction_schemes SET native_rxn_sketch = BINGO.COMPACTREACTION ('" + v_struct + "', true) WHERE RXN_SCHEME_KEY = '" + dict['rxn_scheme_key'] + "'"
                cursor.execute(sql)

#            cursor.execute("""UPDATE cen_reaction_schemes
#                 SET native_rxn_sketch = BINGO.COMPACTREACTION ('""" + v_struct +"""', true)
#                   WHERE RXN_SCHEME_KEY = '""" + dict['rxn_scheme_key'] +"""'""")
            id =dict['rxn_scheme_key']
            conn.commit()                     
            
        return '{"ret":"' + id + '"}'

    def update_stoic(self, notebook, page, Reagents, Products, username): 
#         print Reagents

        sql = "SELECT page_key FROM cen_pages WHERE notebook ='" + notebook + \
        "' and EXPERIMENT = '" + page + "'"
        
        my_query = query_db(sql)
        print my_query[0]['page_key']
        pageKey = my_query[0]['page_key']
        cursor = conn.cursor()
        print "delete from CEN_BATCH_AMOUNTS where PAGE_KEY = '" + pageKey + "'"
        cursor.execute("delete from CEN_BATCH_AMOUNTS where PAGE_KEY = '" + pageKey + "'")
        cursor.execute("delete from CEN_BATCHES where PAGE_KEY = '" + pageKey + "'")

        retBatch = self.insert_batches(Reagents, pageKey, username, notebook, page)

        if retBatch <> "1":
            return 'Cannot insert reagents'

        retBatch = self.insert_batches (Products, pageKey, username, notebook, page)
        
        if retBatch <> "1":
            return 'Cannot insert products'

        conn.commit()
        
        return '1'
      
    def update_procedura(self, notebook, page, procedura ):
        try:
            cursor = conn.cursor()
            cursor.execute("update cen_pages set procedure  = '" + procedura + "' WHERE notebook = '" + notebook + \
                           "' and EXPERIMENT = '" + page + "'")
            conn.commit()
            return '1';
        except:
            raise
              
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
     
