
-- Oracle package 'MATCH' declaration, please edit to match PostgreSQL syntax.
-- PostgreSQL does not recognize PACKAGES, using SCHEMA instead.
DROP SCHEMA IF EXISTS match CASCADE;
CREATE SCHEMA match;

/******************************************************************************
   NAME: utility
   PURPOSE:

   REVISIONS:
   Ver Date Author Description
   --------- ---------- --------------- ------------------------------------
   1.0 5/11/2009 1. Created this package body.
   ******************************************************************************/


CREATE OR REPLACE FUNCTION match.reaction (searchtype   IN     text,
                       struct       IN     text,
                       ret             OUT SYS_REFCURSOR)
    RETURNS SYS_REFCURSOR AS $body$
DECLARE

      v_cursor   REFCURSOR;
      original   varchar(4000);
      reaction   text;
   
BEGIN
      IF searchtype = 'SSS'
      THEN
         -- SELECT LOG INTO reaction FROM tmp_log WHERE id = 228;
         --SELECT Bingo.AAM(struct, 'DISCARD') into reaction from dual;
         OPEN v_cursor FOR
            SELECT RXN_SCHEME_KEY,
                   (SELECT fullname
                      FROM cen_users
                     WHERE username = (SELECT username
                                         FROM cen_pages
                                        WHERE page_key = r.page_key))
                      AS username,
                   (SELECT notebook
                      FROM cen_pages
                     WHERE page_key = r.page_key)
                      AS notebook,
                   (SELECT experiment
                      FROM cen_pages
                     WHERE page_key = r.page_key)
                      AS page,
                   (SELECT creation_date
                      FROM cen_pages
                     WHERE page_key = r.page_key)
                      AS creation_date,
                   (SELECT subject
                      FROM cen_pages
                     WHERE page_key = r.page_key)
                      AS subject
              FROM cen_reaction_schemes r
             WHERE DBMS_LOB.getlength (r.native_rxn_sketch) > 0
                   AND bingo.Rsub (r.native_rxn_sketch, (struct)) = 1;
      --     AND bingo.Rsub (r.native_rxn_sketch, (select bingo.rsmiles(reaction) from dual)) = 1;
      ELSIF searchtype = 'Exact'
      THEN
         OPEN v_cursor FOR
            SELECT RXN_SCHEME_KEY,
                   (SELECT fullname
                      FROM cen_users
                     WHERE username = (SELECT username
                                         FROM cen_pages
                                        WHERE page_key = r.page_key))
                      AS username,
                   (SELECT notebook
                      FROM cen_pages
                     WHERE page_key = r.page_key)
                      AS notebook,
                   (SELECT experiment
                      FROM cen_pages
                     WHERE page_key = r.page_key)
                      AS page,
                   (SELECT creation_date
                      FROM cen_pages
                     WHERE page_key = r.page_key)
                      AS creation_date,
                   (SELECT subject
                      FROM cen_pages
                     WHERE page_key = r.page_key)
                      AS subject
              FROM cen_reaction_schemes r
             WHERE DBMS_LOB.getlength (r.native_rxn_sketch) > 0
                   AND bingo.Rexact (r.native_rxn_sketch, struct, 'NONE') = 1;
      END IF;

      ret := v_cursor;
   END;


$body$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION match.reactiontext ( queryText       IN     text,
                       ret             OUT SYS_REFCURSOR)
    RETURNS SYS_REFCURSOR AS $body$
DECLARE

      v_cursor   REFCURSOR;
      v_stmt_str varchar(4000);
   
BEGIN      
      v_stmt_str :=       'SELECT RXN_SCHEME_KEY,
                   (SELECT fullname
                      FROM cen_users
                     WHERE username = (SELECT username
                                         FROM cen_pages
                                        WHERE page_key = r.page_key))
                      AS username,
                   (SELECT notebook
                      FROM cen_pages
                     WHERE page_key = r.page_key)
                      AS notebook,
                   (SELECT experiment
                      FROM cen_pages
                     WHERE page_key = r.page_key)
                      AS page,
                   (SELECT creation_date
                      FROM cen_pages
                     WHERE page_key = r.page_key)
                      AS creation_date,
                   (SELECT subject
                      FROM cen_pages
                     WHERE page_key = r.page_key)
                      AS subject
              FROM PAGES_VW r
             WHERE ' ||  queryText;
             
              OPEN v_cursor FOR v_stmt_str ;
                    
                   ret := v_cursor;
   END;
   

$body$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION match.get_reaction (reactId IN text, ret OUT text)
    RETURNS text AS $body$
DECLARE

      reaction   text;
   
BEGIN
      SELECT Bingo.rxnfile (r.native_rxn_sketch)
        INTO reaction
        FROM cen_reaction_schemes r
       WHERE DBMS_LOB.getlength (r.native_rxn_sketch) > 0
             AND RXN_SCHEME_KEY = reactId;

      ret := reactId || reaction;
   END;


$body$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION match.get_batch (vBatch     IN     text,
                        vType     IN     text,
                        compound      OUT text,
                        mw            OUT text,
                        mf            OUT text)
    RETURNS RECORD AS $body$
DECLARE

      strId     bigint;
      counter   bigint;
      vmw       varchar(100);
      vmf       varchar(100);
   
BEGIN
    if vType ='Batch' then
      SELECT cm.molweight, cm.molformula, cm.str_id
        INTO vmw, vmf, strId
        FROM mar_corp_str_assoc_t@LN_MAR_DDT10 csa,
             MAR_CORP_LOT_T@LN_MAR_DDT10 cl,
             mar_compound_mol_t@LN_MAR_DDT10 cm
       WHERE     csa.cmp_id = cl.cmp_id
             AND cm.str_id = csa.str_id
             AND cl.BATCH = vBatch;
    else
      SELECT distinct cm.molweight, cm.molformula, cm.str_id
        INTO vmw, vmf, strId
        FROM mar_corp_str_assoc_t@LN_MAR_DDT10 csa,
             MAR_CORP_LOT_T@LN_MAR_DDT10 cl,
             mar_compound_mol_t@LN_MAR_DDT10 cm
       WHERE     csa.cmp_id = cl.cmp_id
             AND cm.str_id = csa.str_id
             AND csa.corp_id = vBatch;
    end if;

      SELECT COUNT (str_id)
        INTO counter
        FROM tgv1
       WHERE str_id = strId;

      IF counter = 0
      THEN
         INSERT INTO tgv1
            SELECT COMPOUND, str_id
              FROM mar_compound_mol_t@LN_MAR_DDT10
             WHERE str_id = strId;

         COMMIT;
      ELSE
         counter := counter;
      END IF;

      SELECT COMPOUND
        INTO COMPOUND
        FROM tgv1
       WHERE str_id = strId;

      mw := vmw;
      mf := vmf;
   END;
   

$body$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION match.get_bottle (vId     IN     text,
                        vType     IN     text,
                        compound      OUT text ,
                        mw            OUT text ,
                        mf            OUT text )
    RETURNS RECORD AS $body$
DECLARE

      strId     bigint;
      counter   bigint;
      vmw       varchar(100);
      vmf       varchar(100);
      vclob text;
   
BEGIN
   
   /* Formatted on 16/05/2014 16:13:01 (QP5 v5.136.908.31019) */
-- DELETE tgb1 WHERE str_id = vId;

--COMMIT;
      if vType = 'StrId' then
          SELECT cm.molweight, cm.molformula, cm.structure_id
            INTO vmw, vmf, strId
            FROM bottles.bot_structures_t@LN_BOTTLE_NMSDD cm
           WHERE     cm.structure_id= vId;
      elsif vType = 'CAS' then
          SELECT cm.molweight, cm.molformula, cm.structure_id
            INTO vmw, vmf, strId
            FROM bottles.bot_structures_t@LN_BOTTLE_NMSDD cm
           WHERE     cm.CAS_NUMBER= vId;
      else
         select s.molweight, s.molformula, s.structure_id 
            INTO vmw, vmf, strId
            from  bottles.BOT_STRUCTURES_T@LN_BOTTLE_NMSDD s, bottles.BOT_FORMULATIONS_T@LN_BOTTLE_NMSDD f, bottles.BOT_BOTTLES_T@LN_BOTTLE_NMSDD b
                where b.FORMULATION_ID= f.FORMULATION_ID
                and f.STRUCTURE_ID= s.STRUCTURE_ID
                and b.bottle_id = vId;      
      end if;
      

      SELECT COUNT (str_id)
        INTO counter
        FROM tgb1
       WHERE str_id = strId;

      IF counter = 0
      THEN
         INSERT INTO tgb1
            SELECT structure_molfile, structure_id
              FROM bottles.bot_structures_bingo_t@LN_BOTTLE_NMSDD
             WHERE structure_id = strId;

         COMMIT;
      ELSE
         counter := counter;
      END IF;

      SELECT COMPOUND
        INTO COMPOUND
        FROM tgb1
       WHERE str_id = strId;

      mw := vmw;
      mf := vmf;
     --    delete tgb1       WHERE str_id = vId;
     --           COMMIT;

   END;
   



$body$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION match.get_bottle_form (vId     IN     text,
                        vType     IN     text,
                        ret             OUT SYS_REFCURSOR )
    RETURNS SYS_REFCURSOR AS $body$
DECLARE

      v_cursor   REFCURSOR;
   
BEGIN

      if vType = 'StrId' then
            OPEN v_cursor FOR
            SELECT f.*, cas_number
                        FROM bottles.bot_structures_t@LN_BOTTLE_NMSDD cm, bottles.bot_formulations_v@LN_BOTTLE_NMSDD f
               WHERE     cm.structure_id=vId
                and cm.structure_id= f.structure_id;
      elsif vType = 'CAS' then
            OPEN v_cursor FOR
            SELECT f.*, cas_number
                        FROM bottles.bot_structures_t@LN_BOTTLE_NMSDD cm, bottles.bot_formulations_v@LN_BOTTLE_NMSDD f
               WHERE     cm.cas_number=vId
                and cm.structure_id= f.structure_id;
      else
            OPEN v_cursor FOR
            SELECT f.*, cas_number
            from  bottles.BOT_STRUCTURES_T@LN_BOTTLE_NMSDD s, bottles.BOT_FORMULATIONS_T@LN_BOTTLE_NMSDD f, bottles.BOT_BOTTLES_T@LN_BOTTLE_NMSDD b
                where b.FORMULATION_ID= f.FORMULATION_ID
                and f.STRUCTURE_ID= s.STRUCTURE_ID
                and b.bottle_id = vId;      
      end if;
              
    ret :=v_cursor;
    END;
    

$body$
LANGUAGE PLPGSQL;
-- End of Oracle package 'MATCH' declaration

-- Oracle package 'REG' declaration, please edit to match PostgreSQL syntax.
-- PostgreSQL does not recognize PACKAGES, using SCHEMA instead.
DROP SCHEMA IF EXISTS reg CASCADE;
CREATE SCHEMA reg;

/******************************************************************************
      NAME:       utility
      PURPOSE:

      REVISIONS:
      Ver        Date        Author           Description
      ---------  ----------  ---------------  ------------------------------------
      1.0        5/11/2009             1. Created this package body.
   ******************************************************************************/



CREATE OR REPLACE FUNCTION reg.delete_attachement (nb     IN     text,
                                exper   IN     text,
                                username   IN     text,
                                namedoc   IN     text,
                                ret           OUT text)
    RETURNS text AS $body$
DECLARE

   pk varchar(40) := '';
   i bigint;
   
BEGIN
    select A.ATTACHEMENT_KEY into pk from CEN_ATTACHEMENTS a, CEN_PAGES p where A.PAGE_KEY = P.PAGE_KEY and P.USERNAME =username and A.DOCUMENT_NAME =namedoc and NOTEBOOK = nb and EXPERIMENT = exper;
    delete CEN_ATTACHEMENTS where ATTACHEMENT_KEY = pk;
    commit;
         i := SQL%ROWCOUNT;
    ret := i;
   EXCEPTION
      WHEN OTHERS
      THEN
         RAISE;
   END;
   

$body$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION reg.delete_experiment (nb     IN     text,
                                exper   IN     text,
                                ret           OUT text)
    RETURNS text AS $body$
DECLARE

   pk varchar(40) := '';
   
BEGIN
    select page_key into pk from CEN_PAGES  where NOTEBOOK = nb and EXPERIMENT = exper;
    --delete  CEN_DEV_OWNER.CEN_NOTEBOOKS where notebook = '';
    delete CEN_DEV_OWNER.CEN_ATTACHEMENTS where page_key = pk;
    delete CEN_DEV_OWNER.CEN_BATCH_AMOUNTS where PAGE_KEY = pk;
    delete CEN_DEV_OWNER.CEN_BATCHES where PAGE_KEY = pk;
    delete CEN_DEV_OWNER.CEN_STRUCTURES where PAGE_KEY = pk;
    delete CEN_DEV_OWNER.CEN_REACTION_SCHEMES where PAGE_KEY = pk;
    delete CEN_DEV_OWNER.CEN_PAGES where page_key = pk;
    BINGO.FLUSHINSERTS ();
    commit;
       
    ret := '1';
   EXCEPTION
      WHEN OTHERS
      THEN
         RAISE;
   END;
   
   

$body$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION reg.get_reaction (reactId IN text, ret OUT text)
    RETURNS text AS $body$
DECLARE

      reaction   text;
   
BEGIN
      SELECT Bingo.rxnfile (r.native_rxn_sketch)
        INTO reaction
        FROM cen_reaction_schemes r
       WHERE DBMS_LOB.getlength (r.native_rxn_sketch) > 0
             AND RXN_SCHEME_KEY = reactId;

      ret := reactId || reaction;
   END;


$body$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION reg.insert_attachement (attach       IN     bytea,
                              nb     IN     text,
                              exper   IN     text,
                              docDesc   IN     text,
                              docName   IN     text,
                              docOrFiNa   IN     text,
                              ret             OUT text)
    RETURNS text AS $body$
DECLARE

      tmp      varchar(40);
      i        bigint;
      attKey   varchar(40);
      pageKey varchar(40);
   
BEGIN
        
        select PAGE_KEY into  pageKey from PAGES_VW where NOTEBOOK = nb and EXPERIMENT = exper;
        
      PERFORM DBMS_RANDOM.STRING ('A', TRUNC (DBMS_RANDOM.VALUE (40, 40)))
        INTO attKey
        ;

      INSERT INTO CEN_DEV_OWNER.CEN_ATTACHEMENTS (ATTACHEMENT_KEY,
                                                      PAGE_KEY,
                                                      DOCUMENT_DESCRIPTION,
                                                      DOCUMENT_NAME,
                                                      ORIGINAL_FILE_NAME,
                                                      LAST_MODIFIED)
          VALUES (attKey,
                  pageKey,
                  docDesc,
                  docName,
                  docOrFiNa,
                  LOCALTIMESTAMP);

      UPDATE CEN_ATTACHEMENTS
         SET BLOB_DATA = attach
       WHERE ATTACHEMENT_KEY = attKey;

      i := SQL%ROWCOUNT;
      
      ret := attKey;
   EXCEPTION
      WHEN OTHERS
      THEN
         RAISE;
   END;
   

$body$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION reg.insert_experiment (struct     IN     text,
                                Reagents   IN     text,
                                Products   IN     text,
                                workup     IN     text,
                                detail     IN     text,
                                ret           OUT text)
    RETURNS text AS $body$
DECLARE

      tmp        varchar(40);
      i          bigint;
      A          bigint := 0;
      retA    varchar(40);
      retPage    varchar(40);
      retBatch   varchar(40);
      retStruc   varchar(40);
      lenS       bigint;
      
       v_obj              json := json (detail);
       nb                 bigint := 0;

      v_notebook         varchar(8);
      v_owner_username   varchar(50);
      v_experiment       varchar(4);
            
   
BEGIN

      v_notebook := REPLACE (v_obj.PATH ('NOTEBOOK').TO_CHAR, '"');
      v_owner_username := REPLACE (v_obj.PATH ('OWNER_USERNAME').TO_CHAR, '"');
      v_experiment := REPLACE (v_obj.PATH ('EXPERIMENT').TO_CHAR, '"');
      
     
      
    SELECT COUNT (*)
        INTO nb
        FROM cen_pages
       WHERE notebook = v_notebook AND experiment = v_experiment;

 --raise_application_error ( -20101, 'nb ' ||nb );
 
    if  nb >0 then
        update_detail (detail, retA );
        update_schema (v_notebook , v_experiment,  'undefined'  ,  struct, retA);
        update_stoic (v_notebook , v_experiment, Reagents , Products ,  v_owner_username ,  retA);
        update_procedure (v_notebook , v_experiment, workup, retA);
--        raise_application_error ( -20101, 'nb ' || retA );
        ret := retA;
        commit;
        return;
    end if;
      


      insert_page (detail, workup, retPage);

      PERFORM LENGTH (retPage) INTO lenS ;

      IF lenS < 3
      THEN
         ret := retPage;
         ROLLBACK;
         RETURN;
      END IF;

      insert_reaction (struct,
                       retPage,
                       'INTENDED',
                       null,
                       retStruc);

      --raise_application_error (-20101, 'insert_reaction: ' || struct);

      PERFORM LENGTH (retStruc) INTO lenS ;

      IF lenS < 3
      THEN
         --raise_application_error (-20101, 'insert_reaction: ' || retStruc);
         ret := retStruc;
         ROLLBACK;
         RETURN;
      END IF;

      insert_batches (Reagents,
                      retPage,
                      REPLACE (v_obj.PATH ('OWNER_USERNAME').TO_CHAR, '"'),
                      retBatch);

      --raise_application_error (-20101, 'insert_products: ' || retPage);
      PERFORM LENGTH (retBatch) INTO lenS ;

      IF lenS < 3
      THEN
         ret := retBatch;
         ROLLBACK;
         RETURN;
      END IF;

      insert_batches (Products,
                      retPage,
                      REPLACE (v_obj.PATH ('OWNER_USERNAME').TO_CHAR, '"'),
                      retBatch);

      --raise_application_error (-20101, 'insert_reagents: ' || retPage);
      PERFORM LENGTH (retBatch) INTO lenS ;

      IF lenS < 3
      THEN
         ret := retBatch;
         ROLLBACK;
         RETURN;
      END IF;

      COMMIT;
      ret := '1';
   EXCEPTION
      WHEN OTHERS
      THEN
         RAISE;
   END;



$body$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION reg.insert_experiment_enum (struct       IN     text,
                                     structEnum   IN     text,
                                     detail       IN     text,
                                     ret             OUT text)
    RETURNS text AS $body$
DECLARE

      tmp        varchar(40);
      i          bigint;
      A          bigint := 0;
      retPage    varchar(40);
      retBatch   varchar(40);
      retStruc   varchar(40);
      lenS       bigint;
      v_obj      json;
      v_list     json_list;
      counter    bigint:=0;
      tmpLob text;
      c bigint :=0;
   
BEGIN
      v_obj := json (detail);
 --raise_application_error (-20101, 'struct: ' || structEnum);
      --            raise_application_error (
      --               -20101,
      --               'owner is missing ' || v_obj.PATH ('NOTEBOOK').TO_CHAR);


      insert_page (detail, '', retPage);

      --COMMIT;
      --raise_application_error (-20101, 'insert_page: ' || retPage);

      PERFORM LENGTH (retPage) INTO lenS ;

      IF lenS < 3
      THEN
         ret := retPage;
         ROLLBACK;
         RETURN;
      END IF;

      insert_reaction (struct,
                       retPage,
                       'INTENDED',
                       null,
                       retStruc);

      --raise_application_error (-20101, 'insert_reaction: ' || struct);

      PERFORM LENGTH (retStruc) INTO lenS ;

      IF lenS < 3
      THEN
         --raise_application_error (-20101, 'insert_reaction: ' || retStruc);
         ret := retStruc;
         ROLLBACK;
         RETURN;
      END IF;

--raise_application_error (-20101, '1: ' || structEnum);
LOOP
        counter := counter+1;
        
        select REGEXP_SUBSTR(s, '[^!]+', 1, counter) a
        into tmpLob
        from (select structEnum s );   
        
       --  raise_application_error (-20101, 'tmplob ' || tmpLob);
        if  length(tmpLob) >0 then
           
            insert_reaction (tmpLob,
                              retPage,
                              'ENUMERATED',
                              counter,
                              retStruc);
         end if;                 
        DBMS_OUTPUT.PUT_LINE(tmp) ;
        exit when  length(tmpLob) =0 ;
    END LOOP;
    
--raise_application_error (-20101, 'insert_reaction: 2' || retStruc);
      COMMIT;
      ret := '1';
   EXCEPTION
      WHEN OTHERS
      THEN
         RAISE;
   END;




$body$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION reg.insert_experiment_enum_batches (
                                Reagents   IN     text,
                                Products   IN     text,
                                detail     IN     text,
                                ret           OUT text)
    RETURNS text AS $body$
DECLARE

      tmp        varchar(40);
      i          bigint;
      A          bigint := 0;
      retPage    varchar(40);
      retBatch   varchar(40);
      retStruc   varchar(40);
      lenS       bigint;
      nb varchar(40);
      ex varchar(40);
      v_obj      json;
   
BEGIN
      v_obj := json (detail);
    nb:=REPLACE (v_obj.PATH ('NOTEBOOK').TO_CHAR, '"');
    ex:=REPLACE (v_obj.PATH ('EXPERIMENT').TO_CHAR, '"');

    
--                  raise_application_error (
--                     -20101,
--                     'nb exp ' || nb || ex  );--v_obj.PATH ('EXPERIMENT').TO_CHAR);
                     
   select page_key into retPage from cen_pages where notebook =nb  and experiment = ex;

--                  raise_application_error (
--                     -20101,
--                     'owner is missing ' || retPage || v_obj.PATH ('EXPERIMENT').TO_CHAR);

      insert_batches (Reagents,
                      retPage,
                      REPLACE (v_obj.PATH ('OWNER_USERNAME').TO_CHAR, '"'),
                      retBatch);

      --raise_application_error (-20101, 'insert_products: ' || retPage);
      PERFORM LENGTH (retBatch) INTO lenS ;

      IF lenS < 3
      THEN
         ret := retBatch;
         ROLLBACK;
         RETURN;
      END IF;

      insert_batches (Products,
                      retPage,
                      REPLACE (v_obj.PATH ('OWNER_USERNAME').TO_CHAR, '"'),
                      retBatch);

      --raise_application_error (-20101, 'insert_reagents: ' || retPage);
      PERFORM LENGTH (retBatch) INTO lenS ;

      IF lenS < 3
      THEN
         ret := retBatch;
         ROLLBACK;
         RETURN;
      END IF;

      COMMIT;
      ret := '1';
   EXCEPTION
      WHEN OTHERS
      THEN
         RAISE;
   END;
   
   
 


$body$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION reg.insert_batches (batches    IN     text,
                             pageKey           text,
                             username          text,
                             ret           OUT text)
    RETURNS text AS $body$
DECLARE

      tmp         varchar(200);
      i           bigint;
      v_list      json_list;
      arrCount    bigint;
      batchKey    varchar(40);
      structKey   varchar(40);
      tmp0 text;
      tmp1 text;
      tmp2 text;
      v_nr bigint;
   
BEGIN
            v_nr := DBMS_LOB.GETLENGTH(batches);
            if  v_nr < 20 then
                ret := '1000';
                return;
            end if;
--            raise_application_error ( -20101, v_nr );
            v_nr :=0;
            v_nr := INSTR (batches,CHR(10), -1);
            
            if v_nr > 0 then
                SELECT REPLACE (batches, CHR(10),'') into tmp2 ;
                 v_list := json_list (tmp2);
            else 
                  v_list := json_list (batches);
            end if;
     
   --   raise_application_error ( -20101,  'arrivato 2 ' );
      arrCount := v_list.COUNT ();
  -- raise_application_error ( -20101,  'arrivato 1 ' );
      FOR i IN 1 .. arrCount
      LOOP
         SELECT DBMS_RANDOM.STRING ('A', TRUNC (DBMS_RANDOM.VALUE (40, 40)))
           INTO batchKey
           ;

         PERFORM DBMS_RANDOM.STRING ('A', TRUNC (DBMS_RANDOM.VALUE (40, 40)))
           INTO structKey
           ;

         INSERT INTO CEN_DEV_OWNER.CEN_STRUCTURES (STRUCT_KEY,
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
             VALUES (structKey,
                     pageKey,
                     xml('<?xml version="1.0" encoding="UTF-8"?><Structure_Properties>   <Meta_Data>   </Meta_Data></Structure_Properties>'),
                     REPLACE (
                        v_list.PATH ('[' || i || '].CHEMICAL_NAME').TO_CHAR,
                        '"'),
                     TO_NUMBER (
                        REPLACE (
                           v_list.PATH (
                              '[' || i || '].BATCH_MW_VALUE').TO_CHAR,
                           '"'),
                        '99999.99999'),
                     0,
                     'C',
                     0,
                     'C',
                     'N',
                     0,
                     REPLACE (
                        v_list.PATH ('[' || i || '].CAS_NUMBER').TO_CHAR,
                        '"'),
                     REPLACE (
                        v_list.PATH ('[' || i || '].CHEMICAL_NAME').TO_CHAR,
                        '"'),
                     0,
                    TO_NUMBER (
                        REPLACE (
                           v_list.PATH (
                              '[' || i || '].REACTION_NUMBER').TO_CHAR,
                           '"'),
                        '99999'),                     
                     LOCALTIMESTAMP);

         INSERT INTO CEN_DEV_OWNER.CEN_BATCHES (BATCH_KEY,
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
             VALUES (batchKey,
                     pageKey,
                     REPLACE (
                        v_list.PATH ('[' || i || '].BATCH_NUMBER').TO_CHAR,
                        '"'),
                     structKey,
                     xml('<?xml version="1.0" encoding="UTF-8"?><Batch_Properties><Meta_Data><Owner></Owner><Comments></Comments><Container_Barcode></Container_Barcode><Stoich_Comments></Stoich_Comments><Stoic_Label>null</Stoic_Label><Reactants_For_Product></Reactants_For_Product><Analytical_Purity_List></Analytical_Purity_List><Precursors></Precursors><Analytical_Comment></Analytical_Comment><Screen_Panels></Screen_Panels><Enumeration_Sequence>0</Enumeration_Sequence></Meta_Data></Batch_Properties>'),
                     NULL,
                     REPLACE (
                        v_list.PATH ('[' || i || '].BATCH_TYPE').TO_CHAR,
                        '"'),
                     REPLACE (
                        v_list.PATH (
                           '[' || i || '].MOLECULAR_FORMULA').TO_CHAR,
                        '"'),
                     '00',
                     0,
                     NULL,
                     TO_NUMBER (
                        REPLACE (
                           v_list.PATH (
                              '[' || i || '].BATCH_MW_VALUE').TO_CHAR,
                           '"'),
                        '99999.99999'),
                     'SCAL',
                     'Y',
                     3,
                     'Y',
                     -1,
                     'N',
                     'Y',
                     username,
                     0,
                     'N',
                     'Y',
                     0,
                     LOCALTIMESTAMP);

         INSERT INTO CEN_DEV_OWNER.CEN_BATCH_AMOUNTS (BATCH_KEY,
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
             VALUES (batchKey,
                     pageKey,
                     TO_NUMBER (
                        REPLACE (
                           v_list.PATH (
                              '[' || i || '].BATCH_MW_VALUE').TO_CHAR,
                           '"'),
                        '99999.99999'),
                     REPLACE (
                        v_list.PATH (
                           '[' || i || '].WEIGHT_UNIT_CODE').TO_CHAR,
                        '"'),
                     REPLACE (
                        v_list.PATH (
                           '[' || i || '].THEO_WT_VALUE').TO_CHAR,
                        '"'),
                     REPLACE (
                        v_list.PATH (
                           '[' || i || '].THEO_WT_UNIT_CODE').TO_CHAR,
                        '"'),
                     REPLACE (
                        v_list.PATH (
                           '[' || i || '].THEO_YLD_PCNT_VALUE').TO_CHAR,
                        '"'),
                     TO_NUMBER (
                        REPLACE (
                           v_list.PATH ('[' || i || '].VOLUME_VALUE').TO_CHAR,
                           '"'),
                        '99999.99999'),
                     REPLACE (
                        v_list.PATH (
                           '[' || i || '].VOLUME_UNIT_CODE').TO_CHAR,
                        '"'),
                     TO_NUMBER (
                        REPLACE (
                           v_list.PATH (
                              '[' || i || '].MOLARITY_VALUE').TO_CHAR,
                           '"'),
                        '99999.99999'),
                     REPLACE (
                        v_list.PATH (
                           '[' || i || '].MOLARITY_UNIT_CODE').TO_CHAR,
                        '"'),
                     TO_NUMBER (
                        REPLACE (
                           v_list.PATH ('[' || i || '].MOLE_VALUE').TO_CHAR,
                           '"'),
                        '99999.99999'),
                     REPLACE (
                        v_list.PATH ('[' || i || '].MOLE_UNIT_CODE').TO_CHAR,
                        '"'),
                     TO_NUMBER (
                        REPLACE (
                           v_list.PATH (
                              '[' || i || '].DENSITY_VALUE').TO_CHAR,
                           '"'),
                        '99999.99999'),
                     REPLACE (
                        v_list.PATH (
                           '[' || i || '].DENSITY_UNIT_CODE').TO_CHAR,
                        '"'),
                     TO_NUMBER (
                        REPLACE (
                           v_list.PATH ('[' || i || '].PURITY_VALUE').TO_CHAR,
                           '"'),
                        '99999.99999'),
                     REPLACE (
                        v_list.PATH (
                           '[' || i || '].PURITY_UNIT_CODE').TO_CHAR,
                        '"'),
                     0,
                     LOCALTIMESTAMP);
      --                     commit;
      --raise_application_error (-20101, 'insert_batches: ' || structKey ||  '  ' || pageKey);

      END LOOP;

      ret := '1000';
   EXCEPTION
      WHEN OTHERS
      THEN
         RAISE;
   END;


$body$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION reg.insert_reaction (struct       IN     text,
                              pageKey             text,
                              structType   IN     text,
                              nRea  in  bigint,
                              ret             OUT text)
    RETURNS text AS $body$
DECLARE

      tmp      varchar(40);
      i        bigint;
      rxnKey   varchar(40);
      v_nr bigint;
   
BEGIN
   
    v_nr := DBMS_LOB.GETLENGTH(struct);
--            raise_application_error ( -20101, 'rows ' || v_nr );
 --         raise_application_error (-20101, 'rxn ' || enumVal || '  pagekey  '  || exper);

            if  v_nr < 120 then -- empy structure circa 102
                ret := '1000';
                return;
            end if;

      PERFORM DBMS_RANDOM.STRING ('A', TRUNC (DBMS_RANDOM.VALUE (40, 40)))
        INTO rxnKey
        ;

      INSERT INTO CEN_DEV_OWNER.CEN_REACTION_SCHEMES (RXN_SCHEME_KEY,
                                                      PAGE_KEY,
                                                      REACTION_TYPE,
                                                      XML_METADATA,
                                                      SYNTH_ROUTE_REF,
                                                      VERSION,
                                                      LAST_MODIFIED)
          VALUES (rxnKey,
                  pageKey,
                  structType,
                  xml('<?xml version="1.0" encoding="UTF-8"?><Reaction_Properties><Meta_Data></Meta_Data></Reaction_Properties>'),
                  nRea,
                  0,
                  LOCALTIMESTAMP);

      UPDATE cen_reaction_schemes
         SET native_rxn_sketch = BINGO.COMPACTREACTION (struct, 1)
       WHERE RXN_SCHEME_KEY = rxnKey;

      i := SQL%ROWCOUNT;
      
      
      
      BINGO.FLUSHINSERTS ();

      ret := rxnKey;
   EXCEPTION
      WHEN OTHERS
      THEN
         RAISE;
   END;


$body$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION reg.insert_detail (detail IN text, ret OUT text)
    RETURNS text AS $body$
DECLARE

      tmp                varchar(40);
      i                  bigint;
      v_obj              json := json (detail);
      nb                 bigint := 0;
      pk                 varchar(100);
      pageKey            varchar(40);
      v_notebook         varchar(8);
      v_owner_username   varchar(50);
      v_experiment       varchar(4);
   
BEGIN

      v_notebook := REPLACE (v_obj.PATH ('NOTEBOOK').TO_CHAR, '"');
      v_owner_username := REPLACE (v_obj.PATH ('OWNER_USERNAME').TO_CHAR, '"');
      v_experiment := REPLACE (v_obj.PATH ('EXPERIMENT').TO_CHAR, '"');

      SELECT COUNT (notebook)
        INTO nb
        FROM cen_notebooks
       WHERE notebook = v_notebook;

      --      raise_application_error (-20101,
      --                               'nb '|| nb || '  ' || v_notebook );

      IF nb = 0
      THEN
         INSERT INTO CEN_DEV_OWNER.CEN_NOTEBOOKS (SITE_CODE,
                                                  USERNAME,
                                                  NOTEBOOK,
                                                  STATUS,
                                                  XML_METADATA,
                                                  LAST_MODIFIED)
             VALUES ('SITE1',
                     v_owner_username,
                     v_notebook,
                     'OPEN',
                     xml('<?xml version="1.0" encoding="UTF-8"?><Notebook_Properties/>'),
                     LOCALTIMESTAMP);
      END IF;

      SELECT COUNT (notebook)
        INTO nb
        FROM cen_pages
       WHERE notebook = v_notebook AND experiment = v_experiment;

      IF nb = 1
      THEN
         ret := '-1';
         RETURN;
      END IF;

      PERFORM DBMS_RANDOM.STRING ('A', TRUNC (DBMS_RANDOM.VALUE (40, 40)))
        INTO pageKey
        ;

      INSERT INTO CEN_DEV_OWNER.CEN_PAGES (page_key,
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
                                           FUNCTION,
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
          VALUES (pageKey,
                  'SITE1',
                  v_notebook,
                  v_experiment,
                  v_owner_username,
                  v_owner_username,
                  'MED-CHEM',
                  'OPEN',
                  LOCALTIMESTAMP,
                  LOCALTIMESTAMP,
                  xml('<?xml version="1.0" encoding="UTF-8"?><Page_Properties><Meta_Data><Archive_Date/><Signature_Url/><Table_Properties/><Ussi_Key>0</Ussi_Key><Auto_Calc_On>true</Auto_Calc_On><Cen_Version></Cen_Version><Completion_Date></Completion_Date><Continued_From_Rxn> </Continued_From_Rxn><Continued_To_Rxn> </Continued_To_Rxn><Project_Alias> </Project_Alias><DSP><Comments/><Description/><Procedure_Width>0</Procedure_Width><designUsers/><ScreenPanels/><Scale><Calculated>true</Calculated><Default_Value>0.0</Default_Value><Unit><Code></Code><Description></Description></Unit><Value>0</Value></Scale><PrototypeLeasdIDs/><DesignSite/><DesignCreationDate></DesignCreationDate><PID/><SummaryPID>null</SummaryPID><VrxnID/></DSP><ConceptionKeyWords/><ConceptorNames/></Meta_Data></Page_Properties>'),
                  null,
                  1,
                  'Y',
                  REPLACE (v_obj.PATH ('TH').TO_CHAR, '"'),
                  REPLACE (v_obj.PATH ('PROJECT_CODE').TO_CHAR, '"'),
                  REPLACE (v_obj.PATH ('LITERATURE_REF').TO_CHAR, '"'),
                  REPLACE (v_obj.PATH ('SUBJECT').TO_CHAR, '"'),
                  'N',
                  v_owner_username,
                  v_owner_username,
                  v_notebook || '-' || v_experiment || '-1',
                  0,
                  REPLACE (v_obj.PATH ('YIELD').TO_CHAR, '"'),
                  REPLACE (v_obj.PATH ('ISSUCCESSFUL').TO_CHAR, '"'));

      UPDATE CEN_PAGES
         SET XML_METADATA =
                UPDATEXML (
                   XML_METADATA,
                   '/Page_Properties/Meta_Data/Continued_From_Rxn/text()',
                   REPLACE (v_obj.PATH ('CONTINUED_FROM_RXN').TO_CHAR, '"'))
       WHERE page_key = pageKey;

      UPDATE CEN_PAGES
         SET XML_METADATA =
                UPDATEXML (
                   XML_METADATA,
                   '/Page_Properties/Meta_Data/Continued_To_Rxn/text()',
                   REPLACE (v_obj.PATH ('CONTINUED_TO_RXN').TO_CHAR, '"'))
       WHERE page_key = pageKey;

      UPDATE CEN_PAGES
         SET XML_METADATA =
                UPDATEXML (
                   XML_METADATA,
                   '/Page_Properties/Meta_Data/Project_Alias/text()',
                   REPLACE (v_obj.PATH ('PROJECT_ALIAS').TO_CHAR, '"'))
       WHERE page_key = pageKey;

      SELECT PAGE_KEY
        INTO pk
        FROM cen_pages
       WHERE notebook = v_notebook AND experiment = v_experiment;
        
       commit;
      ret := 1;
   EXCEPTION
      WHEN OTHERS
      THEN
         RAISE;
   --         raise_application_error (
   --            -20101,
   --            'owner is missing' || v_obj.PATH ('OWNER_USERNAME').TO_CHAR);
   END;


$body$
LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION reg.update_detail (detail IN text, ret OUT text)
    RETURNS text AS $body$
DECLARE

      tmp                varchar(40);
      i                  bigint;
      v_obj              json := json (detail);
      nb                 bigint := 0;
      pk                 varchar(100);
      pageKey            varchar(40);
      v_notebook         varchar(8);
      v_owner_username   varchar(50);
      v_experiment       varchar(4);
   
BEGIN
      v_notebook := REPLACE (v_obj.PATH ('NOTEBOOK').TO_CHAR, '"');
      v_owner_username := REPLACE (v_obj.PATH ('OWNER_USERNAME').TO_CHAR, '"');
      v_experiment := REPLACE (v_obj.PATH ('EXPERIMENT').TO_CHAR, '"');

      SELECT COUNT (notebook)
        INTO nb
        FROM cen_pages
       WHERE notebook = v_notebook AND experiment = v_experiment;

--      IF nb = 1
--      THEN
--         ret := '-1';
--         RETURN;
--      END IF;
--
--      SELECT DBMS_RANDOM.STRING ('A', TRUNC (DBMS_RANDOM.VALUE (40, 40)))
--        INTO pageKey
--        FROM DUAL;

      update CEN_DEV_OWNER.CEN_PAGES 
                  set TA_CODE = REPLACE (v_obj.PATH ('TH').TO_CHAR, '"'),
                  PROJECT_CODE = REPLACE (v_obj.PATH ('PROJECT_CODE').TO_CHAR, '"'),
                  LITERATURE_REF = REPLACE (v_obj.PATH ('LITERATURE_REF').TO_CHAR, '"'),
                  YIELD = REPLACE (v_obj.PATH ('YIELD').TO_CHAR, '"'),
                  ISSUCCESSFUL = REPLACE (v_obj.PATH ('ISSUCCESSFUL').TO_CHAR, '"'),
                  SUBJECT = REPLACE (v_obj.PATH ('SUBJECT').TO_CHAR, '"')
                   WHERE notebook = v_notebook AND experiment = v_experiment;

      UPDATE CEN_PAGES
         SET XML_METADATA =
                UPDATEXML (
                   XML_METADATA,
                   '/Page_Properties/Meta_Data/Continued_From_Rxn/text()',
                   REPLACE (v_obj.PATH ('CONTINUED_FROM_RXN').TO_CHAR, '"'))
       WHERE page_key = pageKey;

      UPDATE CEN_PAGES
         SET XML_METADATA =
                UPDATEXML (
                   XML_METADATA,
                   '/Page_Properties/Meta_Data/Continued_To_Rxn/text()',
                   REPLACE (v_obj.PATH ('CONTINUED_TO_RXN').TO_CHAR, '"'))
       WHERE page_key = pageKey;

      UPDATE CEN_PAGES
         SET XML_METADATA =
                UPDATEXML (
                   XML_METADATA,
                   '/Page_Properties/Meta_Data/Project_Alias/text()',
                   REPLACE (v_obj.PATH ('PROJECT_ALIAS').TO_CHAR, '"'))
       WHERE page_key = pageKey;

      ret := '1';
   EXCEPTION
      WHEN OTHERS
      THEN
         RAISE;
   --         raise_application_error (
   --            -20101,
   --            'owner is missing' || v_obj.PATH ('OWNER_USERNAME').TO_CHAR);
   END;



$body$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION reg.update_procedure (nb     IN     text,
                                exper   IN     text,
                                procedura IN text, ret OUT text)
    RETURNS text AS $body$
DECLARE

    v_nb bigint;
   
BEGIN
        
      update CEN_DEV_OWNER.CEN_PAGES 
                  set FUNCTION  = procedura
                   WHERE notebook = nb AND experiment = exper;
--                     raise_application_error ( -20101, 'nb ' || procedura );
      ret := '1';
   EXCEPTION
      WHEN OTHERS
      THEN
         RAISE;
   --         raise_application_error (
   --            -20101,
   --            'owner is missing' || v_obj.PATH ('OWNER_USERNAME').TO_CHAR);
   END;
   

$body$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION reg.update_schema (nb     IN     text,
                                exper   IN     text,
                                enumVal    IN     text,
                                struct   IN     text,
                                ret         OUT bigint)
    RETURNS bigint AS $body$
DECLARE

      tmp       varchar(40);
      rxnId     varchar(40);
      pageKey     varchar(40);
      ret1        varchar(40);
      i           bigint;
      lenS   bigint;
      isNull varchar(40);
   
BEGIN
   
   if enumVal ='' or enumVal ='undefined' then
        select RXN_SCHEME_KEY,  PAGE_KEY into rxnId, pageKey from PAGES_VW where NOTEBOOK = nb and EXPERIMENT = exper;
    else
--   raise_application_error ( -20101, 'nb ' ||enumVal );
        select RXN_SCHEME_KEY , PAGE_KEY into rxnId, pageKey from PAGES_VW where NOTEBOOK = nb and EXPERIMENT = exper and SYNTH_ROUTE_REF = enumVal;
    end if;
    

   SELECT coalesce(RXN_SCHEME_KEY, 'true') into isNull  from PAGES_VW where NOTEBOOK = nb and EXPERIMENT = exper;
   
    if isNull = 'true' then
--          raise_application_error (-20101, 'rxn ' || rxnId || '  pagekey  '  || exper);
         insert_reaction (struct , pageKey ,'INTENDED', null, ret1 );
        PERFORM LENGTH (ret1) INTO lenS ;
          IF lenS > 3
          THEN
             ret := 1;
         else
             ret := 0;         
          END IF;    
  else
      UPDATE cen_reaction_schemes
         SET native_rxn_sketch = BINGO.COMPACTREACTION (struct, 1)
       WHERE RXN_SCHEME_KEY = rxnId;
       
      i := SQL%ROWCOUNT;      
      BINGO.FLUSHINSERTS ();
      ret := i;
    end if;

   EXCEPTION
      WHEN OTHERS
      THEN
         RAISE;
   END;



$body$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION reg.update_stoic (nb     IN     text,
                                exper   IN     text,
                                Reagents   IN     text,
                                Products   IN     text,
                                username in text,
                                ret           OUT text)
    RETURNS text AS $body$
DECLARE

      pageKey    varchar(40);
      retBatch   varchar(40);
      lenS       bigint;
   
BEGIN
   
     SELECT page_key
        INTO pageKey
        FROM cen_pages
       WHERE notebook = nb AND experiment = exper;
       
      delete CEN_DEV_OWNER.CEN_BATCH_AMOUNTS where PAGE_KEY = pageKey;
      delete CEN_DEV_OWNER.CEN_BATCHES where PAGE_KEY = pageKey;


      insert_batches (Reagents,
                      pageKey,
                      username,
                      retBatch);

      --raise_application_error (-20101, 'insert_products: ' || retPage);
      PERFORM LENGTH (retBatch) INTO lenS ;

      IF lenS < 3
      THEN
         ret := retBatch;
         ROLLBACK;
         RETURN;
      END IF;

      insert_batches (Products,
                      pageKey,
                      username,
                      retBatch);

      --raise_application_error (-20101, 'insert_reagents: ' || retPage);
      PERFORM LENGTH (retBatch) INTO lenS ;

      IF lenS < 3
      THEN
         ret := retBatch;
         ROLLBACK;
         RETURN;
      END IF;

      COMMIT;
      ret := '1';
   EXCEPTION
      WHEN OTHERS
      THEN
         RAISE;
   END;
 

$body$
LANGUAGE PLPGSQL;
-- End of Oracle package 'REG' declaration

-- Oracle package 'UTILITY' declaration, please edit to match PostgreSQL syntax.
-- PostgreSQL does not recognize PACKAGES, using SCHEMA instead.
DROP SCHEMA IF EXISTS utility CASCADE;
CREATE SCHEMA utility;

/******************************************************************************
      NAME:       utility
      PURPOSE:

      REVISIONS:
      Ver        Date        Author           Description
      ---------  ----------  ---------------  ------------------------------------
      1.0        5/11/2009             1. Created this package body.
   ******************************************************************************/



CREATE OR REPLACE FUNCTION utility.split (p_list text, p_del text DEFAULT ',')
       RETURNS SETOF split_tbl AS $body$
DECLARE

      l_idx     integer;
      l_list    varchar(32767) := p_list;
      l_value   varchar(32767);
   
BEGIN
      LOOP
         l_idx := INSTR (l_list, p_del);

         IF l_idx > 0
         THEN
            RETURN NEXT SUBSTR (l_list, 1, l_idx - 1);
            l_list := SUBSTR (l_list, l_idx + LENGTH (p_del));
         ELSE
            RETURN NEXT l_list;
            EXIT;
         END IF;
      END LOOP;

      RETURN;
   END;

$body$
LANGUAGE PLPGSQL;





CREATE OR REPLACE FUNCTION utility.join (p_cursor SYS_REFCURSOR, p_del text DEFAULT ',')
       RETURNS varchar AS $body$
DECLARE

      l_value    varchar(32767);
      l_result   varchar(32767);
   
BEGIN
      LOOP
         FETCH p_cursor INTO l_value;

         IF NOT FOUND THEN EXIT; END IF; -- apply on p_cursor

         IF (l_result IS NOT NULL AND l_result::text <> '')
         THEN
            l_result := l_result || p_del;
         END IF;

         l_result := l_result || l_value;
      END LOOP;

      RETURN l_result;
   END;

$body$
LANGUAGE PLPGSQL;





CREATE OR REPLACE FUNCTION utility.convert_string_to_table (p_table_string    text,
                                     p_sep             text DEFAULT ',')
       RETURNS SETOF STRING_TABLE_ITEM AS $body$
DECLARE

      v_buf        varchar(32767);
      v_old_buf    varchar(32767);
      v_item       varchar(32767);
      v_buf_size   integer;                               --  := 32767;
      v_amount     integer;
      v_offset     bigint;
      v_index_of   bigint;
   
BEGIN
      v_buf_size := 1024;
      v_amount := v_buf_size;
      v_offset := 1;

      WHILE v_amount >= v_buf_size
      LOOP
         DBMS_LOB.READ (lob_loc   => p_table_string,
                        amount    => v_amount,
                        offset    => v_offset,
                        buffer    => v_buf);
         v_offset := v_offset + v_amount;
         v_buf := v_old_buf || v_buf;

         LOOP
            v_index_of := INSTR (v_buf, p_sep, 1);

            IF v_index_of > 0
            THEN
               v_item := LTRIM (RTRIM (SUBSTR (v_buf, 1, v_index_of - 1)));

               IF LENGTH (v_item) > 0
               THEN
                  RETURN NEXT v_item;
               END IF;

               v_buf := SUBSTR (v_buf, v_index_of + LENGTH (p_sep));
            ELSE
               v_old_buf := v_buf;
               EXIT;
            END IF;
         END LOOP;
      END LOOP;

      v_item := LTRIM (RTRIM (v_buf));

      IF LENGTH (v_item) > 0
      THEN
         RETURN NEXT v_item;
      END IF;

      RETURN;
   END;

$body$
LANGUAGE PLPGSQL;
-- End of Oracle package 'UTILITY' declaration

