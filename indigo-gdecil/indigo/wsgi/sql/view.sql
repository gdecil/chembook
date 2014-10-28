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