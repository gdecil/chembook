CREATE OR REPLACE VIEW pages_vw AS 
 SELECT r.rxn_scheme_key, x.page_key, ( SELECT cen_users.fullname
           FROM cen_users
          WHERE cen_users.username::text = x.username::text) AS fullname, x.owner_username, x.notebook, x.experiment, x.creation_date, x.subject, x.procedure, x.page_status, x.project_code, xpath('/Page_Properties/Meta_Data/Project_Alias/text()'::text, x.xml_metadata) AS project_alias, xpath('/Page_Properties/Meta_Data/Continued_From_Rxn/text()'::text, x.xml_metadata) AS continued_from_rxn, xpath('/Page_Properties/Meta_Data/Continued_To_Rxn/text()'::text, x.xml_metadata) AS continued_to_rxn, x.literature_ref, ( SELECT cen_users.fullname
           FROM cen_users
          WHERE cen_users.username::text = x.batch_creator::text) AS batch_creator, ( SELECT cen_users.fullname
           FROM cen_users
          WHERE cen_users.username::text = x.batch_owner::text) AS batch_owner, r.synth_route_ref, x.yield, x.issuccessful
   FROM cen_pages x
   LEFT JOIN cen_reaction_schemes r ON x.page_key::text = r.page_key::text;

CREATE OR REPLACE VIEW BATCH_LEV3_VW
(
   BATCH_KEY,
   NOTEBOOK,
   EXPERIMENT,
   BATCH_NUMBER,
   CHEMICAL_NAME,
   BATCH_MW_VALUE,
   MOLECULAR_FORMULA,
   BATCH_TYPE,
   MOLE_VALUE,
   MOLE_UNIT_CODE,
   PURITY_VALUE,
   PURITY_UNIT_CODE,
   VOLUME_VALUE,
   VOLUME_UNIT_CODE,
   MOLARITY_VALUE,
   MOLARITY_UNIT_CODE,
   DENSITY_VALUE,
   DENSITY_UNIT_CODE,
   WEIGHT_VALUE,
   WEIGHT_UNIT_CODE,
   THEO_WT_VALUE,
   THEO_WT_UNIT_CODE,
   THEO_YLD_PCNT_VALUE,
   CAS_NUMBER,
   USER_HAZARD_COMMENTS,
   SYNTH_ROUTE_REF
)
AS
   SELECT b.BATCH_KEY,
          X.NOTEBOOK,
          X.EXPERIMENT,
          b.BATCH_NUMBER,
          S.CHEMICAL_NAME,
          B.BATCH_MW_VALUE,
          B.MOLECULAR_FORMULA,
          B.BATCH_TYPE,
          TRIM (TO_CHAR (BA.MOLE_VALUE, '9999990.000')) MOLE_VALUE,
          BA.MOLE_UNIT_CODE,
          BA.PURITY_VALUE,
          ba.PURITY_UNIT_CODE,
          TRIM (TO_CHAR (BA.VOLUME_VALUE, '9999990.000')) VOLUME_VALUE,
          BA.VOLUME_UNIT_CODE,
          ba.MOLARITY_VALUE,
          ba.MOLARITY_UNIT_CODE,
          ba.DENSITY_VALUE,
          ba.DENSITY_UNIT_CODE,
          TRIM (TO_CHAR (BA.WEIGHT_VALUE, '9999990.000')) WEIGHT_VALUE,
          BA.WEIGHT_UNIT_CODE,
          ba.THEO_WT_VALUE,
          ba.THEO_WT_UNIT_CODE,
          ba.THEO_YLD_PCNT_VALUE,
          S.CAS_NUMBER,
          S.USER_HAZARD_COMMENTS,
          R.SYNTH_ROUTE_REF
     FROM CEN_BATCH_AMOUNTS ba,
          CEN_BATCHES b,
          CEN_STRUCTURES s,
          CEN_REACTION_SCHEMES r,
          cen_pages x
    WHERE     B.BATCH_KEY = Ba.BATCH_KEY
          AND S.STRUCT_KEY = B.STRUCT_KEY
          AND r.PAGE_KEY = S.PAGE_KEY
          AND X.PAGE_KEY = r.PAGE_KEY
          AND r.SYNTH_ROUTE_REF IS NULL;


